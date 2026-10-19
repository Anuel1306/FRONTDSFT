import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { EmptyState, PageTitle, StateBadge, controlClass, formatDate, primaryButtonClass } from '../components/ui';
import { ARTICLE_STATES, ArticleState, DEADLINES, THEMATIC_LINES, ThematicLine } from '../data/conference';
import { useApp } from '../state/AppContext';

export default function ArticleList() {
  const { articles, users, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [line, setLine] = useState<ThematicLine | 'Todas'>('Todas');
  const [state, setState] = useState<ArticleState | 'Todos'>('Todos');

  const authorName = (id: string) => users.find((user) => user.id === id)?.fullName ?? 'Desconocido';

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesSearch = query === '' || article.title.toLowerCase().includes(query) || authorName(article.authorId).toLowerCase().includes(query);
      const matchesLine = line === 'Todas' || article.thematicLine === line;
      const matchesState = state === 'Todos' || article.state === state;
      return matchesSearch && matchesLine && matchesState;
    });
  }, [articles, users, search, line, state]);

  const canCreate = currentUser?.role === 'Author' && new Date().toISOString().slice(0, 10) <= DEADLINES.postulation;

  return (
    <>
      <PageTitle
        title="Artículos"
        subtitle="Consulta los artículos postulados a la conferencia."
        action={
          canCreate ? (
            <a href="#articulos/nuevo" className={primaryButtonClass}>
              <Icon name="plus" size={16} /> Nuevo artículo
            </a>
          ) : currentUser?.role === 'Author' ? (
            <span className="text-sm text-slate-500">Postulaciones cerradas el {formatDate(DEADLINES.postulation)}</span>
          ) : null
        }
      />

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-3">
        <label className="sr-only" htmlFor="article-search">Buscar por título o autor</label>
        <input
          id="article-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título o autor"
          className={controlClass}
        />
        <label className="sr-only" htmlFor="article-line">Línea temática</label>
        <select id="article-line" value={line} onChange={(event) => setLine(event.target.value as ThematicLine | 'Todas')} className={controlClass}>
          <option value="Todas">Todas las líneas</option>
          {THEMATIC_LINES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="article-state">Estado</label>
        <select id="article-state" value={state} onChange={(event) => setState(event.target.value as ArticleState | 'Todos')} className={controlClass}>
          <option value="Todos">Todos los estados</option>
          {ARTICLE_STATES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No hay artículos que coincidan con los filtros." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {visible.map((article) => (
              <li key={article.id}>
                <a href={`#articulos/${article.id}`} className="flex flex-col gap-2 px-4 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{article.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {authorName(article.authorId)} · {article.thematicLine} · v{article.version}
                    </p>
                  </div>
                  <StateBadge state={article.state} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
