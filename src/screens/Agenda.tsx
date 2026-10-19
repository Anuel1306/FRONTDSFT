import { ChangeEvent } from 'react';
import { Card, EmptyState, PageTitle, controlClass, formatDate, secondaryButtonClass, primaryButtonClass } from '../components/ui';
import { AgendaSlot, CONFERENCE_DAYS, ROOMS } from '../data/conference';
import { useApp } from '../state/AppContext';

export default function Agenda() {
  const { agenda, articles, users, currentUser, generateAgenda, updateSlot } = useApp();
  if (!currentUser) return null;

  const canEdit = currentUser.role === 'Committee Member';
  const articleById = new Map(articles.map((article) => [article.id, article]));
  const authorName = (articleId: string) => {
    const article = articleById.get(articleId);
    return users.find((user) => user.id === article?.authorId)?.fullName ?? '';
  };

  const sorted = [...agenda].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  return (
    <>
      <PageTitle
        title="Agenda de la conferencia"
        subtitle="Presentaciones por fecha, horario y sala. Los artículos se agrupan por línea temática."
        action={
          canEdit ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={generateAgenda} className={primaryButtonClass}>
                Generar agenda sugerida
              </button>
            </div>
          ) : null
        }
      />

      {sorted.length === 0 ? (
        <EmptyState message={canEdit ? 'Aún no hay agenda. Genera una sugerencia con los artículos aceptados.' : 'La agenda aún no ha sido publicada.'} />
      ) : (
        <div className="space-y-6">
          {CONFERENCE_DAYS.map((day) => {
            const slots = sorted.filter((slot) => slot.date === day);
            if (slots.length === 0) return null;
            return (
              <Card key={day} className="p-0">
                <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">{formatDate(day)}</h2>
                <ul className="divide-y divide-slate-100">
                  {slots.map((slot) => (
                    <li key={slot.id} className={`px-5 py-3 ${articleById.get(slot.articleId)?.authorId === currentUser.id ? 'bg-indigo-50/60' : ''}`}>
                      {canEdit ? (
                        <SlotEditor slot={slot} title={articleById.get(slot.articleId)?.title ?? ''} onChange={(patch) => updateSlot(slot.id, patch)} />
                      ) : (
                        <SlotView slot={slot} title={articleById.get(slot.articleId)?.title ?? ''} author={authorName(slot.articleId)} line={articleById.get(slot.articleId)?.thematicLine ?? ''} />
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      {!canEdit && (
        <a href="#articulos" className={`${secondaryButtonClass} mt-4`}>Consultar artículos</a>
      )}
    </>
  );
}

function SlotView({ slot, title, author, line }: { slot: AgendaSlot; title: string; author: string; line: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-4">
      <p className="text-sm font-semibold text-slate-900">{slot.startTime}</p>
      <div className="min-w-0">
        <a href={`#articulos/${slot.articleId}`} className="block truncate text-sm font-medium text-slate-900 hover:text-indigo-700">{title}</a>
        <p className="text-xs text-slate-500">{author} · {line}</p>
      </div>
      <p className="text-xs font-medium text-slate-500">{slot.room}</p>
    </div>
  );
}

function SlotEditor({
  slot,
  title,
  onChange,
}: {
  slot: AgendaSlot;
  title: string;
  onChange: (patch: Partial<Pick<AgendaSlot, 'date' | 'startTime' | 'room'>>) => void;
}) {
  const id = slot.id;
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_repeat(3,minmax(120px,160px))] md:items-center">
      <p className="truncate text-sm font-medium text-slate-900">{title}</p>
      <label className="sr-only" htmlFor={`date-${id}`}>Fecha</label>
      <select id={`date-${id}`} value={slot.date} onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ date: event.target.value })} className={controlClass}>
        {CONFERENCE_DAYS.map((day) => (
          <option key={day} value={day}>{formatDate(day)}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor={`time-${id}`}>Hora de inicio</label>
      <input id={`time-${id}`} type="time" value={slot.startTime} onChange={(event) => onChange({ startTime: event.target.value })} className={controlClass} />
      <label className="sr-only" htmlFor={`room-${id}`}>Sala</label>
      <select id={`room-${id}`} value={slot.room} onChange={(event) => onChange({ room: event.target.value })} className={controlClass}>
        {ROOMS.map((room) => (
          <option key={room} value={room}>{room}</option>
        ))}
      </select>
    </div>
  );
}
