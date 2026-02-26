export type ExplorerNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ExplorerNode[];
};

/**
 * Returns a flat list of node paths in depth-first order.
 */
export function flattenPaths(nodes: ExplorerNode[]): string[] {
  const result: string[] = [];

  const walk = (list: ExplorerNode[]) => {
    for (const node of list) {
      result.push(node.path);
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };

  walk(nodes);
  return result;
}
