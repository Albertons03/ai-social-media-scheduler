# 🎨 Theme Colors & Design Guide

## Platform Colors

### TikTok

```css
text-tiktok        /* #FE2C55 - Main brand color */
bg-tiktok-50       /* #FFF1F2 - Light background */
bg-tiktok-100      /* #FFE4E6 */
border-tiktok-200  /* #FECDD3 */
```

### LinkedIn

```css
text-linkedin        /* #0A66C2 - Main brand color */
bg-linkedin-50       /* #EFF6FF - Light background */
bg-linkedin-100      /* #DBEAFE */
border-linkedin-200  /* #BFDBFE */
```

### Twitter

```css
text-twitter        /* #1DA1F2 - Main brand color */
bg-twitter-50       /* #EFF9FF - Light background */
bg-twitter-100      /* #DEF2FF */
border-twitter-200  /* #B6E5FF */
```

---

## Semantic Tokens (Light & Dark Mode)

### Text Colors

```css
text-foreground        /* Primary text (adapts to theme) */
text-muted-foreground  /* Secondary/muted text */
text-card-foreground   /* Text inside cards */
```

### Background Colors

```css
bg-background  /* Page background */
bg-card        /* Card backgrounds */
bg-accent      /* Subtle highlights */
bg-muted       /* Muted elements (progress bars) */
```

### Borders

```css
border-border  /* Standard borders (adapts to theme) */
```

---

## Button Gradients

### Primary Button

```tsx
<Button>Create Post</Button>
// → Blue to Purple gradient with shadow
// bg-gradient-to-r from-blue-600 to-purple-600
```

### Button Variants

- **default**: Blue → Purple gradient with shadow
- **destructive**: Red (danger actions)
- **outline**: Transparent with border
- **secondary**: Gray subtle background
- **ghost**: Transparent, hover effect only
- **link**: Underlined text link

---

## Usage Examples

### Platform-Specific Card

```tsx
<Card className="border-tiktok-200 bg-tiktok-50/50">
  <CardHeader>
    <CardTitle className="text-tiktok">TikTok Stats</CardTitle>
  </CardHeader>
</Card>
```

### Dark Mode Compatible Text

```tsx
<h1 className="text-foreground">Dashboard</h1>
<p className="text-muted-foreground">Welcome back!</p>
```

### Vibrant Button

```tsx
<Button>Schedule Post</Button>
// Automatically has gradient + shadow!
```

---

## Theme Toggle

The app uses Tailwind's `darkMode: ['class']` configuration.
Toggle dark mode by adding/removing `dark` class on `<html>` element.

```tsx
// Check theme toggle in layout.tsx
--------------------------------------------------------------

 Képek hozzáadása a Landing Page-hez?
Amit javasolok:

1. Hero Section Kép
Product screenshot az app dashboard-ról
Animated mockup a posting flow-ról
AI conversation example illusztráció
2. Features Section képek
Mini screenshots minden feature-höz
Icons + képek kombinációja
Video thumbnails feature demo-khoz
3. Social Proof
Customer avatars testimonials-nél
Brand logos akik használják
Statistics visuals (like blog-ban)
Mit gondolsz? Hozzáadjak product screenshot-okat és feature illusztrációkat? 📸✨
```

---
