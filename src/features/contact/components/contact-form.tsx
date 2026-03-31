"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-12 text-center"
      >
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h3 className="text-xl font-semibold">Message Sent!</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-foreground"
        >
          Name
        </label>
        <Input
          id="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`border-border/50 bg-card/50 transition-colors focus:border-primary/50 ${
            errors.name ? "border-destructive" : ""
          }`}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`border-border/50 bg-card/50 transition-colors focus:border-primary/50 ${
            errors.email ? "border-destructive" : ""
          }`}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Tell me about your project..."
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className={`resize-none border-border/50 bg-card/50 transition-colors focus:border-primary/50 ${
            errors.message ? "border-destructive" : ""
          }`}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:shadow-[0_0_30px_oklch(0.75_0.18_270_/_25%)]"
      >
        <Send className="h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}
