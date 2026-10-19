import { useEffect, useState } from 'react';

export interface Route {
  /** First segment of the hash, e.g. "articulos" for "#articulos/a1". */
  name: string;
  /** Second segment, e.g. "a1" for "#articulos/a1" or "nuevo". */
  param?: string;
  /** Third segment, e.g. "editar" for "#articulos/a1/editar". */
  action?: string;
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [name = '', param, action] = clean.split('/');
  return { name: name || '', param, action };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return parseHash(hash);
}

export function go(path: string) {
  window.location.hash = path;
}
