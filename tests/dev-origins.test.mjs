import { test } from "node:test";
import assert from "node:assert/strict";
import { developmentOrigins } from "../lib/dev-origins.ts";

test("LAN preview permits only this computer's explicit IPv4 interfaces and retains the configured VPN", () => {
  const origins = developmentOrigins({
    loopback: [{ family: "IPv4", address: "127.0.0.1", internal: true }],
    ethernet: [{ family: "IPv4", address: "192.168.1.192", internal: false }],
    duplicate: [{ family: "IPv4", address: "192.168.1.192", internal: false }],
    ipv6: [{ family: "IPv6", address: "fe80::123", internal: false }],
    unused: undefined,
  });
  assert.deepEqual(origins, ["25.44.12.64", "192.168.1.192"]);
  assert.ok(origins.every((origin) => !origin.includes("*") && !origin.includes("://")));
});
