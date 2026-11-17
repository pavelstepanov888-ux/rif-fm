import { asset } from '../assets';
import { Icon } from './ui';

const socialNames = { vk: 'ВКонтакте', rutube: 'Rutube', max: 'MAX', dzen: 'Дзен' };
const footerNetworks = ['vk', 'rutube', 'max', 'dzen'] as const;
const contactNetworks = ['vk', 'rutube', 'dzen'] as const;
const documents = ['Политика конфиденциальности', 'Пользовательские документы', 'Обработка персональных данных', 'Cookie'];

type SocialLinks = Partial<Record<keyof typeof socialNames, string>>;

export function Socials({ footer = false, links, onMissing }: {
  footer?: boolean;
  links?: SocialLinks;
  onMissing: (name: string) => void;
}) {
  const networks = footer ? footerNetworks : contactNetworks;
  return <div className={`socials ${footer ? 'socials--footer' : ''}`}>
    {networks.map(network => {
      const url = links?.[network];
      const name = socialNames[network];
      const icon = <Icon name={network} />;
      return url
        ? <a key={network} className="social-button" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Риф FM — ${name} (откроется в новой вкладке)`}>{icon}</a>
        : <button key={network} type="button" className="social-button" aria-label={`Риф FM — ${name}`} onClick={() => onMissing(name)}>{icon}</button>;
    })}
  </div>;
}

export function Footer({ stationUrl = '', socialLinks, onPending, onMissingSocial }: {
  stationUrl?: string;
  socialLinks?: SocialLinks;
  onPending: (title: string) => void;
  onMissingSocial: (name: string) => void;
}) {
  return <footer className="footer">
    <div className="container footer__inner">
      <a href={`${stationUrl}#air`} className="footer__logo" aria-label="Риф FM — к эфиру">
        <img src={asset('logo-footer.svg')} alt="Риф FM — на волне моего сердца, 95,2 FM" width="280" height="280" loading="lazy" />
      </a>
      <div className="footer__right">
        <div className="footer__columns">
          <div>
            <h3>Радио</h3>
            <a href={`${stationUrl}#air`}>Слушать эфир</a>
            <a href={`${stationUrl}#schedule`}>Расписание</a>
          </div>
          <div>
            <h3>О нас</h3>
            <a href={`${stationUrl}#about`}>О радиостанции</a>
            <a href={`${stationUrl}#contacts`}>Контакты</a>
            <button type="button" onClick={() => onPending('Рекламодателям')}>Рекламодателям</button>
            <button type="button" onClick={() => onPending('Партнёрам')}>Партнёрам</button>
          </div>
          <div>
            <h3>Документы</h3>
            {documents.map(label => <button key={label} type="button" onClick={() => onPending(label)}>{label}</button>)}
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 Радиостанция Риф FM · 95,2 FM</p>
          <Socials footer links={socialLinks} onMissing={onMissingSocial} />
        </div>
      </div>
    </div>
  </footer>;
}

export function Seabed() {
  return <div className="seabed">
    <img src={asset('seabed.png')} width="1920" height="194" alt="" loading="lazy" />
  </div>;
}
