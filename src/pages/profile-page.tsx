import { useAuth } from '@/hooks/use-auth';
import MainLayout from '@/components/shared/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCircle,
  Settings as SettingsIcon,
  BookOpen,
  BookText,
  Calendar,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: userTickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ['/api/tickets'],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) {
          console.error('Failed to fetch tickets', response.status);
          return []; // Return empty array on error
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching tickets:', error);
        return []; // Return empty array on error
      }
    },
    enabled: !!user
  });

  const { data: userPoems = [], isLoading: isLoadingPoems } = useQuery({
    queryKey: ['/api/poems/user'],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await fetch('/api/poems/user');
        if (response.status === 404) {
          return []; // Return empty array if no poems found
        }
        if (!response.ok) {
          throw new Error('Failed to fetch poems');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching poems:', error);
        return []; // Return empty array on error
      }
    },
    enabled: !!user
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (!user) {
    return (
      <MainLayout activeSection="profile">
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Not Authenticated</CardTitle>
              <CardDescription>Please sign in to view your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeSection="profile">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Profile Sidebar */}
          <div className="md:col-span-4">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarFallback className="text-4xl bg-primary text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab} value={activeTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-sm text-green-500 font-medium">Active</span>
                </div>
                {user?.role === "admin" && (
                  <div className="flex justify-between w-full">
                    <span className="text-sm font-medium">Role</span>
                    <span className="text-sm text-purple-500 font-medium">Administrator</span>
                  </div>
                )}
                {user?.role === "admin" && (
                  <Button 
                    variant="outline" 
                    className="w-full bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700"
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Go to Admin Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 space-y-8">
            {activeTab === "profile" ? (
              <>
                {/* My Poems Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <BookText className="mr-2 h-5 w-5" />
                        My Poems
                      </CardTitle>
                      <CardDescription>
                        Poems you've published or saved
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/poetry')}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPoems ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : userPoems.length === 0 ? (
                      <div className="text-center p-6 border rounded-lg bg-muted/10">
                        <BookText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No poems yet</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          You haven't published any poems yet. Start expressing yourself!
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate('/poetry')}>
                          Explore Poetry
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userPoems.slice(0, 4).map((poem: any) => (
                          <div 
                            key={poem.id} 
                            className="border rounded-lg p-4 hover:bg-muted/10 transition cursor-pointer"
                            onClick={() => navigate(`/poetry?poemId=${poem.id}`)} 
                          >
                            <h3 className="font-medium text-sm md:text-base truncate">{poem.title}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                              {poem.content.substring(0, 80)}...
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-2">
                              <span className="text-xs text-muted-foreground mb-1 sm:mb-0">
                                {new Date(poem.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                <span className={`inline-flex text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                                  poem.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {poem.approved ? 'Published' : 'Pending'}
                                </span>
                                {poem.isVideo ? (
                                  <span className="inline-flex text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Video
                                  </span>
                                ) : (
                                  <span className="inline-flex text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Text
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* My Tickets Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Ticket className="mr-2 h-5 w-5" />
                        My Tickets
                      </CardTitle>
                      <CardDescription>
                        Event tickets you've purchased
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/tickets')}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTickets ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : userTickets.length === 0 ? (
                      <div className="text-center p-6 border rounded-lg bg-muted/10">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No tickets yet</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          You haven't purchased any event tickets yet.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate('/events')}>
                          Browse Events
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userTickets.slice(0, 4).map((ticket: any) => (
                          <div 
                            key={ticket.id} 
                            className="border rounded-lg p-4 hover:bg-muted/10 transition cursor-pointer"
                            onClick={() => navigate(`/tickets?ticketId=${ticket.id}`)} 
                          >
                            <h3 className="font-medium text-sm md:text-base truncate">{ticket.event.title}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
                              {new Date(ticket.event.date).toLocaleDateString()} • {ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-2">
                              <span className="text-xs text-muted-foreground mb-1 sm:mb-0">
                                {new Date(ticket.purchaseDate).toLocaleDateString()}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {ticket.isRefunded && (
                                  <span className="inline-flex text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Refunded
                                  </span>
                                )}
                                {ticket.event.isFree ? (
                                  <span className="inline-flex text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Free
                                  </span>
                                ) : (
                                  <span className="inline-flex text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Paid
                                  </span>
                                )}
                                <span className="inline-flex text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap hidden md:inline-flex">
                                  {ticket.ticketCode.substring(0, 8)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your profile information and account settings.
                    </p>
                    <div className="grid gap-4 mt-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Username</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={user.username}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Email</label>
                        <input 
                          type="email" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={user.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how you receive notifications from VerseFountain.
                    </p>
                    <div className="grid gap-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Email Notifications</h4>
                          <p className="text-xs text-muted-foreground">Receive email updates about new content and events</p>
                        </div>
                        <div className="h-6 w-11 cursor-pointer bg-primary rounded-full relative">
                          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Chat Notifications</h4>
                          <p className="text-xs text-muted-foreground">Get notified when you receive new chat messages</p>
                        </div>
                        <div className="h-6 w-11 cursor-pointer bg-muted rounded-full relative">
                          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password to keep your account secure.
                    </p>
                    <div className="grid gap-4 mt-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input 
                          type="password" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      <Button className="mt-2">Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}