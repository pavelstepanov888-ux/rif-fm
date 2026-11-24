import { createRoot } from 'react-dom/client';
import { App } from '../../src/App';
import { musicHref } from '../../src/music/navigation';

if (!location.hash) history.replaceState(null, '', musicHref());

createRoot(document.getElementById('root')!).render(<App />);
