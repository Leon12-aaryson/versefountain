import { Link } from "wouter";
import { AcademicResource } from "@shared/schema";

interface AcademicResourceCardProps {
  resource: AcademicResource;
}

export default function AcademicResourceCard({ resource }: AcademicResourceCardProps) {
  return (
    <Link href={resource.link}>
      <a className="bg-white bg-opacity-10 hover:bg-opacity-15 transition-colors rounded-lg p-6">
        <div className="text-accent mb-3">
          <i className={`${resource.icon} text-2xl`}></i>
        </div>
        <h3 className="font-display text-xl mb-2">{resource.title}</h3>
        <p className="text-white text-opacity-80 text-sm mb-4">
          {resource.description}
        </p>
        <span className="text-accent text-sm font-medium">
          {/* Action text based on resource type */}
          {resource.type === 'Research' && "Browse Collection "}
          {resource.type === 'Video' && "View Lectures "}
          {resource.type === 'Guide' && "Get Guides "}
          {resource.type === 'Community' && "Join Groups "}
          {resource.type === 'Resource' && "Explore Resources "}
          {resource.type === 'Certificate' && "View Programs "}
          <i className="fas fa-arrow-right ml-1"></i>
        </span>
      </a>
    </Link>
  );
}
