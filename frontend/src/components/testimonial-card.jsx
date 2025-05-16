import * as React from "react";
import { Quote, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const Testimonial = React.forwardRef(
  (
    { name, role, company, testimonial, rating, image, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-primary/10 bg-background p-6 transition-all hover:shadow-lg dark:hover:shadow-primary/5 md:p-8 h-full flex flex-col",
          className
        )}
        {...props}
      >
        <div className="absolute right-6 top-6 text-6xl font-serif text-muted-foreground/20">
          <Quote className="stroke-fountain-blue-200/50" />
        </div>

        <div className="flex flex-col gap-4 h-full">
          {rating > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={cn(
                    index < rating
                      ? "fill-fountain-blue-400 text-fountain-blue-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
          )}

          <p className="text-pretty text-base text-muted-foreground flex-1 min-h-[80px]">
            {testimonial}
          </p>

          <div className="flex items-center gap-4 justify-start">
            <div className="flex items-center gap-4">
              <Users />

              <div className="flex flex-col">
                <h3 className="font-medium text-foreground">{name}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
Testimonial.displayName = "Testimonial";

export { Testimonial };
