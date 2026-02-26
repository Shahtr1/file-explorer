# @shahrukh404/file-explorer

Framework-agnostic TypeScript utilities for file-explorer style apps.

## Install

```bash
npm install @shahrukh404/file-explorer
```

## Usage

```ts
import {
  filterResourcesByQuery,
  getFolderPathFromPathname,
  getTrashResourcesAtVirtualPath,
  type ExplorerResource,
} from '@shahrukh404/file-explorer';

const resources: ExplorerResource[] = [
  { name: 'docs', path: 'my-files/docs', type: 'folder' },
  { name: 'notes.txt', path: 'my-files/notes.txt', type: 'file' },
];

const filtered = filterResourcesByQuery(resources, 'docs');
const route = getFolderPathFromPathname('/reading/my-files/docs');
const trash = getTrashResourcesAtVirtualPath(resources, 'trash');
```

## Quick Demo

Run a real example with sample resources and trash items:

```bash
npm run demo
```

Expected output (similar):

```txt
Search result names: [ 'docs', 'project-plan.md' ]
Route parse: { isTrashView: false, baseSegment: 'my-files', folderPath: 'my-files/docs' }
Virtual root: trash/project-a
Mapped trash paths: [
  'project-a -> trash/project-a',
  'readme.md -> trash/project-a/readme.md',
  'orphan.txt -> trash/orphan.txt'
]
trash/project-a children: [ 'readme.md' ]
```

## API

- `flattenPaths(nodes)`
- `getFolderPathFromPathname(pathname)`
- `buildChildFolderPath(currentFolderPath, childFolderName)`
- `filterResourcesByQuery(resources, query)`
- `isHiddenLostAndFound(resource)`
- `mapTrashItemsToVirtualPaths(allTrashItems)`
- `getTrashResourcesAtVirtualPath(allTrashItems, virtualPath, originalPath)`

## License

MIT
