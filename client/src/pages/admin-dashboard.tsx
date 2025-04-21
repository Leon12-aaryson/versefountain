import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Redirect } from 'wouter';
import MainLayout from '@/components/shared/MainLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserCircle, Book, ScrollText, Calendar, MessageCircle, GraduationCap, Ticket, Plus, Check, X, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('users');
  
  // Redirect if not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  if (user && !user.isAdmin) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin dashboard.",
      variant: "destructive",
    });
    return <Redirect to="/" />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your VerseFountain eLibrary application</p>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="users">
                <UserCircle className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="books">
                <Book className="h-4 w-4 mr-2" />
                Books
              </TabsTrigger>
              <TabsTrigger value="poems">
                <ScrollText className="h-4 w-4 mr-2" />
                Poems
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Rooms
              </TabsTrigger>
              <TabsTrigger value="academics">
                <GraduationCap className="h-4 w-4 mr-2" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <Ticket className="h-4 w-4 mr-2" />
                Tickets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="books">
              <BookManagement />
            </TabsContent>
            
            <TabsContent value="poems">
              <PoemManagement />
            </TabsContent>
            
            <TabsContent value="events">
              <EventManagement />
            </TabsContent>
            
            <TabsContent value="chat">
              <ChatManagement />
            </TabsContent>
            
            <TabsContent value="academics">
              <AcademicManagement />
            </TabsContent>
            
            <TabsContent value="tickets">
              <TicketManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

function UserManagement() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    }
  });
  
  const toggleAdminStatusMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: number, isAdmin: boolean }) => {
      const res = await apiRequest('PATCH', `/api/admin/users/${userId}`, { isAdmin });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      refetch();
      toast({
        title: "User Updated",
        description: "User admin status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update user admin status",
        variant: "destructive",
      });
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('DELETE', `/api/admin/users/${userId}`, {});
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      refetch();
      setDeleteDialogOpen(false);
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    }
  });
  
  const handleToggleAdmin = (userId: number, currentStatus: boolean) => {
    toggleAdminStatusMutation.mutate({ userId, isAdmin: !currentStatus });
  };
  
  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <X className="h-8 w-8 text-destructive mb-2" />
            <h3 className="text-lg font-medium">Error Loading Users</h3>
            <p className="text-sm text-gray-500">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </div>
        <Button onClick={() => refetch()}>
          Refresh Users
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of all users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.isAdmin} 
                      onCheckedChange={() => handleToggleAdmin(user.id, user.isAdmin)}
                      disabled={toggleAdminStatusMutation.isPending}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {user.id !== 1 && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the user{" "}
                <span className="font-bold">{selectedUser?.username}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function BookManagement() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['/api/books'],
    queryFn: async () => {
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      return response.json();
    }
  });
  
  const approveBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await apiRequest('PATCH', `/api/admin/books/${bookId}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: "Book Approved",
        description: "Book has been approved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve book",
        variant: "destructive",
      });
    }
  });
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    coverImage: ''
  });
  
  const createBookMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/books', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      setCreateDialogOpen(false);
      setNewBook({
        title: '',
        author: '',
        description: '',
        genre: '',
        coverImage: ''
      });
      toast({
        title: "Book Created",
        description: "New book has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create book",
        variant: "destructive",
      });
    }
  });
  
  const handleCreateBook = () => {
    createBookMutation.mutate(newBook);
  };
  
  const handleApproveBook = (id: number) => {
    approveBookMutation.mutate(id);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Book Management</CardTitle>
          <CardDescription>Manage the book collection in the library</CardDescription>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Fill in the details for the new book</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input 
                  id="title" 
                  value={newBook.title} 
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input 
                  id="author" 
                  value={newBook.author} 
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea 
                  id="description" 
                  value={newBook.description} 
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="genre" className="text-right">Genre</Label>
                <Input 
                  id="genre" 
                  value={newBook.genre} 
                  onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="coverImage" className="text-right">Cover URL</Label>
                <Input 
                  id="coverImage" 
                  value={newBook.coverImage} 
                  onChange={(e) => setNewBook({...newBook, coverImage: e.target.value})}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateBook} disabled={createBookMutation.isPending}>
                {createBookMutation.isPending ? 'Creating...' : 'Create Book'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <Table>
            <TableCaption>A list of all books in the library</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No books found</TableCell>
                </TableRow>
              ) : (
                books.map((book: any) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>
                      {book.approved ? (
                        <span className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <Loader2 className="h-4 w-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {!book.approved && (
                          <Button variant="default" size="sm" onClick={() => handleApproveBook(book.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function PoemManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Poetry Management</CardTitle>
        <CardDescription>Manage poems and poetry content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Poetry Management Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            This section provides tools to approve poems, manage content, and organize the poetry collection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EventManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <CardDescription>Manage events, registration, and scheduling</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Event Management Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            This section provides tools to create, edit, and promote events in the application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChatManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Room Management</CardTitle>
        <CardDescription>Manage chat rooms and user interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Chat Room Management Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            This section provides tools to moderate chat rooms, manage user access, and review message history.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AcademicManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Resources Management</CardTitle>
        <CardDescription>Manage academic materials and resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Academic Management Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            This section provides tools to organize and maintain academic resources in the library.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Management</CardTitle>
        <CardDescription>Manage event tickets and registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <Ticket className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Ticket Management Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            This section provides tools to track ticket sales, manage registrations, and handle event attendance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}