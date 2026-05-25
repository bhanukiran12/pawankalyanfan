/** Pawan Kalyan birthday countdown — shared API payload for footer / social share. */
export const PK_BIRTH = { month: 9, day: 2, year: 1971 } as const;

function nextBirthdayInstant(from: Date): Date {
  const y = from.getFullYear();
  let next = new Date(y, PK_BIRTH.month - 1, PK_BIRTH.day, 0, 0, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next = new Date(y + 1, PK_BIRTH.month - 1, PK_BIRTH.day, 0, 0, 0, 0);
  }
  return next;
}

export function getPkBirthdayCountdown(from: Date = new Date()) {
  const isToday =
    from.getMonth() + 1 === PK_BIRTH.month && from.getDate() === PK_BIRTH.day;
  const nextBirthday = nextBirthdayInstant(from);
  const turningAge = nextBirthday.getFullYear() - PK_BIRTH.year;

  if (isToday) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isToday: true,
      isBirthdaySeason: true,
      nextBirthday: nextBirthday.toISOString(),
      turningAge,
      birthdayLabel: "2 September",
    };
  }

  const totalMs = Math.max(0, nextBirthday.getTime() - from.getTime());
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isToday: false,
    isBirthdaySeason: days <= 7,
    nextBirthday: nextBirthday.toISOString(),
    turningAge,
    birthdayLabel: "2 September",
  };
}

export function buildPkBirthdayShare(siteUrl: string, countdown: ReturnType<typeof getPkBirthdayCountdown>) {
  const text = countdown.isToday
    ? "🎂 Happy Birthday Power Star Pawan Kalyan! #PawanKalyan #PowerStar"
    : `⏳ ${countdown.days} days to Power Star Pawan Kalyan's birthday (2 Sep)! Join the countdown — #PawanKalyan #PowerStar`;
  const url = `${siteUrl.replace(/\/$/, "")}/pk-birthday`;
  return {
    shareText: text,
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    whatsappUrl: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    copyText: `${text}\n${url}`,
  };
}
