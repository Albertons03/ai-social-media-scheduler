// Brand Colors for Dashboard Enhancement
export const BRAND_COLORS = {
  // Platform Colors
  linkedin: {
    primary: "#0077B5",
    dark: "#005885",
    light: "#00a0dc",
  },
  tiktok: {
    primary: "#FE2C55",
    dark: "#d91e42",
    light: "#ff5577",
  },
  twitter: {
    primary: "#1DA1F2",
    dark: "#0d8bd9",
    light: "#4ab3f4",
  },

  // Gradients
  header: "from-[#0077B5] to-[#005885]", // LinkedIn Blue
  sidebar: "from-[#FE2C55] to-[#d91e42]", // TikTok Pink
  accent: "from-[#1DA1F2] to-[#0d8bd9]", // Twitter Blue
};

// Usage in components:
// Header: bg-gradient-to-r from-[#0077B5] to-[#005885]
// Sidebar: bg-gradient-to-b from-[#FE2C55] to-[#d91e42]
// Cards/Actions: accent gradients for hover states
