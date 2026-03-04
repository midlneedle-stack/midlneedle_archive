"use client";

import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { HapticLink } from "@/components/haptic-link";
import { HAPTIC_COPY } from "@/lib/haptics";

const linkStyle = "underline decoration-[var(--link-underline)] hover:decoration-foreground transition-colors";

export function ConnectSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { trigger } = useWebHaptics();

  const handleCopyEmail = async () => {
    trigger(HAPTIC_COPY);

    try {
      await navigator.clipboard.writeText("midlneedle@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback for older browsers or insecure contexts
      const textarea = document.createElement("textarea");
      textarea.value = "midlneedle@gmail.com";
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } catch (err) {
        console.error("Failed to copy email:", err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="type-body text-faint-foreground">
      <p className="mb-[var(--space-connect-gap)]">
        Reach out via{" "}
        <HapticLink
          href="https://t.me/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Telegram
        </HapticLink>{" "}
        or{" "}
        <button
          onClick={handleCopyEmail}
          className={`${linkStyle} cursor-pointer`}
          style={{
            background: 'transparent',
            padding: 0,
            margin: 0,
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
          }}
        >
          {copiedEmail ? "Copied!" : "Email"}
        </button>
      </p>
      <p>
        You can also find me on{" "}
        <HapticLink
          href="https://www.threads.com/@midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Threads
        </HapticLink>
        ,{" "}
        <HapticLink
          href="https://github.com/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          GitHub
        </HapticLink>{" "}
        and{" "}
        <HapticLink
          href="https://x.com/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Twitter
        </HapticLink>
      </p>
    </div>
  );
}
