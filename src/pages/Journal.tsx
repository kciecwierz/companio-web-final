
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserEntries, addEntry, deleteEntry, JournalEntry } from "@/services/journalService";
import { generateReflectionQuestions } from "@/services/userService";
import { CalendarIcon, Loader2, Plus, Trash2, RefreshCw } from "lucide-react";

export default function Journal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad">("neutral");
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  
  // Fetch journal entries on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getUserEntries(user.id);
        setEntries(data);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        toast({
          title: "Failed to load journal entries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [user, toast]);
  
  const handleCreateEntry = async () => {
    if (!user?.id || !newEntryContent.trim()) return;
    
    setIsCreating(true);
    
    try {
      const newEntry = await addEntry({
        userId: user.id,
        content: newEntryContent,
        date: new Date().toISOString(),
        mood: selectedMood,
      });
      
      setEntries([newEntry, ...entries]);
      setNewEntryContent("");
      setSelectedMood("neutral");
      setIsCreating(false);
      
      toast({
        title: "Journal entry created",
        description: "Your reflection has been saved",
      });
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast({
        title: "Failed to save journal entry",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };
  
  const handleDeleteEntry = async (entryId: string) => {
    try {
      const success = await deleteEntry(entryId);
      
      if (success) {
        setEntries(entries.filter(entry => entry.id !== entryId));
        toast({
          title: "Journal entry deleted",
        });
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Failed to delete journal entry",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    try {
      const questions = await generateReflectionQuestions();
      setReflectionQuestions(questions);
    } catch (error) {
      console.error('Error generating reflection questions:', error);
      toast({
        title: "Failed to generate questions",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="pb-20 md:pb-0 md:pl-20 min-h-screen">
      <div className="container px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reflection Journal</h1>
          <p className="text-companio-gray-default dark:text-gray-400">
            Capture your thoughts, feelings, and experiences
          </p>
        </header>
        
        {/* New Entry Form */}
        <Card className="companio-card mb-8">
          <h2 className="text-xl font-medium mb-4">New Reflection</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">How are you feeling?</label>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setSelectedMood("happy")}
                  className={`text-2xl p-1 rounded-full transition-all ${selectedMood === "happy" ? "bg-companio-yellow-light scale-125" : "opacity-50"}`}
                >
                  😊
                </button>
                <button 
                  onClick={() => setSelectedMood("neutral")}
                  className={`text-2xl p-1 rounded-full transition-all ${selectedMood === "neutral" ? "bg-companio-blue-light scale-125" : "opacity-50"}`}
                >
                  😐
                </button>
                <button 
                  onClick={() => setSelectedMood("sad")}
                  className={`text-2xl p-1 rounded-full transition-all ${selectedMood === "sad" ? "bg-companio-beige-light scale-125" : "opacity-50"}`}
                >
                  😔
                </button>
              </div>
            </div>
            
            <Textarea
              placeholder="Write your reflection here..."
              className="companio-input min-h-[150px]"
              value={newEntryContent}
              onChange={(e) => setNewEntryContent(e.target.value)}
            />
          </div>
          
          {/* Reflection question suggestions */}
          {reflectionQuestions.length > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Reflection prompts:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {reflectionQuestions.map((question, index) => (
                  <li key={index} className="text-sm">{question}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleGenerateQuestions}
              disabled={isGeneratingQuestions}
              className="flex items-center gap-2"
            >
              {isGeneratingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {reflectionQuestions.length > 0 ? "New Prompts" : "Get Prompts"}
            </Button>
            
            <Button
              onClick={handleCreateEntry}
              disabled={!newEntryContent.trim() || isCreating}
              className="companio-button flex items-center gap-2"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save Reflection
            </Button>
          </div>
        </Card>
        
        {/* Journal Entries List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Past Reflections</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-companio-purple" />
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="companio-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {entry.mood === "happy" ? "😊" : entry.mood === "neutral" ? "😐" : "😔"}
                      </span>
                      <span className="text-sm text-companio-gray-default">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-companio-gray-default mb-2">No journal entries yet</p>
              <p className="text-sm">Start by creating your first reflection above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
