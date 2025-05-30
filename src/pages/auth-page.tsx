import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin'; // Default role for new users
};

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('register');

  // Login form
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user', // Default role for new users
    },
  });

  useEffect(() => {
    document.title = 'VerseFountain - Authentication';
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/');
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error?.response?.data?.message || error?.message || 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register({
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword, // Laravel expects this field
        role: data.role, // Send the role field
      });
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created and you are now logged in.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error?.response?.data?.message || error?.message || 'Could not register. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          <span className="gradient-text">VerseFountain</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Auth Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to VerseFountain</CardTitle>
                  <CardDescription>
                    {activeTab === 'login'
                      ? 'Sign in to your account to continue'
                      : 'Create a new account to join our community'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="register">Register</TabsTrigger>
                      <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>

                    <TabsContent value="register">
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-username">Username</Label>
                          <Input
                            id="register-username"
                            type="text"
                            placeholder="Choose a username"
                            {...registerForm.register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
                          />
                          {registerForm.formState.errors.username && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            {...registerForm.register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' } })}
                          />
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Create a password"
                            {...registerForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                          />
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-confirm-password">Confirm Password</Label>
                          <Input
                            id="register-confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            {...registerForm.register('confirmPassword', {
                              required: 'Please confirm your password',
                              validate: value => value === registerForm.watch('password') || 'Passwords do not match'
                            })}
                          />
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="login">
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            {...loginForm.register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' } })}
                          />
                          {loginForm.formState.errors.email && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            {...loginForm.register('password', { required: 'Password is required' })}
                          />
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <p className="text-center text-xs text-gray-600 w-full">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column - Hero Section */}
            <div className="hidden md:flex flex-col justify-center">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Discover the World of Poetry
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Join our community of readers and writers. Share your poetry, discover new books, and connect with like-minded literature enthusiasts.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <a href="/poetry">
                  <div className="flex items-center bg-blue-50 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Share Your Poetry</h3>
                      <p className="text-sm text-gray-600">Publish your poems in text or video format</p>
                    </div>
                  </div>
                </a>
                <a href="/chat">
                  <div className="flex items-center bg-purple-50 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Engage in Chat Rooms</h3>
                      <p className="text-sm text-gray-600">Discuss literature with fellow enthusiasts</p>
                    </div>
                  </div>
                </a>

                <a href="/books">
                  <div className="flex items-center bg-green-50 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Explore Books</h3>
                      <p className="text-sm text-gray-600">Access our vast collection of eBooks</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
