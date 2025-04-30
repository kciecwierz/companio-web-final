
import React from "react";
import { cn } from "@/lib/utils";

interface Avatar3DProps {
  emotion?: "happy" | "neutral" | "thinking" | "sad";
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

export default function Avatar3D({ 
  emotion = "happy", 
  size = "md", 
  animate = true,
  className 
}: Avatar3DProps) {
  const getSize = () => {
    switch(size) {
      case "sm": return "w-16 h-16";
      case "md": return "w-24 h-24";
      case "lg": return "w-32 h-32";
      case "xl": return "w-48 h-48";
      default: return "w-24 h-24";
    }
  };

  const getBackgroundColor = () => {
    switch(emotion) {
      case "happy": return "bg-companio-yellow-light dark:bg-companio-yellow-light/80";
      case "neutral": return "bg-companio-blue-light dark:bg-companio-blue-light/80";  
      case "thinking": return "bg-companio-purple-light dark:bg-companio-purple-light/80";
      case "sad": return "bg-companio-beige-light dark:bg-companio-beige-light/80";
      default: return "bg-companio-yellow-light dark:bg-companio-yellow-light/80";
    }
  };

  const getEmojiForEmotion = () => {
    switch(emotion) {
      case "happy": return "😊";
      case "neutral": return "😐";
      case "thinking": return "🤔";
      case "sad": return "😔";
      default: return "😊";
    }
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center shadow-lg",
        getSize(),
        getBackgroundColor(),
        animate && "animate-bounce-slow",
        className
      )}
    >
      <span className={cn("text-4xl", size === "xl" && "text-6xl", size === "lg" && "text-5xl", size === "sm" && "text-3xl")}>
        {getEmojiForEmotion()}
      </span>
    </div>
  );
}
