# @shahrukh404/file-explorer

Framework-agnostic TypeScript utilities for file-explorer style apps.

## Install

```bash
npm install @shahrukh404/file-explorer
```

## Usage

```ts
import {
  copyResourceInTree,
  filterResourcesByQuery,
  getFolderPathFromPathname,
  renameResourceInTree,
  type ExplorerResource,
} from '@shahrukh404/file-explorer';

const resources: ExplorerResource[] = [
  { name: 'my-files', path: 'my-files', type: 'folder' },
  { name: 'docs', path: 'my-files/docs', type: 'folder' },
  { name: 'notes.txt', path: 'my-files/docs/notes.txt', type: 'file' },
  { name: 'archive', path: 'my-files/archive', type: 'folder' },
];

const filtered = filterResourcesByQuery(resources, 'docs');
const route = getFolderPathFromPathname('/reading/my-files/docs');
const renamed = renameResourceInTree(resources, 'my-files/docs', 'documents');
const copied = copyResourceInTree(resources, 'my-files/docs', 'my-files/archive');
```

## Quick Demo

Run a real example with sample resources and trash items:

```bash
npm run demo
```

## API

- `flattenPaths(nodes)`
- `getFolderPathFromPathname(pathname)`
- `buildChildFolderPath(currentFolderPath, childFolderName)`
- `filterResourcesByQuery(resources, query)`
- `isHiddenLostAndFound(resource)`
- `renameResourceInTree(resources, targetPath, newName)`
- `moveResourceInTree(resources, targetPath, destinationFolderPath)`
- `copyResourceInTree(resources, targetPath, destinationFolderPath, options?)`
- `mapTrashItemsToVirtualPaths(allTrashItems)`
- `getTrashResourcesAtVirtualPath(allTrashItems, virtualPath, originalPath)`

## License

MIT
