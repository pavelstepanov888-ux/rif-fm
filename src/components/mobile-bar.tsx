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
  const viewportRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const viewport = window.visualViewport;
    const element = viewportRef.current;
    if (!viewport || !element) return;

    const supportsDynamicHeight = CSS.supports('height', '100dvh');
    let frame = 0;
    let previous = '';
    const update = () => {
      frame = 0;
      if (viewport.width <= 0 || viewport.height <= 0) return;

      const layoutViewport = document.documentElement;
      const needsVisualBounds = !supportsDynamicHeight
        || Math.abs(viewport.scale - 1) > 0.01
        || Math.abs(viewport.offsetTop) > 1
        || Math.abs(viewport.offsetLeft) > 1
        || Math.abs(viewport.width - layoutViewport.clientWidth) > 1
        || Math.abs(viewport.height - layoutViewport.clientHeight) > 1;

      // Let CSS follow browser toolbar changes while both viewports agree.
      const values = needsVisualBounds
        ? [viewport.offsetTop, viewport.offsetLeft, viewport.width, viewport.height].map(value => `${Math.round(value * 100) / 100}px`)
        : ['', '', '', ''];
      const signature = values.join('|');
      if (signature === previous) return;
      previous = signature;
      [element.style.top, element.style.left, element.style.width, element.style.height] = values;
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    viewport.addEventListener('resize', schedule, { passive: true });
    viewport.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', schedule);
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
      element.style.top = element.style.left = element.style.width = element.style.height = '';
    };
  }, []);
  return <div className="mobile-bar" ref={viewportRef}>
    <div className="mobile-bar__content" data-figma-component="1030:318987">
      <MiniPlayer onOpenPlaylist={onOpenPlaylist} playlistOpen={playlistOpen} />
      <TabBar active={active} moreOpen={moreOpen} onMore={onMore} />
    </div>
  </div>;
}
