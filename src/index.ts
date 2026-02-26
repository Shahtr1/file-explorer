export type ExplorerNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ExplorerNode[];
};

export type ResourceType = 'file' | 'folder';

export type ExplorerResource = {
  _id?: string;
  id?: string;
  name: string;
  path: string;
  type: ResourceType;
  empty?: boolean;
};

export type TrashVirtualResource = ExplorerResource & {
  virtualPath: string;
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

/**
 * Mirrors folder path parsing used by the app's FolderView route logic.
 */
export function getFolderPathFromPathname(pathname: string): {
  isTrashView: boolean;
  baseSegment: 'trash' | 'my-files';
  folderPath: string;
} {
  const pathSegments = pathname.split('/').filter(Boolean);
  const isTrashView = pathname.includes('/reading/trash');
  const baseSegment: 'trash' | 'my-files' = isTrashView
    ? 'trash'
    : 'my-files';
  const folderPathIndex = pathSegments.indexOf(baseSegment);

  return {
    isTrashView,
    baseSegment,
    folderPath:
      folderPathIndex >= 0 ? pathSegments.slice(folderPathIndex).join('/') : '',
  };
}

/**
 * Builds a child folder path using encoded segment names.
 */
export function buildChildFolderPath(
  currentFolderPath: string,
  childFolderName: string
): string {
  const encodedName = encodeURIComponent(childFolderName);
  return `${currentFolderPath}/${encodedName}`.replace(/\/+/g, '/');
}

/**
 * Search helper used by the app (name + path + type contains query).
 */
export function filterResourcesByQuery<T extends ExplorerResource>(
  resources: T[],
  query: string
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return resources;

  return resources.filter((resource) => {
    const searchableText = [resource.name, resource.path, resource.type]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Utility for hiding placeholder lost+found folders from rendering.
 */
export function isHiddenLostAndFound(resource: ExplorerResource): boolean {
  return (
    resource.type === 'folder' &&
    resource.name === 'lost+found' &&
    Boolean(resource.empty)
  );
}

/**
 * Converts raw trash items into virtual trash paths.
 */
export function mapTrashItemsToVirtualPaths(
  allTrashItems: ExplorerResource[]
): {
  items: TrashVirtualResource[];
  virtualRoot: string;
} {
  if (allTrashItems.length === 0) {
    return { items: [], virtualRoot: 'trash' };
  }

  const folderAnchorPaths = allTrashItems
    .filter((item) => item.type === 'folder')
    .sort((a, b) => a.path.split('/').length - b.path.split('/').length)
    .map((item) => item.path);

  const originalToVirtualPathMap: Record<string, string> = {};
  for (const originalFolderPath of folderAnchorPaths) {
    const pathSegments = originalFolderPath.split('/');
    const folderName = pathSegments[pathSegments.length - 1];
    originalToVirtualPathMap[originalFolderPath] = `trash/${folderName}`;
  }

  const items = allTrashItems.map((item) => {
    let itemVirtualPath: string | undefined;

    for (const [originalPrefix, virtualPrefix] of Object.entries(
      originalToVirtualPathMap
    )) {
      if (item.path.startsWith(originalPrefix)) {
        itemVirtualPath = item.path.replace(originalPrefix, virtualPrefix);
        break;
      }
    }

    if (!itemVirtualPath) {
      const fileName = item.path.split('/').pop() || item.name;
      itemVirtualPath = `trash/${fileName}`;
    }

    return {
      ...item,
      virtualPath: itemVirtualPath,
    };
  });

  const virtualRoot = Object.values(originalToVirtualPathMap)[0] || 'trash';

  return { items, virtualRoot };
}

/**
 * Returns only the direct children for a given virtual trash path.
 */
export function getTrashResourcesAtVirtualPath(
  allTrashItems: ExplorerResource[],
  virtualPath = 'trash',
  originalPath = ''
): {
  resources: TrashVirtualResource[];
  virtualRoot: string;
} {
  const normalizedVirtualPath = decodeURIComponent(virtualPath);
  const { items, virtualRoot } = mapTrashItemsToVirtualPaths(allTrashItems);

  let resources = items.filter((item) => {
    const parentPath = item.virtualPath.split('/').slice(0, -1).join('/');
    return parentPath === normalizedVirtualPath;
  });

  if (originalPath) {
    resources = resources.filter((item) => item.path.includes(originalPath));
  }

  return { resources, virtualRoot };
}
