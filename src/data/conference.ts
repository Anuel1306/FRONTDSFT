export const THEMATIC_LINES = [
  'Sistemas Inteligentes',
  'Tecnologías en Informática',
  'Educación en Informática',
  'Sistemas de Software',
  'Software en la práctica',
] as const;

export type ThematicLine = (typeof THEMATIC_LINES)[number];

export const ARTICLE_STATES = [
  'Propuesta',
  'En revisión',
  'Aceptado',
  'Rechazado',
  'Con aval para presentación',
  'Con aval para publicación',
  'Deshabilitado',
] as const;

export type ArticleState = (typeof ARTICLE_STATES)[number];

export type Decision = 'Aceptar' | 'Rechazar';

export interface Article {
  id: string;
  title: string;
  abstract: string;
  thematicLine: ThematicLine;
  authorId: string;
  state: ArticleState;
  pdfName: string;
  version: number;
  /** Committee members assigned to review (three per article in the brief). */
  reviewerIds: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  articleId: string;
  reviewerId: string;
  decision: Decision;
  comment: string;
  createdAt: string;
}

export interface AgendaSlot {
  id: string;
  articleId: string;
  /** ISO date (YYYY-MM-DD), Monday to Friday of the conference week. */
  date: string;
  startTime: string;
  room: string;
}

/**
 * Conference calendar. These are placeholder dates for the prototype;
 * replace them with the dates the professor confirms during elicitation.
 */
export const DEADLINES = {
  postulation: '2026-12-15',
  review: '2026-12-31',
  correction: '2027-01-20',
  finalVersion: '2027-02-10',
} as const;

export const CONFERENCE_DAYS = ['2027-02-15', '2027-02-16', '2027-02-17', '2027-02-18', '2027-02-19'] as const;

export const ROOMS = ['Auditorio A', 'Auditorio B', 'Sala 301'] as const;

export const ARTICLE_STATE_STYLES: Record<ArticleState, string> = {
  Propuesta: 'bg-slate-100 text-slate-700 ring-slate-200',
  'En revisión': 'bg-sky-50 text-sky-700 ring-sky-200',
  Aceptado: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Rechazado: 'bg-rose-50 text-rose-700 ring-rose-200',
  'Con aval para presentación': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Con aval para publicación': 'bg-violet-50 text-violet-700 ring-violet-200',
  Deshabilitado: 'bg-zinc-200 text-zinc-600 ring-zinc-300',
};

export const SEED_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Detección temprana de deserción estudiantil con redes neuronales',
    abstract: 'Se propone un modelo de aprendizaje profundo que identifica señales tempranas de deserción en estudiantes de primer semestre.',
    thematicLine: 'Sistemas Inteligentes',
    authorId: '3',
    state: 'En revisión',
    pdfName: 'desercion_v1.pdf',
    version: 1,
    reviewerIds: ['2', '5', '8'],
    createdAt: '2026-10-02',
  },
  {
    id: 'a2',
    title: 'Arquitectura de microservicios para plataformas académicas',
    abstract: 'Análisis comparativo de arquitecturas monolíticas y de microservicios aplicadas a sistemas de gestión universitaria.',
    thematicLine: 'Sistemas de Software',
    authorId: '6',
    state: 'Aceptado',
    pdfName: 'microservicios_v2.pdf',
    version: 2,
    reviewerIds: ['2', '5', '8'],
    createdAt: '2026-09-18',
  },
  {
    id: 'a3',
    title: 'Gamificación en la enseñanza de la programación básica',
    abstract: 'Evaluación de un curso gamificado de introducción a la programación con estudiantes de ingeniería.',
    thematicLine: 'Educación en Informática',
    authorId: '3',
    state: 'Propuesta',
    pdfName: 'gamificacion.pdf',
    version: 1,
    reviewerIds: ['2', '5', '8'],
    createdAt: '2026-10-10',
  },
  {
    id: 'a4',
    title: 'Metodología ágil para proyectos de software en pequeñas empresas',
    abstract: 'Adaptación de Scrum a equipos de menos de cinco personas con recursos limitados.',
    thematicLine: 'Software en la práctica',
    authorId: '4',
    state: 'Rechazado',
    pdfName: 'scrum_pymes.pdf',
    version: 1,
    reviewerIds: ['2', '5', '8'],
    createdAt: '2026-09-30',
  },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'r1', articleId: 'a1', reviewerId: '2', decision: 'Aceptar', comment: 'Buena base metodológica; falta describir el conjunto de datos.', createdAt: '2026-10-12' },
  { id: 'r2', articleId: 'a2', reviewerId: '2', decision: 'Aceptar', comment: 'Comparación clara y bien argumentada.', createdAt: '2026-10-08' },
  { id: 'r3', articleId: 'a2', reviewerId: '5', decision: 'Aceptar', comment: 'Aporta valor práctico para la universidad.', createdAt: '2026-10-09' },
  { id: 'r4', articleId: 'a4', reviewerId: '5', decision: 'Rechazar', comment: 'El caso de estudio no es suficientemente representativo.', createdAt: '2026-10-05' },
  { id: 'r5', articleId: 'a4', reviewerId: '8', decision: 'Rechazar', comment: 'Resultados insuficientes para respaldar las conclusiones.', createdAt: '2026-10-06' },
];

export const SEED_AGENDA: AgendaSlot[] = [
  { id: 's1', articleId: 'a2', date: '2027-02-15', startTime: '09:00', room: 'Auditorio A' },
];
