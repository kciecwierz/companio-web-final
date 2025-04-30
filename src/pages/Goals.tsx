
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserGoals,
  addGoal,
  toggleGoalCompletion,
  deleteGoal,
  Goal,
} from "@/services/goalService";
import { Loader2, Plus, Trash2 } from "lucide-react";

const goalCategoryIcons: Record<string, string> = {
  personal: "🌟",
  work: "💼",
  health: "❤️",
  learning: "📚",
  other: "🔄",
};

export default function Goals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // New goal form state
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<"personal" | "work" | "health" | "learning" | "other">("personal");
  
  // Fetch goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getUserGoals(user.id);
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: "Failed to load goals",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, [user, toast]);
  
  const handleCreateGoal = async () => {
    if (!user?.id || !newGoalTitle.trim()) return;
    
    setIsCreating(true);
    
    try {
      const newGoal = await addGoal({
        userId: user.id,
        title: newGoalTitle,
        description: newGoalDescription,
        completed: false,
        category: newGoalCategory,
        createdAt: new Date().toISOString(),
      });
      
      setGoals([newGoal, ...goals]);
      setNewGoalTitle("");
      setNewGoalDescription("");
      setNewGoalCategory("personal");
      
      toast({
        title: "Goal created",
        description: "Your new goal has been added",
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleToggleGoal = async (goalId: string) => {
    try {
      const updatedGoal = await toggleGoalCompletion(goalId);
      
      if (updatedGoal) {
        setGoals(goals.map(goal => 
          goal.id === goalId ? updatedGoal : goal
        ));
        
        toast({
          title: updatedGoal.completed ? "Goal completed! 🎉" : "Goal marked as incomplete",
        });
      }
    } catch (error) {
      console.error('Error toggling goal completion:', error);
      toast({
        title: "Failed to update goal",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteGoal = async (goalId: string) => {
    try {
      const success = await deleteGoal(goalId);
      
      if (success) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        toast({
          title: "Goal deleted",
        });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };
  
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="pb-20 md:pb-0 md:pl-20 min-h-screen">
      <div className="container px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Goals</h1>
          <p className="text-companio-gray-default dark:text-gray-400">
            Set and track your personal goals
          </p>
        </header>
        
        {/* New Goal Form */}
        <Card className="companio-card mb-8">
          <h2 className="text-xl font-medium mb-4">Add New Goal</h2>
          
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Goal title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="companio-input"
              />
            </div>
            
            <div>
              <Textarea
                placeholder="Description (optional)"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="companio-input min-h-[100px]"
              />
            </div>
            
            <div>
              <Select
                value={newGoalCategory}
                onValueChange={(value: any) => setNewGoalCategory(value)}
              >
                <SelectTrigger className="companio-input">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">
                    {goalCategoryIcons.personal} Personal
                  </SelectItem>
                  <SelectItem value="work">
                    {goalCategoryIcons.work} Work
                  </SelectItem>
                  <SelectItem value="health">
                    {goalCategoryIcons.health} Health
                  </SelectItem>
                  <SelectItem value="learning">
                    {goalCategoryIcons.learning} Learning
                  </SelectItem>
                  <SelectItem value="other">
                    {goalCategoryIcons.other} Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleCreateGoal}
              disabled={!newGoalTitle.trim() || isCreating}
              className="companio-button w-full"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Goal
            </Button>
          </div>
        </Card>
        
        {/* Goals Lists */}
        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="active">
              Active Goals ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-companio-purple" />
              </div>
            ) : activeGoals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <Card key={goal.id} className="companio-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {goalCategoryIcons[goal.category]}
                        </span>
                        <h3 className="font-medium">{goal.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-companio-gray-default">
                        {new Date(goal.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Complete</span>
                        <Switch
                          checked={goal.completed}
                          onCheckedChange={() => handleToggleGoal(goal.id)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-companio-gray-default mb-2">No active goals</p>
                <p className="text-sm">Create a new goal to get started</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-companio-purple" />
              </div>
            ) : completedGoals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="companio-card bg-muted/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {goalCategoryIcons[goal.category]}
                        </span>
                        <h3 className="font-medium line-through opacity-70">{goal.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-through opacity-70">
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-companio-gray-default">
                        Completed
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Reactivate</span>
                        <Switch
                          checked={goal.completed}
                          onCheckedChange={() => handleToggleGoal(goal.id)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-companio-gray-default mb-2">No completed goals</p>
                <p className="text-sm">Your completed goals will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
