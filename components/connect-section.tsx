"use client";

import { useState } from "react";

const linkStyle = "underline decoration-[var(--link-underline)] hover:decoration-foreground transition-colors";

export function ConnectSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
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
    <div className="type-body text-muted-foreground">
      <p className="mb-[var(--space-connect-gap)]">
        Reach out via{" "}
        <a
          href="https://t.me/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Telegram
        </a>{" "}
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
        <a
          href="https://www.threads.com/@midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Threads
        </a>
        ,{" "}
        <a
          href="https://github.com/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://x.com/midlneedle"
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
        >
          Twitter
        </a>
      </p>
    </div>
  );
}
