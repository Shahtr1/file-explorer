# @shahrukh404/file-explorer

A lightweight TypeScript utility package for file-explorer style tree structures.

## Install

```bash
npm install @shahrukh404/file-explorer
```

## Usage

```ts
import { flattenPaths, type ExplorerNode } from "@shahrukh404/file-explorer";

const tree: ExplorerNode[] = [
  {
    name: "src",
    path: "src",
    isDirectory: true,
    children: [{ name: "index.ts", path: "src/index.ts", isDirectory: false }],
  },
];

const paths = flattenPaths(tree);
// ["src", "src/index.ts"]
```

## API

- `ExplorerNode`: tree node type.
- `flattenPaths(nodes)`: returns depth-first flattened paths.

## License

MIT
