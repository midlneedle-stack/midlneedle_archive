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
    href: "https://t.me/vladislavivanov",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/vladislavivanov",
  },
  {
    label: "Threads",
    href: "https://threads.net/@vladislavivanov",
  },
];

export function ConnectSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@vladislavivanov.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {socialLinks.map((link) => (
        <div key={link.label}>
          {link.copyable ? (
            <button
              onClick={handleCopyEmail}
              className={cn(
                "inline-flex items-center gap-2 text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground"
              )}
              style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em' }}
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
              style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em' }}
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
