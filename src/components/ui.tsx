import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { asset } from '../assets';

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={`icon icon--${name} ${className}`} style={{ '--icon-url': `url("${asset(`icon-${name}.svg`)}")` } as CSSProperties} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary'; size?: 'm' | 'l'; icon?: string; iconRight?: string; iconOnly?: boolean;
};
export function Button({ variant = 'primary', size = 'm', icon, iconRight, iconOnly, className = '', children, ...rest }: ButtonProps) {
  return <button className={`button button--${variant} button--${size} ${iconOnly ? 'button--icon' : ''} ${className}`} {...rest}>
    {icon && <Icon name={icon} />}{children}{iconRight && <Icon name={iconRight} />}
  </button>;
}

const heights = [4,16,24,24,16,8,6,6,10,14,12,8,10,20,28,22,10,8,12,20,16,8,6,12,22,28,20,12,6,10,18,24,20,12,8,6,10,16,22,16,10,6,18,28];
export function Wave({ active = false }: { active?: boolean }) {
  return <span aria-hidden="true" className={`wave ${active ? 'wave--active' : ''}`}>
    {heights.map((height, i) => <i key={i} style={{ '--bar-height': `${height}px`, '--bar-delay': `${-i * 61}ms` } as CSSProperties} />)}
  </span>;
}

export function Avatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return <span className="avatar" title={name}>{src && !failed ? <img src={src} alt={name} onError={() => setFailed(true)} /> : name.split(' ').map(p => p[0]).slice(0,2).join('')}</span>;
}

export function Hosts() {
  return <div className="hosts"><div className="hosts__avatars"><Avatar src={asset('host.png')} name="Игорь Федоров" /><Avatar src={asset('guest.png')} name="Михаил Александров" /></div>
    <div className="hosts__names"><strong>Игорь Федоров</strong><span>В гостях: Михаил Александров</span></div>
  </div>;
}

export function LiveLabel() { return <div className="live-label"><span />Сейчас в эфире</div>; }

export function Heading({ first, script, level = 2 }: { first: string; script: string; level?: 1 | 2 }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return <Tag className={`heading heading--${level}`}><span>{first}</span><span className="heading__script">{script}<img src={asset('underline.svg')} alt="" /></span></Tag>;
}

export function Volume({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const previous = useRef(0.7);
  return <div className="volume"><button className={`volume__mute ${value === 0 ? 'is-muted' : ''}`} aria-label={value === 0 ? 'Включить звук' : 'Выключить звук'} onClick={() => { if(value) previous.current = value; onChange(value ? 0 : previous.current); }}><Icon name="volume" /></button>
    <input aria-label="Громкость" type="range" min="0" max="1" step="0.01" value={value} onChange={e => onChange(Number(e.target.value))} style={{ '--volume': `${value * 100}%` } as CSSProperties} />
  </div>;
}

export function Dialog({ children, label, onClose, className = '' }: { children: ReactNode; label: string; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={label} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>{children}</dialog>;
}
