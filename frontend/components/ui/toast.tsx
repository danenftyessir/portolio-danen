"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// konteks untuk toast
const ToastContext = React.createContext({
  toast: (props: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {},
});

export const useToast = () => {
  return React.useContext(ToastContext);
};

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ToastProps
>(({ className, title, description, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border border-slate-200 p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
        variant === "destructive" && "border-red-500 bg-red-500 text-slate-50",
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    </div>
  );
});
Toast.displayName = "Toast";

const Toaster = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast: any) => toast.id !== id)
      );
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <div
        ref={ref}
        className={cn(
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
          className
        )}
        {...props}
      >
        {toasts.map((toast: any, index) => (
          <Toast key={index} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
});
Toaster.displayName = "Toaster";

export { Toast, Toaster };
