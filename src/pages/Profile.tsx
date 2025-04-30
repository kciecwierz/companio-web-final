
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Avatar3D from "@/components/Avatar3D";
import { getUserSettings, UserSettings, updateUserSettings } from "@/services/userService";
import { getUserGoals } from "@/services/goalService";
import { getUserEntries } from "@/services/journalService";
import { Loader2, Sun, Moon, Volume2, VolumeX, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [journalCount, setJournalCount] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch user settings
        const settings = await getUserSettings(user.id);
        setUserSettings(settings);
        
        // Fetch journal entries count
        const entries = await getUserEntries(user.id);
        setJournalCount(entries.length);
        
        // Fetch goals stats
        const goals = await getUserGoals(user.id);
        setGoalsCount(goals.length);
        setCompletedGoalsCount(goals.filter(goal => goal.completed).length);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleVoiceToggle = async () => {
    if (!user?.id || !userSettings) return;
    
    const newVoiceType = userSettings.voiceType === "female" ? "male" : "female";
    
    try {
      const updatedSettings = await updateUserSettings(user.id, {
        voiceType: newVoiceType,
      });
      
      setUserSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating voice settings:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-companio-purple" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-20 min-h-screen">
      <div className="container px-4 py-6">
        <header className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Avatar3D size="xl" emotion="happy" />
          </div>
          
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-companio-gray-default dark:text-gray-400">{user?.email}</p>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="companio-card text-center p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-companio-purple">{journalCount}</span>
            <span className="text-sm">Reflections</span>
          </Card>
          
          <Card className="companio-card text-center p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-companio-blue-DEFAULT">{goalsCount}</span>
            <span className="text-sm">Total Goals</span>
          </Card>
          
          <Card className="companio-card text-center p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-companio-yellow-DEFAULT">{completedGoalsCount}</span>
            <span className="text-sm">Completed</span>
          </Card>
        </div>
        
        {/* Preferences */}
        <Card className="companio-card mb-8">
          <h2 className="text-xl font-medium mb-4">Preferences</h2>
          
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-companio-purple" />
                ) : (
                  <Sun className="h-5 w-5 text-companio-yellow-DEFAULT" />
                )}
                <span>Theme</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="min-w-[100px]"
              >
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </Button>
            </div>
            
            {/* Voice Preference */}
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {userSettings?.voiceType === "female" ? (
                  <Volume2 className="h-5 w-5 text-companio-purple" />
                ) : (
                  <Volume2 className="h-5 w-5 text-companio-blue-DEFAULT" />
                )}
                <span>Voice</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceToggle}
                className="min-w-[100px]"
              >
                {userSettings?.voiceType === "female" ? "Female Voice" : "Male Voice"}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Account Actions */}
        <Card className="companio-card">
          <h2 className="text-xl font-medium mb-4">Account</h2>
          
          <div className="space-y-4">
            {/* Edit Profile Button */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </Button>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
