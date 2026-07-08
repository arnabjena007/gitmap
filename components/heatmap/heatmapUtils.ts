export interface DayData {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface WeekData {
  days: (DayData | null)[];
}

/** Generate a year of fake contribution data */
export function generateHeatmapData(days = 365): WeekData[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - days + 1);

  // Align start to Sunday
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  const weeks: WeekData[] = [];
  const current = new Date(start);

  while (current <= today) {
    const week: (DayData | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(current);
      day.setDate(current.getDate() + d);

      if (day > today || day < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())) {
        week.push(null);
      } else {
        // Weighted random: mostly 0, occasional bursts
        const rand = Math.random();
        let count = 0;
        if (rand > 0.65) {
          const burst = Math.random();
          if (burst > 0.9) count = Math.floor(Math.random() * 15) + 10;
          else if (burst > 0.7) count = Math.floor(Math.random() * 8) + 4;
          else count = Math.floor(Math.random() * 4) + 1;
        }
        week.push({ date: day, count, level: countToLevel(count) });
      }
    }
    weeks.push({ days: week });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

export function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 12) return 3;
  return 4;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getMonthLabels(weeks: WeekData[]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, i) => {
    const firstDay = week.days.find((d) => d !== null);
    if (!firstDay) return;
    const month = firstDay.date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: firstDay.date.toLocaleDateString("en-US", { month: "short" }),
        col: i,
      });
      lastMonth = month;
    }
  });

  return labels;
}

export interface RawContribution {
  date: string;
  count: number;
  level: number;
}

export function transformRawContributions(
  raw: RawContribution[],
  days: number
): WeekData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - days + 1);

  // Align start to Sunday
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  const map = new Map<string, { count: number; level: number }>();
  raw.forEach((item) => {
    map.set(item.date, { count: item.count, level: item.level });
  });

  const weeks: WeekData[] = [];
  const current = new Date(start);

  while (current <= today) {
    const week: (DayData | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(current);
      day.setDate(current.getDate() + d);

      const yyyy = day.getFullYear();
      const mm = String(day.getMonth() + 1).padStart(2, "0");
      const dd = String(day.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const minDate = new Date(today);
      minDate.setDate(today.getDate() - days);
      minDate.setHours(0, 0, 0, 0);

      if (day > today || day < minDate) {
        week.push(null);
      } else {
        const found = map.get(dateStr);
        week.push({
          date: day,
          count: found ? found.count : 0,
          level: found ? (found.level as 0 | 1 | 2 | 3 | 4) : 0,
        });
      }
    }
    weeks.push({ days: week });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
}

function getSeededRandom(str: string) {
  let h1 = 1779033703, h2 = 3024733165, h3 = 3362453659, h4 = 50249321;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  return sfc32(h1, h2, h3, h4);
}

export function generateSeededHeatmapData(username: string, days = 365): WeekData[] {
  const randFn = getSeededRandom(username);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - days + 1);

  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  const weeks: WeekData[] = [];
  const current = new Date(start);

  while (current <= today) {
    const week: (DayData | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(current);
      day.setDate(current.getDate() + d);

      const minDate = new Date(today);
      minDate.setDate(today.getDate() - days);
      minDate.setHours(0, 0, 0, 0);

      if (day > today || day < minDate) {
        week.push(null);
      } else {
        const rand = randFn();
        let count = 0;
        if (rand > 0.65) {
          const burst = randFn();
          if (burst > 0.9) count = Math.floor(randFn() * 15) + 10;
          else if (burst > 0.7) count = Math.floor(randFn() * 8) + 4;
          else count = Math.floor(randFn() * 4) + 1;
        }
        week.push({ date: day, count, level: countToLevel(count) });
      }
    }
    weeks.push({ days: week });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}
