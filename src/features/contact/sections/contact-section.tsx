"use client";

import SectionContainer from "@/components/shared/section-container";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import ContactForm from "../components/contact-form";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/username",
    href: "https://github.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/username",
    href: "https://linkedin.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
    href: null,
  },
];

export default function ContactSection() {
  return (
    <SectionContainer
      id="contact"
      title="Get in Touch"
      subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
    >
      <div className="grid gap-12 md:grid-cols-2">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-xl font-semibold">
              Let&apos;s build something great together
            </h3>
            <p className="mt-2 text-muted-foreground">
              Whether you have a project idea, need technical consulting, or
              just want to say hello — my inbox is always open.
            </p>
          </div>

          <div className="space-y-4">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/50">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card/30 p-6 md:p-8"
        >
          <ContactForm />
        </motion.div>
      </div>
    </SectionContainer>
  );
}
