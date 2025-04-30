
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Target, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const location = useLocation();
  const { theme } = useTheme();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "Journal", path: "/journal" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-companio-gray-light dark:border-gray-700 bg-white dark:bg-card h-16 md:h-screen md:w-20 md:border-r md:border-t-0 overflow-hidden transition-all z-10">
      <div className="flex h-full md:flex-col justify-around md:justify-start items-center py-1 md:py-8 md:space-y-8">
        {/* Logo on larger screens */}
        <div className="hidden md:flex md:mb-8">
          <div className="w-12 h-12 rounded-full bg-companio-purple flex items-center justify-center">
            <span className="text-white text-xl font-bold">C</span>
          </div>
        </div>
        
        {/* Navigation Items */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-2 md:px-0 md:w-full h-16",
              location.pathname === item.path 
                ? "text-companio-purple" 
                : "text-gray-500 hover:text-companio-purple/80"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
