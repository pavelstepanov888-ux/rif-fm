type MusicPage = 'home' | 'direction' | 'catalog' | 'detail';
export type MusicRoute = { page: MusicPage; id: string; direction: string };

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
  return { page, id, direction: page === 'direction' ? id : params.get('direction') || '' };
}
