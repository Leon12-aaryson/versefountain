import { Star, StarHalf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value = 0,
  count,
  size = "md",
  showCount = true,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const filledStars = Math.floor(value);
  const hasHalfStar = value - filledStars >= 0.25 && value - filledStars < 0.75;
  const totalStars = 5;
  
  const displayValue = hoverValue !== null && interactive ? hoverValue : value;
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  
  const handleClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {[...Array(totalStars)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = displayValue >= starValue - 0.25;
          const isHalf = !isFilled && displayValue >= starValue - 0.75;
          
          return (
            <span
              key={i}
              className={cn(
                "cursor-default",
                interactive && "cursor-pointer",
                sizeClasses[size]
              )}
              onMouseEnter={() => interactive && setHoverValue(starValue)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              onClick={() => handleClick(starValue)}
            >
              {isFilled ? (
                <Star className="text-yellow-400 fill-yellow-400" />
              ) : isHalf ? (
                <StarHalf className="text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="text-yellow-400" />
              )}
            </span>
          );
        })}
      </div>
      
      {showCount && (
        <span className={cn("ml-1", sizeClasses[size])}>
          {displayValue.toFixed(1)}{count ? ` (${count})` : ""}
        </span>
      )}
    </div>
  );
}
