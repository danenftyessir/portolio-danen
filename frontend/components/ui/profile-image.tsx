"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  border?: boolean;
  borderColor?: string;
}

const ProfileImage = ({
  src,
  alt,
  size = "md",
  className,
  border = false,
  borderColor = "border-indigo-500",
}: ProfileImageProps) => {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-48 w-48",
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden",
        sizeClasses[size],
        border && `p-1 ${borderColor} border-2`,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`(max-width: 768px) ${
          parseInt(sizeClasses[size].slice(2, 4)) * 16
        }px, ${parseInt(sizeClasses[size].slice(2, 4)) * 16}px`}
        className="object-cover"
        priority
      />
    </div>
  );
};

export { ProfileImage };
