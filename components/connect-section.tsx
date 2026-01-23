"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SocialLink {
  label: string;
  href?: string;
  copyable?: boolean;
}

const socialLinks: SocialLink[] = [
  {
    label: "Email",
    copyable: true,
  },
  {
    label: "Telegram",
    href: "https://t.me/midlneedle",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@midlneedle",
  },
  {
    label: "Twitter",
    href: "https://x.com/midlneedle",
  },
];

export function ConnectSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("midlneedle@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-connect-gap)]">
      {socialLinks.map((link) => (
        <div key={link.label}>
          {link.copyable ? (
            <button
              onClick={handleCopyEmail}
              className={cn(
                "inline-flex items-center gap-2 text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground cursor-pointer"
              )}
            >
              {copiedEmail ? "Copied!" : link.label}
              <span>↗</span>
            </button>
          ) : (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground"
            >
              {link.label}
              <span>↗</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
