# Риф FM — главная страница

Локальный прототип актуальной главной из Figma. React, TypeScript и Vite; обычный CSS и переменные дизайн-системы.

## Запуск

```sh
cd rif-fm
npm install
npm run dev
```

Открыть http://127.0.0.1:5173. Проверка сборки: `npm run build`.

## Источники

- Главная: [639:18783](https://www.figma.com/design/r01RsBBc2UlVk1imiMyChS/Rif-FM?node-id=639-18783).
- Молекулы и их описания: [91:10891](https://www.figma.com/design/r01RsBBc2UlVk1imiMyChS/Rif-FM?node-id=91-10891).
- Организмы и их описания: [366:593](https://www.figma.com/design/r01RsBBc2UlVk1imiMyChS/Rif-FM?node-id=366-593).
- Видеотрансляция: [744:31310](https://www.figma.com/design/r01RsBBc2UlVk1imiMyChS/Rif-FM?node-id=744-31310).

`design/figma-tokens.json` содержит 112 переменных исходного файла, включая ссылки между переменными и режимы Desktop/Mobile. `npm run tokens` генерирует `src/tokens.css`. Шрифты Helvetica Neue, Lobster и Great Vibes хранятся локально. Графика, аватары, обложки и иконки экспортированы из Figma; временные URL Figma во время работы страницы не используются.

Логотип шапки (включая окно трансляции и favicon), иллюстрация hero и логотип футера используют SVG. Из экспорта удалены фоновые слои родительских экранов; исходные контуры, маски и эффекты сохранены. Эти исходники Figma смешанные: SVG шапки содержит один растровый фрагмент, hero и футера — по 62. Полная иллюстрация не заменена PNG внутри SVG: в каждом большом файле более 15 тысяч векторных контуров. Состав файлов зафиксирован в `design/asset-manifest.json`.

## Компоненты и поведение

- `src/components/ui.tsx`: Button с вариантами Primary/Secondary/Tertiary, Icon, Avatar, Hosts, Heading, LiveLabel, PlayerWave, Volume, Dialog.
- `src/components/player.tsx`: NowPlaying, ButtonListen, общий RadioProvider, закреплённый Player, VideoPlayer и полноэкранная трансляция.
- `src/App.tsx`: Header, Hero, ProgramCard, PageSection, ContactCard, Socials, Footer и MobileBar.
- Состояние воспроизведения и громкость общие для кнопки в hero и нижнего плеера. NowPlaying анимируется независимо от состояния эфира. На мобильном MiniPlayer скрыт, пока видна кнопка прослушивания hero; навигация остаётся на экране.
- Состояния Hover применяются только на устройствах с указателем, Focus — через `:focus-visible`. Учитывается `prefers-reduced-motion`. Модальные окна удерживают фокус, закрываются Escape и возвращают фокус инициатору.
- Плейлист, история треков и драфты не включены.

## Данные прототипа

Тексты, программа, трек, время карточек и контактные данные взяты из макета. Повторяющиеся заголовки «Письмо редакции» и интервалы «16:00 – 17:30» сохранены из исходного фрейма. По описанию Socials MAX показывается только в футере.

Ссылки на остальные страницы представлены локальными окнами для проверки переходов. Это не реализация отдельных страниц расписания, документов или рекламодателей.

Аудио- и видеопотоки, а также точные URL соцсетей не заданы в макете. Без них аудиокнопки демонстрируют состояния с уведомлением, видео показывает постер, соцсети сообщают об отсутствии ссылки. Для подключения скопировать `.env.example` в `.env.local` и заполнить нужные значения. Никакой сторонний поток или случайный аккаунт не подставляется.

## GitHub Pages

Для GitHub публикуется содержимое этой папки как отдельный репозиторий `rif-fm`. Для изоляции от существующего Git-репозитория проекта рекомендуемая папка копии для публикации — `~/Documents/rif-fm-pages`, вне исходной папки `Rif FM`. В неё копируются исходники сайта с исключением `.git`, `.vercel`, `.env*` (кроме `.env.example`), `node_modules`, `dist`, `dist-pages` и `*.tsbuildinfo`. Новый Git-репозиторий создаётся уже в этой отдельной копии. Файл `.github/workflows/pages.yml` автоматически собирает и публикует сайт при push в `main`; также доступен ручной запуск из Actions.

Настройка репозитория: **Settings → Pages → Source: GitHub Actions**. Сборка использует `npm ci`, Node.js 24 и `npm run build`. Деплой загружает только `dist`.

Workflow получает путь страницы от GitHub и передаёт его в Vite как `VITE_BASE_PATH`. Это поддерживает адреса вида `https://USERNAME.github.io/rif-fm/`, корневой сайт и свой домен. Изображения, SVG-иконки, постер видео, favicon и шрифты используют соответствующий путь. Для локальной проверки варианта с подпапкой:

```sh
VITE_BASE_PATH=/rif-fm/ npm run build -- --outDir dist-pages
```

Потоки и ссылки при необходимости задаются в **Settings → Secrets and variables → Actions → Variables** переменными из `.env.example`. Значения `VITE_*` включаются в клиентскую сборку и должны быть публичными.

Первоначальная публикация из отдельной копии через GitHub CLI после входа в нужный аккаунт. Чтобы сохранить текущую глобальную настройку авторизации Git, не запускать `gh auth setup-git`; при входе через `gh auth login` ответить No на предложение настроить авторизацию Git. Следующие две команды `git config --local` задают авторизацию через gh только для нового репозитория сайта:

```sh
git init -b main
git config --local --replace-all credential.https://github.com.helper ''
git config --local --add credential.https://github.com.helper '!gh auth git-credential'
git add .
git commit -m "Publish Rif FM homepage"
gh repo create rif-fm --public --source=. --remote=origin --push
gh api --method POST 'repos/{owner}/{repo}/pages' -f build_type=workflow
gh workflow run pages.yml
```

Последующие обновления: `git add .`, `git commit -m "Update homepage"`, `git push`.

## Vercel

При публикации текущей папки через CLI указать Framework Preset: Vite, Build Command: `npm run build`, Output Directory: `dist`. При импорте отдельного репозитория сайта Root Directory — `./`. Путь `VITE_BASE_PATH` по умолчанию `/`, поэтому существующее размещение на Vercel продолжает работать. В переменные окружения добавить потоки и ссылки при наличии.
