import { test } from "node:test";
import assert from "node:assert/strict";
import { imageShareIssue } from "../lib/quote-sharing.ts";

test("LAN HTTP explains the secure-context requirement rather than blaming the device", () => {
  assert.match(imageShareIssue({ secureContext: false, hasShare: false }), /HTTPS/);
});
test("an absent canShare probe does not suppress an available share API", () => {
  assert.equal(imageShareIssue({ secureContext: true, hasShare: true }), null);
  assert.equal(imageShareIssue({ secureContext: true, hasShare: true, fileSupport: true }), null);
});
test("unsupported sharing is explained without silently downloading a file", () => {
  assert.match(imageShareIssue({ secureContext: true, hasShare: false }), /menüsünü desteklemiyor/);
  assert.match(imageShareIssue({ secureContext: true, hasShare: true, fileSupport: false }), /dosyası paylaşımını desteklemiyor/);
});
