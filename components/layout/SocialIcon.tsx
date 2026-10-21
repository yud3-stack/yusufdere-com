import { Mail } from "lucide-react";

type SocialIconProps = { kind: string; size?: number };

export function SocialIcon({ kind, size = 20 }: SocialIconProps) {
  if (kind === "email") return <Mail size={size} aria-hidden="true" />;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "instagram" ? (
        <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>
      ) : kind === "linkedin" ? (
        <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7.5 10v7M7.5 7v.01M11 17v-7h3v1c2-2 4-.5 4 2v4M14 11v6" /></>
      ) : (
        <path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7a5.4 5.4 0 0 0-1.5-3.8A5 5 0 0 0 18.9 1S17.7.7 15 2.5a13.4 13.4 0 0 0-7 0C5.3.7 4.1 1 4.1 1A5 5 0 0 0 4 4.7a5.4 5.4 0 0 0-1.5 3.8c0 5.5 3.3 6.7 6.4 7a3.4 3.4 0 0 0-.9 2.6V22" />
      )}
    </svg>
  );
}
