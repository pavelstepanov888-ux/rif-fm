import { useEffect, useState, type MouseEvent } from 'react';
import { asset } from '../assets';
import type { StationSection } from '../music/navigation';
import { Button } from './ui';

const stationLinks = [
  { id: 'schedule', title: 'Расписание' },
  { id: 'contacts', title: 'Контакты' },
  { id: 'about', title: 'О радиостанции' },
];

type HeaderProps = {
  writeToAirOpen: boolean;
  onWriteToAir: (event: MouseEvent<HTMLButtonElement>) => void;
  stationUrl?: string;
  musicHref?: string;
  programsHref?: string;
  guestsHref?: string;
  activeSection?: StationSection;
};

export function Header({ writeToAirOpen, onWriteToAir, stationUrl = '', musicHref, programsHref, guestsHref, activeSection = 'air' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const homeHref = `${stationUrl}#air`;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <header className={`header${musicHref ? ' header--with-music' : ''}${scrolled ? ' header--scrolled' : ''}`} data-figma-component="639:18784">
    <div className="container header__inner">
      <a className="brand" href={homeHref} aria-label="Риф FM — на главную"><img src={asset('logo-header.svg')} width="135" height="64" alt="Риф FM" /></a>
      <nav aria-label="Основная навигация">
        <a href={homeHref} aria-current={activeSection === 'air' ? 'page' : undefined}>Эфир</a>
        {musicHref && <a href={musicHref} aria-current={activeSection === 'music' ? 'page' : undefined}>Музыка</a>}
        {programsHref && <a href={programsHref} aria-current={activeSection === 'programs' ? 'page' : undefined}>Программы</a>}
        {guestsHref && <a href={guestsHref} aria-current={activeSection === 'guests' ? 'page' : undefined}>Гости</a>}
        {stationLinks.map(({ id, title }) => <a key={id} href={`${stationUrl}#${id}`}>{title}</a>)}
      </nav>
      <div className="header__slot">
        <Button className="header__write-to-air" type="button" variant="secondary" size="m" icon="chat-bubble" aria-label="Написать в эфир" aria-haspopup="dialog" aria-expanded={writeToAirOpen} onClick={onWriteToAir}><span className="header__write-label">Написать в эфир</span></Button>
      </div>
    </div>
  </header>;
}
