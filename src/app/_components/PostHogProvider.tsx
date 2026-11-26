"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Production only, and only when a key is set. Cookieless (memory
// persistence), so it needs no cookie banner on this one-pager.
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_ENV === "production" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://eu.posthog.com",
    persistence: "memory",
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
