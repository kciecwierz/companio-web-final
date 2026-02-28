export type AgentAniItemType = "TASK" | "EVENT" | "PAYMENT" | "SOMEDAY";

export interface AgentAniItem {
  id: string;
  text: string;
  type: AgentAniItemType;
  createdAt: string;
  dueDate?: string;
  recurrence?: "monthly" | "yearly";
  reminderPlan: string[];
  done: boolean;
}

const STORAGE_KEY = "agent-ani-items-v1";

const PAYMENT_HINTS = ["zapła", "rachu", "fakt", "czynsz", "abonament", "prąd", "gaz", "rat"];
const EVENT_HINTS = ["urodziny", "wizyta", "dentyst", "spotkanie", "rocznica", "w marcu", "w maju", "w czerwcu", "w lipcu"];
const SOMEDAY_HINTS = ["kiedyś", "w przyszłości", "kiedy bede", "kiedy będę", "może", "moze"];

const MONTHS_PL = [
  "stycz", "lut", "mar", "kwie", "maj", "czer", "lip", "sier", "wrze", "paź", "paz", "list", "grud",
];

function hasAnyHint(text: string, hints: string[]) {
  return hints.some((hint) => text.includes(hint));
}

export function classifyItem(rawText: string): AgentAniItemType {
  const text = rawText.toLowerCase();

  if (hasAnyHint(text, PAYMENT_HINTS)) return "PAYMENT";
  if (hasAnyHint(text, SOMEDAY_HINTS)) return "SOMEDAY";

  const hasDateLike = /\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/.test(text) || MONTHS_PL.some((m) => text.includes(m));
  if (hasDateLike || hasAnyHint(text, EVENT_HINTS)) return "EVENT";

  return "TASK";
}

export function parseDueDate(rawText: string): string | undefined {
  const text = rawText.toLowerCase();
  const now = new Date();

  const ddmmyyyy = text.match(/\b(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?\b/);
  if (ddmmyyyy) {
    const day = Number(ddmmyyyy[1]);
    const month = Number(ddmmyyyy[2]) - 1;
    const yearRaw = ddmmyyyy[3];
    const year = yearRaw ? Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw) : now.getFullYear();
    const date = new Date(year, month, day, 9, 0, 0);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  const dayMonth = text.match(/\b(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|pazdziernika|października|listopada|grudnia)\b/);
  if (dayMonth) {
    const day = Number(dayMonth[1]);
    const monthMap: Record<string, number> = {
      stycznia: 0,
      lutego: 1,
      marca: 2,
      kwietnia: 3,
      maja: 4,
      czerwca: 5,
      lipca: 6,
      sierpnia: 7,
      września: 8,
      pazdziernika: 9,
      października: 9,
      listopada: 10,
      grudnia: 11,
    };

    let year = now.getFullYear();
    const date = new Date(year, monthMap[dayMonth[2]], day, 9, 0, 0);
    if (date < now) date.setFullYear(year + 1);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return undefined;
}

export function buildReminderPlan(type: AgentAniItemType, dueDate?: string): string[] {
  if (!dueDate) {
    if (type === "SOMEDAY") return ["delikatne przypomnienie co 7 dni"];
    if (type === "TASK") return ["przypomnienie jutro rano"];
    return ["przypomnienie przy najbliższym briefingu"];
  }

  if (type === "PAYMENT") {
    return ["2 dni wcześniej", "w dniu terminu o 8:30"];
  }

  return ["dzień wcześniej o 18:00", "w dniu wydarzenia o 8:30"];
}

export function createItem(rawText: string): AgentAniItem {
  const type = classifyItem(rawText);
  const dueDate = parseDueDate(rawText);
  const recurrence = type === "PAYMENT" && rawText.toLowerCase().includes("co miesiąc") ? "monthly" : undefined;

  return {
    id: crypto.randomUUID(),
    text: rawText.trim(),
    type,
    createdAt: new Date().toISOString(),
    dueDate,
    recurrence,
    reminderPlan: buildReminderPlan(type, dueDate),
    done: false,
  };
}

export function loadItems(): AgentAniItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as AgentAniItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveItems(items: AgentAniItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getTodayBriefing(items: AgentAniItem[]): string[] {
  const pending = items.filter((item) => !item.done);
  const priorityOrder: AgentAniItemType[] = ["PAYMENT", "EVENT", "TASK", "SOMEDAY"];

  return pending
    .sort((a, b) => {
      const byType = priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type);
      if (byType !== 0) return byType;
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return ad - bd;
    })
    .slice(0, 3)
    .map((item) => item.text);
}

export function typeLabel(type: AgentAniItemType): string {
  const labels: Record<AgentAniItemType, string> = {
    TASK: "Zadanie",
    EVENT: "Wydarzenie",
    PAYMENT: "Płatność",
    SOMEDAY: "Do kiedyś",
  };

  return labels[type];
}
