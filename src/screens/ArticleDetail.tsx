import { useState } from 'react';
import Icon from '../components/Icon';
import { Card, EmptyState, PageTitle, ROLE_LABELS, StateBadge, dangerButtonClass, formatDate, primaryButtonClass, secondaryButtonClass } from '../components/ui';
import { go } from '../lib/route';
import { useApp } from '../state/AppContext';

export default function ArticleDetail({ articleId }: { articleId: string }) {
  const { articles, users, reviews, currentUser, disableArticle } = useApp();
  const [confirming, setConfirming] = useState(false);

  const article = articles.find((item) => item.id === articleId);
  if (!currentUser) return null;
  if (!article) return <EmptyState message="No encontramos este artículo." />;

  const author = users.find((user) => user.id === article.authorId);
  const isOwner = author?.id === currentUser.id;
  const isCommittee = currentUser.role === 'Committee Member';
  const isAssignedReviewer = article.reviewerIds.includes(currentUser.id);
  const canSeeComments = isOwner || currentUser.role !== 'Author';
  const articleReviews = reviews.filter((review) => review.articleId === article.id);
  const reviewerName = (id: string) => users.find((user) => user.id === id)?.fullName ?? 'Evaluador';

  return (
    <>
      <a href="#articulos" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900">
        <Icon name="arrow" size={16} /> Volver a artículos
      </a>

      <PageTitle
        title={article.title}
        subtitle={`${author?.fullName ?? 'Autor'} · ${article.thematicLine}`}
        action={<StateBadge state={article.state} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">Resumen</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{article.abstract}</p>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Evaluaciones</h2>
            {!canSeeComments ? (
              <p className="text-sm text-slate-500">Los comentarios de los evaluadores solo son visibles para el autor y el comité.</p>
            ) : articleReviews.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay evaluaciones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {articleReviews.map((review) => (
                  <li key={review.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{reviewerName(review.reviewerId)}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          review.decision === 'Aceptar' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {review.decision}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Datos</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Versión</dt><dd className="font-medium text-slate-900">v{article.version}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Archivo</dt><dd className="truncate font-medium text-slate-900">{article.pdfName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Postulado</dt><dd className="font-medium text-slate-900">{formatDate(article.createdAt)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Autor</dt><dd className="font-medium text-slate-900">{author?.fullName}</dd></div>
              {author && (
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Rol</dt><dd className="font-medium text-slate-900">{ROLE_LABELS[author.role]}</dd></div>
              )}
            </dl>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Comité asignado</h2>
            <ul className="space-y-1 text-sm text-slate-700">
              {article.reviewerIds.map((id) => (
                <li key={id}>{reviewerName(id)}</li>
              ))}
            </ul>
            {isAssignedReviewer && (
              <button type="button" onClick={() => go('revisiones')} className={`${primaryButtonClass} mt-4 w-full`}>
                Evaluar este artículo
              </button>
            )}
          </Card>

          {(isOwner || isCommittee) && article.state !== 'Deshabilitado' && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Acciones</h2>
              <div className="flex flex-col gap-2">
                {isOwner && (
                  <a href={`#articulos/${article.id}/editar`} className={secondaryButtonClass}>
                    <Icon name="file" size={16} /> Editar artículo
                  </a>
                )}
                {isCommittee && !confirming && (
                  <button type="button" onClick={() => setConfirming(true)} className={dangerButtonClass}>
                    Deshabilitar artículo
                  </button>
                )}
                {isCommittee && confirming && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-sm text-rose-800">El artículo se retirará de la conferencia. ¿Continuar?</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          disableArticle(article.id);
                          setConfirming(false);
                        }}
                        className={dangerButtonClass}
                      >
                        Sí, deshabilitar
                      </button>
                      <button type="button" onClick={() => setConfirming(false)} className={secondaryButtonClass}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
