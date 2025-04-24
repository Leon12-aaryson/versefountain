import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/shared/MainLayout';
import ResourceCard from '@/components/academics/ResourceCard';
import { AcademicResource } from '@shared/schema';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  FileText, 
  Briefcase,
  Search 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AcademicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  const { data: resources, isLoading } = useQuery<AcademicResource[]>({
    queryKey: ['/api/academic-resources'],
    queryFn: async () => {
      const res = await fetch('/api/academic-resources');
      if (!res.ok) throw new Error('Failed to fetch academic resources');
      return res.json();
    }
  });
  
  useEffect(() => {
    document.title = 'eLibrary - Academic Resources';
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };
  
  const filteredResources = resources?.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    
    return matchesSearch && matchesType && matchesSubject;
  });
  
  const getSubjects = () => {
    if (!resources) return [];
    const subjects = new Set(resources.map(resource => resource.subject).filter(Boolean));
    return Array.from(subjects);
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'study_guide':
        return <FileText className="h-6 w-6 text-primary" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-600" />;
      case 'career_guide':
        return <Briefcase className="h-6 w-6 text-green-600" />;
      default:
        return <GraduationCap className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <MainLayout activeSection="academics">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Academic Resources</h1>
          <p className="text-gray-600">Access educational materials, study guides, and career resources</p>
        </div>
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">Enhance Your Knowledge</h2>
              <p className="text-blue-100 mb-4">Access a wide range of academic resources designed to support your learning journey, from study guides to career development materials.</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">Literature Studies</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">Creative Writing</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">Career Development</Badge>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
              <GraduationCap className="h-24 w-24 text-white/80" />
            </div>
          </div>
        </div>
        
        {/* Search and Filter Area */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search academic resources..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="study_guide">Study Guides</SelectItem>
                    <SelectItem value="video">Video Lessons</SelectItem>
                    <SelectItem value="career_guide">Career Guides</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resource Categories */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="literature">Literature</TabsTrigger>
            <TabsTrigger value="writing">Writing</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Academic Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center py-10">Loading resources...</div>
          ) : filteredResources && filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description || ''}
                type={resource.type}
                icon={getResourceIcon(resource.type)}
                onClick={() => window.open(resource.resourceUrl, '_blank')}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">No resources found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
        
        {/* Featured Learning Paths */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Featured Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Poetry Analysis Fundamentals</CardTitle>
                <CardDescription>Learn to analyze and understand different forms of poetry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">5 Modules</h3>
                    <p className="text-xs text-gray-500">10 hours total</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Introduction to Poetry Structures</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Analyzing Metaphors and Symbolism</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Interpreting Classical and Modern Poetry</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Learning</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creative Writing Essentials</CardTitle>
                <CardDescription>Develop your creative writing skills from basic to advanced</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">7 Modules</h3>
                    <p className="text-xs text-gray-500">15 hours total</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Finding Your Writing Voice</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Character Development Techniques</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Building Compelling Narratives</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Learning</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Literary Career Pathways</CardTitle>
                <CardDescription>Explore career opportunities in the literary world</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">4 Modules</h3>
                    <p className="text-xs text-gray-500">8 hours total</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Publishing Industry Overview</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Building Your Author Platform</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Literary Agency and Editorial Careers</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Learning</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
