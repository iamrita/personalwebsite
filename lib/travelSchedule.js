import { addDays, eachDayOfInterval, format, isWithinInterval, parseISO } from "date-fns";

// Edit this list to match your real travel plans.
// Dates should be YYYY-MM-DD (local time). Ranges are inclusive.
export const travelSchedule = [
  {
    startDate: "2026-04-01",
    endDate: "2026-04-04",
    location: "San Francisco, CA",
    details: "Home base",
  },
  {
    startDate: "2026-04-05",
    endDate: "2026-04-07",
    location: "Los Angeles, CA",
    details: "Work meetings",
  },
  {
    startDate: "2026-04-08",
    endDate: "2026-04-14",
    location: "San Francisco, CA",
    details: "Home base",
  },
];

function normalizeRange(item) {
  const start = parseISO(item.startDate);
  const end = parseISO(item.endDate);
  return { start, end };
}

export function buildTwoWeekTravelCalendar({
  startDate = new Date(),
  days = 14,
  schedule = travelSchedule,
} = {}) {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = addDays(start, days - 1);
  const items = schedule.map((item) => ({ ...item, ...normalizeRange(item) }));

  return eachDayOfInterval({ start, end }).map((day) => {
    const matches = items
      .filter((it) => isWithinInterval(day, { start: it.start, end: it.end }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const primary = matches[0] ?? null;

    return {
      date: format(day, "yyyy-MM-dd"),
      label: format(day, "EEE, MMM d"),
      location: primary?.location ?? "—",
      details: primary?.details ?? "",
    };
  });
}

