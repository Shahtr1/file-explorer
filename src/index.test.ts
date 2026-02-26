import { describe, expect, it } from 'vitest';
import {
  buildChildFolderPath,
  filterResourcesByQuery,
  flattenPaths,
  getFolderPathFromPathname,
  getTrashResourcesAtVirtualPath,
  isHiddenLostAndFound,
  mapTrashItemsToVirtualPaths,
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
