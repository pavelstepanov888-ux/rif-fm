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

export function LiveLabel() {
  return <div className="live-label"><span className="live-label__dot" aria-hidden="true" /><span className="live-label__text">Сейчас в эфире</span></div>;
}

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

export function Dialog({ children, label, onClose, className = '', closeOnBackdrop = true, animated = false }: { children: ReactNode | ((close: () => void) => ReactNode); label: string; onClose: () => void; className?: string; closeOnBackdrop?: boolean; animated?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const closeRequested = useRef(false);
  const completed = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState(animated ? 'entering' : 'open');
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  const completeClose = () => {
    if (completed.current) return;
    completed.current = true;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    onCloseRef.current();
  };
  const requestClose = () => {
    if (closeRequested.current) return;
    closeRequested.current = true;
    if (!animated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { completeClose(); return; }
    setPhase('closing');
    // transitionend normally finishes the exit; the timer handles interrupted transitions.
    closeTimer.current = setTimeout(completeClose, 320);
  };
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    const oldRootOverflow = document.documentElement.style.overflow;
    if (animated) dialog.autofocus = window.matchMedia('(max-width: 767px)').matches;
    dialog.showModal();
    if (dialog.autofocus && document.activeElement !== dialog) dialog.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    // Establish the visible dialog's initial style before starting the transition.
    if (animated) dialog.getBoundingClientRect();
    const frame = animated ? requestAnimationFrame(() => { if (!closeRequested.current) setPhase('open'); }) : null;
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      dialog.close(); document.body.style.overflow = oldOverflow; document.documentElement.style.overflow = oldRootOverflow; previous?.focus({ preventScroll: true });
    };
  }, [animated]);
  return <dialog ref={ref} className={`dialog ${animated ? 'fullscreen-dialog' : ''} ${className}`} data-phase={animated ? phase : undefined} aria-label={label} onCancel={e => { e.preventDefault(); requestClose(); }} onClick={e => { if(closeOnBackdrop && e.target === e.currentTarget) requestClose(); }} onTransitionEnd={e => { if (closeRequested.current && e.target === e.currentTarget && e.propertyName === 'opacity') completeClose(); }}>{typeof children === 'function' ? children(requestClose) : children}</dialog>;
}
