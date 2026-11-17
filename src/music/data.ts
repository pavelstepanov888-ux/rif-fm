export const sections = [
  { id: 'release', title: 'Новая музыка и', script: 'релизы', label: 'Релиз', desktopColumns: 6 },
  { id: 'program', title: 'Музыкальные', script: 'программы', label: 'Программа', desktopColumns: 5 },
  { id: 'episode', title: 'Записи', script: 'эфиров', label: 'Запись эфира', desktopColumns: 5 },
  { id: 'artist', title: '', script: 'Артисты', label: 'Артист', desktopColumns: 5 },
  { id: 'article', title: 'Истории', script: 'о музыке', label: 'Статья', desktopColumns: 5 },
] as const;
export type Item = { id: string; type: string; title: string; subtitle: string; image: string; coverScale?: number; direction: string; description: string; related?: string[]; extraDirections?: string[]; duration?: string; format?: 'audio' | 'video'; host?: string; guest?: string; airedAt?: string; };
export const articleCover = 'cover-article.webp';

export const items: Item[] = [
  // Thilo Parg / Wikimedia Commons, CC BY-SA 3.0, resized and displayed in a circular crop.
  // https://commons.wikimedia.org/wiki/File:Sade_Adu_1_(cropped).jpg
  // https://creativecommons.org/licenses/by-sa/3.0/
  {id:'sade',type:'artist',title:'Sade',subtitle:'Соул · мягкое звучание',image:'portrait-sade.jpg',direction:'Джаз и соул',description:'Голос, который узнаёшь с первых секунд. Собрали музыку, истории и разговоры вокруг Sade.',related:['diamond','sade-story','soul-night','sade-news']},
  // Philip Romano, CC BY 4.0, resized and displayed in a circular crop.
  // https://commons.wikimedia.org/wiki/File:NorahJones-byPhilipRomano.jpg
  // https://creativecommons.org/licenses/by/4.0/
  {id:'norah',type:'artist',title:'Norah Jones',subtitle:'Джаз · вокал',image:'portrait-norah.jpg',direction:'Джаз и соул',description:'Для неспешного знакомства — любимые записи и разговор о том, как голос создаёт настроение.',related:['visions','come-away','soul-night','sade-story']},
  // Universal Music press portrait for The Last Ship, resized and displayed in a circular crop.
  // https://media.universalmusic.pl/439055-sting-wydal-rozszerzona-wersje-the-last-ship
  {id:'sting',type:'artist',title:'Sting',subtitle:'Поп и рок',image:'portrait-sting.jpg',direction:'Поп и рок',description:'Песни и истории, к которым хочется возвращаться. Музыка артиста в подборке Риф FM.',related:['ten-summoner','guitar-story','road-episode']},
  // Courtesy of Special Collections, University of Houston Libraries. Public domain.
  // https://commons.wikimedia.org/wiki/File:George_Michael_(cropped).jpeg
  {id:'george',type:'artist',title:'George Michael',subtitle:'Поп · соул',image:'portrait-george.jpg',direction:'Эстрада',description:'Знакомые мелодии и внимание к деталям. Слушаем, обсуждаем и вспоминаем вместе.',related:['ladies','song-story','melody-story','melody-episode']},
  {id:'mikhail',type:'artist',title:'Михаил Александров',subtitle:'Гость студии',image:'guest-mikhail-portrait.jpg',direction:'Авторская песня',description:'Знакомство с гостем через разговор в студии и песни, которые он выбрал для эфира.',related:['studio-talk','author-hour','studio-story','notebook']},
  // Artwork and tracks: https://www.herbiehancock.com/music/discography/album/head-hunters/
  {id:'head-hunters',type:'release',title:'Head Hunters',subtitle:'Herbie Hancock',image:'album-head-hunters.jpg',direction:'Джаз и соул',description:'Джаз-фанк Херби Хэнкока. В «Chameleon» синтезатор задаёт басовую линию, а в «Watermelon Man» знакомая мелодия звучит в новой аранжировке.',related:['visions','diamond']},
  // Artwork and album: https://www.norahjones.com/news-1/2024/3/8/norah-jones-releases-visions-produced-by-leon-michels-vibrant-new-studio-album-out-now-on-blue-note
  {id:'visions',type:'release',title:'Visions',subtitle:'Norah Jones',image:'album-visions.webp',direction:'Джаз и соул',description:'Нора Джонс записала этот альбом с Леоном Мичелсом. В «Paradise» и «Running» её голос звучит на фоне гитары, клавишных и подвижного ритма.',related:['norah','come-away','head-hunters']},
  {id:'ten-summoner',type:'release',title:'Ten Summoner’s Tales',subtitle:'Sting',image:'album-sting.jpg',direction:'Поп и рок',description:'Знакомимся с альбомом через любимую песню и открываем соседние композиции.',related:['sting','guitar-story']},
  // Artwork and album: https://music.apple.com/us/album/shes-so-unusual/400603643
  {id:'shes-so-unusual',type:'release',title:'She’s So Unusual',subtitle:'Cyndi Lauper',image:'album-shes-so-unusual.jpg',direction:'Эстрада',description:'В дебютном альбоме Синди Лопер звучат танцевальная «Girls Just Want to Have Fun» и баллада «Time After Time».',related:['ladies','melody-story']},
  {id:'stars',type:'release',title:'Stars',subtitle:'Simply Red',image:'album-simply-red.jpg',direction:'Поп и рок',description:'Тёплое звучание и мелодии для длинной дороги.',related:['guitar-story']},
  // Album and track list: https://melody.su/catalog/estrade/46295/
  {id:'notebook',type:'release',title:'Песни Булата Окуджавы',subtitle:'Булат Окуджава',image:'album-okudzhava-songs.jpg',direction:'Авторская песня',description:'Альбом «Мелодии» 1976 года. В подборке — песни об Арбате, дороге и друзьях.',related:['mikhail','words-story','studio-talk']},
  {id:'diamond',type:'release',title:'Diamond Life',subtitle:'Sade',image:'album-sade.jpg',direction:'Джаз и соул',description:'Возвращаемся к знакомой пластинке и слушаем, как мелодия, голос и ритм складываются в общее настроение.',related:['sade','sade-story']},
  // Crop the blue border baked into the 600 × 600 source cover.
  {id:'come-away',type:'release',title:'Come Away With Me',subtitle:'Norah Jones',image:'album-norah-jones.jpg',coverScale:1.09,direction:'Джаз и соул',description:'Музыка для вечера, в котором можно никуда не торопиться.',related:['norah','soul-night']},
  {id:'ladies',type:'release',title:'Ladies & Gentlemen',subtitle:'George Michael',image:'album-george-michael.jpg',direction:'Эстрада',description:'Песни, которые остаются рядом. Подборка для нового знакомства с известным голосом.',related:['george','song-story']},
  {id:'song-story',type:'program',title:'История одной песни',subtitle:'Игорь Федоров',image:'cover-story.png',direction:'Эстрада',extraDirections:['Джаз и соул','Поп и рок','Авторская песня'],description:'Как родилась знакомая мелодия, что вдохновляло её авторов и кто первым спел эту песню? В каждом выпуске Игорь Федоров и гость студии разбирают одну композицию. Они возвращаются к истории её создания, вслушиваются в слова и обращают внимание на детали, которые легко пропустить, даже если знаешь песню наизусть.',related:['melody-episode','studio-talk','melody-story','studio-story']},
  {id:'author-hour',type:'program',title:'Стихи на каждый день',subtitle:'Игорь Федоров',image:'cover-poetry.png',direction:'Авторская песня',description:'Ведущие и гости студии читают вслух любимые и малоизвестные стихи. В эфире звучат и песни, написанные на эти строки. Слушаем, как меняется интонация одного и того же текста, когда к словам добавляется мелодия, и какие строки после этого запоминаются по-новому.',related:['poetry-episode','words-story','notebook']},
  {id:'calendar-sheet',type:'program',title:'Лист календаря',subtitle:'Этот день в истории музыки',image:'cover-calendar.png',direction:'Поп и рок',extraDirections:['Джаз и соул','Эстрада'],description:'Вспоминаем, что произошло в этот день в истории музыки. Кто из любимых исполнителей родился, какие записи вышли и какие песни прозвучали впервые. За каждой датой есть история, а за знакомой записью — момент, когда её услышали впервые. Возвращаемся к этим событиям через музыку.',related:['road-episode','guitar-story']},
  {id:'soul-night',type:'episode',title:'Голоса тихого вечера',subtitle:'История одной песни',image:'video-poster.png',direction:'Джаз и соул',format:'audio',host:'Игорь Федоров',guest:'Михаил Александров',duration:'42:18',airedAt:'2026-11-11T10:00:00+03:00',description:'Разговор о том, почему спокойная музыка порой говорит громче любых слов.',related:['song-story','norah','come-away']},
  {id:'studio-talk',type:'episode',title:'Песня начинается с истории',subtitle:'В гостях Михаил Александров',image:'video-poster.png',direction:'Авторская песня',format:'video',host:'Игорь Федоров',guest:'Михаил Александров',duration:'36:24',airedAt:'2026-11-13T10:00:00+03:00',description:'Встреча в студии: об авторах, первых строчках и песнях, которые помнишь всю жизнь.',related:['song-story','mikhail','words-story']},
  {id:'melody-episode',type:'episode',title:'Почему мы узнаём мелодию',subtitle:'История одной песни',image:'video-poster.png',direction:'Эстрада',format:'audio',host:'Игорь Федоров',guest:'Михаил Александров',duration:'28:40',airedAt:'2026-11-12T10:00:00+03:00',description:'Обсуждаем, какие детали делают песню узнаваемой.',related:['song-story','george']},
  {id:'road-episode',type:'episode',title:'Премьеры, которые стали классикой',subtitle:'Лист календаря',image:'video-poster.png',direction:'Поп и рок',format:'audio',airedAt:'2026-11-13T14:00:00+03:00',description:'Возвращаемся к релизам, которые со временем стали классикой, и вспоминаем, как их слушали в день премьеры.',related:['calendar-sheet','sting','stars']},
  {id:'poetry-episode',type:'episode',title:'Стихи, которые стали песнями',subtitle:'Стихи на каждый день',image:'video-poster.png',direction:'Авторская песня',format:'audio',host:'Игорь Федоров',airedAt:'2026-11-13T16:00:00+03:00',description:'Читаем стихи вслух и обсуждаем, как меняется интонация, когда те же строки звучат в песне.',related:['author-hour','words-story','notebook']},
  {id:'sade-story',type:'article',title:'Музыка, которой не нужно спешить',subtitle:'Слушаем Sade внимательнее',image:articleCover,direction:'Джаз и соул',description:'Иногда хочется оставить одну пластинку на весь вечер. Разбираемся, что помогает музыке создавать это ощущение.',related:['sade','diamond','soul-night','studio-story']},
  {id:'guitar-story',type:'article',title:'История в нескольких аккордах',subtitle:'Что мы слышим между строк',image:articleCover,direction:'Поп и рок',description:'Любимая песня может начинаться с простого рисунка гитары. Прислушиваемся к знакомой записи ещё раз.',related:['sting','ten-summoner']},
  {id:'words-story',type:'article',title:'Когда стихи становятся песней',subtitle:'О встрече слова и музыки',image:articleCover,direction:'Авторская песня',description:'Что меняется в стихотворении, когда у него появляется мелодия? Об этом говорим с гостями студии.',related:['author-hour','studio-talk','mikhail']},
  {id:'melody-story',type:'article',title:'Песня, которую хочется напевать',subtitle:'Мелодии, которые остаются с нами',image:articleCover,direction:'Эстрада',description:'У каждого есть мелодия, которая возвращает в определённый момент жизни.',related:['song-story','melody-episode']},
  { id:'studio-story', type:'article', title:'У микрофона', subtitle:'Фотоистория из студии', image:articleCover, direction:'Авторская песня', description:'Что происходит в студии за несколько минут до эфира? Заглядываем за стекло и листаем рабочие заметки.', related:['studio-talk','words-story','author-hour','mikhail'] },
  { id:'sade-news', type:'article', title:'Sade в фонотеке Риф FM', subtitle:'Новость редакции', image:articleCover, direction:'Джаз и соул', description:'В демонстрационной фонотеке собрали записи и материалы, с которых можно начать знакомство с Sade.', related:['sade','diamond','sade-story'] },
];

export const directions = [
  { id: 'jazz', title: 'Джаз и соул', short: 'От свинга до неосоула', description: 'Камерные голоса, мягкий грув и импровизация. Альбомы для неспешного знакомства, эфиры о джазе и истории об артистах.' },
  { id: 'variety', title: 'Эстрада', short: 'Песни, которые мы помним', description: 'Знакомые голоса и припевы, которые легко вспомнить. Разбираем, как устроены любимые песни, и ищем записи, к которым тянет вернуться.' },
  { id: 'songwriter', title: 'Авторская песня', short: 'Голос, гитара и слово', description: 'Песни, в которых сначала слышишь человека. Разговоры с авторами, акустические записи и истории о том, как стихи становятся музыкой.' },
  { id: 'rock', title: 'Поп и рок', short: 'От мелодий к гитарам', description: 'Музыка для дороги и встреч со старыми друзьями. От авторских баллад до узнаваемых гитарных записей.' },
];

export const tracks: Record<string, { title: string; duration?: string }[]> = {
  'head-hunters': [{ title: 'Chameleon' }, { title: 'Watermelon Man' }, { title: 'Sly' }],
  visions: [{ title: 'Staring at the Wall' }, { title: 'Paradise' }, { title: 'Running' }],
  'shes-so-unusual': [{ title: 'Girls Just Want to Have Fun' }, { title: 'Time After Time' }, { title: 'She Bop' }],
  diamond: [{ title: 'Smooth Operator' }, { title: 'Your Love Is King' }, { title: 'Hang On to Your Love' }],
  'come-away': [{ title: 'Don’t Know Why' }, { title: 'Seven Years' }, { title: 'Cold Cold Heart' }],
  'ten-summoner': [{ title: 'If I Ever Lose My Faith in You' }, { title: 'Love Is Stronger Than Justice' }, { title: 'Fields of Gold' }],
  stars: [{ title: 'Something Got Me Started' }, { title: 'Stars' }, { title: 'Thrill Me' }],
  ladies: [{ title: 'Careless Whisper' }, { title: 'Faith' }, { title: 'Freedom! ’90' }],
  notebook: [{ title: 'Песенка об Арбате' }, { title: 'Песенка о дальней дороге' }, { title: 'Союз друзей' }],
};

export const programs: Record<string, { host?: string; schedule: string; episodes: string[]; guests: string[]; reads: string[] }> = {
  'song-story': {
    host: 'Игорь Федоров', schedule: '10:00–12:00',
    episodes: ['studio-talk', 'melody-episode', 'soul-night'],
    guests: ['mikhail'], reads: ['melody-story', 'studio-story', 'sade-story'],
  },
  'author-hour': {
    host: 'Игорь Федоров', schedule: '16:00–17:30',
    episodes: ['poetry-episode'], guests: [], reads: ['words-story'],
  },
  'calendar-sheet': {
    schedule: '14:00–16:00',
    episodes: ['road-episode'], guests: [], reads: ['guitar-story'],
  },
};

export const episodePrograms: Record<string, string> = {
  'melody-episode': 'song-story', 'studio-talk': 'song-story',
  'soul-night': 'song-story', 'road-episode': 'calendar-sheet', 'poetry-episode': 'author-hour',
};
export const byId = (id: string) => items.find((item) => item.id === id);
export const pick = (ids: string[]) => ids.flatMap((id) => {
  const item = byId(id);
  return item ? [item] : [];
});
