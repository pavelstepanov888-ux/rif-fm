import { useLayoutEffect, useRef } from 'react';
import { Icon } from './ui';
import { PlayControl, PlaylistButton, useRadio } from './player';

export type MobileTab = 'air' | 'schedule' | 'contacts' | 'more';
const tabs = [
  { id: 'air', label: 'Эфир', icon: 'tab-broadcast' },
  { id: 'schedule', label: 'Расписание', icon: 'tab-calendar' },
  { id: 'contacts', label: 'Контакты', icon: 'tab-mail' },
] as const;

export function TabBar({ active, moreOpen, onMore }: { active: MobileTab; moreOpen: boolean; onMore: () => void }) {
  return <nav className="tab-bar" aria-label="Мобильная навигация" data-figma-component="1030:316712">
    {tabs.map(tab => <a key={tab.id} className="tab-bar__item" href={`#${tab.id}`} aria-current={active === tab.id ? 'page' : undefined} data-figma-component="1030:316627"><span className="tab-bar__icon"><Icon name={tab.icon} /></span><span>{tab.label}</span></a>)}
    <button type="button" className="tab-bar__item" aria-current={active === 'more' ? 'page' : undefined} aria-haspopup="dialog" aria-expanded={moreOpen} onClick={onMore} data-figma-component="1030:316627"><span className="tab-bar__icon"><Icon name="tab-more" /></span><span>Ещё</span></button>
  </nav>;
}

function MiniPlayer({ onOpenPlaylist, playlistOpen }: { onOpenPlaylist: () => void; playlistOpen: boolean }) {
  const { openVideo } = useRadio();
  return <div className="mini-player" aria-label="Мини-плеер прямого эфира" data-figma-component="1030:316725">
    <PlayControl minimal />
    <button className="player-info" onClick={openVideo} aria-label="Открыть полный плеер"><strong>История одной песни</strong><span>Игорь Федоров</span></button>
    <div className="mini-player__actions"><button type="button" className="mini-player__video" aria-label="Смотреть трансляцию" onClick={openVideo}><Icon name="mini-video" /></button><PlaylistButton onOpenPlaylist={onOpenPlaylist} playlistOpen={playlistOpen} /></div>
  </div>;
}

export function MobileBar({ active, moreOpen, onMore, onOpenPlaylist, playlistOpen }: { active: MobileTab; moreOpen: boolean; onMore: () => void; onOpenPlaylist: () => void; playlistOpen: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const bar = barRef.current;
    const viewport = window.visualViewport;
    if (!bar || !viewport) return;

    let frame = 0;
    const isZoomed = () => Math.abs(viewport.scale - 1) > 0.01;
    const update = () => {
      frame = 0;
      const zoomed = isZoomed();
      bar.toggleAttribute('data-zoomed', zoomed);
      if (!zoomed) return;
      bar.style.setProperty('--visual-viewport-bottom', `${viewport.offsetTop + viewport.height}px`);
      bar.style.setProperty('--visual-viewport-left', `${viewport.offsetLeft}px`);
      bar.style.setProperty('--visual-viewport-width', `${viewport.width}px`);
    };
    const schedule = () => {
      if (!frame && (isZoomed() || bar.hasAttribute('data-zoomed'))) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    viewport.addEventListener('resize', schedule, { passive: true });
    viewport.addEventListener('scroll', schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', schedule);
      viewport.removeEventListener('scroll', schedule);
      bar.removeAttribute('data-zoomed');
    };
  }, []);

  return <div className="mobile-bar" ref={barRef}>
    <div className="mobile-bar__content" data-figma-component="1030:318987">
      <MiniPlayer onOpenPlaylist={onOpenPlaylist} playlistOpen={playlistOpen} />
      <TabBar active={active} moreOpen={moreOpen} onMore={onMore} />
    </div>
  </div>;
}
