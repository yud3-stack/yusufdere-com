import { networkInterfaces } from "node:os";

type Interfaces = Record<string, { family: string; internal: boolean; address: string }[] | undefined>;

// Permit this computer's exact LAN/VPN addresses, never arbitrary network hosts.
// Resolving on startup also covers DHCP changes during local phone previews.
export function developmentOrigins(interfaces: Interfaces = networkInterfaces()) {
  return [...new Set(["25.44.12.64", ...Object.values(interfaces).flatMap((entries) =>
    (entries ?? []).filter((entry) => entry.family === "IPv4" && !entry.internal).map((entry) => entry.address))])];
}
