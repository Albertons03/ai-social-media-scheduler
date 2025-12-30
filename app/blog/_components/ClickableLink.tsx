"use client";

import Link from "next/link";
import { trackBlogEvents } from "@/lib/analytics";

interface ClickableLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  postSlug?: string;
  ctaText?: string;
  ctaLocation?: string;
}

export default function ClickableLink({
  href,
  children,
  className,
  postSlug,
  ctaText,
  ctaLocation = "unknown",
}: ClickableLinkProps) {
  const handleClick = () => {
    if (postSlug && ctaText) {
      trackBlogEvents.clickCTA(postSlug, ctaText, ctaLocation);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
