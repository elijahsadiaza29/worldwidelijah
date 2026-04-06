"use client";

import { useState, useEffect } from "react";

const MAX_MESSAGES = 20;
const RESET_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface RateLimitState {
  messagesUsed: number;
  resetAt: number;
}

export function useRateLimit() {
  const [state, setState] = useState<RateLimitState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio_chat_limit");
    const now = Date.now();

    if (stored) {
      try {
        const parsed: RateLimitState = JSON.parse(stored);
        if (now > parsed.resetAt) {
          // Reset if time passed
          const newState = { messagesUsed: 0, resetAt: now + RESET_INTERVAL_MS };
          localStorage.setItem("portfolio_chat_limit", JSON.stringify(newState));
          setState(newState);
        } else {
          setState(parsed);
        }
      } catch {
        const newState = { messagesUsed: 0, resetAt: now + RESET_INTERVAL_MS };
        setState(newState);
      }
    } else {
      const newState = { messagesUsed: 0, resetAt: now + RESET_INTERVAL_MS };
      localStorage.setItem("portfolio_chat_limit", JSON.stringify(newState));
      setState(newState);
    }

    // Optional: Add interval to auto-refresh the hook if we cross the boundary
    const interval = setInterval(() => {
      if (state && Date.now() > state.resetAt) {
        const newState = { messagesUsed: 0, resetAt: Date.now() + RESET_INTERVAL_MS };
        localStorage.setItem("portfolio_chat_limit", JSON.stringify(newState));
        setState(newState);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [state?.resetAt]);

  const incrementMessage = () => {
    setState((prev) => {
      if (!prev) return prev;
      const newState = { ...prev, messagesUsed: prev.messagesUsed + 1 };
      localStorage.setItem("portfolio_chat_limit", JSON.stringify(newState));
      return newState;
    });
  };

  const messagesLeft = state ? Math.max(0, MAX_MESSAGES - state.messagesUsed) : MAX_MESSAGES;
  const isLimited = state ? state.messagesUsed >= MAX_MESSAGES : false;

  return {
    messagesLeft,
    isLimited,
    maxMessages: MAX_MESSAGES,
    resetAt: state?.resetAt,
    incrementMessage,
  };
}
