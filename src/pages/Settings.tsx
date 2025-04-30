
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSettings, updateUserSettings, UserSettings } from "@/services/userService";
import { Loader2, Save, Trash2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  
  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getUserSettings(user.id);
        setSettings(data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast({
          title: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [user, toast]);
  
  const handleSaveSettings = async () => {
    if (!user?.id || !settings) return;
    
    setIsSaving(true);
    
    try {
      await updateUserSettings(user.id, settings);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClearData = () => {
    // This would be implemented with actual data clearing once connected to a backend
    toast({
      title: "This feature requires backend integration",
      description: "Connect to Supabase to implement data clearing functionality",
    });
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-companio-gray-default dark:text-gray-400">
            Customize your Companio experience
          </p>
        </header>
        
        {settings && (
          <>
            {/* Voice Settings */}
            <Card className="companio-card mb-8">
              <h2 className="text-xl font-medium mb-6">Voice Settings</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="voice-type">Voice Type</Label>
                  <Select
                    value={settings.voiceType}
                    onValueChange={(value: any) => 
                      setSettings({...settings, voiceType: value})
                    }
                  >
                    <SelectTrigger id="voice-type" className="companio-input">
                      <SelectValue placeholder="Select voice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            
            {/* App Preferences */}
            <Card className="companio-card mb-8">
              <h2 className="text-xl font-medium mb-6">App Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="child-mode">Child Mode</Label>
                    <p className="text-sm text-companio-gray-default">
                      Simplified UI with child-friendly language
                    </p>
                  </div>
                  <Switch
                    id="child-mode"
                    checked={settings.childMode}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, childMode: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-companio-gray-default">
                      Enable reminders and notifications
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, notificationsEnabled: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-theme">Auto Theme Change</Label>
                    <p className="text-sm text-companio-gray-default">
                      Automatically switch between day/night themes
                    </p>
                  </div>
                  <Switch
                    id="auto-theme"
                    checked={settings.autoThemeChange}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, autoThemeChange: checked})
                    }
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: any) => 
                      setSettings({...settings, language: value})
                    }
                  >
                    <SelectTrigger id="language" className="companio-input">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            
            {/* Data Management */}
            <Card className="companio-card">
              <h2 className="text-xl font-medium mb-6">Data Management</h2>
              
              <div className="space-y-6">
                <Button
                  onClick={handleClearData}
                  variant="outline"
                  className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
                
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="companio-button w-full flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Settings
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
