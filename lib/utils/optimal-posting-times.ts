// Optimal posting times for each platform
// Based on industry research and engagement data

export interface OptimalTime {
  platform: "twitter" | "linkedin" | "tiktok";
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number; // 0-23
  description: string;
  engagementLevel: "high" | "medium" | "low";
}

export const OPTIMAL_POSTING_TIMES: OptimalTime[] = [
  // Twitter
  {
    platform: "twitter",
    dayOfWeek: 1,
    hour: 9,
    description: "Monday 9 AM - High B2B engagement",
    engagementLevel: "high",
  },
  {
    platform: "twitter",
    dayOfWeek: 2,
    hour: 12,
    description: "Tuesday 12 PM - Lunch break scrolling",
    engagementLevel: "high",
  },
  {
    platform: "twitter",
    dayOfWeek: 3,
    hour: 9,
    description: "Wednesday 9 AM - Mid-week momentum",
    engagementLevel: "high",
  },
  {
    platform: "twitter",
    dayOfWeek: 4,
    hour: 12,
    description: "Thursday 12 PM - Pre-weekend activity",
    engagementLevel: "medium",
  },
  {
    platform: "twitter",
    dayOfWeek: 5,
    hour: 9,
    description: "Friday 9 AM - End-of-week content",
    engagementLevel: "medium",
  },

  // LinkedIn
  {
    platform: "linkedin",
    dayOfWeek: 1,
    hour: 8,
    description: "Monday 8 AM - Start of business week",
    engagementLevel: "high",
  },
  {
    platform: "linkedin",
    dayOfWeek: 2,
    hour: 10,
    description: "Tuesday 10 AM - Peak professional hours",
    engagementLevel: "high",
  },
  {
    platform: "linkedin",
    dayOfWeek: 2,
    hour: 12,
    description: "Tuesday 12 PM - Business lunch networking",
    engagementLevel: "high",
  },
  {
    platform: "linkedin",
    dayOfWeek: 3,
    hour: 10,
    description: "Wednesday 10 AM - Mid-week productivity",
    engagementLevel: "high",
  },
  {
    platform: "linkedin",
    dayOfWeek: 4,
    hour: 8,
    description: "Thursday 8 AM - Professional momentum",
    engagementLevel: "medium",
  },

  // TikTok
  {
    platform: "tiktok",
    dayOfWeek: 1,
    hour: 18,
    description: "Monday 6 PM - After work/school scroll",
    engagementLevel: "high",
  },
  {
    platform: "tiktok",
    dayOfWeek: 2,
    hour: 19,
    description: "Tuesday 7 PM - Peak evening engagement",
    engagementLevel: "high",
  },
  {
    platform: "tiktok",
    dayOfWeek: 3,
    hour: 18,
    description: "Wednesday 6 PM - Mid-week entertainment",
    engagementLevel: "high",
  },
  {
    platform: "tiktok",
    dayOfWeek: 4,
    hour: 19,
    description: "Thursday 7 PM - Pre-weekend vibes",
    engagementLevel: "high",
  },
  {
    platform: "tiktok",
    dayOfWeek: 5,
    hour: 17,
    description: "Friday 5 PM - TGIF content peak",
    engagementLevel: "high",
  },
  {
    platform: "tiktok",
    dayOfWeek: 6,
    hour: 11,
    description: "Saturday 11 AM - Weekend leisure time",
    engagementLevel: "medium",
  },
  {
    platform: "tiktok",
    dayOfWeek: 0,
    hour: 14,
    description: "Sunday 2 PM - Sunday afternoon chill",
    engagementLevel: "medium",
  },
];

export function getOptimalTimes(
  platform: "twitter" | "linkedin" | "tiktok"
): OptimalTime[] {
  return OPTIMAL_POSTING_TIMES.filter(
    (time) => time.platform === platform
  ).sort((a, b) => {
    // Sort by engagement level first, then by day of week
    const engagementOrder = { high: 0, medium: 1, low: 2 };
    if (
      engagementOrder[a.engagementLevel] !== engagementOrder[b.engagementLevel]
    ) {
      return (
        engagementOrder[a.engagementLevel] - engagementOrder[b.engagementLevel]
      );
    }
    return a.dayOfWeek - b.dayOfWeek;
  });
}

export function getNextOptimalTime(
  platform: "twitter" | "linkedin" | "tiktok"
): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  const optimalTimes = getOptimalTimes(platform);

  // Find next optimal time from current moment
  for (let i = 0; i < 7; i++) {
    // Check next 7 days
    const targetDay = (currentDay + i) % 7;

    const dayTimes = optimalTimes.filter(
      (time) => time.dayOfWeek === targetDay
    );

    for (const time of dayTimes) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + i);
      targetDate.setHours(time.hour, 0, 0, 0);

      // If it's today, make sure the time hasn't passed
      if (i === 0 && time.hour <= currentHour) {
        continue;
      }

      return targetDate;
    }
  }

  // Fallback: next Monday 9 AM
  const fallback = new Date(now);
  const daysUntilMonday = (7 - currentDay + 1) % 7 || 7;
  fallback.setDate(now.getDate() + daysUntilMonday);
  fallback.setHours(9, 0, 0, 0);
  return fallback;
}

export function formatOptimalTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
