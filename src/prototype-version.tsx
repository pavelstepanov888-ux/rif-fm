import { useLayoutEffect, type ReactNode } from 'react';

export function PrototypeVersionProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.prototypeVersion;
    const version = new URLSearchParams(window.location.search).get('version');
    root.dataset.prototypeVersion = version === '2' || version === '3' ? version : '1';
    return () => {
      if (previous === undefined) delete root.dataset.prototypeVersion;
      else root.dataset.prototypeVersion = previous;
    };
  }, []);
  return children;
}
