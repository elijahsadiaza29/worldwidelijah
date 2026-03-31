"use client";

import { motion } from "framer-motion";

interface ContactSocial {
  label: string;
  href: string;
}

interface ContactsWidgetProps {
  name: string;
  handle: string;
  email: string;
  socials: ContactSocial[];
}

export default function ContactsWidget({
  handle,
  email,
  socials,
}: ContactsWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-2xl"
    >
      <div className="bg-muted rounded-[32px] p-6 md:ps-8 shadow-sm border border-black/[0.03] dark:border-white/[0.03]">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-[36px] md:text-[44px]  font-medium text-black dark:text-white leading-tight">
            Contacts
          </h2>
          <span className="text-[14px] md:text-[15px] text-zinc-500 dark:text-zinc-400 font-normal mt-3">
            {handle}
          </span>
        </div>

        {/* Primary Contact (Email) */}
        <div className="mb-12">
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-1.5 text-[17px] md:text-[19px] font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors"
          >
            {email}
            <span className="text-[20px] md:text-[22px] font-light leading-none -mt-1 group-hover:translate-x-0.5 transition-transform">
              ›
            </span>
          </a>
        </div>

        {/* Social Links Row */}
        <div className="flex flex-wrap items-center gap-x-8 md:gap-x-10 gap-y-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] md:text-[15px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
