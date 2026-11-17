import { Fragment, useState, type CSSProperties, type ReactNode } from 'react';
import { Avatar, Button, Dialog, Heading, Icon } from '../components/ui';
import { PlaylistFilter } from '../components/playlist-filter';
import { asset } from '../assets';
import { articleCover, byId, directions, episodePrograms, items, pick, programs, sections, tracks, type Item } from './data';
import { articleReferences, articles, searchMusic, type ArticleBlock, type ArticleLink } from './articles';
import { musicHref as href, type MusicRoute } from './navigation';
import { type Clip, type RecordingState } from './recordings';

const articleCoverStyle = {
  '--article-cover-background': `url("${asset('cover-article-background.webp')}")`,
} as CSSProperties;

const typeNames: Record<string, string> = Object.fromEntries(sections.map(({ id, label }) => [id, label]));
const editorialIds = ['studio-story', 'sade-story', 'words-story'];
const relatedGroups = [
  { type: 'episode', title: 'Записи эфиров' },
  { type: 'article', title: 'Читайте также' },
  { type: 'program', title: 'Программы' },
  { type: 'artist', title: 'Артисты и гости' },
  { type: 'release', title: 'Релизы' },
];
const catalogLabels: Record<string, string> = {
  release: 'Все релизы', program: 'Все программы', episode: 'Все записи',
  artist: 'Все артисты', article: 'Все статьи',
};
const formatOptions = [
  { id: '', label: 'Аудио и видео' },
  { id: 'audio', label: 'Аудио' },
  { id: 'video', label: 'Видео' },
];

const broadcastDate = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Moscow' });
const formatBroadcastDate = (date: string) => broadcastDate.format(new Date(date)).replace(/\s+г\.(?=\s|$)/u, '');
const photos = [
  { image: 'video-poster.png', alt: 'Кадр разговора у микрофонов', caption: 'Разговор в студии. Кадр из макета эфира.', position: 'center' },
  { image: 'studio.jpg', alt: 'Микрофон и виниловая пластинка в радиостудии', caption: 'У микрофона. Иллюстрация к фотоистории.', position: 'center' },
  { image: 'studio.jpg', alt: 'Проигрыватель и виниловая пластинка', caption: 'Крупный план проигрывателя перед эфиром.', position: 'left bottom', detail: true },
];

function cardMeta(item: Item) {
  if (item.type === 'episode') return item.format === 'video' ? 'Видео' : 'Аудио';
  if (item.type === 'article') return item.id.endsWith('-news') ? 'Новости' : item.id === 'studio-story' ? 'Фотоистория' : 'Статья';
  return item.direction;
}

function MusicCover({ item, loading }: { item: Item; loading?: 'lazy' }) {
  const style = item.coverScale === undefined ? undefined : { scale: item.coverScale };
  return <img src={asset(item.image)} alt="" loading={loading} style={style}/>;
}

function MediaCard({ item, direction = '', meta = cardMeta(item) }: { item: Item; direction?: string; meta?: string }) {
  return <a className={'music-card music-card--' + item.type} href={href('detail', item.id, direction)}>
    <div className="music-card__art">
      <MusicCover item={item} loading="lazy"/>
      {item.type === 'program' && <span aria-hidden="true" className="program-title">{item.title}</span>}
      {item.type === 'episode' && <span className="media-chip"><Icon name={item.format === 'video' ? 'video' : 'play'}/>{item.format === 'video' ? 'Видео' : 'Аудио'}</span>}
    </div>
    <div className="card-copy">
      {(item.type === 'article' || item.type === 'release') && <span className="eyebrow">{meta}</span>}
      <h3>{item.title}</h3>
      <p>{item.type === 'article' ? item.description : item.subtitle}</p>
    </div>
  </a>;
}

function ShelfHeading({ title, script, more, moreLabel }: {
  title: string; script?: string; more?: string; moreLabel?: string;
}) {
  const content = script ? <Heading first={title} script={script}/> : <h2>{title}</h2>;
  const heading = [title, script].filter(Boolean).join(' ');
  const linkLabel = [heading, moreLabel].filter(Boolean).join('. ');
  return <div className="shelf-heading">
    {more ? <a className="shelf-heading__link" href={more} aria-label={linkLabel}>
      {content}
      <Icon name="chevron-down" className="shelf-heading__chevron"/>
    </a> : content}
  </div>;
}

function Shelf({ title, script, list, more, moreLabel, direction = '', desktopColumns }: {
  title: string; script?: string; list: Item[]; more?: string; moreLabel?: string;
  direction?: string; desktopColumns?: 5 | 6;
}) {
  if (!list.length) return null;
  const preview = more ? list.slice(0, desktopColumns ?? 4) : list;
  const heading = [title, script].filter(Boolean).join(' ');
  return <section className="music-section" aria-label={heading}>
    <ShelfHeading title={title} script={script} more={more} moreLabel={moreLabel}/>
    <div className="music-shelf" data-single={preview.length === 1 || undefined} data-desktop-columns={desktopColumns}>
      {preview.map((item) => <MediaCard key={item.id} item={item} direction={direction}/>)}
    </div>
  </section>;
}

function EpisodeList({ title, episodes, cover, direction }: { title: string; episodes: Item[]; cover: string; direction: string }) {
  if (!episodes.length) return null;
  return <section className="music-section" aria-label={title}>
    <div className="shelf-heading"><h2>{title}</h2></div>
    <ul className="episode-list" role="list">
      {episodes.map((episode) => <li key={episode.id}>
        <a className="episode-list__link" href={href('detail', episode.id, direction)}>
          <img className="episode-list__cover" src={asset(cover)} alt="" loading="lazy"/>
          <div className="episode-list__copy">
            <h3>{episode.guest ? `В гостях — ${episode.guest}` : episode.title}</h3>
            {episode.airedAt && <time dateTime={episode.airedAt}>{formatBroadcastDate(episode.airedAt)}</time>}
          </div>
        </a>
      </li>)}
    </ul>
  </section>;
}

function EpisodeRelatedSections({ item, program, guest, direction }: { item: Item; program?: Item; guest?: Item; direction: string }) {
  const related = pick(item.related ?? []);
  const artists = related.filter((entry) => entry.type === 'artist' && entry.id !== guest?.id);
  if (guest) artists.unshift(guest);

  return <>
    {program && <EpisodeList title="Другие выпуски" episodes={pick((programs[program.id]?.episodes ?? []).filter((id) => id !== item.id))} cover={program.image} direction={direction}/>}
    <Shelf title="Читайте также" list={related.filter((entry) => entry.type === 'article')} direction={direction}/>
    <Shelf title="Артисты и гости" list={artists} direction={direction}/>
  </>;
}

function RelatedSections({ item, direction }: { item: Item; direction: string }) {
  const related = pick(item.related ?? []);
  if (!related.length) return null;
  return relatedGroups.map(({ type, title }) => (
    <Shelf key={type} title={title} list={related.filter((entry) => entry.type === type)} direction={direction}/>
  ));
}

function Directions({ active }: { active?: string }) {
  return <nav className="directions" aria-label="Музыкальные направления">
    {directions.map((direction) => <a key={direction.id} className={'direction-tile tone-' + direction.id} aria-current={active === direction.id ? 'page' : undefined} href={href('direction', direction.id)}>
      <img src={asset(direction.cover)} alt=""/>
      <span className="direction-label"><strong>{direction.title}</strong><small>{direction.short}</small></span>
    </a>)}
  </nav>;
}

function TrackList({ item }: { item: Item }) {
  const list = tracks[item.id] ?? [];
  return <section className="tracklist music-section">
    <div className="shelf-heading"><h2>Трек-лист</h2></div>
    <ol role="list">{list.map(({ title, duration }) => <li key={title} className="track">
      <span className="track-cover"><MusicCover item={item}/></span><span><strong>{title}</strong><small>{item.subtitle}</small></span>
      {duration && <span className="secondary">{duration}</span>}
    </li>)}</ol>
  </section>;
}

function Gallery() {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const photo = photos[index];
  const photoImg = <img className={photo.detail ? 'gallery-detail' : ''} src={asset(photo.image)} alt={photo.alt} style={{ objectPosition: photo.position }}/>;
  return <figure className="gallery">
    <button type="button" className="gallery-view" onClick={() => setZoom(true)} aria-label={'Увеличить фото. ' + photo.alt}>{photoImg}</button>
    <figcaption className="gallery-footer" aria-live="polite">{photo.caption}</figcaption>
    <div className="gallery-thumbnails" role="group" aria-label="Кадры галереи">
      {photos.map((frame, i) => <button key={frame.alt} type="button" aria-pressed={index === i} aria-label={`Фото ${i + 1}. ${frame.alt}`} onClick={() => setIndex(i)}>
        <img className={frame.detail ? 'gallery-detail' : ''} src={asset(frame.image)} alt=""/>
      </button>)}
    </div>
    {zoom && <Dialog label="Галерея" className="gallery-dialog" onClose={() => setZoom(false)}>
      <div className="gallery-modal-head"><span>{index + 1} / {photos.length}</span><Button variant="secondary" icon="close" iconOnly aria-label="Закрыть галерею" onClick={() => setZoom(false)}/></div>
      {photoImg}
      <p>{photo.caption}</p>
    </Dialog>}
  </figure>;
}

function VideoPreview({ poster = 'video-poster.png' }: { poster?: string }) {
  const [showNotice, setShowNotice] = useState(false);
  return <div className="video-preview">
    <div className="video-frame video-preview__frame">
      <img src={asset(poster)} alt="" loading="lazy"/>
      <Button type="button" className="video-frame__play" size="l" icon="play" iconOnly aria-label="Воспроизвести видео" onClick={() => setShowNotice(true)}/>
    </div>
    <p className="secondary video-preview__status" role="status">{showNotice && 'Видео пока не подключено'}</p>
  </div>;
}

function ClipButton({ clip, current, playing, play }: { clip: Clip; current: Clip | null; playing: boolean; play: (clip: Clip) => void }) {
  const active = current?.id === clip.id && playing;
  return <ArticleObjectCard {...clip} subtitle={`${clip.subtitle} · демо`} action={
    <Button className="object-action" variant="secondary" icon={active ? 'pause' : 'play'} aria-label={active ? 'Пауза' : 'Слушать аудиофрагмент'} onClick={() => play(clip)}>{active ? 'Пауза' : 'Слушать'}</Button>
  }/>;
}

function ArticleObjectCard({ image, portrait, typeLabel, title, subtitle, action }: Pick<ArticleLink, 'image' | 'portrait' | 'title' | 'subtitle'> & { typeLabel?: string; action: ReactNode }) {
  return <div className="object-card">
    <img className={`object-cover${portrait ? ' object-cover--portrait' : ''}${image === articleCover ? ' object-cover--article' : ''}`} src={asset(image)} alt="" loading="lazy"/>
    <span className="object-copy">
      {typeLabel && <span className="eyebrow">{typeLabel}</span>}
      <strong>{title}</strong>
      <small>{subtitle}</small>
    </span>
    {action}
  </div>;
}

function ArticleObjectLink({ entry, external = false }: { entry: ArticleLink; external?: boolean }) {
  return <ArticleObjectCard {...entry} action={
    <a className="button button--secondary button--m object-action" href={entry.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{entry.action}</a>
  }/>;
}

function ArticleView({ item, direction, breadcrumbs }: {
  item: Item; direction: string; breadcrumbs: ReactNode;
}) {
  const article = articles[item.id];
  if (!article) return null;

  function renderBlock(block: ArticleBlock) {
    if (typeof block === 'string') return <p>{block}</p>;
    if ('quote' in block) return <blockquote><p>{block.quote}</p></blockquote>;
    if ('reference' in block) return <ArticleObjectLink entry={articleReferences[block.reference]} external/>;
    if ('media' in block) return block.media === 'gallery' ? <Gallery/> : <VideoPreview/>;

    const linked = byId(block.item);
    return linked && <ArticleObjectLink entry={{
      typeLabel: linked.type === 'release' ? 'Альбом' : typeNames[linked.type],
      title: linked.title,
      subtitle: linked.subtitle,
      image: linked.image,
      url: href('detail', linked.id, direction),
      action: 'Открыть',
    }}/>;
  }

  return <article className="article-page">
    <div className="article-masthead">
      {breadcrumbs}
      <header className="article-heading">
        <h1>{item.title}</h1>
        <p>{item.subtitle}</p>
      </header>
      <figure className="article-cover">
        <img src={asset(item.image)} alt=""/>
      </figure>
    </div>
    {article.chapters.length > 0 && <nav className="article-toc" aria-label="Оглавление">
      <strong>Оглавление</strong>
      <ul role="list">{article.chapters.map((chapter, i) => <li key={chapter.title}><button type="button" onClick={() => {
        const target = document.getElementById('chapter-' + i);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: 'start' });
      }}>{chapter.title}</button></li>)}</ul>
    </nav>}
    <div className="article-body">
      {article.chapters.map((chapter, i) => <section key={chapter.title} className="article-chapter" id={'chapter-' + i} tabIndex={-1}>
        <h2>{chapter.title}</h2>
        {chapter.blocks.map((block, index) => <Fragment key={index}>{renderBlock(block)}</Fragment>)}
      </section>)}
    </div>
  </article>;
}

function CoverFeature({ list, direction }: { list: Item[]; direction: string }) {
  const [story, ...otherStories] = list;
  if (!story) return null;
  const leadMeta = [cardMeta(story), articles[story.id]?.time].filter(Boolean).join(' · ');
  return <section className="music-section editor-section" aria-label="Выбор редакции">
    <ShelfHeading title="Выбор" script="редакции" more={href('catalog', 'article', direction)} moreLabel="Все статьи"/>
    <div className="music-shelf editorial-shelf">
      {list.map((item) => {
        const meta = item === story ? leadMeta : [item.direction, articles[item.id]?.time].filter(Boolean).join(' · ');
        return <MediaCard key={item.id} item={item} direction={direction} meta={meta}/>;
      })}
    </div>
    <div className="feature-grid">
      <a className="feature-main" href={href('detail', story.id, direction)}>
        <img src={asset(story.image)} alt=""/>
        <div className="feature-copy"><span>{leadMeta}</span><h3>{story.title}</h3><p>{story.description}</p><span className="feature-link">Читать</span></div>
      </a>
      {otherStories.length > 0 && <div className="feature-side">
        {otherStories.map((item) => <a key={item.id} href={href('detail', item.id, direction)}>
          <img src={asset(item.image)} alt=""/>
          <span><small>{item.direction} · {articles[item.id]?.time}</small><strong>{item.title}</strong><span className="feature-summary">{item.description}</span></span>
        </a>)}
      </div>}
    </div>
  </section>;
}

export function Music({ route, recordings }: {
  route: MusicRoute;
  recordings: RecordingState;
}) {
  const [format, setFormat] = useState('');
  const [guest, setGuest] = useState('');
  const direction = directions.find((entry) => entry.id === route.direction);
  const directionId = direction?.id ?? '';
  const item = byId(route.id);
  const section = sections.find((entry) => entry.id === route.id);
  const all = direction ? items.filter((entry) => entry.direction === direction.title || entry.extraDirections?.includes(direction.title)) : items;
  const showOverview = route.page === 'home' || (route.page === 'direction' && direction !== undefined);

  const audio = (clip: Clip) => <ClipButton clip={clip} current={recordings.current} playing={recordings.playing} play={recordings.play}/>;
  const filterRecords = all.filter((entry) => entry.type === 'episode');
  const guests = [...new Set(filterRecords.flatMap((entry) => entry.guest ? [entry.guest] : []))];
  const catalog = all.filter((entry) => entry.type === route.id && (!format || entry.format === format) && (!guest || entry.guest === guest));
  const programme = item && programs[item.id];
  const isRelease = item?.type === 'release';
  const isEpisode = item?.type === 'episode';
  const episodeProgramId = item && episodePrograms[item.id];
  const episodeProgram = episodeProgramId ? byId(episodeProgramId) : undefined;
  const guestProfile = item?.guest ? items.find((entry) => entry.type === 'artist' && entry.title === item.guest) : undefined;
  const articlePage = route.page === 'detail' && item?.type === 'article';
  const breadcrumbs = route.page !== 'home' && <nav className="breadcrumbs" aria-label="Хлебные крошки">
    <a href={href()}>Музыка</a><span aria-hidden="true">/</span>
    {direction && (route.page === 'catalog' || articlePage) && <><a href={href('direction', directionId)}>{direction.title}</a><span aria-hidden="true">/</span></>}
    <span aria-current="page">{route.page === 'direction' ? direction?.title : route.page === 'catalog' ? [section?.title, section?.script].filter(Boolean).join(' ') : (item && typeNames[item.type])}</span>
  </nav>;
  const overviewTitle = direction?.title ?? 'Вся наша музыка';
  const scriptStart = overviewTitle.lastIndexOf(' ') + 1;

  return (
    <main className={`container music-main music-main--${route.page}`} id="music-content" tabIndex={-1} style={articleCoverStyle}>
      {!articlePage && breadcrumbs}

      {showOverview && <>
        <header className="music-title">
          <Heading first={overviewTitle.slice(0, scriptStart).trimEnd()} script={overviewTitle.slice(scriptStart)} level={1}/>
          <p>{direction?.description ?? 'Знакомые голоса, новые имена и истории за любимыми песнями.'}</p>
        </header>
        <Directions active={directionId}/>
        <CoverFeature list={pick(editorialIds).filter((entry) => all.includes(entry))} direction={directionId}/>
        {sections.map((group) => <Shelf key={group.id} title={group.title} script={group.script}
          list={all.filter((entry) => entry.type === group.id && !editorialIds.includes(entry.id))}
          direction={directionId} more={href('catalog', group.id, directionId)} moreLabel={catalogLabels[group.id]}
          desktopColumns={group.desktopColumns}/>)}
      </>}

      {route.page === 'catalog' && section && <>
        <header className="music-title"><Heading first={section.title} script={section.script} level={1} size={2}/></header>
        {section.id === 'episode' && <div className="playlist-filters catalog-filters" role="group" aria-label="Фильтры записей эфиров">
          <PlaylistFilter id="recordings-format" label="Формат" showLabel value={format} options={formatOptions} onChange={setFormat}/>
          <PlaylistFilter id="recordings-guest" label="Гость" showLabel value={guest}
            options={[{ id: '', label: 'Все гости' }, ...guests.map(name => ({ id: name, label: name }))]} onChange={setGuest}/>
        </div>}
        {catalog.length ? <div className="catalog-grid" data-desktop-columns={section.desktopColumns}>
          {catalog.map((entry) => <MediaCard key={entry.id} item={entry} direction={directionId}/>)}
        </div> : <div className="empty">
          <h2>Материалы не найдены</h2>
          {section.id === 'episode' && (format || guest) && <Button variant="secondary" onClick={() => { setFormat(''); setGuest(''); }}>Сбросить фильтры</Button>}
        </div>}
      </>}

      {route.page === 'detail' && item && <>
        {item.type === 'article' ? <ArticleView key={item.id} item={item} direction={directionId} breadcrumbs={breadcrumbs}/> : <>
          <header className={'detail-hero detail-hero--' + item.type}>
            <div className="detail-art"><MusicCover item={item}/>{item.type === 'program' && <span aria-hidden="true" className="program-title">{item.title}</span>}</div>
            <div className="detail-copy">
              <div className="detail-heading">
                <h1>{item.title}</h1>
                <p className="detail-subtitle">{programme?.schedule ?? episodeProgram?.title ?? item.subtitle}</p>
              </div>
              <p>{item.description}</p>
              {programme?.host && <div className="hosts">
                <div className="hosts__avatars" aria-hidden="true"><Avatar src={asset('host.png')} name={programme.host}/></div>
                <div className="hosts__names"><span>Ведущий</span><strong>{programme.host}</strong></div>
              </div>}
              {isRelease && <a className="button button--primary button--m" href={searchMusic(item.subtitle + ' ' + item.title)} target="_blank" rel="noreferrer">Открыть в Яндекс Музыке</a>}
              {isEpisode && (item.host || item.guest) && <div className="episode-credits">
                {item.host && <div className="credit"><Avatar src={asset('host.png')} name={item.host}/><span>Ведущий<strong>{item.host}</strong></span></div>}
                {item.guest && <a className="credit" href={guestProfile && href('detail', guestProfile.id, directionId)}>
                  <Avatar src={guestProfile && asset(guestProfile.image)} name={item.guest}/><span>Гость<strong>{item.guest}</strong></span>
                </a>}
              </div>}
            </div>
          </header>
          {isRelease && <TrackList item={item}/>}
          {isEpisode && <section className="episode-media music-section">
            <div className="shelf-heading"><h2>{item.format === 'video' ? 'Видео выпуска' : 'Аудиозапись'}</h2></div>
            {item.format === 'video' ? <VideoPreview poster={item.image}/> : audio({ id: item.id, title: item.title, subtitle: 'Фрагмент записи эфира', image: item.image })}
          </section>}
        </>}
        {programme ? <>
          <EpisodeList title="Последние выпуски" episodes={pick(programme.episodes)} cover={item.image} direction={directionId}/>
          <Shelf title="Гости программы" list={pick(programme.guests)} direction={directionId}/>
          <Shelf title="Статьи, новости и подборки" list={pick(programme.reads)} direction={directionId}/>
        </> : isEpisode ? <EpisodeRelatedSections item={item} program={episodeProgram} guest={guestProfile} direction={directionId}/> : item.type === 'artist' ? <>
          <Shelf title="Новости и статьи" list={pick(item.related ?? []).filter((entry) => entry.type === 'article')} direction={directionId}/>
          <Shelf title="Записи эфиров" list={pick(item.related ?? []).filter((entry) => entry.type === 'episode')} direction={directionId}/>
          <Shelf title="Музыка артиста" list={pick(item.related ?? []).filter((entry) => entry.type === 'release')} direction={directionId}/>
          <Shelf title="Программы" list={pick(item.related ?? []).filter((entry) => entry.type === 'program')} direction={directionId}/>
        </> : <RelatedSections item={item} direction={directionId}/>}
      </>}

      {((route.page === 'detail' && !item) || (route.page === 'direction' && !direction) || (route.page === 'catalog' && !section)) && <div className="empty"><h1>Страница не найдена</h1><a href={href()}>Вернуться к музыке</a></div>}
    </main>
  );
}
