import { site } from "@/data/site";

export const githubProfileUrl = "https://github.com/yud3-stack";

export const publicSocialLinks = [
  { href: githubProfileUrl, label: "GitHub", kind: "github", external: true },
  ...(site.linkedinUrl ? [{ href: site.linkedinUrl, label: "LinkedIn", kind: "linkedin", external: true }] : []),
  ...(site.instagramUrl ? [{ href: site.instagramUrl, label: "Instagram", kind: "instagram", external: true }] : []),
  ...(site.email ? [{ href: `mailto:${site.email}`, label: "E-posta", kind: "email", external: false }] : []),
];
