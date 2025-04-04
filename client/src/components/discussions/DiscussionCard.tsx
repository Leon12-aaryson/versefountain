import { Link } from "wouter";
import { Discussion } from "@shared/schema";
import { MessageSquare, Eye } from "lucide-react";

interface DiscussionCardProps {
  discussion: Discussion;
  className?: string;
}

export default function DiscussionCard({ discussion, className = "" }: DiscussionCardProps) {
  // Format date string
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Define status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-secondary bg-opacity-20 text-secondary';
      case 'hot':
        return 'bg-primary bg-opacity-20 text-primary';
      case 'new':
        return 'bg-accent bg-opacity-20 text-accent-dark';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <Link href={`/discussions/${discussion.id}`}>
      <a className={`block p-6 hover:bg-gray-50 transition-colors ${className}`}>
        <div className="flex items-start">
          <img
            src={discussion.authorAvatar || "https://via.placeholder.com/40"}
            alt={`${discussion.authorName} avatar`}
            className="w-10 h-10 rounded-full object-cover mr-4"
          />
          <div className="flex-1">
            <h4 className="font-medium text-lg mb-1">{discussion.title}</h4>
            <p className="text-sm text-gray-500 mb-2">
              Started by {discussion.authorName} • {getTimeAgo(discussion.createdAt)}
            </p>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {discussion.content}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center mr-4">
                <MessageSquare className="h-3 w-3 mr-1" /> {discussion.replies} replies
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" /> {discussion.views} views
              </span>
            </div>
          </div>
          <div className="ml-4 flex flex-col items-end">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(discussion.status)}`}>
              {discussion.status}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
