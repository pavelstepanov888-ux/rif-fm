import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Avatar, Button, Dialog, Heading, Icon } from '../components/ui';
import { PlaylistFilter } from '../components/playlist-filter';
import { asset } from '../assets';
import { allMusicDirection, articleSection, byId, directions, episodePrograms, featuredIds, items, pick, programs, sections, tracks, type Item } from './data';
import { articleReferences, articles, searchMusic, type ArticleBlock, type ArticleLink } from './articles';
import { catalogLabels, hasCatalog, isMusicOverview, musicHref as href, programDetailHref, programsHref, type MusicRoute } from './navigation';
import { type Clip, type RecordingState } from './recordings';

const typeNames: Record<string, string> = Object.fromEntries(sections.map(({ id, label }) => [id, label]));
const editorialIds = ['studio-story', 'sade-story', 'words-story'];
const relatedGroups = [
  { type: 'episode', title: 'Записи эфиров' },
  { type: 'article', title: 'Читайте также' },
  { type: 'program', title: 'Программы' },
  { type: 'artist', title: 'Артисты и гости' },
  { type: 'release', title: 'Релизы' },
];
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
  return <>
    <img src={asset(item.image)} alt="" loading={loading}
      style={{ scale: item.coverScale, objectPosition: item.coverPosition }}/>
    {item.type === 'program' && <span className="program-cover-title" aria-hidden="true">{item.title}</span>}
  </>;
}

function EpisodeCard({ item, direction = '', showDate = false, compact = false }: {
  item: Item; direction?: string; showDate?: boolean; compact?: boolean;
}) {
  const video = item.format === 'video';
  return <a className="music-card episode-card" href={href('detail', item.id, direction)}>
    <div className="episode-card__cover">
      <MusicCover item={item} loading="lazy"/>
      <span className="episode-card__icon"><Icon name={video ? 'video' : 'play'}/></span>
    </div>
    <div className="episode-card__copy">
      <div className="episode-card__meta">
        <span>{video ? 'Видео' : 'Аудио'}</span>
        {!compact && item.duration && <span>{item.duration}</span>}
      </div>
      <h3>{item.title}</h3>
      {!compact && <p>{showDate && item.guest ? `В гостях — ${item.guest}` : item.subtitle}</p>}
      {showDate && item.airedAt && <time dateTime={item.airedAt}>{formatBroadcastDate(item.airedAt)}</time>}
    </div>
  </a>;
}

function MediaCard({ item, direction = '', showMeta = true, fromPrograms = false }: {
  item: Item; direction?: string; showMeta?: boolean; fromPrograms?: boolean;
}) {
  if (item.type === 'episode') return <EpisodeCard item={item} direction={direction}/>;
  return <a className={'music-card music-card--' + item.type} href={fromPrograms ? programDetailHref(item.id) : href('detail', item.id, direction)}>
    <div className="music-card__art">
      <MusicCover item={item} loading="lazy"/>
    </div>
    <div className="card-copy">
      {showMeta && (item.type === 'article' || item.type === 'release') && <span className="eyebrow">{cardMeta(item)}</span>}
      <h3>{item.title}</h3>
      <p>{item.type === 'article' ? item.description : item.subtitle}</p>
    </div>
  </a>;
}

type CatalogLink = { href: string; label: string };

function ShelfSection({ title, script, more, className = '', children }: {
  title: string; script?: string; more?: CatalogLink; className?: string; children: ReactNode;
}) {
  const heading = [title, script].filter(Boolean).join(' ');
  return <section className={`music-section ${className}`} aria-label={heading}>
    <div className="shelf-heading section__header">
      {script ? <Heading first={title} script={script}/> : <h2>{title}</h2>}
      {more && <a className="button button--tertiary button--m section__link" href={more.href}>
        {more.label}<Icon name="chevron-right"/>
      </a>}
    </div>
    {children}
    {more && <a className="button button--secondary button--m section__mobile-action" href={more.href}>
      {more.label}<Icon name="chevron-right"/>
    </a>}
  </section>;
}

function Shelf({ title, script, list, more, previewLimit, direction = '', trimPreview = false }: {
  title: string; script?: string; list: Item[]; more?: CatalogLink;
  previewLimit?: number; direction?: string; trimPreview?: boolean;
}) {
  if (!list.length) return null;
  const type = list[0].type;
  const desktopColumns = sections.find((section) => section.id === type)?.desktopColumns;
  const preview = more ? list.slice(0, previewLimit ?? desktopColumns) : list;
  return <ShelfSection title={title} script={script} more={preview.length < list.length ? more : undefined}>
    <div className={type === 'episode' ? 'episode-grid' : 'music-shelf'}
      data-desktop-columns={desktopColumns}
      data-trim-preview={trimPreview || undefined}>
      {preview.map((item) => <MediaCard key={item.id} item={item} direction={direction}/>)}
    </div>
  </ShelfSection>;
}

function EpisodeList({ title, episodes, direction, compact = false }: {
  title: string; episodes: Item[]; direction: string; compact?: boolean;
}) {
  if (!episodes.length) return null;
  return <ShelfSection title={title}>
    <ul className="episode-grid" role="list">
      {episodes.map((episode) => <li key={episode.id}>
        <EpisodeCard item={episode} direction={direction} showDate compact={compact}/>
      </li>)}
    </ul>
  </ShelfSection>;
}

function EpisodeRelatedSections({ item, program, guest, direction }: { item: Item; program?: Item; guest?: Item; direction: string }) {
  const related = pick(item.related ?? []);
  const artists = related.filter((entry) => entry.type === 'artist' && entry.id !== guest?.id);
  if (guest) artists.unshift(guest);

  return <>
    {program && <EpisodeList title="Другие выпуски" episodes={pick((programs[program.id]?.episodes ?? []).filter((id) => id !== item.id))} direction={direction}/>}
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

function Directions({ selected }: { selected?: string }) {
  const navigation = useRef<HTMLElement>(null);
  const filtering = selected !== undefined;
  const options = filtering ? [allMusicDirection, ...directions] : directions;

  useEffect(() => {
    const rail = navigation.current;
    const activeChip = rail?.querySelector('[aria-current]');
    if (!rail || !activeChip || rail.scrollWidth <= rail.clientWidth) return;
    const railBounds = rail.getBoundingClientRect();
    const chipBounds = activeChip.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    const start = chipBounds.left - railBounds.left - padding;
    const end = chipBounds.right - railBounds.right + padding;
    if (start < 0 || end > 0) rail.scrollBy({ left: start < 0 ? start : end, behavior: 'instant' });
  }, [selected]);

  return <nav ref={navigation} className={`directions ${filtering ? 'directions--switcher' : 'directions--portraits'}`} aria-label="Музыкальные направления">
    {options.map(({ id, title, short, previews }) => <a key={id} className="direction-tile"
      href={id ? href('direction', id) : href()} aria-current={selected === id ? 'true' : undefined}>
      <span className="direction-portraits">
        {previews.map(({ image, position, scale, translate }) => <span className="direction-portraits__frame" key={image}>
          <img src={asset(image)} alt="" decoding="async" style={{ objectPosition: position, scale, translate }}/>
        </span>)}
      </span>
      <span className="direction-label"><strong>{title}</strong>{!filtering && <small>{short}</small>}</span>
    </a>)}
  </nav>;
}

function OtherDirections({ active }: { active: string }) {
  return <nav className="music-section other-directions" aria-labelledby="other-directions-title">
    <h2 id="other-directions-title">Другие направления</h2>
    <ul>
      {directions.filter(({ id }) => id !== active).map(({ id, title }) => <li key={id}>
        <a className="button button--tertiary" href={href('direction', id)}>{title}<Icon name="chevron-right"/></a>
      </li>)}
    </ul>
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
    <img className={`object-cover${portrait ? ' object-cover--portrait' : ''}`} src={asset(image)} alt="" loading="lazy"/>
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
  const articleBody = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const chapters = Array.from(articleBody.current?.children ?? []);
    const firstChapter = chapters[0];
    if (!firstChapter) return;

    let activationLine = 0;
    function updateActiveChapter() {
      let index = 0;
      for (const [chapterIndex, chapter] of chapters.entries()) {
        if (chapter.getBoundingClientRect().top > activationLine) break;
        index = chapterIndex;
      }
      setActiveChapter(index);
    }

    function updateActivationLine() {
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const scrollMargin = parseFloat(getComputedStyle(firstChapter).scrollMarginTop) || 0;
      activationLine = scrollPadding + scrollMargin + 2;
      updateActiveChapter();
    }

    updateActivationLine();
    window.addEventListener('scroll', updateActiveChapter, { passive: true });
    window.addEventListener('resize', updateActivationLine);
    return () => {
      window.removeEventListener('scroll', updateActiveChapter);
      window.removeEventListener('resize', updateActivationLine);
    };
  }, [article]);

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
      <div className="article-cover"><MusicCover item={item}/></div>
    </div>
    {article.chapters.length > 0 && <nav className="article-toc" aria-labelledby="article-toc-heading">
      <strong id="article-toc-heading">Что внутри</strong>
      <ul role="list">{article.chapters.map((chapter, i) => <li key={chapter.title}><button type="button" aria-current={activeChapter === i ? 'location' : undefined} onClick={() => {
        const target = document.getElementById('chapter-' + i);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: 'start' });
      }}>{chapter.title}</button></li>)}</ul>
    </nav>}
    <div className="article-body" ref={articleBody}>
      {article.chapters.map((chapter, i) => <section key={chapter.title} className="article-chapter" id={'chapter-' + i} tabIndex={-1}>
        <h2>{chapter.title}</h2>
        {chapter.blocks.map((block, index) => <Fragment key={index}>{renderBlock(block)}</Fragment>)}
      </section>)}
    </div>
  </article>;
}

function CoverFeature({ list, totalArticles, direction }: { list: Item[]; totalArticles: number; direction: string }) {
  const [story, ...otherStories] = list;
  if (!story) return null;
  const more = list.length >= articleSection.desktopColumns && totalArticles > list.length
    ? { href: href('catalog', 'article', direction), label: catalogLabels.article }
    : undefined;
  return <ShelfSection title="Выбор" script="редакции" className="editor-section"
    more={more}>
    <div className="music-shelf editorial-shelf" data-desktop-columns={articleSection.desktopColumns}>
      {list.map((item) => <MediaCard key={item.id} item={item} direction={direction} showMeta={false}/>)}
    </div>
    <div className="feature-grid">
      <a className="feature-main" href={href('detail', story.id, direction)}>
        <div className="feature-main__cover"><MusicCover item={story} loading="lazy"/></div>
        <div className="feature-copy"><h3>{story.title}</h3><p>{story.description}</p></div>
      </a>
      {otherStories.length > 0 && <div className="feature-side">
        {otherStories.map((item) => <a key={item.id} href={href('detail', item.id, direction)}>
          <div className="feature-side__cover"><MusicCover item={item} loading="lazy"/></div>
          <span><strong>{item.title}</strong><span className="feature-summary">{item.description}</span></span>
        </a>)}
      </div>}
    </div>
  </ShelfSection>;
}

// Match the column breakpoints of .episode-grid in style.css.
function getEpisodePreviewLimit() {
  if (window.matchMedia('(min-width: 1120px)').matches) return 5;
  if (window.matchMedia('(min-width: 768px)').matches) return 3;
  return 2;
}

export function Music({ route, recordings, filterDirections }: {
  route: MusicRoute;
  recordings: RecordingState;
  filterDirections: boolean;
}) {
  const [format, setFormat] = useState('');
  const [guest, setGuest] = useState('');
  const [episodePreviewLimit, setEpisodePreviewLimit] = useState(getEpisodePreviewLimit);
  useEffect(() => {
    const update = () => setEpisodePreviewLimit(getEpisodePreviewLimit());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const direction = directions.find((entry) => entry.id === route.direction);
  const directionId = direction?.id ?? '';
  const item = byId(route.id);
  const section = sections.find((entry) => entry.id === route.id);
  const programsCatalog = route.page === 'catalog' && section?.id === 'program';
  const all = direction ? items.filter((entry) => entry.direction === direction.title || entry.extraDirections?.includes(direction.title)) : items;
  const overview = direction ? all : all.filter((entry) => !featuredIds[entry.type] || featuredIds[entry.type].includes(entry.id));
  const showOverview = route.page === 'home' || (isMusicOverview(route) && direction !== undefined);
  const directionPage = route.page === 'direction';
  const filterOverview = filterDirections && showOverview;
  const editorPicks = pick(editorialIds).filter((entry) => all.includes(entry));
  const allArticles = all.filter((entry) => entry.type === 'article');
  const otherArticles = direction ? allArticles.filter((entry) => !editorPicks.includes(entry)) : [];

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
  const breadcrumbs = !isMusicOverview(route) && !programsCatalog && <nav className="breadcrumbs" aria-label="Хлебные крошки">
    <a href={route.fromPrograms ? programsHref : href()}>{route.fromPrograms ? 'Программы' : 'Музыка'}</a><span aria-hidden="true">/</span>
    {direction && <><a href={href('direction', directionId)}>{direction.title}</a><span aria-hidden="true">/</span></>}
    <span aria-current="page">{route.page === 'catalog' ? [section?.title, section?.script].filter(Boolean).join(' ') : item && (route.fromPrograms ? item.title : typeNames[item.type])}</span>
  </nav>;
  const rubricHeading = directionPage ? direction : undefined;
  const overviewTitle = rubricHeading?.title ?? 'Музыкальный мир РИФ FM';
  const scriptStart = rubricHeading ? overviewTitle.lastIndexOf(' ') + 1 : overviewTitle.indexOf('РИФ FM');

  return (
    <main className={`container music-main music-main--${route.page}${programsCatalog ? ' music-main--programs' : ''}${filterOverview ? ' music-main--with-filters' : ''}`} id="music-content" tabIndex={-1}>
      {!articlePage && breadcrumbs}

      {showOverview && <>
        {filterOverview && <Directions selected={directionId}/>}
        {directionPage && !filterOverview && <a className="button button--tertiary music-back" href={href()}><Icon name="chevron-down"/>Вся музыка</a>}
        <header className="music-title">
          <Heading first={overviewTitle.slice(0, scriptStart).trimEnd()} script={overviewTitle.slice(scriptStart)} level={1}/>
          <p>{rubricHeading?.description ?? 'Здесь мы собрали альбомы, истории об исполнителях и записи наших передач. Можно начать с прослушивания любимой песни, а можно найти что-то, чего раньше не слышали.'}</p>
        </header>
        {!filterOverview && !directionPage && <Directions/>}
        <CoverFeature list={editorPicks} totalArticles={allArticles.length} direction={directionId}/>
        {sections.map((group) => <Shelf key={group.id} title={group.title} script={group.script}
          list={group.id === 'article' ? otherArticles : overview.filter((entry) => entry.type === group.id)}
          direction={directionId}
          more={group.id !== 'article' && hasCatalog(group.id) ? { href: href('catalog', group.id, directionId), label: catalogLabels[group.id] } : undefined}
          previewLimit={group.id === 'episode' ? episodePreviewLimit : undefined}
          trimPreview={!direction}/>)}
        {directionPage && !filterOverview && <OtherDirections active={directionId}/>}
      </>}

      {route.page === 'catalog' && section && <>
        <header className="music-title"><Heading first={programsCatalog ? 'Наши' : section.title} script={section.script} level={1} size={programsCatalog ? 1 : 2}/></header>
        {section.id === 'episode' && <div className="playlist-filters catalog-filters" role="group" aria-label="Фильтры записей эфиров">
          <PlaylistFilter id="recordings-format" label="Формат" value={format} options={formatOptions} onChange={setFormat}/>
          <PlaylistFilter id="recordings-guest" label="Гость" value={guest}
            options={[{ id: '', label: 'Все гости' }, ...guests.map(name => ({ id: name, label: name }))]} onChange={setGuest}/>
        </div>}
        {catalog.length ? <div className={section.id === 'episode' ? 'catalog-grid episode-grid' : 'catalog-grid music-shelf'} data-desktop-columns={section.desktopColumns}>
          {catalog.map((entry) => <MediaCard key={entry.id} item={entry} direction={directionId} fromPrograms={programsCatalog}/>)}
        </div> : <div className="empty">
          <h2>Материалы не найдены</h2>
          {section.id === 'episode' && (format || guest) && <Button variant="secondary" onClick={() => { setFormat(''); setGuest(''); }}>Сбросить фильтры</Button>}
        </div>}
      </>}

      {route.page === 'detail' && item && <>
        {item.type === 'article' ? <ArticleView key={item.id} item={item} direction={directionId} breadcrumbs={breadcrumbs}/> : <>
          <header className={'detail-hero detail-hero--' + item.type}>
            <div className="detail-art">
              <MusicCover item={item}/>
            </div>
            <div className="detail-copy">
              <div className="detail-heading">
                <h1>{item.title}</h1>
                <p className="detail-subtitle">{programme?.schedule ?? episodeProgram?.title ?? item.subtitle}</p>
              </div>
              <div className="detail-description">
                {item.description.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
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
          <EpisodeList title="Последние выпуски" episodes={pick(programme.episodes)} direction={directionId} compact/>
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
