import { useEffect, useState, type ReactNode } from 'react';
import { asset } from './assets';
import { Button, Dialog, Heading, Hosts, Icon, LiveLabel } from './components/ui';
import { DesktopPlayer, NowPlaying, PlayControl, RadioProvider, useRadio, VideoOverlay } from './components/player';
import { PlaylistOverlay } from './components/playlist';
import { MobileBar, type MobileTab } from './components/mobile-bar';
import { PrototypeVersionProvider } from './prototype-version';

const programs = [
  { title: 'История одной песни', cover: 'story' },
  { title: 'Новости', cover: 'news' },
  { title: 'Гороскоп', cover: 'horoscope' },
  { title: 'Стихи на каждый день', cover: 'poetry' },
];
const about = [
  'Как морской риф становится домом для множества обитателей, так Риф FM становится местом встречи музыки, слова и людей. Местом, куда хочется возвращаться. Каждый приходит сюда со своей историей и находит что-то своё.',
  'В нашем эфире – эстрада, авторская песня, знакомые и новые голоса. На волне Риф FM можно услышать любимую песню, познакомиться с автором, узнать о книге или картине.',
  'Нам важно, что остаётся с человеком после встречи с произведением.',
];
const editorialEmail = 'info@rif-fm.ru';
const advertisingEmail = 'ads@rif-fm.ru';
const contactCards = [
  {
    title: 'Письмо редакции',
    description: 'Задать вопрос нашей редакции - о программе, произведении или его авторе. Также будем рады вашим комментариям и предложениям.',
    email: editorialEmail,
  },
  {
    title: 'Коллаборации и партнерство',
    description: 'Ролики, спонсорство программ и интеграции в эфир. Медиакит пришлём по запросу.',
    email: advertisingEmail,
  },
  {
    title: 'Наши социальные сети',
    description: 'трансляция эфира, записи концертов и закулисье радио Риф FM.',
  },
];
const nav = [{ id: 'air', title: 'Эфир', icon: 'broadcast' }, { id: 'schedule', title: 'Расписание', icon: 'calendar' }, { id: 'contacts', title: 'Контакты', icon: 'mail' }, { id: 'about', title: 'О радиостанции', icon: 'more' }];
type Details = { title: string; content: ReactNode } | null;

function Header({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 12); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <header className={`header ${scrolled ? 'header--scrolled' : ''}`} data-figma-component="639:18784"><div className="container header__inner"><a className="brand" href="#air" aria-label="Риф FM — на главную"><img src={asset('logo-header.svg')} width="135" height="64" alt="Риф FM" /></a><nav aria-label="Основная навигация">{nav.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'page' : undefined}>{item.title}</a>)}</nav><div className="header__slot" /></div></header>;
}

function Hero({ onOpenPlaylist, playlistOpen }: { onOpenPlaylist: () => void; playlistOpen: boolean }) {
  const { openVideo } = useRadio();
  return <section className="hero" id="air" aria-label="Прямой эфир" data-figma-component="841:24276"><div className="container hero__inner">
    <div className="hero__visual"><img className="hero__art" src={asset('hero-art.svg')} width="661" height="580" alt="Парусник на музыкальных волнах — Риф FM" fetchPriority="high" /><div className="slogan"><span>На волне</span><span>моего сердца</span><span>95,2 fm</span></div></div>
    <div className="hero__body"><div className="hero__top"><div className="hero__info"><div className="hero__heading"><LiveLabel /><Heading first="История одной" script="песни" level={1} /></div><Hosts /></div><NowPlaying onOpenPlaylist={onOpenPlaylist} playlistOpen={playlistOpen} /></div>
      <div className="hero__actions"><PlayControl listen /><Button size="l" icon="video" iconOnly aria-label="Смотреть трансляцию" onClick={openVideo} /></div>
    </div>
  </div></section>;
}

function Socials({ footer = false, onMissing }: { footer?: boolean; onMissing: (name: string) => void }) {
  const networks = footer ? ['vk', 'rutube', 'max', 'dzen'] : ['vk', 'rutube', 'dzen'];
  const names: Record<string,string> = { vk: 'ВКонтакте', rutube: 'Rutube', max: 'MAX', dzen: 'Дзен' };
  return <div className={`socials ${footer ? 'socials--footer' : ''}`}>{networks.map(network => {
    const url = import.meta.env[`VITE_SOCIAL_${network.toUpperCase()}`];
    const child = <Icon name={network} />;
    return url ? <a key={network} className="social-button" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Риф FM — ${names[network]} (откроется в новой вкладке)`}>{child}</a> : <button key={network} className="social-button" aria-label={`Риф FM — ${names[network]}`} onClick={() => onMissing(names[network])}>{child}</button>;
  })}</div>;
}

function Page() {
  const [active, setActive] = useState('air');
  const [moreOpen, setMoreOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [details, setDetails] = useState<Details>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for(const entry of entries) if(entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -60% 0px' });
    nav.forEach(({id}) => { const section = document.getElementById(id); if(section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  const pending = (title: string) => setDetails({ title, content: <p>Этот раздел не входит в прототип главной страницы.</p> });
  const missingSocial = (name: string) => setDetails({ title: `Риф FM в ${name}`, content: <p>Ссылка на официальный канал пока не подключена.</p> });
  const schedule = () => setDetails({ title: 'Дальше в эфире', content: <div className="schedule-list">{programs.map(p => <div key={p.cover}><img src={asset(`cover-${p.cover}.png`)} alt="" /><div><span>16:00 – 17:30</span><strong>{p.title}</strong></div></div>)}</div> });
  return <><a className="skip-link" href="#schedule">К содержимому</a><Header active={active} /><main><Hero onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} />
    <section className="section upcoming" id="schedule" data-figma-component="639:18786"><div className="container"><div className="section__header"><Heading first="Дальше в" script="эфире" /><Button variant="tertiary" iconRight="arrow" className="section__link" onClick={schedule}>Всё расписание</Button></div><div className="program-grid">{programs.map(program => <button className="program-card" key={program.cover} onClick={() => setDetails({ title: program.title, content: <><p className="detail-time">16:00 – 17:30</p>{program.cover === 'story' ? <><Hosts /><p>Как появилась песня, кто спел её первым и почему она до сих пор трогает.</p></> : <p>Слушайте программу в эфире Риф FM.</p>}<Button icon="play" onClick={() => { setDetails(null); document.getElementById('air')?.scrollIntoView({ behavior: 'smooth' }); }}>К эфиру</Button></> })}><img src={asset(`cover-${program.cover}.png`)} alt="" width="324" height="324" loading="lazy" /><span className="time-chip">16:00 – 17:30</span><h3>{program.title}</h3></button>)}</div><Button variant="secondary" iconRight="arrow" className="section__mobile-action" onClick={schedule}>Всё расписание</Button></div></section>
    <div className="ocean-gradient"><section className="section about" id="about" data-figma-component="639:18787"><div className="container about__grid"><div className="about__left"><Heading first="О радиостанции" script="Риф FM" /><img className="about__art" src={asset('about-art.png')} width="920" height="520" alt="Музыкальный маяк среди морских волн" loading="lazy" /></div><div className="about__copy">{about.map(p => <p key={p}>{p}</p>)}<Button iconRight="arrow" onClick={() => setDetails({ title: 'О радиостанции Риф FM', content: <>{about.map(p => <p key={p}>{p}</p>)}</> })}>Подробнее</Button></div><img className="about__birds" src={asset('seagulls.png')} alt="" loading="lazy" /></div></section>
    <section className="section contacts" id="contacts" data-figma-component="639:18788">
      <div className="container">
        <div className="section__header">
          <Heading first="Наши" script="контакты" />
          <Button variant="tertiary" iconRight="arrow" className="section__link" onClick={() => setDetails({
            title: 'Контакты Риф FM',
            content: <>
              <p>Вопросы о программах и ведущих: <a href={`mailto:${editorialEmail}`}>{editorialEmail}</a></p>
              <p>Реклама и сотрудничество: <a href={`mailto:${advertisingEmail}`}>{advertisingEmail}</a></p>
            </>,
          })}>Все контакты</Button>
        </div>
        <div className="contact-grid">
          {contactCards.map(({ title, description, email }) => <article className="contact-card" key={title}>
            <div className="contact-card__text">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            {email
              ? <a href={`mailto:${email}`} className="button button--secondary button--l"><Icon name="mail" />{email}</a>
              : <Socials onMissing={missingSocial} />}
          </article>)}
        </div>
        <Button variant="secondary" iconRight="arrow" className="section__mobile-action" onClick={() => setDetails({
          title: 'Контакты Риф FM',
          content: <>
            <p><a href={`mailto:${editorialEmail}`}>{editorialEmail}</a> — редакция</p>
            <p><a href={`mailto:${advertisingEmail}`}>{advertisingEmail}</a> — сотрудничество</p>
          </>,
        })}>Все контакты</Button>
      </div>
    </section>
    <footer className="footer"><div className="container footer__inner"><a href="#air" className="footer__logo" aria-label="Риф FM — к эфиру"><img src={asset('logo-footer.svg')} alt="Риф FM — на волне моего сердца, 95,2 FM" width="280" height="280" loading="lazy" /></a><div className="footer__right"><div className="footer__columns"><div><h3>Радио</h3><a href="#air">Слушать эфир</a><a href="#schedule">Расписание</a></div><div><h3>О нас</h3><a href="#about">О радиостанции</a><a href="#contacts">Контакты</a><button onClick={() => pending('Рекламодателям')}>Рекламодателям</button><button onClick={() => pending('Партнёрам')}>Партнёрам</button></div><div><h3>Документы</h3>{['Политика конфиденциальности','Пользовательские документы','Обработка персональных данных','Cookie'].map(label => <button key={label} onClick={() => pending(label)}>{label}</button>)}</div></div><div className="footer__bottom"><p>© 2026 Радиостанция Риф FM · 95,2 FM</p><Socials footer onMissing={missingSocial} /></div></div></div></footer>
    </div><div className="seabed"><img src={asset('seabed.png')} width="1920" height="194" alt="" loading="lazy" /></div>
  </main><DesktopPlayer onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} /><MobileBar active={(moreOpen || active === 'about' ? 'more' : active) as MobileTab} moreOpen={moreOpen} onMore={() => setMoreOpen(true)} onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} />
  {moreOpen && <Dialog label="Ещё" onClose={() => setMoreOpen(false)} className="more-sheet"><div className="sheet-handle" /><div className="details__header"><h2>Ещё</h2><Button variant="tertiary" icon="chevron-down" iconOnly aria-label="Закрыть меню" onClick={() => setMoreOpen(false)} /></div><a href="#about" onClick={() => setMoreOpen(false)}>О радиостанции</a>{['Рекламодателям','Партнёрам','Документы'].map(label => <button key={label} onClick={() => { setMoreOpen(false); pending(label); }}>{label}<Icon name="arrow" /></button>)}</Dialog>}
  {details && <Dialog label={details.title} onClose={() => setDetails(null)} className="details"><div className="details__header"><h2>{details.title}</h2><Button variant="secondary" icon="chevron-down" iconOnly aria-label="Закрыть" onClick={() => setDetails(null)} /></div><div className="details__body">{details.content}</div></Dialog>}
  <VideoOverlay />{playlistOpen && <PlaylistOverlay onClose={() => setPlaylistOpen(false)} />}</>;
}

export function App() { return <PrototypeVersionProvider><RadioProvider><Page /></RadioProvider></PrototypeVersionProvider>; }
