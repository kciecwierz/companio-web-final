
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Avatar3D from "@/components/Avatar3D";
import { getUserEntries, JournalEntry } from "@/services/journalService";
import { getUserGoals, Goal } from "@/services/goalService";
import { generateAffirmation } from "@/services/userService";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState("");
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [affirmation, setAffirmation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "";
    
    if (hour < 12) {
      greetingText = "Good morning";
    } else if (hour < 18) {
      greetingText = "Good afternoon";
    } else {
      greetingText = "Good evening";
    }
    
    setGreeting(`${greetingText}, ${user?.name || "Friend"}!`);
  }, [user]);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch journal entries
        const entries = await getUserEntries(user.id);
        if (entries.length > 0) {
          setLatestEntry(entries[0]);
        }
        
        // Fetch goals
        const goals = await getUserGoals(user.id);
        const activeGoals = goals.filter(goal => !goal.completed).slice(0, 3);
        const completedCount = goals.filter(goal => goal.completed).length;
        
        setActiveGoals(activeGoals);
        setCompletedGoals(completedCount);
        
        // Generate affirmation
        const dailyAffirmation = await generateAffirmation();
        setAffirmation(dailyAffirmation);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  return (
    <div className="pb-20 md:pb-0 md:pl-20 min-h-screen">
      <div className="container px-4 py-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{greeting}</h1>
            <p className="text-companio-gray-default dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center">
            <Avatar3D emotion="happy" size="md" />
          </div>
        </header>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-companio-purple">Loading...</div>
          </div>
        ) : (
          <>
            {/* Daily Affirmation */}
            <Card className="companio-card mb-8 border-l-4 border-l-companio-yellow-DEFAULT">
              <h2 className="text-xl font-medium mb-2">Today's Affirmation</h2>
              <p className="text-lg italic text-companio-purple font-medium">"{affirmation}"</p>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Latest Journal Entry */}
              <Card className="companio-card h-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium">Latest Reflection</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/journal')} className="text-companio-purple flex items-center gap-1">
                    View all <ArrowRight size={16} />
                  </Button>
                </div>
                
                {latestEntry ? (
                  <div>
                    <p className="text-sm text-companio-gray-default mb-2">
                      {new Date(latestEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="line-clamp-3">{latestEntry.content}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">No reflections yet. Start your first one!</p>
                    <Button onClick={() => navigate('/journal')} className="companio-button">
                      Create Reflection
                    </Button>
                  </div>
                )}
              </Card>
              
              {/* Goals Summary */}
              <Card className="companio-card h-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium">Goals</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/goals')} className="text-companio-purple flex items-center gap-1">
                    View all <ArrowRight size={16} />
                  </Button>
                </div>
                
                {activeGoals.length > 0 ? (
                  <div>
                    <p className="text-companio-gray-default mb-4">
                      {completedGoals} completed • {activeGoals.length} in progress
                    </p>
                    
                    <ul className="space-y-3">
                      {activeGoals.map((goal) => (
                        <li key={goal.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                          <div className={`w-3 h-3 rounded-full ${
                            goal.category === 'personal' ? 'bg-companio-purple' :
                            goal.category === 'health' ? 'bg-companio-blue-DEFAULT' :
                            goal.category === 'work' ? 'bg-companio-beige-DEFAULT' :
                            'bg-companio-yellow-DEFAULT'
                          }`} />
                          <span className="text-sm">{goal.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">No active goals. Create one to get started!</p>
                    <Button onClick={() => navigate('/goals')} className="companio-button">
                      Add Goal
                    </Button>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Current Mode */}
            <Card className="companio-card flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium">Current Mode</h2>
                <p>{theme === 'dark' ? 'Night mode' : 'Day mode'}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-companio-purple-light text-companio-purple-DEFAULT' : 'bg-companio-yellow-light text-companio-yellow-DEFAULT'
              }`}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
