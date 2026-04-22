"use client";

import {
  Briefcase,
  Code2,
  GraduationCap,
  Mail,
  Sparkles,
  User,
  PartyPopper,
} from "lucide-react";
import React from "react";

export const SUGGESTION_CATEGORIES = [
  {
    category: "Me",
    icon: <User size={18} className="text-zinc-700 dark:text-zinc-300" />,
    items: [
      { text: "Who are you?", highlighted: true, icon: <Sparkles size={14} /> },
      { text: "How did you get started in tech?" },
      { text: "Where do you see yourself in 5 years?" },
    ],
  },
  {
    category: "Professional",
    icon: <Briefcase size={18} className="text-zinc-700 dark:text-zinc-300" />,
    items: [
      {
        text: "Can I see your resume?",
        highlighted: true,
        icon: <Sparkles size={14} />,
      },
      { text: "Where are you working now?" },
      { text: "Why should I hire you?" },
      { text: "What's your educational background?" },
    ],
  },
  {
    category: "Projects",
    icon: <Code2 size={18} className="text-zinc-700 dark:text-zinc-300" />,
    items: [
      {
        text: "What projects are you most proud of?",
        highlighted: true,
        icon: <Sparkles size={14} />,
      },
    ],
  },
  {
    category: "Skills",
    icon: (
      <GraduationCap size={18} className="text-zinc-700 dark:text-zinc-300" />
    ),
    items: [
      {
        text: "What are your skills?",
        highlighted: true,
        icon: <Sparkles size={14} />,
      },
    ],
  },
  {
    category: "Fun",
    icon: <PartyPopper size={18} className="text-zinc-700 dark:text-zinc-300" />,
    items: [
      {
        text: "What's the craziest thing you've ever done?",
        highlighted: true,
        icon: <Sparkles size={14} />,
      },
    ],
  },
  {
    category: "Contact & Future",
    icon: <Mail size={18} className="text-zinc-700 dark:text-zinc-300" />,
    items: [
      // {
      //   text: "How can I reach you?",
      //   highlighted: true,
      //   icon: <Sparkles size={14} />,
      // },
      {
        text: "What kind of project would make you say 'yes' immediately?",
        highlighted: true,
        icon: <Sparkles size={14} />,
      },
      { text: "Where are you located?" },
    ],
  },
];
