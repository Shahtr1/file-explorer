import {
  filterResourcesByQuery,
  getFolderPathFromPathname,
  getTrashResourcesAtVirtualPath,
  mapTrashItemsToVirtualPaths,
} from '../dist/index.js';

const resources = [
  { name: 'docs', path: 'my-files/docs', type: 'folder' },
  { name: 'notes.txt', path: 'my-files/notes.txt', type: 'file' },
  { name: 'project-plan.md', path: 'my-files/docs/project-plan.md', type: 'file' },
];

const trashItems = [
  { _id: '1', name: 'project-a', path: 'my-files/projects/project-a', type: 'folder' },
  { _id: '2', name: 'readme.md', path: 'my-files/projects/project-a/readme.md', type: 'file' },
  { _id: '3', name: 'orphan.txt', path: 'my-files/random/orphan.txt', type: 'file' },
];

const search = filterResourcesByQuery(resources, 'docs');
const route = getFolderPathFromPathname('/reading/my-files/docs');
const mappedTrash = mapTrashItemsToVirtualPaths(trashItems);
const trashAtProject = getTrashResourcesAtVirtualPath(trashItems, 'trash/project-a');

console.log('Search result names:', search.map((r) => r.name));
console.log('Route parse:', route);
console.log('Virtual root:', mappedTrash.virtualRoot);
console.log(
  'Mapped trash paths:',
  mappedTrash.items.map((item) => `${item.name} -> ${item.virtualPath}`)
);
console.log(
  'trash/project-a children:',
  trashAtProject.resources.map((r) => r.name)
);
