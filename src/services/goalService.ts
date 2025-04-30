
// Mock service for goals

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category: "personal" | "work" | "health" | "learning" | "other";
  createdAt: string;
};

// Mock data
let goals: Goal[] = [
  {
    id: "goal-1",
    userId: "user-1",
    title: "Meditate for 10 minutes",
    description: "Take time each day for mindfulness",
    completed: false,
    category: "health",
    createdAt: new Date().toISOString()
  },
  {
    id: "goal-2",
    userId: "user-1",
    title: "Read 20 pages",
    description: "Continue reading my current book",
    completed: true,
    category: "personal",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "goal-3",
    userId: "user-1",
    title: "Learn React hooks",
    description: "Complete online tutorial on hooks",
    completed: false,
    dueDate: new Date(Date.now() + 604800000).toISOString(), // week from now
    category: "learning",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
];

// Get goals for a user
export const getUserGoals = (userId: string): Promise<Goal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userGoals = goals.filter(goal => goal.userId === userId);
      resolve(userGoals);
    }, 500);
  });
};

// Get goal by id
export const getGoalById = (goalId: string): Promise<Goal | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = goals.find(goal => goal.id === goalId);
      resolve(goal);
    }, 300);
  });
};

// Add new goal
export const addGoal = (goal: Omit<Goal, "id">): Promise<Goal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGoal = {
        ...goal,
        id: "goal-" + Math.random().toString(36).substring(2, 9),
      };
      goals.unshift(newGoal);
      resolve(newGoal);
    }, 500);
  });
};

// Update goal
export const updateGoal = (goalId: string, updates: Partial<Goal>): Promise<Goal | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = goals.findIndex(goal => goal.id === goalId);
      if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        resolve(goals[index]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Toggle goal completion
export const toggleGoalCompletion = (goalId: string): Promise<Goal | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = goals.findIndex(goal => goal.id === goalId);
      if (index !== -1) {
        goals[index] = { 
          ...goals[index], 
          completed: !goals[index].completed 
        };
        resolve(goals[index]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};

// Delete goal
export const deleteGoal = (goalId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = goals.length;
      goals = goals.filter(goal => goal.id !== goalId);
      resolve(goals.length < initialLength);
    }, 500);
  });
};
