
// Mock service for journal entries

export type JournalEntry = {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: "happy" | "neutral" | "sad";
};

// Mock data
let journalEntries: JournalEntry[] = [
  {
    id: "entry-1",
    userId: "user-1",
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    content: "Today I felt a sense of accomplishment after completing my project. The weather was nice and I took a walk in the park.",
    mood: "happy"
  },
  {
    id: "entry-2",
    userId: "user-1",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    content: "I had a busy day with meetings. Nothing special happened, but I managed to get through my to-do list.",
    mood: "neutral"
  },
  {
    id: "entry-3",
    userId: "user-1",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    content: "Feeling a bit down today. The rainy weather didn't help my mood. Hope tomorrow will be better.",
    mood: "sad"
  },
];

// Get entries for a user
export const getUserEntries = (userId: string): Promise<JournalEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEntries = journalEntries.filter(entry => entry.userId === userId);
      resolve(userEntries);
    }, 500);
  });
};

// Get entry by id
export const getEntryById = (entryId: string): Promise<JournalEntry | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = journalEntries.find(entry => entry.id === entryId);
      resolve(entry);
    }, 300);
  });
};

// Add new entry
export const addEntry = (entry: Omit<JournalEntry, "id">): Promise<JournalEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEntry = {
        ...entry,
        id: "entry-" + Math.random().toString(36).substring(2, 9),
      };
      journalEntries.unshift(newEntry);
      resolve(newEntry);
    }, 500);
  });
};

// Update entry
export const updateEntry = (entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(entry => entry.id === entryId);
      if (index !== -1) {
        journalEntries[index] = { ...journalEntries[index], ...updates };
        resolve(journalEntries[index]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Delete entry
export const deleteEntry = (entryId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = journalEntries.length;
      journalEntries = journalEntries.filter(entry => entry.id !== entryId);
      resolve(journalEntries.length < initialLength);
    }, 500);
  });
};
