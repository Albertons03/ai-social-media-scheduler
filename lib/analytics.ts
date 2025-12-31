/**
 * Analytics tracking utility for Google Analytics 4
 * Handles custom events and user interactions
 */

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

/**
 * Track custom events to Google Analytics
 * @param eventName - Name of the event
 * @param params - Additional event parameters
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      // Add timestamp for better tracking
      timestamp: new Date().toISOString(),
      ...params,
    });

    // Log to console for debugging (both dev and prod temporarily)
    console.log("📊 Analytics Event:", eventName, params);
  } else {
    // Debug: why is gtag not available?
    console.log("🚨 Analytics Debug:", {
      hasWindow: typeof window !== "undefined",
      hasGtag: typeof window !== "undefined" && !!window.gtag,
      eventName,
      params
    });
  }
};

/**
 * Track page views
 * @param url - Page URL
 * @param title - Page title
 */
export const trackPageView = (url: string, title?: string) => {
  trackEvent("page_view", {
    page_title: title || document.title,
    page_location: url,
  });
};

/**
 * Track blog post engagement
 */
export const trackBlogEvents = {
  /**
   * Track when user views a blog post
   */
  viewPost: (postSlug: string, postTitle: string) => {
    trackEvent("blog_post_view", {
      post_title: postTitle,
      post_slug: postSlug,
      content_type: "blog_post",
    });
  },

  /**
   * Track when user reads a significant portion of the post
   */
  readProgress: (postSlug: string, percentage: number) => {
    trackEvent("blog_post_progress", {
      post_slug: postSlug,
      scroll_percentage: percentage,
    });
  },

  /**
   * Track CTA clicks from blog posts
   */
  clickCTA: (postSlug: string, ctaText: string, ctaLocation: string) => {
    trackEvent("cta_click", {
      source: "blog_post",
      post_slug: postSlug,
      cta_text: ctaText,
      cta_location: ctaLocation,
    });
  },

  /**
   * Track social sharing
   */
  sharePost: (postSlug: string, platform: string) => {
    trackEvent("share", {
      method: platform,
      content_type: "blog_post",
      item_id: postSlug,
    });
  },
};

/**
 * Track user authentication events
 */
export const trackAuthEvents = {
  /**
   * Track successful signup
   */
  signup: (method: "email" | "google" | "github" = "email") => {
    trackEvent("sign_up", {
      method: method,
    });
  },

  /**
   * Track successful login
   */
  login: (method: "email" | "google" | "github" = "email") => {
    trackEvent("login", {
      method: method,
    });
  },

  /**
   * Track logout
   */
  logout: () => {
    trackEvent("logout", {});
  },
};

/**
 * Track app usage events
 */
export const trackAppEvents = {
  /**
   * Track when user creates a post
   */
  createPost: (platform: string, hasAI: boolean = false) => {
    trackEvent("create_post", {
      platform: platform,
      uses_ai: hasAI,
      content_type: "social_post",
    });
  },

  /**
   * Track when user schedules a post
   */
  schedulePost: (platform: string, scheduledTime: string) => {
    trackEvent("schedule_post", {
      platform: platform,
      scheduled_time: scheduledTime,
    });
  },

  /**
   * Track when user reaches their limit
   */
  reachLimit: (currentPlan: "free" | "pro", postCount: number) => {
    trackEvent("limit_reached", {
      plan: currentPlan,
      post_count: postCount,
    });
  },

  /**
   * Track when user views upgrade prompt
   */
  viewUpgrade: (triggerLocation: string) => {
    trackEvent("view_upgrade_prompt", {
      source: triggerLocation,
    });
  },
};

/**
 * Track conversion events
 */
export const trackConversionEvents = {
  /**
   * Track successful purchase
   */
  purchase: (plan: string, value: number, currency: string = "USD") => {
    trackEvent("purchase", {
      currency: currency,
      value: value,
      items: [
        {
          item_id: plan,
          item_name: `${plan} Plan`,
          item_category: "subscription",
          price: value,
          quantity: 1,
        },
      ],
    });
  },

  /**
   * Track checkout initiation
   */
  beginCheckout: (plan: string, value: number) => {
    trackEvent("begin_checkout", {
      currency: "USD",
      value: value,
      items: [
        {
          item_id: plan,
          item_name: `${plan} Plan`,
          item_category: "subscription",
          price: value,
          quantity: 1,
        },
      ],
    });
  },

  /**
   * Track trial start
   */
  startTrial: (plan: string) => {
    trackEvent("start_trial", {
      plan: plan,
      trial_days: 14,
    });
  },
};

/**
 * Track user engagement
 */
export const trackEngagementEvents = {
  /**
   * Track feature usage
   */
  useFeature: (featureName: string, context?: string) => {
    trackEvent("feature_usage", {
      feature_name: featureName,
      context: context,
    });
  },

  /**
   * Track help/support interactions
   */
  viewHelp: (helpTopic: string) => {
    trackEvent("view_help", {
      help_topic: helpTopic,
    });
  },

  /**
   * Track search usage
   */
  search: (searchTerm: string, resultCount: number) => {
    trackEvent("search", {
      search_term: searchTerm,
      result_count: resultCount,
    });
  },
};

/**
 * Initialize analytics tracking with user properties
 */
export const initializeAnalytics = (userId?: string, userPlan?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (userId) {
      window.gtag("config", "G-FJDR7R7PF9", {
        user_id: userId,
        custom_map: {
          custom_parameter_1: "user_plan",
        },
      });
    }

    if (userPlan) {
      window.gtag("set", "user_plan", userPlan);
    }
  }
};

/**
 * Enhanced error tracking
 */
export const trackError = (error: Error, context?: string) => {
  trackEvent("exception", {
    description: error.message,
    fatal: false,
    context: context,
  });

  // Also log to console for debugging
  console.error("Tracked Error:", error, context);
};
