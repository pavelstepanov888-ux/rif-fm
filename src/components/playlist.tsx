import { useRef, useState } from 'react';
import { asset } from '../assets';
import { getPlaylistTracks, liveDay, liveTrack, playlistDays, playlistTimeRanges } from '../playlist-data';
import { PlayControl } from './player';
import { Button, Dialog, Select } from './ui';

export function PlaylistOverlay({ onClose }: { onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState(liveDay);
  const [selectedRange, setSelectedRange] = useState('all');
  const list = useRef<HTMLDivElement>(null);
  const selectedLabel = playlistDays.find(day => day.id === selectedDay)!.label;
  const rangeLabel = playlistTimeRanges.find(range => range.id === selectedRange)!.label;
  const tracks = getPlaylistTracks(selectedDay, selectedRange);
  const resetScroll = () => { if (list.current) list.current.scrollTop = 0; };
  const resetFilters = () => { setSelectedDay(liveDay); setSelectedRange('all'); resetScroll(); document.getElementById('playlist-day')?.focus(); };

  return <Dialog label="Что звучало" onClose={onClose} closeOnBackdrop={false} animated className="playlist-overlay">{close => <>
    <div className="playlist-overlay__header container">
      <a href="#air" onClick={close} aria-label="Риф FM — к эфиру"><img src={asset('logo-header.svg')} width="135" height="64" alt="Риф FM" /></a>
      <Button variant="secondary" icon="chevron-down" iconOnly aria-label="Свернуть плейлист" onClick={close} />
    </div>
    <div className="playlist-overlay__body container" data-figma-node="1104:123555">
      <div className="playlist-overlay__grid">
        <section className="playlist-current" aria-label="Сейчас играет" data-figma-node="1104:123556">
          <img className="playlist-current__cover" src={asset(liveTrack.cover)} width="416" height="416" alt={`${liveTrack.artist} — ${liveTrack.title}`} />
          <div className="playlist-current__info"><PlayControl /><div><h2>{liveTrack.title}</h2><p>{liveTrack.artist}</p></div></div>
        </section>
        <div className="playlist-sidebar">
          <div className="playlist-filters" role="group" aria-label="Фильтры истории эфира" data-figma-node="1141:281288">
            <Select id="playlist-day" label="День истории эфира" value={selectedDay} className={`playlist-filter--day ${['14', liveDay].includes(selectedDay) ? 'is-relative' : ''}`} aria-controls="playlist-history" onChange={e => { setSelectedDay(e.target.value); resetScroll(); }}>
              {[...playlistDays].reverse().map(day => <option key={day.id} value={day.id}>{day.id === liveDay ? 'Сегодня' : day.id === '14' ? 'Вчера' : day.label}</option>)}
            </Select>
            <Select label="Время в эфире" value={selectedRange} className={`playlist-filter--time ${selectedRange === 'all' ? 'is-all' : ''}`} aria-controls="playlist-history" onChange={e => { setSelectedRange(e.target.value); resetScroll(); }}>
              {playlistTimeRanges.map(range => <option key={range.id} value={range.id}>{range.label}</option>)}
            </Select>
          </div>
          <p className="visually-hidden" role="status">{selectedLabel}, {rangeLabel}. Треков: {tracks.length}.</p>
          <div className="playlist-history" id="playlist-history" ref={list} role="region" aria-label={`Что звучало · ${selectedLabel} · ${rangeLabel}`} tabIndex={0}>
          {tracks.length > 0 ? <ol className="playlist-tracks" aria-label="Композиции — новые сверху">
            {tracks.map((track, i) => <li className={`playlist-track ${track === liveTrack ? 'playlist-track--live' : ''}`} key={`${track.cover}-${i}`}>
              <span className="playlist-track__time">{track.time}</span>
              <img src={asset(track.cover)} width="52" height="52" alt="" />
              <div className="playlist-track__info"><strong title={track.title}>{track.title}</strong><span>{track.artist}</span></div>
            </li>)}
          </ol> : <div className="playlist-empty"><h2>{selectedDay !== liveDay ? 'За этот день пока нет треков' : 'В этом интервале пока нет треков'}</h2><p>Попробуйте другой день или время.</p><Button variant="tertiary" onClick={resetFilters}>Показать сегодняшний эфир</Button></div>}
          </div>
        </div>
      </div>
    </div>
  </>}</Dialog>;
}
