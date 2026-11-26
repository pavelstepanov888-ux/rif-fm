import { byId, sections } from './data';

type MusicPage = 'home' | 'direction' | 'catalog' | 'detail';
type StationCatalog = 'programs' | 'guests';
export type MusicRoute = { page: MusicPage; id: string; direction: string; fromCatalog?: StationCatalog; guestSpecialty?: string };
export type StationSection = 'air' | 'music' | StationCatalog;
export const programsHref = '#programs';
export const guestsHref = '#guests';

export function isMusicOverview(route: MusicRoute | null) {
  return route?.page === 'home' || route?.page === 'direction';
}

export function isGuestCatalog(route: MusicRoute | null) {
  return route?.page === 'catalog' && route.id === 'guest';
}

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

export function guestCatalogHref(specialty: string) {
  return specialty ? '#' + new URLSearchParams({ page: 'catalog', id: 'guest', specialty }) : guestsHref;
}

export function stationProfileHref(id: string, catalog: StationCatalog, specialty = '') {
  const filter = catalog === 'guests' && specialty ? '&' + new URLSearchParams({ specialty }) : '';
  return musicHref('detail', id) + '&section=' + catalog + filter;
}

export function stationSection(route: MusicRoute | null): StationSection {
  if (!route) return 'air';
  if (route.fromCatalog) return route.fromCatalog;
  if (route.page === 'catalog' && route.id === 'program') return 'programs';
  if (isGuestCatalog(route)) return 'guests';
  return 'music';
}

export function readMusicRoute(hash: string): MusicRoute | null {
  if (hash === '#music') return { page: 'home', id: '', direction: '' };
  if (hash === programsHref) return { page: 'catalog', id: 'program', direction: '' };
  if (hash === guestsHref) return { page: 'catalog', id: 'guest', direction: '' };
  const params = new URLSearchParams(hash.slice(1));
  const page = params.get('page');
  if (page !== 'direction' && page !== 'catalog' && page !== 'detail') return null;
  const id = params.get('id') || '';
  const guestSpecialty = params.get('specialty') || undefined;
  if (page === 'catalog' && id === 'guest') return { page, id, direction: '', guestSpecialty };
  const direction = page === 'direction' ? id : params.get('direction') || '';
  const currentDirection = directionAliases[direction] ?? direction;
  if (page === 'catalog' && id !== 'program' && !hasCatalog(id) && sections.some((section) => section.id === id)) {
    return currentDirection
      ? { page: 'direction', id: currentDirection, direction: currentDirection }
      : { page: 'home', id: '', direction: '' };
  }
  if (page === 'detail') {
    const type = byId(id)?.type;
    if (type === 'guest') return { page, id, direction: '', fromCatalog: 'guests', guestSpecialty };
    if (type === 'program' && params.get('section') === 'programs') {
      return { page, id, direction: '', fromCatalog: 'programs' };
    }
  }
  return { page, id: page === 'direction' ? currentDirection : id, direction: currentDirection };
}
