export const articleSection = {
  id: 'article', title: 'Истории', script: 'о музыке', label: 'Статья', desktopColumns: 3,
} as const;

export const sections = [
  articleSection,
  { id: 'release', title: 'Новая музыка и', script: 'релизы', label: 'Релиз', desktopColumns: 5 },
  { id: 'program', title: 'Музыкальные', script: 'программы', label: 'Программа', desktopColumns: 5 },
  { id: 'episode', title: 'Записи', script: 'эфиров', label: 'Запись эфира', desktopColumns: 5 },
  { id: 'artist', title: '', script: 'Артисты', label: 'Артист', desktopColumns: 5 },
] as const;
export type Item = { id: string; type: string; title: string; subtitle: string; image: string; coverScale?: number; coverPosition?: string; direction: string; description: string; related?: string[]; extraDirections?: string[]; duration?: string; format?: 'audio' | 'video'; host?: string; guest?: string; airedAt?: string; };
const episodeCover = 'video-poster.png';
const winterSelectionDescription = 'Музыкальная подборка нашей редакции для уютного зимнего вечера';
const wordsStoryDescription = 'Одни и те же строки можно прочитать или спеть. Впечатление может быть разным. Разбираемся, почему так происходит.';

export const featuredIds: Record<string, string[]> = {
  release: ['apina-dance', 'september-zoloto', 'rubalskaya-dama', 'syutkin-to-chto-nado', 'notebook'],
  artist: ['krutoy', 'boyarsky', 'aguzarova', 'september'],
};

export const items: Item[] = [
  // Artist photographs from https://www.igorkrutoy.com/ and https://mboyarskiy.ru/
  {id:'krutoy',type:'artist',title:'Игорь Крутой',subtitle:'Композитор и пианист',image:'portrait-krutoy.jpg',direction:'Поп-музыка',extraDirections:['Советская эстрада'],description:'Музыка Игоря Крутого — песни для знакомых голосов и инструментальные композиции. Знакомимся с композитором через мелодии и истории их создания.',related:['song-story','calendar-sheet']},
  {id:'boyarsky',type:'artist',title:'Михаил Боярский',subtitle:'Актёр и певец',image:'portrait-boyarsky.png',direction:'Советская эстрада',extraDirections:['Поп-музыка','Романс'],description:'«Всё пройдёт», «Зеленоглазое такси» и песни из кино. Слушаем Михаила Боярского и вспоминаем музыку, с которой связан его голос.',related:['song-story','melody-story']},
  // Artist photographs from their official websites.
  // https://www.alena-apina.ru/ and https://syutkin.ru/
  {id:'apina',type:'artist',title:'Алёна Апина',subtitle:'Певица',image:'portrait-apina.png',direction:'Поп-музыка',description:'Слушаем альбомы Алёны Апиной и возвращаемся к знакомым песням — «Ксюша», «Узелок» и «Электричка».',related:['apina-dance','song-story']},
  {id:'syutkin',type:'artist',title:'Валерий Сюткин',subtitle:'Певец и музыкант',image:'portrait-syutkin.jpg',direction:'Поп-музыка',description:'Песни Валерия Сюткина — от рок-н-ролла до джазовых аранжировок. Собрали записи для знакомства с его музыкой.',related:['syutkin-to-chto-nado','calendar-sheet']},
  // Алексей Кан / Жанна Агузарова, CC BY-SA 3.0, displayed in a circular crop.
  // https://commons.wikimedia.org/wiki/File:Жанна_Агузарова.jpg
  // https://creativecommons.org/licenses/by-sa/3.0/
  {id:'aguzarova',type:'artist',title:'Жанна Агузарова',subtitle:'Певица',image:'portrait-aguzarova.jpg',direction:'Советская эстрада',extraDirections:['Поп-музыка'],description:'Узнаваемый голос группы «Браво» и сольные записи Жанны Агузаровой. Возвращаемся к музыке, в которой встречаются рок-н-ролл и эстрада.',related:['song-story','calendar-sheet']},
  // Studio group portrait from https://24smi.org/celebrity/475479-gruppa-sentiabr.html
  {
    id: 'september',
    type: 'artist',
    title: 'Группа «Сентябрь»',
    subtitle: 'Музыкальная группа',
    image: 'portrait-september-studio.webp',
    direction: 'Поп-музыка',
    description: `Группа «Сентябрь» — уникальное явление российской эстрады. Каждое появление музыкантов на сцене — это невероятное красочное шоу, полное драматургии, неимоверной энергии, неподдельных эмоций и, конечно же, шикарной музыки.

Коллектив придерживается своего элегантного музыкального стиля, сохраняя баланс между поэзией и мелодичностью, и позволяет слушателю проникнуться настроением праздника, погрузившись в прослушивание альбома. Каждый альбом группы — это единый композиционный ансамбль, в котором ничто не нарушает целостности пластинки.

В центре творчества «Сентября» – конечно же, женщины. Удивительные, восхитительные, приковывающие взгляд, пленяющие сердце. Именно им посвящен каждый из 13 полноформатных альбомов группы: в них лирические герои рассказывают истории настоящей любви в разном ключе. Здесь и нежность, и гордость, и счастливые надежды, и горечь разлуки… И каждая из этих историй заставляет слушателей искренне сопереживать ее героям, откликаясь в сердце собственными воспоминаниями.`,
    related: ['september-zoloto', 'song-story'],
  },
  // https://rubala.ru/
  {id:'rubalskaya',type:'artist',title:'Лариса Рубальская',subtitle:'Поэтесса и автор песен',image:'portrait-rubalskaya.png',direction:'Авторская песня',extraDirections:['Советская эстрада','Романс'],description:'Стихи Ларисы Рубальской звучат в песнях разных исполнителей. Знакомимся с автором через её строки и музыку.',related:['rubalskaya-dama','words-story']},
  // Album artwork and track list from Apple Music.
  // https://music.apple.com/ru/album/1442198099
  {id:'apina-dance',type:'release',title:'Танцевать до утра',subtitle:'Алёна Апина',image:'album-apina-dance.jpg',direction:'Поп-музыка',description:'Альбом Алёны Апиной «Танцевать до утра». Слушаем знакомый голос и песни для хорошего настроения.',related:['apina','song-story']},
  // https://september-group.ru/music/zoloto
  {id:'september-zoloto',type:'release',title:'Золото осени',subtitle:'Группа «Сентябрь»',image:'album-september-zoloto.jpg',direction:'Поп-музыка',description:'Альбом группы «Сентябрь» с лирическими песнями о любви и встречах.',related:['september','song-story']},
  // https://music.apple.com/us/album/1840882222
  {id:'rubalskaya-dama',type:'release',title:'Лариса, Вы прекрасная дама!',subtitle:'Лариса Рубальская · Александр Добронравов',image:'album-rubalskaya.jpg',direction:'Поп-музыка',description:'Совместный альбом Александра Добронравова и Ларисы Рубальской. Слушаем песни, в которых встречаются музыка и поэзия.',related:['rubalskaya','words-story']},
  // https://music.apple.com/ru/album/1124021389
  {id:'syutkin-to-chto-nado',type:'release',title:'То, что надо',subtitle:'Валерий Сюткин',image:'album-syutkin-to-chto-nado.jpg',direction:'Поп-музыка',description:'Альбом Валерия Сюткина «То, что надо». Мелодии и ритмы для знакомства с сольными записями музыканта.',related:['syutkin','calendar-sheet']},
  // Thilo Parg / Wikimedia Commons, CC BY-SA 3.0, resized and displayed in a circular crop.
  // https://commons.wikimedia.org/wiki/File:Sade_Adu_1_(cropped).jpg
  // https://creativecommons.org/licenses/by-sa/3.0/
  {id:'sade',type:'artist',title:'Sade',subtitle:'Соул · мягкое звучание',image:'portrait-sade.jpg',direction:'Поп-музыка',description:'Голос, который узнаёшь с первых секунд. Собрали музыку, истории и разговоры вокруг Sade.',related:['diamond','sade-story','soul-night','sade-news']},
  // Philip Romano, CC BY 4.0, resized and displayed in a circular crop.
  // https://commons.wikimedia.org/wiki/File:NorahJones-byPhilipRomano.jpg
  // https://creativecommons.org/licenses/by/4.0/
  {id:'norah',type:'artist',title:'Norah Jones',subtitle:'Джаз · вокал',image:'portrait-norah.jpg',direction:'Поп-музыка',description:'Для неспешного знакомства — любимые записи и разговор о том, как голос создаёт настроение.',related:['visions','come-away','soul-night','sade-story']},
  // Universal Music press portrait for The Last Ship, resized and displayed in a circular crop.
  // https://media.universalmusic.pl/439055-sting-wydal-rozszerzona-wersje-the-last-ship
  {id:'sting',type:'artist',title:'Sting',subtitle:'Поп и рок',image:'portrait-sting.jpg',direction:'Поп-музыка',description:'Песни и истории, к которым хочется возвращаться. Музыка артиста в подборке Риф FM.',related:['ten-summoner','guitar-story','road-episode']},
  // Courtesy of Special Collections, University of Houston Libraries. Public domain.
  // https://commons.wikimedia.org/wiki/File:George_Michael_(cropped).jpeg
  {id:'george',type:'artist',title:'George Michael',subtitle:'Поп · соул',image:'portrait-george.jpg',direction:'Поп-музыка',description:'Знакомые мелодии и внимание к деталям. Слушаем, обсуждаем и вспоминаем вместе.',related:['ladies','song-story','melody-story','melody-episode']},
  {id:'mikhail',type:'artist',title:'Михаил Александров',subtitle:'Гость студии',image:'guest-mikhail-portrait.jpg',direction:'Авторская песня',description:'Знакомство с гостем через разговор в студии и песни, которые он выбрал для эфира.',related:['studio-talk','author-hour','studio-story','notebook']},
  // Artwork and tracks: https://www.herbiehancock.com/music/discography/album/head-hunters/
  {id:'head-hunters',type:'release',title:'Head Hunters',subtitle:'Herbie Hancock',image:'album-head-hunters.jpg',direction:'Поп-музыка',description:'Джаз-фанк Херби Хэнкока. В «Chameleon» синтезатор задаёт басовую линию, а в «Watermelon Man» знакомая мелодия звучит в новой аранжировке.',related:['visions','diamond']},
  // Artwork and album: https://www.norahjones.com/news-1/2024/3/8/norah-jones-releases-visions-produced-by-leon-michels-vibrant-new-studio-album-out-now-on-blue-note
  {id:'visions',type:'release',title:'Visions',subtitle:'Norah Jones',image:'album-visions.webp',direction:'Поп-музыка',description:'Нора Джонс записала этот альбом с Леоном Мичелсом. В «Paradise» и «Running» её голос звучит на фоне гитары, клавишных и подвижного ритма.',related:['norah','come-away','head-hunters']},
  {id:'ten-summoner',type:'release',title:'Ten Summoner’s Tales',subtitle:'Sting',image:'album-sting.jpg',direction:'Поп-музыка',description:'Знакомимся с альбомом через любимую песню и открываем соседние композиции.',related:['sting','guitar-story']},
  // Artwork and album: https://music.apple.com/us/album/shes-so-unusual/400603643
  {id:'shes-so-unusual',type:'release',title:'She’s So Unusual',subtitle:'Cyndi Lauper',image:'album-shes-so-unusual.jpg',direction:'Поп-музыка',description:'В дебютном альбоме Синди Лопер звучат танцевальная «Girls Just Want to Have Fun» и баллада «Time After Time».',related:['ladies','melody-story']},
  {id:'stars',type:'release',title:'Stars',subtitle:'Simply Red',image:'album-simply-red.jpg',direction:'Поп-музыка',description:'Тёплое звучание и мелодии для длинной дороги.',related:['guitar-story']},
  // Album and track list: https://melody.su/catalog/estrade/46295/
  {id:'notebook',type:'release',title:'Песни Булата Окуджавы',subtitle:'Булат Окуджава',image:'album-okudzhava-songs.jpg',direction:'Авторская песня',description:'Альбом «Мелодии» 1976 года. В подборке — песни об Арбате, дороге и друзьях.',related:['mikhail','words-story','studio-talk']},
  {id:'diamond',type:'release',title:'Diamond Life',subtitle:'Sade',image:'album-sade.jpg',direction:'Поп-музыка',description:'Возвращаемся к знакомой пластинке и слушаем, как мелодия, голос и ритм складываются в общее настроение.',related:['sade','sade-story']},
  // Crop the blue border baked into the 600 × 600 source cover.
  {id:'come-away',type:'release',title:'Come Away With Me',subtitle:'Norah Jones',image:'album-norah-jones.jpg',coverScale:1.09,direction:'Поп-музыка',description:'Музыка для вечера, в котором можно никуда не торопиться.',related:['norah','soul-night']},
  {id:'ladies',type:'release',title:'Ladies & Gentlemen',subtitle:'George Michael',image:'album-george-michael.jpg',direction:'Поп-музыка',description:'Песни, которые остаются рядом. Подборка для нового знакомства с известным голосом.',related:['george','song-story']},
  // Artwork from the Tilda home and schedule pages, with titles rendered by MusicCover.
  {id:'song-story',type:'program',title:'История одной песни',subtitle:'Игорь Федоров',image:'tilda-program-story-art.webp',direction:'Поп-музыка',extraDirections:['Советская эстрада','Авторская песня','Романс'],description:'Как родилась знакомая мелодия, что вдохновляло её авторов и кто первым спел эту песню? В каждом выпуске Игорь Федоров и гость студии разбирают одну композицию. Они возвращаются к истории её создания, вслушиваются в слова и обращают внимание на детали, которые легко пропустить, даже если знаешь песню наизусть.',related:['melody-episode','studio-talk','melody-story','studio-story']},
  {id:'author-hour',type:'program',title:'Стихи на каждый день',subtitle:'Игорь Федоров',image:'tilda-program-poetry-art.webp',direction:'Авторская песня',description:'Ведущие и гости студии читают вслух любимые и малоизвестные стихи. В эфире звучат и песни, написанные на эти строки. Слушаем, как меняется интонация одного и того же текста, когда к словам добавляется мелодия, и какие строки после этого запоминаются по-новому.',related:['poetry-episode','words-story','notebook']},
  {id:'calendar-sheet',type:'program',title:'Лист календаря',subtitle:'Этот день в истории музыки',image:'tilda-program-calendar-art.webp',direction:'Поп-музыка',extraDirections:['Советская эстрада','Романс'],description:'Вспоминаем, что произошло в этот день в истории музыки. Кто из любимых исполнителей родился, какие записи вышли и какие песни прозвучали впервые. За каждой датой есть история, а за знакомой записью — момент, когда её услышали впервые. Возвращаемся к этим событиям через музыку.',related:['road-episode','guitar-story']},
  {id:'soul-night',type:'episode',title:'Голоса тихого вечера',subtitle:'История одной песни',image:episodeCover,direction:'Поп-музыка',format:'audio',host:'Игорь Федоров',guest:'Михаил Александров',duration:'42:18',airedAt:'2026-11-11T10:00:00+03:00',description:'Разговор о том, почему спокойная музыка порой говорит громче любых слов.',related:['song-story','norah','come-away']},
  {id:'studio-talk',type:'episode',title:'Песня начинается с истории',subtitle:'В гостях Михаил Александров',image:episodeCover,direction:'Авторская песня',format:'video',host:'Игорь Федоров',guest:'Михаил Александров',duration:'36:24',airedAt:'2026-11-13T10:00:00+03:00',description:'Встреча в студии: об авторах, первых строчках и песнях, которые помнишь всю жизнь.',related:['song-story','mikhail','words-story']},
  {id:'melody-episode',type:'episode',title:'Почему мы узнаём мелодию',subtitle:'История одной песни',image:episodeCover,direction:'Поп-музыка',format:'audio',host:'Игорь Федоров',guest:'Михаил Александров',duration:'28:40',airedAt:'2026-11-12T10:00:00+03:00',description:'Обсуждаем, какие детали делают песню узнаваемой.',related:['song-story','george']},
  {id:'road-episode',type:'episode',title:'Премьеры, которые стали классикой',subtitle:'Лист календаря',image:episodeCover,direction:'Поп-музыка',format:'audio',airedAt:'2026-11-13T14:00:00+03:00',description:'Возвращаемся к релизам, которые со временем стали классикой, и вспоминаем, как их слушали в день премьеры.',related:['calendar-sheet','sting','stars']},
  {id:'poetry-episode',type:'episode',title:'Стихи, которые стали песнями',subtitle:'Стихи на каждый день',image:episodeCover,direction:'Авторская песня',format:'audio',host:'Игорь Федоров',airedAt:'2026-11-13T16:00:00+03:00',description:'Читаем стихи вслух и обсуждаем, как меняется интонация, когда те же строки звучат в песне.',related:['author-hour','words-story','notebook']},
  {id:'sade-story',type:'article',title:'Падает снег',subtitle:winterSelectionDescription,image:'portrait-krutoy.jpg',coverPosition:'center 12%',direction:'Поп-музыка',description:winterSelectionDescription,related:['sade','diamond','soul-night','studio-story']},
  {id:'guitar-story',type:'article',title:'История в нескольких аккордах',subtitle:'Что мы слышим между строк',image:'portrait-syutkin.jpg',coverPosition:'center 22%',direction:'Поп-музыка',description:'Любимая песня может начинаться с простого рисунка гитары. Прислушиваемся к знакомой записи ещё раз.',related:['sting','ten-summoner']},
  // Concert photograph from https://www.svoboda.org/a/28630605.html
  {id:'words-story',type:'article',title:'Когда стихи становятся песней',subtitle:wordsStoryDescription,image:'okudzhava-stage.jpg',coverPosition:'center 32%',direction:'Авторская песня',description:wordsStoryDescription,related:['author-hour','studio-talk','mikhail']},
  {id:'melody-story',type:'article',title:'Песня, которую хочется напевать',subtitle:'Мелодии, которые остаются с нами',image:'album-apina-dance.jpg',coverPosition:'center 36%',direction:'Поп-музыка',description:'У каждого есть мелодия, которая возвращает в определённый момент жизни.',related:['song-story','melody-episode']},
  // Concert photograph from https://www.kinoafisha.info/events/mihail-boyarskiy--artist-scenicheskogo-temperamenta/
  { id:'studio-story', type:'article', title:'У микрофона', subtitle:'Фотоистория из студии', image:'boyarsky-stage.jpg', coverPosition:'center 12%', direction:'Авторская песня', description:'Что происходит в студии за несколько минут до эфира? Заглядываем за стекло и листаем рабочие заметки.', related:['studio-talk','words-story','author-hour','mikhail'] },
  // Group photograph from https://tunnel.ru/post-gruppa-sentyabr-ot-sentyabrya-do-sentyabrya-2022
  { id:'sade-news', type:'article', title:'Sade в фонотеке Риф FM', subtitle:'Новость редакции', image:'september-group-photo.jpg', coverPosition:'center 25%', direction:'Поп-музыка', description:'В демонстрационной фонотеке собрали записи и материалы, с которых можно начать знакомство с Sade.', related:['sade','diamond','sade-story'] },
];

const rubalskayaPreview = { image: 'portrait-rubalskaya.png', position: 'left center', scale: 2.25, translate: '28% 56%' };
export const allMusicDirection = {
  id: '', title: 'Вся музыка', short: '',
  previews: [
    { image: 'portrait-september-studio.webp', position: 'center', scale: 1.0, translate: '0 0' },
    { image: 'portrait-apina.png', position: 'center top', scale: 1.35, translate: '0 8%' },
  ],
};
export const directions = [
  {
    id: 'songwriter', title: 'Авторская песня', short: 'Истории в песнях',
    description: 'Есть песни, в которых узнаёшь себя — свои мысли, чувства, переживания. Они напоминают о дорогих людях, любимых местах и моментах, которые хочется сохранить в памяти. В авторской песне каждое слово имеет значение, а мелодия помогает глубже почувствовать его смысл. И порой даже в давно знакомых строчках вдруг слышишь что-то новое, близкое именно тебе.',
    previews: [
      { image: 'album-okudzhava-songs.jpg', position: 'center', scale: 1.35, translate: '-4% 12%' },
      rubalskayaPreview,
    ],
  },
  {
    id: 'soviet', title: 'Советская эстрада', short: 'Песни нашей памяти',
    description: 'Есть песни, которые мы полюбим и помним уже много лет. Они звучали по радио, с пластинок, на семейных праздниках. В них – голоса любимых исполнителей, красивые мелодии и слова, которые не теряют своего смысла и сегодня. Советская эстрада – это не просто музыка прошлых лет. Это песни которые хочется слушать и петь.',
    previews: [
      { image: 'portrait-krutoy.jpg', position: 'center', scale: 2.15, translate: '-14% 49%' },
      { image: 'portrait-aguzarova.jpg', position: 'center top', scale: 1.6, translate: '-8% 28%' },
    ],
  },
  {
    id: 'pop', title: 'Поп-музыка', short: 'Любимые хиты',
    description: 'У каждого есть песни, которые хочется слушать снова и снова. Поп-музыка всегда рядом с нами. В ней легко найти песню под любое настроение — от зажигательных танцевальных хитов до нежных, проникновенных баллад. Мы любим её за яркие мелодии, узнаваемые голоса и припевы, которым хочется подпевать.',
    previews: [
      { image: 'album-apina-dance.jpg', position: 'center', scale: 2.6, translate: '-67% 31%' },
      { image: 'album-syutkin-to-chto-nado.jpg', position: 'center', scale: 2.35, translate: '39% 45%' },
    ],
  },
  {
    id: 'romance', title: 'Романс', short: 'Музыка чувств',
    description: 'Романс – это музыкальный способ рассказать о самом сокровенном. О любви и разлуке, о нежности, надежде и самом сокровенном. В песнях этого жанра каждое слово наполнено чувством, а мелодия помогает выразить то, что порой трудно сказать вслух. И сколько бы лет ни прошло, романс продолжает трогать наши сердца, ведь время не властно над чувствами.',
    previews: [
      { image: 'portrait-boyarsky.png', position: 'center', scale: 1.8, translate: '-25% 20%' },
      rubalskayaPreview,
    ],
  },
];

export const tracks: Record<string, { title: string; duration?: string }[]> = {
  'apina-dance': [{ title: 'Танцевать до утра' }, { title: 'Лёха' }, { title: 'Летучий голландец' }],
  'september-zoloto': [{ title: 'Золото осени' }, { title: 'Без тебя этот мир' }, { title: 'Грустить не надо' }],
  'rubalskaya-dama': [{ title: 'Интро' }, { title: 'Дама с собачкой' }, { title: 'Безнадёга' }],
  'syutkin-to-chto-nado': [{ title: 'Гуру' }, { title: 'Семь тысяч над землёй' }, { title: 'Гангстер' }],
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
