import { describe, expect, it } from 'vitest';
import {
  buildChildFolderPath,
  copyResourceInTree,
  filterResourcesByQuery,
  flattenPaths,
  getFolderPathFromPathname,
  getTrashResourcesAtVirtualPath,
  isHiddenLostAndFound,
  mapTrashItemsToVirtualPaths,
  moveResourceInTree,
  renameResourceInTree,
  type ExplorerNode,
  type ExplorerResource,
} from './index';

describe('flattenPaths', () => {
  it('flattens a nested tree in depth-first order', () => {
    const tree: ExplorerNode[] = [
      {
        name: 'src',
        path: 'src',
        isDirectory: true,
        children: [
          { name: 'index.ts', path: 'src/index.ts', isDirectory: false },
          {
            name: 'components',
            path: 'src/components',
            isDirectory: true,
            children: [
              {
                name: 'Tree.tsx',
                path: 'src/components/Tree.tsx',
                isDirectory: false,
              },
            ],
          },
        ],
      },
    ];

    expect(flattenPaths(tree)).toEqual([
      'src',
      'src/index.ts',
      'src/components',
      'src/components/Tree.tsx',
    ]);
  });
});

describe('getFolderPathFromPathname', () => {
  it('parses my-files paths', () => {
    expect(getFolderPathFromPathname('/reading/my-files/docs')).toEqual({
      isTrashView: false,
      baseSegment: 'my-files',
      folderPath: 'my-files/docs',
    });
  });

  it('parses trash paths', () => {
    expect(getFolderPathFromPathname('/reading/trash/project-a')).toEqual({
      isTrashView: true,
      baseSegment: 'trash',
      folderPath: 'trash/project-a',
    });
  });
});

describe('buildChildFolderPath', () => {
  it('encodes child folder segment', () => {
    expect(buildChildFolderPath('my-files/docs', 'My Folder')).toBe(
      'my-files/docs/My%20Folder'
    );
  });
});

describe('filterResourcesByQuery', () => {
  const resources: ExplorerResource[] = [
    { name: 'notes.txt', path: 'my-files/notes.txt', type: 'file' },
    { name: 'docs', path: 'my-files/docs', type: 'folder' },
  ];

  it('returns all items for empty query', () => {
    expect(filterResourcesByQuery(resources, '   ')).toEqual(resources);
  });

  it('filters by name/path/type', () => {
    expect(filterResourcesByQuery(resources, 'folder')).toEqual([
      { name: 'docs', path: 'my-files/docs', type: 'folder' },
    ]);
  });
});

describe('isHiddenLostAndFound', () => {
  it('hides empty lost+found folder', () => {
    expect(
      isHiddenLostAndFound({
        name: 'lost+found',
        path: 'my-files/lost+found',
        type: 'folder',
        empty: true,
      })
    ).toBe(true);
  });
});

describe('rename/move/copy tree operations', () => {
  const tree: ExplorerResource[] = [
    { name: 'my-files', path: 'my-files', type: 'folder' },
    { name: 'docs', path: 'my-files/docs', type: 'folder' },
    {
      name: 'project-a',
      path: 'my-files/docs/project-a',
      type: 'folder',
    },
    {
      name: 'readme.md',
      path: 'my-files/docs/project-a/readme.md',
      type: 'file',
    },
    { name: 'archive', path: 'my-files/archive', type: 'folder' },
  ];

  it('renames a folder and updates descendant paths', () => {
    const renamed = renameResourceInTree(
      tree,
      'my-files/docs/project-a',
      'project-z'
    );

    expect(renamed.find((r) => r.name === 'project-z')?.path).toBe(
      'my-files/docs/project-z'
    );
    expect(
      renamed.find((r) => r.name === 'readme.md' && r.type === 'file')?.path
    ).toBe('my-files/docs/project-z/readme.md');
  });

  it('moves a folder and updates descendant paths', () => {
    const moved = moveResourceInTree(
      tree,
      'my-files/docs/project-a',
      'my-files/archive'
    );

    expect(
      moved.find((r) => r.path === 'my-files/archive/project-a')?.name
    ).toBe('project-a');
    expect(
      moved.find((r) => r.name === 'readme.md' && r.type === 'file')?.path
    ).toBe('my-files/archive/project-a/readme.md');
  });

  it('prevents moving folder into itself/descendant', () => {
    expect(() =>
      moveResourceInTree(tree, 'my-files/docs', 'my-files/docs/project-a')
    ).toThrow('Cannot move a folder into itself or its descendant');
  });

  it('copies a folder subtree with automatic copy naming', () => {
    const copied = copyResourceInTree(
      tree,
      'my-files/docs/project-a',
      'my-files/archive'
    );

    expect(
      copied.find((r) => r.path === 'my-files/archive/project-a copy')?.type
    ).toBe('folder');
    expect(
      copied.find((r) => r.path === 'my-files/archive/project-a copy/readme.md')
        ?.type
    ).toBe('file');
  });
});

describe('trash virtual path helpers', () => {
  const trashItems: ExplorerResource[] = [
    {
      _id: '1',
      name: 'project-a',
      path: 'my-files/projects/project-a',
      type: 'folder',
    },
    {
      _id: '2',
      name: 'readme.md',
      path: 'my-files/projects/project-a/readme.md',
      type: 'file',
    },
    {
      _id: '3',
      name: 'orphan.txt',
      path: 'my-files/random/orphan.txt',
      type: 'file',
    },
  ];

  it('maps items to virtual trash paths and picks virtual root', () => {
    const { items, virtualRoot } = mapTrashItemsToVirtualPaths(trashItems);

    expect(virtualRoot).toBe('trash/project-a');
    expect(items.find((i) => i._id === '2')?.virtualPath).toBe(
      'trash/project-a/readme.md'
    );
    expect(items.find((i) => i._id === '3')?.virtualPath).toBe(
      'trash/orphan.txt'
    );
  });

  it('returns direct children for virtual trash path', () => {
    const { resources } = getTrashResourcesAtVirtualPath(
      trashItems,
      'trash/project-a'
    );

    expect(resources.map((r) => r.name)).toEqual(['readme.md']);
  });
});
