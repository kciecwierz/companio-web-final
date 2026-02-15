import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type BallSize = "small" | "medium" | "large";
type HatOption = "cylinder" | "pot" | "beanie";

type BallProgress = Record<BallSize, number>;
type BuiltBalls = Record<BallSize, boolean>;
type PlacedBalls = Record<BallSize, boolean>;
type Decoration = "buttons" | "carrot" | "eyes" | "smile" | "arms";

const creationOrder: BallSize[] = ["small", "medium", "large"];
const placementOrder: BallSize[] = ["large", "medium", "small"];
const decorations: Decoration[] = ["buttons", "carrot", "eyes", "smile", "arms"];

const ballLabels: Record<BallSize, string> = {
  small: "mała kula",
  medium: "średnia kula",
  large: "duża kula",
};

const hatLabels: Record<HatOption, string> = {
  cylinder: "Cylinder",
  pot: "Stary garnek",
  beanie: "Czapka",
};

const baseBallClass =
  "mx-auto rounded-full border-2 border-slate-200 bg-white shadow-inner transition-all duration-300";

export default function SnowmanGame() {
  const [progress, setProgress] = useState<BallProgress>({ small: 0, medium: 0, large: 0 });
  const [builtBalls, setBuiltBalls] = useState<BuiltBalls>({ small: false, medium: false, large: false });
  const [placedBalls, setPlacedBalls] = useState<PlacedBalls>({ small: false, medium: false, large: false });
  const [addedDecorations, setAddedDecorations] = useState<Decoration[]>([]);
  const [hat, setHat] = useState<HatOption | null>(null);

  const nextCreation = creationOrder.find((size) => !builtBalls[size]) ?? null;
  const nextPlacement = placementOrder.find((size) => !placedBalls[size]) ?? null;

  const allBallsBuilt = useMemo(() => creationOrder.every((size) => builtBalls[size]), [builtBalls]);
  const allBallsPlaced = useMemo(() => placementOrder.every((size) => placedBalls[size]), [placedBalls]);
  const allDecorationsAdded = addedDecorations.length === decorations.length;
  const gameCompleted = allBallsBuilt && allBallsPlaced && allDecorationsAdded && Boolean(hat);

  const rollCurrentBall = () => {
    if (!nextCreation) {
      return;
    }

    setProgress((prev) => {
      const updated = Math.min(prev[nextCreation] + 20, 100);
      const next = { ...prev, [nextCreation]: updated };

      if (updated === 100) {
        setBuiltBalls((old) => ({ ...old, [nextCreation]: true }));
      }

      return next;
    });
  };

  const placeCurrentBall = () => {
    if (!nextPlacement) {
      return;
    }

    setPlacedBalls((prev) => ({ ...prev, [nextPlacement]: true }));
  };

  const toggleDecoration = (decoration: Decoration) => {
    if (!allBallsPlaced) {
      return;
    }

    setAddedDecorations((prev) =>
      prev.includes(decoration)
        ? prev.filter((item) => item !== decoration)
        : [...prev, decoration]
    );
  };

  const restart = () => {
    setProgress({ small: 0, medium: 0, large: 0 });
    setBuiltBalls({ small: false, medium: false, large: false });
    setPlacedBalls({ small: false, medium: false, large: false });
    setAddedDecorations([]);
    setHat(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-100 to-slate-200 p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="rounded-3xl border-white/60 bg-white/80 p-6 backdrop-blur">
          <h1 className="text-3xl font-bold text-slate-900">Zbuduj bałwana ☃️</h1>
          <p className="mt-2 text-slate-700">
            Tak — Codex może stworzyć taką grę! Poniżej jest działający prototyp: toczysz kule,
            ustawiasz je, dekorujesz i wybierasz nakrycie głowy.
          </p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="rounded-3xl border-white/60 bg-white/80 p-6 backdrop-blur">
            <div className="flex min-h-[480px] flex-col items-center justify-end rounded-2xl bg-gradient-to-b from-sky-200 to-blue-50 p-4">
              {hat && allBallsPlaced ? (
                <div className="mb-2 text-3xl">
                  {hat === "cylinder" ? "🎩" : hat === "pot" ? "🫕" : "🧢"}
                </div>
              ) : (
                <div className="mb-2 h-12" />
              )}

              <div
                className={`${baseBallClass} ${placedBalls.small ? "h-24 w-24" : "h-10 w-10 opacity-30"} relative`}
              >
                {addedDecorations.includes("eyes") && placedBalls.small ? (
                  <div className="absolute left-0 right-0 top-6 mx-auto flex w-10 justify-between text-lg">
                    <span>•</span>
                    <span>•</span>
                  </div>
                ) : null}
                {addedDecorations.includes("carrot") && placedBalls.small ? (
                  <div className="absolute left-1/2 top-10 -translate-x-1/2 text-lg">🥕</div>
                ) : null}
                {addedDecorations.includes("smile") && placedBalls.small ? (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm">◡◡◡</div>
                ) : null}
              </div>

              <div className={`${baseBallClass} ${placedBalls.medium ? "h-36 w-36" : "mt-2 h-14 w-14 opacity-30"} relative`}>
                {addedDecorations.includes("buttons") && placedBalls.medium ? (
                  <div className="absolute left-0 right-0 top-8 text-center text-xl">• • •</div>
                ) : null}
                {addedDecorations.includes("arms") && placedBalls.medium ? (
                  <div className="absolute -left-20 top-10 flex w-[18rem] justify-between text-2xl">
                    <span>🪵</span>
                    <span>🪵</span>
                  </div>
                ) : null}
              </div>

              <div className={`${baseBallClass} ${placedBalls.large ? "h-48 w-48" : "mt-2 h-16 w-16 opacity-30"}`} />
            </div>
          </Card>

          <Card className="rounded-3xl border-white/60 bg-white/80 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-slate-900">Kroki gry</h2>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-medium">1) Toczenie kul</h3>
                <p className="text-sm text-slate-600">
                  Najpierw mała, potem średnia i na końcu duża.
                </p>
                <p className="mt-2 text-sm font-medium text-blue-700">
                  {nextCreation ? `Teraz tworzysz: ${ballLabels[nextCreation]}` : "Wszystkie kule gotowe!"}
                </p>
                {creationOrder.map((size) => (
                  <div key={size} className="mt-2">
                    <div className="mb-1 flex justify-between text-xs text-slate-600">
                      <span>{ballLabels[size]}</span>
                      <span>{progress[size]}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${progress[size]}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={rollCurrentBall} className="mt-3 w-full" disabled={!nextCreation}>
                  Tocz kulę
                </Button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-medium">2) Ustawianie kul</h3>
                <p className="text-sm text-slate-600">Kolejność: duża → średnia → mała.</p>
                <p className="mt-2 text-sm font-medium text-blue-700">
                  {!allBallsBuilt
                    ? "Najpierw dokończ toczenie kul."
                    : nextPlacement
                      ? `Następna do ustawienia: ${ballLabels[nextPlacement]}`
                      : "Bałwan stoi!"}
                </p>
                <Button
                  onClick={placeCurrentBall}
                  className="mt-3 w-full"
                  disabled={!allBallsBuilt || !nextPlacement}
                >
                  Ustaw kolejną kulę
                </Button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-medium">3) Dekoracje</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {decorations.map((decoration) => (
                    <Button
                      key={decoration}
                      variant={addedDecorations.includes(decoration) ? "default" : "outline"}
                      disabled={!allBallsPlaced}
                      onClick={() => toggleDecoration(decoration)}
                      className="capitalize"
                    >
                      {decoration === "buttons" && "Guziki"}
                      {decoration === "carrot" && "Nos"}
                      {decoration === "eyes" && "Oczy"}
                      {decoration === "smile" && "Usta"}
                      {decoration === "arms" && "Ramiona"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-medium">4) Nakrycie głowy</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {(Object.keys(hatLabels) as HatOption[]).map((option) => (
                    <Button
                      key={option}
                      variant={hat === option ? "default" : "outline"}
                      disabled={!allBallsPlaced}
                      onClick={() => setHat(option)}
                    >
                      {hatLabels[option]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              {gameCompleted
                ? "Świetnie! Udało się stworzyć kompletnego bałwana 🎉"
                : "Buduj krok po kroku, a na końcu wybierz idealne nakrycie głowy."}
            </div>

            <Button onClick={restart} variant="secondary" className="mt-4 w-full">
              Zagraj od nowa
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
