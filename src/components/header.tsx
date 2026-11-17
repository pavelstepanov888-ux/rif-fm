import { useEffect, useState, type MouseEvent } from 'react';
import { asset } from '../assets';
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
  musicActive?: boolean;
};

export function Header({ writeToAirOpen, onWriteToAir, stationUrl = '', musicHref, musicActive }: HeaderProps) {
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
        <a href={homeHref} aria-current={musicActive ? undefined : 'page'}>Эфир</a>
        {musicHref && <a href={musicHref} aria-current={musicActive ? 'page' : undefined}>Музыка</a>}
        {stationLinks.map(({ id, title }) => <a key={id} href={`${stationUrl}#${id}`}>{title}</a>)}
      </nav>
      <div className="header__slot">
        <Button className="header__write-to-air" type="button" variant="secondary" size="m" icon="chat-bubble" aria-haspopup="dialog" aria-expanded={writeToAirOpen} onClick={onWriteToAir}>Написать в эфир</Button>
      </div>
    </div>
  </header>;
}
