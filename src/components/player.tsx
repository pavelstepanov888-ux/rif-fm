import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { asset } from '../assets';
import { Button, Dialog, Heading, Hosts, Icon, LiveLabel, Volume, Wave } from './ui';

type Playback = 'paused' | 'loading' | 'playing';
type Radio = { status: Playback; toggle: () => void; volume: number; setVolume: (value: number) => void; videoOpen: boolean; openVideo: () => void; closeVideo: () => void; notice: string };
const RadioContext = createContext<Radio | null>(null);
export const useRadio = () => useContext(RadioContext)!;

export function RadioProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Playback>('paused');
  const [volume, setVolume] = useState(0.7);
  const [videoOpen, setVideoOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const audio = useRef<HTMLAudioElement | null>(null);
  const demoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioUrl = import.meta.env.VITE_AUDIO_STREAM_URL;
  useEffect(() => {
    if (!audioUrl) return;
    const element = new Audio(audioUrl); element.preload = 'none'; audio.current = element;
    element.addEventListener('playing', () => setStatus('playing'));
    element.addEventListener('waiting', () => setStatus('loading'));
    element.addEventListener('error', () => { setStatus('paused'); setNotice('Не удалось подключиться к эфиру. Попробуйте ещё раз.'); });
    return () => { element.pause(); element.removeAttribute('src'); element.load(); audio.current = null; };
  }, [audioUrl]);
  useEffect(() => { if(audio.current) audio.current.volume = volume; }, [volume]);
  useEffect(() => () => { if(demoTimer.current) clearTimeout(demoTimer.current); }, []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timer); }, [notice]);
  const toggle = () => {
    if(demoTimer.current) clearTimeout(demoTimer.current);
    if(status !== 'paused') { audio.current?.pause(); setStatus('paused'); return; }
    setStatus('loading');
    if(audio.current) { void audio.current.play().catch(() => { setStatus('paused'); setNotice('Не удалось подключиться к эфиру. Попробуйте ещё раз.'); }); }
    else { setNotice('Прототип: аудиопоток пока не подключён'); demoTimer.current = setTimeout(() => setStatus('playing'), 650); }
  };
  return <RadioContext.Provider value={{ status, toggle, volume, setVolume, videoOpen, openVideo: () => setVideoOpen(true), closeVideo: () => setVideoOpen(false), notice }}>{children}{notice && <div className="notice" role="status">{notice}</div>}</RadioContext.Provider>;
}

export function PlayControl({ listen = false }: { listen?: boolean }) {
  const { status, toggle } = useRadio();
  const label = status === 'loading' ? 'Подключаемся' : status === 'playing' ? 'Пауза' : 'Слушать эфир';
  const icon = status === 'loading' ? 'loader' : status === 'playing' ? 'pause' : 'play';
  return <button className={listen ? 'listen-button' : 'play-control'} aria-label={label} aria-pressed={status === 'playing'} onClick={toggle}>
    <span className="play-control__disc"><Icon name={icon} className={status === 'loading' ? 'spin' : ''} /></span>{listen && <span>{label}</span>}
  </button>;
}

export function NowPlaying() {
  return <div className="now-playing" data-figma-component="352:1067"><div className="now-playing__top"><strong>Сейчас играет</strong><Wave active /></div><p title="Sade · Smooth Operator">Sade · Smooth Operator</p></div>;
}

export function DesktopPlayer() {
  const { status, volume, setVolume, openVideo } = useRadio();
  return <aside className="desktop-player" aria-label="Плеер прямого эфира" data-figma-component="639:18791">
    <div className="desktop-player__left"><PlayControl /><div className="player-info"><strong>История одной песни</strong><span>Игорь Федоров</span></div></div>
    <Wave active={status === 'playing'} />
    <div className="desktop-player__right"><Volume value={volume} onChange={setVolume} /><Button variant="secondary" icon="video" onClick={openVideo}>Смотреть трансляцию</Button></div>
  </aside>;
}

export function VideoOverlay() {
  const { videoOpen, closeVideo, volume, setVolume } = useRadio();
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = import.meta.env.VITE_VIDEO_STREAM_URL;
  useEffect(() => { if(videoRef.current) videoRef.current.volume = volume; }, [volume, videoOpen]);
  useEffect(() => { if(!videoOpen) { setPlaying(false); setError(false); } }, [videoOpen]);
  if(!videoOpen) return null;
  const toggleVideo = () => {
    if(!videoUrl) { setError(true); return; }
    if(playing) videoRef.current?.pause();
    else void videoRef.current?.play().catch(() => setError(true));
  };
  return <Dialog label="Видеотрансляция Риф FM" onClose={closeVideo} className="video-overlay">
    <div className="video-overlay__header container"><img src={asset('logo-header.svg')} width="135" height="64" alt="Риф FM" /><Button variant="secondary" icon="chevron-down" iconOnly aria-label="Свернуть трансляцию" onClick={closeVideo} /></div>
    <div className="video-overlay__body container"><div className="video-column"><div className="video-frame">
      <video ref={videoRef} src={videoUrl || undefined} poster={asset('video-poster.png')} playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} />
      <span className="video-badge"><i />В эфире</span>
      {!playing && <Button className="video-frame__play" size="l" icon="play" iconOnly aria-label="Воспроизвести видео" onClick={toggleVideo} />}
      {error && <p className="video-message" role="status">{videoUrl ? 'Не удалось загрузить трансляцию' : 'Видеопоток пока не подключён'}</p>}
      <div className="video-controls"><Button icon={playing ? 'pause' : 'play'} iconOnly aria-label={playing ? 'Приостановить видео' : 'Воспроизвести видео'} onClick={toggleVideo} /><Volume value={volume} onChange={setVolume} /><Button variant="tertiary" icon="fullscreen" iconOnly aria-label="На весь экран" onClick={() => void videoRef.current?.requestFullscreen()} /></div>
    </div><div className="program-progress"><span>10:00</span><span><i /></span><span>12:00</span></div></div>
    <div className="video-info"><LiveLabel /><Heading first="История одной" script="песни" /><Hosts /><p>Как появилась песня, кто спел её первым и почему она до сих пор трогает. Ведущий и гость разбирают одну композицию от первой ноты до последней.</p><h3>Дальше в эфире</h3>
      {[['12:00 – 12:30','Гороскоп','horoscope'],['12:30 – 14:00','Галерея','poetry'],['14:00 – 16:00','Лист календаря','news']].map(([time,title,cover]) => <div className="up-next" key={title}><img src={asset(`cover-${cover}.png`)} alt="" /><div><span>{time}</span><strong>{title}</strong></div></div>)}
    </div></div>
  </Dialog>;
}
