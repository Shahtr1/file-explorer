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
