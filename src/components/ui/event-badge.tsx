import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const eventBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-blue-100 text-blue-800",
        secondary: "bg-purple-100 text-purple-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface EventBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof eventBadgeVariants> {}

export function EventBadge({
  className,
  variant,
  ...props
}: EventBadgeProps) {
  return (
    <span
      className={cn(eventBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}
