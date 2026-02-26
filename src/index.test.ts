import { describe, expect, it } from "vitest";
import { flattenPaths, type ExplorerNode } from "./index";

describe("flattenPaths", () => {
  it("flattens a nested tree in depth-first order", () => {
    const tree: ExplorerNode[] = [
      {
        name: "src",
        path: "src",
        isDirectory: true,
        children: [
          { name: "index.ts", path: "src/index.ts", isDirectory: false },
          {
            name: "components",
            path: "src/components",
            isDirectory: true,
            children: [
              {
                name: "Tree.tsx",
                path: "src/components/Tree.tsx",
                isDirectory: false,
              },
            ],
          },
        ],
      },
    ];

    expect(flattenPaths(tree)).toEqual([
      "src",
      "src/index.ts",
      "src/components",
      "src/components/Tree.tsx",
    ]);
  });
});
