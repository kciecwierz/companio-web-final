import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AgentAniItem,
  createItem,
  getTodayBriefing,
  loadItems,
  saveItems,
  typeLabel,
} from "@/services/agentAniService";

export default function AgentAni() {
  const [items, setItems] = useState<AgentAniItem[]>([]);
  const [captureText, setCaptureText] = useState("");

  useEffect(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const briefing = useMemo(() => getTodayBriefing(items), [items]);

  const addItem = () => {
    const trimmed = captureText.trim();
    if (!trimmed) return;

    const newItem = createItem(trimmed);
    setItems((prev) => [newItem, ...prev]);
    setCaptureText("");
  };

  const toggleDone = (id: string, done: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done } : item)));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Agent Ani — MVP</h1>
          <p className="text-slate-600 mt-2">
            Zewnętrzny mózg operacyjny: zapisuje sprawy, sam je porządkuje i przygotowuje krótki briefing dnia.
          </p>
        </header>

        <Card className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">1) Capture</h2>
          <p className="text-sm text-slate-600">Wpisz sprawę naturalnym językiem, np. „zapłacić prąd”, „urodziny mamy 14 maja”.</p>
          <div className="flex gap-2">
            <Input
              value={captureText}
              onChange={(event) => setCaptureText(event.target.value)}
              placeholder="Co chcesz zrzucić z głowy?"
              onKeyDown={(event) => {
                if (event.key === "Enter") addItem();
              }}
            />
            <Button onClick={addItem}>Zapisz</Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-2">2) Codzienny briefing (demo)</h2>
          {briefing.length > 0 ? (
            <div className="text-sm text-slate-700 space-y-1">
              <p className="font-medium">Dziś masz {briefing.length} ważne rzeczy:</p>
              <ul className="list-disc pl-6">
                {briefing.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Brak aktywnych spraw. Umysł może odpocząć 🙂</p>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">3) Lista spraw i inteligentne przypomnienia</h2>
          <div className="space-y-3">
            {items.length === 0 && <p className="text-sm text-slate-600">Jeszcze nic nie zapisano.</p>}
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={item.done} onCheckedChange={(checked) => toggleDone(item.id, checked === true)} />
                    <div>
                      <p className={item.done ? "line-through text-slate-400" : "text-slate-900"}>{item.text}</p>
                      <div className="flex gap-2 mt-2 items-center flex-wrap">
                        <Badge variant="secondary">{typeLabel(item.type)}</Badge>
                        {item.dueDate && (
                          <Badge variant="outline">
                            termin: {new Date(item.dueDate).toLocaleDateString("pl-PL", { day: "2-digit", month: "short", year: "numeric" })}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Przypomnienia: {item.reminderPlan.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
