
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Avatar3D from "@/components/Avatar3D";

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      title: "Welcome to Companio",
      description: "Your daily companion for reflection, wellness, and personal growth.",
      emotion: "happy" as const,
      color: "bg-companio-yellow-light"
    },
    {
      title: "Daily Reflection",
      description: "Take a moment each day to reflect on your experiences, emotions, and growth.",
      emotion: "thinking" as const,
      color: "bg-companio-purple-light"
    },
    {
      title: "Set Meaningful Goals",
      description: "Create small, achievable goals that bring joy and purpose to your daily life.",
      emotion: "neutral" as const,
      color: "bg-companio-blue-light"
    },
    {
      title: "Emotional Balance",
      description: "Track your moods and discover patterns to better understand your emotional wellbeing.",
      emotion: "happy" as const,
      color: "bg-companio-beige-light"
    }
  ];
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };
  
  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Slides container */}
      <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${slide.color} transition-all`}
            initial={{ opacity: 0, x: index > currentSlide ? "100%" : "-100%" }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              x: index === currentSlide ? 0 : index > currentSlide ? "100%" : "-100%"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Avatar3D 
              emotion={slide.emotion}
              size="xl"
              className="mb-8"
            />
            
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {slide.title}
            </h1>
            
            <p className="text-lg max-w-md text-gray-600">
              {slide.description}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center my-6 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide ? "bg-companio-purple w-8" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Buttons */}
      <div className="p-6 flex justify-between">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500"
        >
          Skip
        </Button>
        
        <Button
          onClick={handleNext}
          className="companio-button"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
