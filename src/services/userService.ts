
// Mock service for user settings and preferences

export type UserSettings = {
  userId: string;
  voiceType: "male" | "female";
  childMode: boolean;
  notificationsEnabled: boolean;
  language: "en" | "es" | "fr";
  autoThemeChange: boolean;
};

// Mock data
const userSettings: Record<string, UserSettings> = {
  "user-1": {
    userId: "user-1",
    voiceType: "female",
    childMode: false,
    notificationsEnabled: true,
    language: "en",
    autoThemeChange: true,
  },
};

// Get user settings
export const getUserSettings = (userId: string): Promise<UserSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const settings = userSettings[userId] || {
        userId,
        voiceType: "female",
        childMode: false,
        notificationsEnabled: true,
        language: "en",
        autoThemeChange: true,
      };
      resolve(settings);
    }, 300);
  });
};

// Update user settings
export const updateUserSettings = (
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      userSettings[userId] = {
        ...(userSettings[userId] || {
          userId,
          voiceType: "female",
          childMode: false,
          notificationsEnabled: true,
          language: "en",
          autoThemeChange: true,
        }),
        ...updates,
      };
      resolve(userSettings[userId]);
    }, 500);
  });
};

// Generate reflection questions (simulated GPT integration)
export const generateReflectionQuestions = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = [
        "What made you smile today?",
        "What was challenging about your day?",
        "Did you learn something new today?",
        "What are you grateful for today?",
        "How did you take care of yourself today?",
      ];
      resolve(questions);
    }, 800);
  });
};

// Generate affirmation (simulated GPT integration)
export const generateAffirmation = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const affirmations = [
        "You are capable of amazing things.",
        "Today is full of possibilities.",
        "You have the power to create change.",
        "Your potential is limitless.",
        "You are enough just as you are.",
      ];
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      resolve(affirmations[randomIndex]);
    }, 500);
  });
};
