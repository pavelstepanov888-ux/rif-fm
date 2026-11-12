import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from './ui';

type PlaylistFilterProps = {
  id: string;
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
};

export function PlaylistFilter({ id, label, value, options, onChange }: PlaylistFilterProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = `${id}-options`;
  const selected = options.find(option => option.id === value)!;

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();

    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismissOutside, true);
    return () => document.removeEventListener('pointerdown', dismissOutside, true);
  }, [open]);

  function closeAndFocusTrigger() {
    root.current?.querySelector<HTMLButtonElement>('.playlist-filter__trigger')?.focus({ preventScroll: true });
    setOpen(false);
  }

  function handleOptionKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowDown': next = Math.min(index + 1, options.length - 1); break;
      case 'ArrowUp': next = Math.max(index - 1, 0); break;
      case 'Home': next = 0; break;
      case 'End': next = options.length - 1; break;
      case 'Tab': closeAndFocusTrigger(); return;
      default: return;
    }
    event.preventDefault();
    menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[next]?.focus();
  }

  return <div className="playlist-filter" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (!open || event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeAndFocusTrigger();
  }}>
    <Button id={id} type="button" variant="secondary" size="m" iconRight="chevron-down" className="playlist-filter__trigger"
      aria-label={`${label}, ${selected.label}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => open ? closeAndFocusTrigger() : setOpen(true)} onKeyDown={event => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        setOpen(true);
      }}>
      <span>{selected.label}</span>
    </Button>
    {open && <div className="playlist-filter__menu" id={menuId} ref={menu} role="listbox" aria-label={label}>
      {options.map((option, index) => <button key={option.id} type="button" className="playlist-filter__option" role="option"
        aria-selected={option.id === value} tabIndex={-1} onKeyDown={event => handleOptionKey(event, index)} onClick={() => {
          closeAndFocusTrigger();
          onChange(option.id);
        }}>{option.label}</button>)}
    </div>}
  </div>;
}
