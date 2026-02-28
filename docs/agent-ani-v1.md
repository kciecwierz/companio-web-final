# Agent Ani — zarys startowy (v1)

## 1. Cel projektu (najważniejsze zdanie)

System, który przejmuje od Ani pamiętanie o sprawach codziennych i przypomina o nich we właściwym momencie.

- To **nie** jest projekt o produktywności.
- To **nie** jest klasyczny task manager.
- Priorytet: **redukcja mentalnego obciążenia**.

## 2. Problem, który rozwiązujemy

Ania:

- ma dużo równoległych spraw,
- pamięta „w głowie”,
- zapisuje rzeczy w różnych miejscach,
- zapomina nie dlatego, że nie chce, tylko dlatego, że mózg ma limit.

Efekt:

- stres,
- odkładanie,
- poczucie chaosu.

Agent ma działać jak **zewnętrzny mózg operacyjny**.

## 3. Zakres v1 — tylko 4 funkcje

### A) Capture (przyjmowanie spraw)

Ania może powiedzieć albo napisać np.:

- „zapłacić prąd”,
- „urodziny mamy 14 maja”,
- „kupić filtr do wody”,
- „dentysta Kajka w marcu”.

Agent:

- zapisuje sprawę,
- dopytuje o brakujące informacje.

### B) Automatyczne porządkowanie

Bez ręcznego wybierania kategorii przez użytkownika.

Agent sam rozpoznaje typ wpisu:

- zadanie,
- wydarzenie,
- płatność,
- przypomnienie cykliczne.

### C) Inteligentne przypomnienia

Nie spamujemy.

Zasada: przypomnienie ma przyjść wtedy, gdy **wciąż można podjąć działanie**.

Przykłady:

- dzień wcześniej,
- rano,
- przed wyjściem z domu.

### D) Codzienny briefing

Codziennie rano (np. 8:30) krótka wiadomość:

> Dziś masz 3 ważne rzeczy:
> – zapłacić prąd
> – telefon do dentysty
> – kupić prezent

Krótko i konkretnie — bez „listy śmierci”.

## 4. Czego świadomie NIE robimy

- ❌ aplikacji mobilnej,
- ❌ kont użytkowników,
- ❌ synchronizacji kalendarzy,
- ❌ wielu pobocznych funkcji,
- ❌ dashboardów.

Na początku ma to być **niewidzialne narzędzie**, które realnie odciąża.

## 5. Architektura — wersja ultra-prosta

Przepływ na start:

```text
Ania → czat/głos → Agent AI → Lista spraw → Przypomnienia
```

Minimalny stack:

- interfejs: WhatsApp / Telegram / ChatGPT,
- AI: model językowy,
- baza: prosta lista (Notion / Google Sheet / JSON),
- przypomnienia: scheduler (cron / automation).

To wystarczy do walidacji.

## 6. Model danych v1 (typy rzeczy)

Tylko 4 typy:

1. **ZADANIE** — trzeba coś zrobić,
2. **WYDARZENIE** — konkretna data,
3. **PŁATNOŚĆ** — jednorazowa albo cykliczna,
4. **DO KIEDYŚ** — bez terminu, agent przypomina okresowo.

Minimalizm ma redukować chaos.

## 7. Zachowanie agenta (osobowość systemu)

To ważniejsze niż kod.

Agent:

- nie moralizuje,
- nie zasypuje powiadomieniami,
- upraszcza decyzje,
- proponuje, zamiast zadawać serię zbędnych pytań.

Zamiast „Podaj kategorię.”

Mówi: „Chcesz przypomnienie dzień wcześniej?”

## 8. Miernik sukcesu

Nie liczba funkcji.

Prawdziwy sukces:

> Po 2 tygodniach Ania mówi: „już nie muszę o tym pamiętać”.

## 9. Plan działania — pierwsze 14 dni

### Dzień 1–3

- ręczne zbieranie spraw Ani (operator = Ty),
- obserwacja wzorców.

### Dzień 4–7

- prosty czat AI, który zapisuje sprawy.

### Dzień 8–10

- automatyczne briefingi dnia.

### Dzień 11–14

- pierwsze inteligentne przypomnienia.

Bez kodowego overkill.

---

## Najważniejsza zasada

**Agent ma zmniejszać liczbę decyzji Ani, nie zwiększać.**

Jeśli trzeba dużo konfigurować, to znaczy, że projekt idzie w złą stronę.
