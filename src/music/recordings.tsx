import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../assets';
import { Button, Icon, Volume, Wave } from '../components/ui';
import { musicHref } from './navigation';

export type Clip = { id: string; title: string; subtitle: string; image: string };

export function useRecordingPlayer(onStart?: () => void) {
  const [current, setCurrent] = useState<Clip | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(.7);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => { if (player.current) player.current.volume = volume; }, [volume]);

  function play(clip: Clip) {
    const element = player.current;
    if (!element) return;
    if (current?.id === clip.id && !element.paused) { element.pause(); return; }
    onStart?.();
    if (current?.id !== clip.id) element.currentTime = 0;
    setCurrent(clip);
    setMediaError(false);
    void element.play().catch((error) => { if (error.name !== 'AbortError') setMediaError(true); });
  }

  const clear = useCallback(() => {
    player.current?.pause();
    setCurrent(null);
    setPlaying(false);
    setMediaError(false);
  }, []);

  return {
    current, playing, volume, elapsed, duration, mediaError, setVolume, play, clear,
    seek: (time: number) => { if (player.current) player.current.currentTime = time; },
    audio: <audio ref={player} preload="none" src={asset('radio-fragment.mp3')}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}/>,
  };
}

export type RecordingState = ReturnType<typeof useRecordingPlayer>;

const timeLabel = (seconds: number) => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');

export function RecordingPlayer({ recordings, stationUrl }: { recordings: RecordingState; stationUrl?: string }) {
  const { current, playing, volume, elapsed, duration, mediaError, play, seek, setVolume, clear } = recordings;
  return <aside className="music-player container" aria-label={current ? 'Плеер записи' : 'Плеер Риф FM'}>
    {current ? <Button icon={playing ? 'pause' : 'play'} iconOnly aria-label={playing ? 'Приостановить запись' : 'Воспроизвести запись'} onClick={() => play(current)}/> :
      <a className="button button--primary button--icon button--m" href={stationUrl} aria-label="Слушать прямой эфир"><Icon name="play"/></a>}
    <div className="player-label"><strong>{current?.title ?? 'Риф FM'}</strong><span>{mediaError ? 'Не удалось воспроизвести запись' : current?.subtitle ?? 'Прямой эфир · 95,2 FM'}</span></div>
    {current ? <div className="player-progress"><input aria-label="Позиция записи" type="range" min={0} max={duration || 1} step={.1} value={elapsed} onChange={(event) => seek(Number(event.target.value))}/><span>{timeLabel(elapsed)} / {timeLabel(duration)}</span></div> : <Wave/>}
    {current && <div className="player-volume"><Volume value={volume} onChange={setVolume}/></div>}
    {current ? <Button variant="secondary" onClick={clear}>К эфиру</Button> : <a className="button button--secondary button--m player-records" href={musicHref('catalog', 'episode')}>Записи эфиров</a>}
  </aside>;
}
