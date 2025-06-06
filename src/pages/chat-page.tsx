import { useState, useEffect } from 'react';
import MainLayout from '@/components/shared/MainLayout';
import ChatRoom from '@/components/chat/ChatRoom';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Users, Lock, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    connected, 
    rooms, 
    userRooms,
    activeRoom, 
    joinRoom, 
    leaveRoom,
    joinChatRoom,
    leaveChatRoom,
    isMemberOf,
    loadingMembership
  } = useChat();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingUserRooms, setViewingUserRooms] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // No schema, just use react-hook-form rules
  const chatRoomForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
    }
  });

  // Remove tanstack query, use axios for chat room creation
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit = async (data: any) => {
    setIsCreating(true);
    try {
      await axios.post(`${API_BASE_URL}/api/chat/rooms`, data, { withCredentials: true });
      toast({
        title: 'Chat Room Created',
        description: 'Your chat room has been created successfully.',
      });
      chatRoomForm.reset();
      setDialogOpen(false);
      // Optionally, you may want to refresh rooms here if your context doesn't auto-refresh
      // await fetchRooms();
    } catch (error: any) {
      toast({
        title: 'Creation Failed',
        description: error?.message || 'Failed to create chat room',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (roomId: number) => {
    if (!connected) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to chat server. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedRoomId(roomId);
    setTimeout(() => {
      joinRoom(roomId);
    }, 50);
  };

  const handleBackToRoomList = () => {
    leaveRoom();
    setSelectedRoomId(null);
  };

  useEffect(() => {
    document.title = 'eLibrary - Chat Rooms';
  }, []);

  if (!user) {
    return (
      <MainLayout activeSection="chat">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Rooms</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You need to be logged in to access chat rooms. Join our community to participate in discussions about poetry, books, and more.
            </p>
            <Button onClick={() => window.location.href="/auth"}>
              Login or Register
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeSection="chat">
      <div className="h-full flex flex-col">
        {!selectedRoomId ? (
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mb-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 break-words">Chat Rooms</h1>
                <p className="text-gray-600 text-sm md:text-base">Connect with fellow readers and writers in real-time discussions</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex rounded-lg border border-gray-200 p-1">
                  <Button 
                    variant={viewingUserRooms ? "ghost" : "default"}
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() => setViewingUserRooms(false)}
                  >
                    All Rooms
                  </Button>
                  <Button 
                    variant={viewingUserRooms ? "default" : "ghost"}
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() => setViewingUserRooms(true)}
                  >
                    My Rooms ({userRooms.length})
                  </Button>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="whitespace-nowrap">
                      <PlusCircle className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
                      <span>Create Room</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Chat Room</DialogTitle>
                      <DialogDescription>
                        Create a space to discuss your favorite literary topics with the community.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...chatRoomForm}>
                      <form onSubmit={chatRoomForm.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={chatRoomForm.control}
                          name="name"
                          rules={{ required: "Room name is required", minLength: { value: 2, message: "Name must be at least 2 characters." } }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter a name for your chat room" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chatRoomForm.control}
                          name="description"
                          rules={{ required: "Description is required", minLength: { value: 5, message: "Description must be at least 5 characters." } }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe what this chat room is about" 
                                  className="resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chatRoomForm.control}
                          name="isPrivate"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Private Room</FormLabel>
                                <FormDescription>
                                  Make this room invite-only
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create Room'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(rooms.length === 0 || (viewingUserRooms && userRooms.length === 0)) ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800">
                    {viewingUserRooms ? "You haven't joined any chat rooms yet" : "No chat rooms available"}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {viewingUserRooms ? "Join a room to start chatting" : "Be the first to create a room!"}
                  </p>
                  {viewingUserRooms && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setViewingUserRooms(false)}
                    >
                      Browse All Rooms
                    </Button>
                  )}
                </div>
              ) : (
                (viewingUserRooms ? userRooms : rooms).map(room => {
                  const isJoined = isMemberOf(room.id);
                  return (
                    <Card key={room.id} className={`overflow-hidden ${isJoined ? 'border-primary/50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl flex items-center gap-1">
                            {room.name}
                            {isJoined && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                Joined
                              </span>
                            )}
                          </CardTitle>
                          {room.isPrivate && (
                            <Lock className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <CardDescription>{room.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Active community</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            className="w-full" 
                            onClick={() => handleJoinRoom(room.id)}
                            disabled={!connected}
                          >
                            Enter Chat
                          </Button>
                          {isJoined ? (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => leaveChatRoom(room.id)}
                              disabled={loadingMembership}
                            >
                              Leave Room
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => joinChatRoom(room.id)}
                              disabled={loadingMembership}
                            >
                              Join Room
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ChatRoom 
              roomId={selectedRoomId || 0}
              roomName={rooms.find(r => r.id === selectedRoomId)?.name || 'Chat Room'}
              onBack={handleBackToRoomList}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}