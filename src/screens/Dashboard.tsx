import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Card, EmptyState, PageTitle, ROLE_LABELS, StateBadge, formatDate } from '../components/ui';
import { ARTICLE_STATES, ArticleState, DEADLINES, THEMATIC_LINES } from '../data/conference';
import { useApp } from '../state/AppContext';
import { AppUser } from '../types/user';
import { go } from '../lib/route';

const PALETTE = ['#6366F1', '#0EA5E9', '#10B981', '#F43F5E', '#F59E0B', '#8B5CF6', '#64748B'];

const baseOptions: ApexOptions = {
  chart: { fontFamily: 'DM Sans, sans-serif', toolbar: { show: false }, animations: { enabled: true } },
  dataLabels: { enabled: false },
  legend: { position: 'bottom', fontSize: '12px' },
  colors: PALETTE,
  tooltip: { theme: 'light' },
};

const ACCEPTED: ArticleState[] = ['Aceptado', 'Con aval para presentación', 'Con aval para publicación'];

function kpi(label: string, value: number, hint?: string) {
  return (
    <Card key={label} className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

function countBy<T extends string>(items: T[], keys: readonly T[]) {
  return keys.map((key) => items.filter((item) => item === key).length);
}

function nextStep(state: ArticleState) {
  switch (state) {
    case 'Propuesta':
      return `Esperando el inicio de la revisión. Postulaciones hasta el ${formatDate(DEADLINES.postulation)}.`;
    case 'En revisión':
      return `Revisión en curso. Los evaluadores entregan antes del ${formatDate(DEADLINES.review)}.`;
    case 'Aceptado':
      return `Sube tu versión corregida antes del ${formatDate(DEADLINES.correction)}.`;
    case 'Rechazado':
      return 'Tu artículo no fue aceptado. Revisa los comentarios de los evaluadores.';
    case 'Con aval para presentación':
      return `Entrega tu versión final antes del ${formatDate(DEADLINES.finalVersion)}.`;
    case 'Con aval para publicación':
      return 'Versión final avalada. No requiere acciones.';
    case 'Deshabilitado':
      return 'Tu artículo fue retirado de la conferencia.';
  }
}

export default function Dashboard() {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  return <DashboardContent user={currentUser} />;
}

function DashboardContent({ user: currentUser }: { user: AppUser }) {
  const { articles, reviews, users, agenda } = useApp();

  const isAuthor = currentUser.role === 'Author';
  const visibleArticles = isAuthor ? articles.filter((article) => article.authorId === currentUser.id) : articles;

  const states = visibleArticles.map((article) => article.state);
  const accepted = visibleArticles.filter((article) => ACCEPTED.includes(article.state)).length;
  const rejected = states.filter((state) => state === 'Rechazado').length;
  const inProgress = states.filter((state) => state === 'Propuesta' || state === 'En revisión').length;

  const donutSeries = useMemo(() => countBy(states, ARTICLE_STATES), [states]);
  const donutLabels = [...ARTICLE_STATES];
  const lineCounts = useMemo(
    () => THEMATIC_LINES.map((line) => visibleArticles.filter((article) => article.thematicLine === line).length),
    [visibleArticles],
  );

  const pendingReviews = articles.filter(
    (article) =>
      article.reviewerIds.includes(currentUser.id) &&
      !reviews.some((review) => review.articleId === article.id && review.reviewerId === currentUser.id),
  ).length;

  const roleCounts = useMemo(() => {
    const roles = ['Admin', 'Committee Member', 'Author'] as const;
    return roles.map((role) => users.filter((user) => user.role === role).length);
  }, [users]);

  return (
    <>
      <PageTitle
        title={isAuthor ? `Hola, ${currentUser.fullName.split(' ')[0]}` : 'Panel de la conferencia'}
        subtitle={`Sesión como ${ROLE_LABELS[currentUser.role]}`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {isAuthor
          ? [
              kpi('Mis artículos', visibleArticles.length),
              kpi('Aceptados', accepted),
              kpi('En proceso', inProgress),
              kpi('Rechazados', rejected),
            ]
          : [
              kpi('Artículos', visibleArticles.length),
              kpi('Aceptados', accepted),
              kpi('En proceso', inProgress),
              kpi(currentUser.role === 'Committee Member' ? 'Revisiones pendientes' : 'Sesiones en agenda', currentUser.role === 'Committee Member' ? pendingReviews : agenda.length),
            ]}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Estado de los artículos</h2>
          {visibleArticles.length === 0 ? (
            <EmptyState message="Aún no hay artículos para mostrar." />
          ) : (
            <Chart type="donut" height={280} series={donutSeries} options={{ ...baseOptions, labels: donutLabels }} />
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Artículos por línea temática</h2>
          <Chart
            type="bar"
            height={280}
            series={[{ name: 'Artículos', data: lineCounts }]}
            options={{
              ...baseOptions,
              legend: { show: false },
              plotOptions: { bar: { borderRadius: 4, horizontal: true } },
              xaxis: {
                categories: [...THEMATIC_LINES],
                labels: { style: { fontSize: '11px' }, formatter: (value: string) => String(Math.round(Number(value))) },
                tickAmount: 4,
                decimalsInFloat: 0,
              },
              yaxis: { labels: { style: { fontSize: '11px' } } },
            }}
          />
        </Card>
      </div>

      {isAuthor ? (
        <Card className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Qué debo hacer</h2>
          {visibleArticles.length === 0 ? (
            <EmptyState message="Todavía no has postulado artículos." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleArticles.map((article) => (
                <li key={article.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <a href={`#articulos/${article.id}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-700">
                      {article.title}
                    </a>
                    <p className="text-xs text-slate-500">{nextStep(article.state)}</p>
                  </div>
                  <StateBadge state={article.state} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : currentUser.role === 'Committee Member' ? (
        <Card className="mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Revisiones pendientes</h2>
            <button type="button" onClick={() => go('revisiones')} className="text-sm font-semibold text-indigo-700 hover:underline">
              Ir a revisiones
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Tienes {pendingReviews} artículo(s) por evaluar. La fecha límite para revisiones es el {formatDate(DEADLINES.review)}.
          </p>
        </Card>
      ) : (
        <Card className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Usuarios por rol</h2>
          <Chart
            type="bar"
            height={200}
            series={[{ name: 'Usuarios', data: roleCounts }]}
            options={{
              ...baseOptions,
              legend: { show: false },
              xaxis: { categories: ['Administradores', 'Miembros del comité', 'Autores'] },
            }}
          />
        </Card>
      )}
    </>
  );
}
