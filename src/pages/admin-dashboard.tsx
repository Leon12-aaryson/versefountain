import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserCircle, Book, ScrollText, Calendar, MessageCircle, GraduationCap, Ticket, Plus, Check, X, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('users');
  
  // Redirect if not authenticated
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Allow access if user.role === 'admin'
  if (user && user.role !== 'admin') {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin dashboard.",
      variant: "destructive",
    });
    return <Redirect to="/" />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-8">
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

// --- USERS MANAGEMENT ---
function UserManagement() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, { withCredentials: true });
      setUsers(response.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    setIsPending(true);
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}`, { isAdmin: !currentStatus }, { withCredentials: true });
      toast({
        title: "User Updated",
        description: "User admin status has been updated successfully.",
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error?.response?.data?.message || "Failed to update user admin status",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsPending(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${selectedUser.id}`, { withCredentials: true });
      setDeleteDialogOpen(false);
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error?.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
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
              {error}
            </p>
            <Button onClick={fetchUsers} className="mt-4">
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
        <Button onClick={fetchUsers}>
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
                      disabled={isPending}
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
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// --- BOOKS MANAGEMENT ---
function BookManagement() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    coverImage: ''
  });

  // Fetch books
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateBook = async () => {
    setIsPending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/books`, newBook, { withCredentials: true });
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
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error?.response?.data?.message || "Failed to create book",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleApproveBook = async (id: number) => {
    setIsPending(true);
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/books/${id}/approve`, {}, { withCredentials: true });
      toast({
        title: "Book Approved",
        description: "Book has been approved successfully.",
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error?.response?.data?.message || "Failed to approve book",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
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
                <div className="col-span-3">
                  <Select
                    value={newBook.genre}
                    onValueChange={(value) => setNewBook({...newBook, genre: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="science-fiction">Science Fiction</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="poetry">Poetry</SelectItem>
                      <SelectItem value="self-help">Self-Help</SelectItem>
                      <SelectItem value="children">Children's</SelectItem>
                      <SelectItem value="young-adult">Young Adult</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="coverImage" className="text-right">Cover URL</Label>
                <Input 
                  id="coverImage" 
                  value={newBook.coverImage} 
                  onChange={(e) => setNewBook({...newBook, coverImage: e.target.value})}
                  className="col-span-3" 
                  placeholder="Enter a URL or upload using the book page dialog"
                />
                <div className="col-span-4 text-xs text-muted-foreground text-right">
                  For file uploads, please use the Upload Book dialog on the main Books page
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateBook} disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Book'}
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

// --- POEMS MANAGEMENT ---
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

// --- EVENTS MANAGEMENT ---
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

// --- CHAT MANAGEMENT ---
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

// --- ACADEMIC MANAGEMENT ---
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

// --- TICKET MANAGEMENT ---
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