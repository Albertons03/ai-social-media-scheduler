export const platformColors = {
  tiktok: {
    primary: "#FE2C55",
    bg: "bg-[#FE2C55]",
    bgLight: "bg-[#FE2C55]/10",
    text: "text-[#FE2C55]",
    border: "border-[#FE2C55]/20",
  },
  linkedin: {
    primary: "#0077B5",
    bg: "bg-[#0077B5]",
    bgLight: "bg-[#0077B5]/10",
    text: "text-[#0077B5]",
    border: "border-[#0077B5]/20",
  },
  twitter: {
    primary: "#000000",
    bg: "bg-black dark:bg-white",
    bgLight: "bg-black/10 dark:bg-white/10",
    text: "text-black dark:text-white",
    border: "border-black/20 dark:border-white/20",
  },
} as const;

export type Platform = keyof typeof platformColors;

export function getPlatformColor(platform: Platform): string {
  return platformColors[platform].primary;
}

export function getPlatformClasses(platform: Platform) {
  return platformColors[platform];
}
