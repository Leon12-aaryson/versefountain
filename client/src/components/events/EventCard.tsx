import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Event } from "@shared/schema";
import { MapPin, Clock, Users, Video } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const getDateColor = () => {
    if (event.isVirtual) {
      return "bg-secondary";
    }
    return "bg-primary";
  };

  const handleAttend = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `/events/${event.id}/tickets`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-0 left-0 ${getDateColor()} text-white px-3 py-2 font-sans font-medium`}>
          <div className="text-xs uppercase">{event.month}</div>
          <div className="text-xl leading-tight">{event.day}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 mb-3">
          {event.isVirtual ? (
            <Video className="h-3 w-3 mr-1" />
          ) : (
            <MapPin className="h-3 w-3 mr-1" />
          )}
          {event.location}
          <span className="mx-2">•</span>
          <Clock className="h-3 w-3 mr-1" /> {event.startTime} - {event.endTime}
        </div>
        <Link href={`/events/${event.id}`}>
          <a className="hover:underline">
            <h3 className="font-display text-xl mb-2">{event.title}</h3>
          </a>
        </Link>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-full text-xs">
            <Users className="h-3 w-3 mr-1" /> {event.attendees} Attending
          </span>
          <Button
            variant="link"
            size="sm"
            className="text-primary hover:text-primary-dark font-medium"
            onClick={handleAttend}
          >
            {event.isVirtual ? "Register" : "Get Tickets"}
          </Button>
        </div>
      </div>
    </div>
  );
}
