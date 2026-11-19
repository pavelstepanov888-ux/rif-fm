import { sections } from './data';

type MusicPage = 'home' | 'direction' | 'catalog' | 'detail';
export type MusicRoute = { page: MusicPage; id: string; direction: string };

export const catalogLabels = { article: 'Все статьи', episode: 'Все записи' };

export function hasCatalog(id: string): id is keyof typeof catalogLabels {
  return Object.hasOwn(catalogLabels, id);
}

const directionAliases: Record<string, string> = { jazz: 'pop', rock: 'pop', variety: 'soviet' };

export function musicHref(page: MusicPage = 'home', id = '', direction = '') {
  if (page === 'home') return '#music';
  const params = new URLSearchParams({ page, id });
  if (direction) params.set('direction', direction);
  return '#' + params.toString();
}

export function readMusicRoute(hash: string): MusicRoute | null {
  if (hash === '#music') return { page: 'home', id: '', direction: '' };
  const params = new URLSearchParams(hash.slice(1));
  const page = params.get('page');
  if (page !== 'direction' && page !== 'catalog' && page !== 'detail') return null;
  const id = params.get('id') || '';
  const direction = page === 'direction' ? id : params.get('direction') || '';
  const currentDirection = directionAliases[direction] ?? direction;
  if (page === 'catalog' && !hasCatalog(id) && sections.some((section) => section.id === id)) {
    return currentDirection
      ? { page: 'direction', id: currentDirection, direction: currentDirection }
      : { page: 'home', id: '', direction: '' };
  }
  return { page, id: page === 'direction' ? currentDirection : id, direction: currentDirection };
}
