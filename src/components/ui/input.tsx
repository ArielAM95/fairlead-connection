
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    // Special handling for email inputs to validate and restrict input
    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "email") {
        // Remove any non-Latin characters, spaces, or invalid characters for email
        const value = e.target.value.replace(/[^\x00-\x7F]/g, "");
        e.target.value = value;
      }
    };

    // Handle numeric inputs (for business license numbers)
    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.inputMode === "numeric" && props.pattern === "[\\d\\s-]*") {
        // Allow only digits, spaces, and hyphens
        const value = e.target.value.replace(/[^\d\s-]/g, "");
        e.target.value = value;
      }
    };

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          onInput={(e: any) => {
            handleEmailInput(e);
            handleNumericInput(e);
          }}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
