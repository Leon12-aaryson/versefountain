import { ReactNode } from 'react';
import { 
  GraduationCap, 
  Video, 
  FileText, 
  Briefcase 
} from 'lucide-react';

interface ResourceCardProps {
  id: number;
  title: string;
  description: string;
  type: string;
  icon?: ReactNode;
  onClick?: () => void;
}

const ResourceCard = ({ id, title, description, type, icon, onClick }: ResourceCardProps) => {
  const getTypeIcon = () => {
    if (icon) return icon;
    
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
  
  const getTypeColor = () => {
    switch (type) {
      case 'study_guide':
        return 'bg-blue-100';
      case 'video':
        return 'bg-purple-100';
      case 'career_guide':
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 flex cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 ${getTypeColor()} rounded-lg mr-4`}>
        {getTypeIcon()}
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default ResourceCard;
