import { useLayoutEffect, type ReactNode } from 'react';

export function PrototypeVersionProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.prototypeVersion;
    root.dataset.prototypeVersion = new URLSearchParams(window.location.search).get('version') === '2' ? '2' : '1';
    return () => {
      if (previous === undefined) delete root.dataset.prototypeVersion;
      else root.dataset.prototypeVersion = previous;
    };
  }, []);
  return children;
}
