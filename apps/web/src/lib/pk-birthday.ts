/** Pawan Kalyan — born 2 September 1971 (public record). */
export const PK_BIRTH = { month: 9, day: 2, year: 1971 } as const;

export type PkMilestoneCategory = "birth" | "cinema" | "politics" | "milestone";

export type PkMilestone = {
  month: number;
  day: number;
  year: number;
  headline: string;
  detail: string;
  category: PkMilestoneCategory;
};

/** Calendar-day milestones for "On this day, PK was…" engagement. */
export const PK_ON_THIS_DAY: PkMilestone[] = [
  {
    month: 9,
    day: 2,
    year: 1971,
    headline: "Born in Bapatla, Andhra Pradesh",
    detail: "Konidela Pawan Kalyan — the day Power Star entered the world.",
    category: "birth",
  },
  {
    month: 7,
    day: 24,
    year: 1998,
    headline: "Tholi Prema changed Telugu youth cinema",
    detail: "A landmark romance that turned Pawan Kalyan into a generation's icon.",
    category: "cinema",
  },
  {
    month: 4,
    day: 26,
    year: 2001,
    headline: "Kushi became a cult classic",
    detail: "Ego, love, and mass style — still quoted by fans decades later.",
    category: "cinema",
  },
  {
    month: 4,
    day: 2,
    year: 2008,
    headline: "Jalsa — sharp dialogue, mass energy",
    detail: "A film fans still rewatch for attitude, comedy, and punch lines.",
    category: "cinema",
  },
  {
    month: 5,
    day: 11,
    year: 2012,
    headline: "Gabbar Singh — the comeback roar",
    detail: "One of the biggest Telugu blockbusters; swagger that defined an era.",
    category: "cinema",
  },
  {
    month: 9,
    day: 27,
    year: 2013,
    headline: "Attarintiki Daredi ruled the box office",
    detail: "Family entertainer with record-breaking openings across Telugu states.",
    category: "cinema",
  },
  {
    month: 3,
    day: 14,
    year: 2014,
    headline: "Jana Sena Party took shape",
    detail: "Fans saw the star step into people's politics with a new party identity.",
    category: "politics",
  },
  {
    month: 4,
    day: 8,
    year: 2016,
    headline: "Sardaar Gabbar Singh arrived",
    detail: "The fearless cop returned — mass action built for the big screen.",
    category: "cinema",
  },
  {
    month: 3,
    day: 24,
    year: 2017,
    headline: "Katamarayudu — brothers & village honour",
    detail: "Rural action drama that packed theatres with family audiences.",
    category: "cinema",
  },
  {
    month: 4,
    day: 9,
    year: 2021,
    headline: "Vakeel Saab — justice on screen",
    detail: "Courtroom drama that sparked conversations on dignity and law.",
    category: "cinema",
  },
  {
    month: 2,
    day: 25,
    year: 2022,
    headline: "Bheemla Nayak — power clash",
    detail: "A rural action spectacle that dominated openings and fan frenzy.",
    category: "cinema",
  },
  {
    month: 7,
    day: 28,
    year: 2023,
    headline: "Bro — divine fantasy action",
    detail: "God of Time meets mass cinema — a new turn in the PSPK filmography.",
    category: "cinema",
  },
  {
    month: 7,
    day: 15,
    year: 1999,
    headline: "Thammudu — sports & rebellion",
    detail: "Kabaddi, family, and attitude — an early fan-favourite mass story.",
    category: "cinema",
  },
  {
    month: 4,
    day: 20,
    year: 2000,
    headline: "Badri — stylish youth mass",
    detail: "Action romance that cemented his cool, rebellious screen image.",
    category: "cinema",
  },
  {
    month: 12,
    day: 9,
    year: 2011,
    headline: "Panjaa — Bangkok swagger",
    detail: "Stylish action protecting a mentor's legacy — cult visuals for fans.",
    category: "cinema",
  },
  {
    month: 1,
    day: 10,
    year: 2018,
    headline: "Agnyaathavaasi — Trivikram mass",
    detail: "High-stakes family revenge drama with big opening-day energy.",
    category: "cinema",
  },
  {
    month: 9,
    day: 17,
    year: 2010,
    headline: "Puli — fearless cop energy",
    detail: "Action against a powerful villain — early-2010s mass template.",
    category: "cinema",
  },
  {
    month: 6,
    day: 15,
    year: 1999,
    headline: "Prema Tho Prema — early stardom",
    detail: "Romantic drama in his rise before the blockbuster era exploded.",
    category: "cinema",
  },
];

export type BirthdayCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isToday: boolean;
  isBirthdaySeason: boolean;
  nextBirthday: Date;
  turningAge: number;
};

function nextBirthdayInstant(from: Date): Date {
  const y = from.getFullYear();
  let next = new Date(y, PK_BIRTH.month - 1, PK_BIRTH.day, 0, 0, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next = new Date(y + 1, PK_BIRTH.month - 1, PK_BIRTH.day, 0, 0, 0, 0);
  }
  return next;
}

export function isPkBirthdayToday(from: Date = new Date()): boolean {
  return from.getMonth() + 1 === PK_BIRTH.month && from.getDate() === PK_BIRTH.day;
}

/** Within 7 days before birthday (build-up). */
export function isBirthdaySeason(from: Date = new Date()): boolean {
  if (isPkBirthdayToday(from)) return true;
  const countdown = getBirthdayCountdown(from);
  return countdown.days > 0 && countdown.days <= 7;
}

export function getPkAge(from: Date = new Date()): number {
  let age = from.getFullYear() - PK_BIRTH.year;
  const beforeBirthday =
    from.getMonth() + 1 < PK_BIRTH.month ||
    (from.getMonth() + 1 === PK_BIRTH.month && from.getDate() < PK_BIRTH.day);
  if (beforeBirthday) age -= 1;
  return age;
}

export function getBirthdayCountdown(from: Date = new Date()): BirthdayCountdown {
  if (isPkBirthdayToday(from)) {
    const next = nextBirthdayInstant(from);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isToday: true,
      isBirthdaySeason: true,
      nextBirthday: next,
      turningAge: getPkAge(from),
    };
  }

  const next = nextBirthdayInstant(from);
  const totalMs = Math.max(0, next.getTime() - from.getTime());
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    isToday: false,
    isBirthdaySeason: days <= 7,
    nextBirthday: next,
    turningAge: next.getFullYear() - PK_BIRTH.year,
  };
}

export function getOnThisDayMilestones(from: Date = new Date()): PkMilestone[] {
  const m = from.getMonth() + 1;
  const d = from.getDate();
  return PK_ON_THIS_DAY.filter((item) => item.month === m && item.day === d).sort(
    (a, b) => a.year - b.year,
  );
}

export function formatBirthdayDate(): string {
  const date = new Date(PK_BIRTH.year, PK_BIRTH.month - 1, PK_BIRTH.day);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export const categoryLabel: Record<PkMilestoneCategory, string> = {
  birth: "Birth",
  cinema: "Cinema",
  politics: "Politics",
  milestone: "Milestone",
};
