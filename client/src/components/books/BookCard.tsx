import { Link } from "wouter";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="book-hover">
      <div className="relative h-64 md:h-72 w-full rounded-md overflow-hidden shadow-lg transition-all duration-300">
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="book-cover h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link href={`/books/${book.id}`}>
            <Button className="bg-primary text-white py-2 px-4 rounded text-sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/books/${book.id}`} className="hover:underline">
          <h3 className="font-display text-lg leading-tight">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600">By {book.author}</p>
        <div className="flex items-center mt-1">
          <Rating value={book.rating} count={book.ratingCount} size="sm" />
        </div>
      </div>
    </div>
  );
}
