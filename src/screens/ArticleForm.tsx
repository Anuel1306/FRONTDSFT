import { ChangeEvent, FormEvent, useState } from 'react';
import { Card, EmptyState, FieldError, PageTitle, controlClass, primaryButtonClass, secondaryButtonClass } from '../components/ui';
import { DEADLINES, THEMATIC_LINES, ThematicLine } from '../data/conference';
import { go } from '../lib/route';
import { useApp } from '../state/AppContext';

const MAX_PDF_BYTES = 10 * 1024 * 1024;

interface FormErrors {
  title?: string;
  abstract?: string;
  thematicLine?: string;
  pdf?: string;
  form?: string;
}

interface ArticleFormProps {
  /** When set, the form edits this article; otherwise it creates a new one. */
  articleId?: string;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const { articles, currentUser, createArticle, updateArticle } = useApp();
  const existing = articleId ? articles.find((article) => article.id === articleId) : undefined;
  const [errors, setErrors] = useState<FormErrors>({});
  const [pdf, setPdf] = useState<{ name: string } | null>(null);

  if (!currentUser || currentUser.role !== 'Author') {
    return <EmptyState message="Solo los autores pueden postular o editar artículos." />;
  }
  if (articleId && !existing) return <EmptyState message="No encontramos este artículo." />;
  if (existing && existing.authorId !== currentUser.id) {
    return <EmptyState message="Solo el autor puede modificar su artículo." />;
  }
  if (existing && existing.state === 'Deshabilitado') {
    return <EmptyState message="Este artículo fue deshabilitado y ya no puede modificarse." />;
  }

  const isEdit = Boolean(existing);
  const closed = !isEdit && new Date().toISOString().slice(0, 10) > DEADLINES.postulation;

  function handlePdf(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setErrors((current) => ({ ...current, pdf: undefined }));
    if (!file) {
      setPdf(null);
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrors((current) => ({ ...current, pdf: 'El archivo debe ser un PDF.' }));
      event.target.value = '';
      setPdf(null);
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setErrors((current) => ({ ...current, pdf: 'El PDF no puede superar 10 MB.' }));
      event.target.value = '';
      setPdf(null);
      return;
    }
    setPdf({ name: file.name });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    const abstract = String(form.get('abstract') ?? '').trim();
    const thematicLine = String(form.get('thematicLine') ?? '') as ThematicLine;

    const next: FormErrors = {};
    if (title.length < 10 || title.length > 150) next.title = 'El título debe tener entre 10 y 150 caracteres.';
    if (abstract.length < 50 || abstract.length > 1500) next.abstract = 'El resumen debe tener entre 50 y 1500 caracteres.';
    if (!THEMATIC_LINES.includes(thematicLine)) next.thematicLine = 'Selecciona una línea temática.';
    if (!isEdit && !pdf) next.pdf = 'Adjunta el PDF de tu propuesta.';
    if (closed) next.form = `Las postulaciones cerraron el ${DEADLINES.postulation}.`;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (isEdit && existing) {
      updateArticle(existing.id, { title, abstract, thematicLine, pdfName: pdf?.name });
      go(`articulos/${existing.id}`);
      return;
    }

    const created = createArticle({ title, abstract, thematicLine, pdfName: pdf?.name });
    if (!created) {
      setErrors({ form: 'No fue posible guardar el artículo. Revisa la fecha límite de postulaciones.' });
      return;
    }
    go(`articulos/${created.id}`);
  }

  return (
    <>
      <PageTitle
        title={isEdit ? 'Editar artículo' : 'Nuevo artículo'}
        subtitle={isEdit ? 'Los cambios se guardan como nueva versión cuando adjuntas un PDF.' : `Postulaciones abiertas hasta el ${DEADLINES.postulation}.`}
      />

      <Card className="max-w-3xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">Título</label>
            <input id="title" name="title" className={controlClass} defaultValue={existing?.title ?? ''} aria-invalid={Boolean(errors.title)} />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label htmlFor="thematicLine" className="mb-1 block text-sm font-medium text-slate-700">Línea temática</label>
            <select id="thematicLine" name="thematicLine" className={controlClass} defaultValue={existing?.thematicLine ?? ''} aria-invalid={Boolean(errors.thematicLine)}>
              <option value="" disabled>Selecciona una línea</option>
              {THEMATIC_LINES.map((line) => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
            <FieldError message={errors.thematicLine} />
          </div>

          <div>
            <label htmlFor="abstract" className="mb-1 block text-sm font-medium text-slate-700">Resumen</label>
            <textarea
              id="abstract"
              name="abstract"
              rows={6}
              className={`${controlClass} h-auto py-2`}
              defaultValue={existing?.abstract ?? ''}
              aria-invalid={Boolean(errors.abstract)}
            />
            <FieldError message={errors.abstract} />
          </div>

          <div>
            <label htmlFor="pdf" className="mb-1 block text-sm font-medium text-slate-700">
              PDF de la propuesta {isEdit && <span className="font-normal text-slate-500">(opcional, actual: {existing?.pdfName})</span>}
            </label>
            <input
              id="pdf"
              name="pdf"
              type="file"
              accept="application/pdf"
              onChange={handlePdf}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {pdf && <p className="mt-1 text-xs text-slate-500">Archivo seleccionado: {pdf.name}</p>}
            <p className="mt-1 text-xs text-slate-500">Solo PDF, máximo 10 MB.</p>
            <FieldError message={errors.pdf} />
          </div>

          {errors.form && <p className="form-error" role="alert">{errors.form}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className={primaryButtonClass} disabled={closed}>
              {isEdit ? 'Guardar cambios' : 'Postular artículo'}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={() => go(isEdit && existing ? `articulos/${existing.id}` : 'articulos')}>
              Cancelar
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
