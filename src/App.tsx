import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { asset } from './assets';
import { Header } from './components/header';
import { Footer, Seabed, Socials } from './components/footer';
import { Button, Dialog, Heading, Hosts, Icon, LiveLabel } from './components/ui';
import { DesktopPlayer, NowPlaying, PlayControl, RadioProvider, useRadio, VideoOverlay } from './components/player';
import { PlaylistOverlay } from './components/playlist';
import { MobileBar } from './components/mobile-bar';
import { WriteToAir } from './components/write-to-air';
import { Music } from './music/music';
import { guestsHref, isGuestCatalog, isMusicOverview, musicHref, programsHref, readMusicRoute, stationSection } from './music/navigation';
import { RecordingPlayer, useRecordingPlayer } from './music/recordings';

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
const socialLinks = {
  vk: import.meta.env.VITE_SOCIAL_VK,
  rutube: import.meta.env.VITE_SOCIAL_RUTUBE,
  max: import.meta.env.VITE_SOCIAL_MAX,
  dzen: import.meta.env.VITE_SOCIAL_DZEN,
};
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
type Details = { title: string; content: ReactNode } | null;

function Hero({ onOpenPlaylist, playlistOpen }: { onOpenPlaylist: () => void; playlistOpen: boolean }) {
  const { openVideo } = useRadio();
  return <section className="hero" id="air" aria-label="Прямой эфир" data-figma-component="841:24276"><div className="container hero__inner">
    <div className="hero__visual"><img className="hero__art" src={asset('hero-art.svg')} width="661" height="580" alt="Парусник на музыкальных волнах — Риф FM" fetchPriority="high" /><div className="slogan"><span>На волне</span><span>моего сердца</span><span>95,2 fm</span></div></div>
    <div className="hero__body"><div className="hero__top"><div className="hero__info"><div className="hero__heading"><LiveLabel /><Heading first="История одной" script="песни" level={1} /></div><Hosts /></div><NowPlaying onOpenPlaylist={onOpenPlaylist} playlistOpen={playlistOpen} /></div>
      <div className="hero__actions"><PlayControl listen /><Button size="l" icon="video" iconOnly aria-label="Смотреть трансляцию" onClick={openVideo} /></div>
    </div>
  </div></section>;
}

function Page() {
  const [hash, setHash] = useState(() => location.hash);
  const previousHash = useRef(hash);
  const musicPositions = useRef(new Map<string, { destination: string; top: number }>());
  const musicRoute = readMusicRoute(hash);
  const filtersBelowTitle = new URLSearchParams(location.search).get('filters') === 'below';
  const musicOverview = isMusicOverview(musicRoute);
  const guestCatalog = isGuestCatalog(musicRoute);
  const activeSection = stationSection(musicRoute);
  const { pause: pauseLive } = useRadio();
  const recordings = useRecordingPlayer(pauseLive);
  const { clear: clearRecording } = recordings;
  const recordPlayer = musicRoute && recordings.current ? <RecordingPlayer recordings={recordings} /> : undefined;
  const [moreOpen, setMoreOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [writeToAirOpen, setWriteToAirOpen] = useState(false);
  const [details, setDetails] = useState<Details>(null);

  useEffect(() => {
    const updateHash = () => setHash(location.hash);
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useLayoutEffect(() => {
    const from = previousHash.current;
    if (from === hash) return;
    previousHash.current = hash;
    const fromRoute = readMusicRoute(from);
    if (musicRoute) {
      const position = musicPositions.current.get(hash);
      const returning = position?.destination === from;
      const main = document.getElementById('music-content');
      const switchingChips = (musicOverview && isMusicOverview(fromRoute)) || (guestCatalog && isGuestCatalog(fromRoute));
      if (switchingChips && main?.querySelector('.directions--switcher')?.contains(document.activeElement)) return;
      const clicked = returning && [...(main?.querySelectorAll('a') ?? [])]
        .find((link) => link.hash === from && link.getClientRects().length > 0);
      window.scrollTo({ top: returning ? position.top : 0, behavior: 'instant' });
      (clicked || main)?.focus({ preventScroll: true });
    } else if (fromRoute) {
      clearRecording();
      const section = document.getElementById(hash.slice(1));
      if (section) section.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash, clearRecording, guestCatalog, musicOverview, musicRoute]);

  const rememberMusicPosition = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hash === hash) return;
    const destination = readMusicRoute(link.hash);
    if (guestCatalog && isGuestCatalog(destination)) return;
    if (destination?.page === 'catalog' || destination?.page === 'detail') {
      musicPositions.current.set(hash, { destination: link.hash, top: window.scrollY });
    }
  };

  const pending = (title: string) => setDetails({ title, content: <p>Этот раздел не входит в прототип главной страницы.</p> });
  const missingSocial = (name: string) => setDetails({ title: `Риф FM в ${name}`, content: <p>Ссылка на официальный канал пока не подключена.</p> });
  const footer = <Footer socialLinks={socialLinks} onPending={pending} onMissingSocial={missingSocial} />;
  const schedule = () => setDetails({ title: 'Дальше в эфире', content: <div className="schedule-list">{programs.map(p => <div key={p.cover}><img src={asset(`cover-${p.cover}.png`)} alt="" /><div><span>16:00 – 17:30</span><strong>{p.title}</strong></div></div>)}</div> });
  const openWriteToAir = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus({ preventScroll: true });
    setWriteToAirOpen(true);
  };
  return <><a className="skip-link" href={musicRoute ? '#music-content' : '#schedule'} onClick={musicRoute ? (event) => {
    event.preventDefault();
    const content = document.getElementById('music-content');
    content?.focus({ preventScroll: true });
    content?.scrollIntoView();
  } : undefined}>К содержимому</a>
  <Header musicHref={musicHref()} programsHref={programsHref} guestsHref={guestsHref} activeSection={activeSection} writeToAirOpen={writeToAirOpen} onWriteToAir={openWriteToAir} />
  {musicRoute ? <>
    <div className="music-page ocean-gradient" onClickCapture={rememberMusicPosition}>
      <Music key={musicOverview ? musicHref() : guestCatalog ? guestsHref : hash} route={musicRoute} recordings={recordings} filtersBelowTitle={filtersBelowTitle} />
      {footer}
    </div>
    <Seabed />
  </> : <main><Hero onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} />
    <section className="section upcoming" id="schedule" data-figma-component="639:18786"><div className="container"><div className="section__header"><Heading first="Дальше в" script="эфире" /><Button variant="tertiary" iconRight="chevron-right" className="section__link" onClick={schedule}>Всё расписание</Button></div><div className="program-grid">{programs.map(program => <button className="program-card" key={program.cover} onClick={() => setDetails({ title: program.title, content: <><p className="detail-time">16:00 – 17:30</p>{program.cover === 'story' ? <><Hosts /><p>Как появилась песня, кто спел её первым и почему она до сих пор трогает.</p></> : <p>Слушайте программу в эфире Риф FM.</p>}<Button icon="play" onClick={() => { setDetails(null); document.getElementById('air')?.scrollIntoView({ behavior: 'smooth' }); }}>К эфиру</Button></> })}><img src={asset(`cover-${program.cover}.png`)} alt="" width="324" height="324" loading="lazy" /><span className="time-chip">16:00 – 17:30</span><h3>{program.title}</h3></button>)}</div><Button variant="secondary" iconRight="chevron-right" className="section__mobile-action" onClick={schedule}>Всё расписание</Button></div></section>
    <div className="ocean-gradient"><section className="section about" id="about" data-figma-component="639:18787"><div className="container about__grid"><div className="about__left"><Heading first="О радиостанции" script="Риф FM" /><img className="about__art" src={asset('about-art.png')} width="920" height="520" alt="Музыкальный маяк среди морских волн" loading="lazy" /></div><div className="about__copy">{about.map(p => <p key={p}>{p}</p>)}<Button iconRight="chevron-right" onClick={() => setDetails({ title: 'О радиостанции Риф FM', content: <>{about.map(p => <p key={p}>{p}</p>)}</> })}>Подробнее</Button></div><img className="about__birds" src={asset('seagulls.png')} alt="" loading="lazy" /></div></section>
    <section className="section contacts" id="contacts" data-figma-component="639:18788">
      <div className="container">
        <div className="section__header">
          <Heading first="Наши" script="контакты" />
          <Button variant="tertiary" iconRight="chevron-right" className="section__link" onClick={() => setDetails({
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
              : <Socials links={socialLinks} onMissing={missingSocial} />}
          </article>)}
        </div>
        <Button variant="secondary" iconRight="chevron-right" className="section__mobile-action" onClick={() => setDetails({
          title: 'Контакты Риф FM',
          content: <>
            <p><a href={`mailto:${editorialEmail}`}>{editorialEmail}</a> — редакция</p>
            <p><a href={`mailto:${advertisingEmail}`}>{advertisingEmail}</a> — сотрудничество</p>
          </>,
        })}>Все контакты</Button>
      </div>
    </section>
    {footer}
    </div><Seabed />
  </main>}
  {recordings.audio}
  {recordPlayer ? <div className="music-player-wrap music-player-wrap--desktop">{recordPlayer}</div> : <DesktopPlayer onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} />}
  <MobileBar musicHref={musicHref()} activeSection={activeSection} miniPlayer={recordPlayer} moreOpen={moreOpen} onMore={() => setMoreOpen(true)} writeToAirOpen={writeToAirOpen} onWriteToAir={openWriteToAir} onOpenPlaylist={() => setPlaylistOpen(true)} playlistOpen={playlistOpen} />
  {moreOpen && <Dialog label="Ещё" onClose={() => setMoreOpen(false)} className="more-sheet">
    <div className="sheet-handle" />
    <div className="details__header"><h2>Ещё</h2><Button variant="tertiary" icon="chevron-down" iconOnly aria-label="Закрыть меню" onClick={() => setMoreOpen(false)} /></div>
    <a href={programsHref} aria-current={activeSection === 'programs' ? 'page' : undefined} onClick={() => setMoreOpen(false)}>Программы<Icon name="chevron-right" /></a>
    <a href={guestsHref} aria-current={activeSection === 'guests' ? 'page' : undefined} onClick={() => setMoreOpen(false)}>Гости<Icon name="chevron-right" /></a>
    <a href="#about" onClick={() => setMoreOpen(false)}>О радиостанции</a>
    <a href="#contacts" onClick={() => setMoreOpen(false)}>Контакты</a>
    {['Рекламодателям','Партнёрам','Документы'].map(label => <button key={label} onClick={() => { setMoreOpen(false); pending(label); }}>{label}<Icon name="chevron-right" /></button>)}
  </Dialog>}
  {details && <Dialog label={details.title} onClose={() => setDetails(null)} className="details"><div className="details__header"><h2>{details.title}</h2><Button variant="secondary" icon="chevron-down" iconOnly aria-label="Закрыть" onClick={() => setDetails(null)} /></div><div className="details__body">{details.content}</div></Dialog>}
  {writeToAirOpen && <WriteToAir onClose={() => setWriteToAirOpen(false)} />}
  <VideoOverlay />{playlistOpen && <PlaylistOverlay onClose={() => setPlaylistOpen(false)} />}</>;
}

export function App() { return <RadioProvider><Page /></RadioProvider>; }
