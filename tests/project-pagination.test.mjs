import test from "node:test";
import assert from "node:assert/strict";
import { projectPage } from "../lib/project-pagination.ts";

test("project gallery handles empty, full, and partial pages without omitting a project", () => {
  assert.deepEqual(projectPage(0, 0, 4), { page: 0, pages: 1, start: 0, end: 0 });
  for (const size of [2, 4]) {
    for (const total of [1, 4, 5, 9]) {
      const collected = [];
      for (let anchor = 0; anchor < total; anchor += size) {
        const { start, end } = projectPage(total, anchor, size);
        for (let i = start; i < end; i++) collected.push(i);
      }
      assert.deepEqual(collected, Array.from({ length: total }, (_, i) => i));
    }
  }
});
test("resizing preserves the anchored project and shrinking content clamps the last page", () => {
  assert.equal(projectPage(9, 6, 4).start, 4);
  assert.equal(projectPage(9, 4, 2).start, 4);
  assert.deepEqual(projectPage(3, 8, 2), { page: 1, pages: 2, start: 2, end: 3 });
});
