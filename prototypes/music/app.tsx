import { useEffect, useState, type MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { Footer, Seabed } from '../../src/components/footer';
import { Header } from '../../src/components/header';
import { Button, Dialog, Icon } from '../../src/components/ui';
import { WriteToAir } from '../../src/components/write-to-air';
import { Music } from '../../src/music/music';
import { musicHref, readMusicRoute } from '../../src/music/navigation';
import { RecordingPlayer, useRecordingPlayer } from '../../src/music/recordings';

const stationUrl = 'https://pavelstepanov888-ux.github.io/rif-fm/?version=3';

function App() {
  const [hash, setHash] = useState(() => location.hash);
  const [write, setWrite] = useState(false);
  const [details, setDetails] = useState<{ title: string; message: string } | null>(null);
  const recordings = useRecordingPlayer();
  const route = readMusicRoute(hash) ?? readMusicRoute(musicHref())!;

  useEffect(() => {
    const updateHash = () => {
      setHash(location.hash);
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() => document.getElementById('music-content')?.focus({ preventScroll: true }));
    };
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  function openWrite(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus({ preventScroll: true });
    setWrite(true);
  }

  return <>
    <Header stationUrl={stationUrl} musicHref={musicHref()} musicActive writeToAirOpen={write} onWriteToAir={openWrite} />
    <div className="music-page">
      <Music key={hash} route={route} recordings={recordings} />
      <Footer stationUrl={stationUrl}
        onPending={(title) => setDetails({ title, message: 'Этот раздел не входит в прототип главной страницы.' })}
        onMissingSocial={(name) => setDetails({ title: `Риф FM в ${name}`, message: 'Ссылка на официальный канал пока не подключена.' })} />
    </div>
    <Seabed />
    {recordings.audio}
    <div className="music-player-wrap">
      <RecordingPlayer recordings={recordings} stationUrl={stationUrl} />
      <nav className="music-mobile-nav" aria-label="Мобильная навигация">
        <a href={stationUrl}><Icon name="tab-broadcast"/>Эфир</a>
        <a aria-current="page" href={musicHref()}><Icon name="playlist"/>Музыка</a>
        <button onClick={openWrite}><Icon name="chat-bubble"/>Написать</button>
      </nav>
    </div>
    {details && <Dialog label={details.title} onClose={() => setDetails(null)} className="details">
      <div className="details__header"><h2>{details.title}</h2><Button variant="secondary" icon="chevron-down" iconOnly aria-label="Закрыть" onClick={() => setDetails(null)} /></div>
      <div className="details__body"><p>{details.message}</p></div>
    </Dialog>}
    {write && <WriteToAir onClose={() => setWrite(false)} />}
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
