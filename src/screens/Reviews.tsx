import { FormEvent, useState } from 'react';
import { Card, EmptyState, FieldError, PageTitle, StateBadge, controlClass, formatDate, primaryButtonClass } from '../components/ui';
import { DEADLINES, Decision } from '../data/conference';
import { useApp } from '../state/AppContext';
import { Article } from '../data/conference';

export default function Reviews() {
  const { articles, currentUser, reviews } = useApp();
  if (!currentUser || currentUser.role !== 'Committee Member') {
    return <EmptyState message="Esta sección es exclusiva para miembros del comité científico." />;
  }

  const assigned = articles.filter((article) => article.reviewerIds.includes(currentUser.id) && article.state !== 'Deshabilitado');

  return (
    <>
      <PageTitle
        title="Revisiones asignadas"
        subtitle={`Entrega tu evaluación antes del ${formatDate(DEADLINES.review)}. Un artículo queda aceptado o rechazado cuando dos evaluadores coinciden.`}
      />

      {assigned.length === 0 ? (
        <EmptyState message="No tienes artículos asignados por ahora." />
      ) : (
        <div className="space-y-5">
          {assigned.map((article) => (
            <ReviewCard
              key={article.id}
              article={article}
              existing={reviews.find((review) => review.articleId === article.id && review.reviewerId === currentUser.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ReviewCard({
  article,
  existing,
}: {
  article: Article;
  existing?: { decision: Decision; comment: string; createdAt: string };
}) {
  const { submitReview } = useApp();
  const [decision, setDecision] = useState<Decision | ''>(existing?.decision ?? '');
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [errors, setErrors] = useState<{ decision?: string; comment?: string }>({});
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { decision?: string; comment?: string } = {};
    if (!decision) next.decision = 'Selecciona si aceptas o rechazas el artículo.';
    if (comment.trim().length < 20) next.comment = 'El comentario debe tener al menos 20 caracteres.';
    setErrors(next);
    setSaved(false);
    if (Object.keys(next).length > 0 || !decision) return;
    submitReview(article.id, decision, comment);
    setSaved(true);
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a href={`#articulos/${article.id}`} className="text-base font-semibold text-slate-900 hover:text-indigo-700">
            {article.title}
          </a>
          <p className="text-xs text-slate-500">{article.thematicLine} · v{article.version}</p>
        </div>
        <StateBadge state={article.state} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Decisión</legend>
          <div className="flex flex-wrap gap-3">
            {(['Aceptar', 'Rechazar'] as const).map((option) => (
              <label
                key={option}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                  decision === option ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input type="radio" name={`decision-${article.id}`} value={option} checked={decision === option} onChange={() => setDecision(option)} className="sr-only" />
                {option}
              </label>
            ))}
          </div>
          <FieldError message={errors.decision} />
        </fieldset>

        <div>
          <label htmlFor={`comment-${article.id}`} className="mb-1 block text-sm font-medium text-slate-700">Comentarios para el autor</label>
          <textarea
            id={`comment-${article.id}`}
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={`${controlClass} h-auto py-2`}
            aria-invalid={Boolean(errors.comment)}
          />
          <FieldError message={errors.comment} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={primaryButtonClass}>{existing ? 'Actualizar evaluación' : 'Enviar evaluación'}</button>
          {saved && <span className="text-sm text-emerald-700">Evaluación guardada.</span>}
          {existing && !saved && <span className="text-xs text-slate-500">Evaluación enviada el {formatDate(existing.createdAt)}.</span>}
        </div>
      </form>
    </Card>
  );
}
