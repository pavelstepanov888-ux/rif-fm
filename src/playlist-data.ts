// Prototype content from Figma 1103:140982, including its sample dates.
export const playlistDays = [
  { id: '09', label: 'Чт, 09 окт' },
  { id: '10', label: 'Пт, 10 окт' },
  { id: '11', label: 'Сб, 11 окт' },
  { id: '12', label: 'Вс, 12 окт' },
  { id: '13', label: 'Пн, 13 окт' },
  { id: '14', label: 'Вчера, 14 окт' },
  { id: '15', label: 'Сегодня, 15 окт' },
];
export const liveDay = '15';
export const liveTrack = { time: 'Сейчас', hour: 15, title: 'Smooth Operator', artist: 'Sade', cover: 'album-sade.jpg' };
const lastTrack = { time: '15:09', title: 'Slave to Love', artist: 'Bryan Ferry', cover: 'album-bryan-ferry.jpg' };
export const playlistTracks = [
  liveTrack,
  { time: '15:37', title: 'Shape of My Heart', artist: 'Sting', cover: 'album-sting.jpg' },
  { time: '15:33', title: 'Come Away With Me', artist: 'Norah Jones', cover: 'album-norah-jones.jpg' },
  { time: '15:28', title: 'On the Beach', artist: 'Chris Rea', cover: 'album-chris-rea.jpg' },
  { time: '15:23', title: 'Careless Whisper', artist: 'George Michael', cover: 'album-george-michael.jpg' },
  { time: '15:19', title: 'Stars', artist: 'Simply Red', cover: 'album-simply-red.jpg' },
  { time: '15:14', title: 'Hunting High and Low', artist: 'a-ha', cover: 'album-a-ha.jpg' },
  lastTrack,
  // Repeated rows are present in the supplied design to show the scrolling list.
  lastTrack, lastTrack, lastTrack, lastTrack,
];

export const playlistTimeRanges = [
  { id: 'all', label: 'Весь день', startHour: 0, endHour: 24 },
  ...Array.from({ length: 6 }, (_, i) => ({
    id: String(i * 4),
    label: `${String(i * 4).padStart(2, '0')}:00 – ${String((i + 1) * 4).padStart(2, '0')}:00`,
    startHour: i * 4,
    endHour: (i + 1) * 4,
  })),
];

export function getPlaylistTracks(day: string, rangeId: string) {
  if (day !== liveDay) return [];
  const range = playlistTimeRanges.find(item => item.id === rangeId);
  if (!range) return [];
  return playlistTracks.filter(track => {
    const hour = track === liveTrack ? liveTrack.hour : Number(track.time.split(':')[0]);
    return hour >= range.startHour && hour < range.endHour;
  });
}
