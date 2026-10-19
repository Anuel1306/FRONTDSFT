import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { INITIAL_USERS, PROTOTYPE_PASSWORD_MIN_LENGTH } from '../data/users';
import {
  AgendaSlot,
  Article,
  ArticleState,
  CONFERENCE_DAYS,
  Decision,
  DEADLINES,
  ROOMS,
  Review,
  SEED_AGENDA,
  SEED_ARTICLES,
  SEED_REVIEWS,
  ThematicLine,
  THEMATIC_LINES,
} from '../data/conference';
import { AppUser } from '../types/user';

export interface ArticleInput {
  title: string;
  abstract: string;
  thematicLine: ThematicLine;
  pdfName?: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
}

interface AppContextValue {
  users: AppUser[];
  setUsers: Dispatch<SetStateAction<AppUser[]>>;
  currentUser: AppUser | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  registerAuthor: (input: RegisterInput) => AppUser;
  updateProfile: (userId: string, patch: Partial<Pick<AppUser, 'fullName' | 'email'>>) => void;

  articles: Article[];
  createArticle: (input: ArticleInput) => Article | null;
  updateArticle: (articleId: string, input: ArticleInput) => void;
  disableArticle: (articleId: string) => void;

  reviews: Review[];
  submitReview: (articleId: string, decision: Decision, comment: string) => void;

  agenda: AgendaSlot[];
  generateAgenda: () => void;
  updateSlot: (slotId: string, patch: Partial<Pick<AgendaSlot, 'date' | 'startTime' | 'room'>>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Accepted states that can be scheduled in the agenda. */
const PRESENTABLE: ArticleState[] = ['Aceptado', 'Con aval para presentación'];

/**
 * Brief rule: 3 committee members review each article.
 * Two or more "accept" decisions accept it; two or more "reject" decisions reject it.
 */
function stateFromReviews(current: ArticleState, reviews: Review[]): ArticleState {
  if (current === 'Deshabilitado' || current === 'Con aval para presentación' || current === 'Con aval para publicación') {
    return current;
  }
  const accepts = reviews.filter((review) => review.decision === 'Aceptar').length;
  const rejects = reviews.filter((review) => review.decision === 'Rechazar').length;
  if (accepts >= 2) return 'Aceptado';
  if (rejects >= 2) return 'Rechazado';
  return reviews.length > 0 ? 'En revisión' : current;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [agenda, setAgenda] = useState<AgendaSlot[]>(SEED_AGENDA);

  const currentUser = useMemo(() => users.find((user) => user.id === currentUserId) ?? null, [users, currentUserId]);

  const login = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      const user = users.find((item) => item.email.toLowerCase() === normalized);
      if (!user) return 'No encontramos una cuenta con ese correo.';
      if (user.status !== 'Active') return 'Tu cuenta está inactiva. Comunícate con el administrador.';
      if (password.length < PROTOTYPE_PASSWORD_MIN_LENGTH) return 'La contraseña no es válida.';
      setCurrentUserId(user.id);
      return null;
    },
    [users],
  );

  const logout = useCallback(() => setCurrentUserId(null), []);

  const registerAuthor = useCallback((input: RegisterInput) => {
    const user: AppUser = {
      id: crypto.randomUUID(),
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      role: 'Author',
      status: 'Active',
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setUsers((current) => [...current, user]);
    setCurrentUserId(user.id);
    return user;
  }, []);

  const updateProfile = useCallback((userId: string, patch: Partial<Pick<AppUser, 'fullName' | 'email'>>) => {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, ...patch } : user)));
  }, []);

  const createArticle = useCallback(
    (input: ArticleInput) => {
      if (!currentUser || currentUser.role !== 'Author') return null;
      if (new Date().toISOString().slice(0, 10) > DEADLINES.postulation) return null;
      const reviewerIds = users.filter((user) => user.role === 'Committee Member' && user.status === 'Active').slice(0, 3).map((user) => user.id);
      const article: Article = {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        abstract: input.abstract.trim(),
        thematicLine: input.thematicLine,
        authorId: currentUser.id,
        state: 'Propuesta',
        pdfName: input.pdfName ?? 'propuesta.pdf',
        version: 1,
        reviewerIds,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setArticles((current) => [article, ...current]);
      return article;
    },
    [currentUser, users],
  );

  const updateArticle = useCallback((articleId: string, input: ArticleInput) => {
    setArticles((current) =>
      current.map((article) => {
        if (article.id !== articleId) return article;
        const newPdf = Boolean(input.pdfName);
        return {
          ...article,
          title: input.title.trim(),
          abstract: input.abstract.trim(),
          thematicLine: input.thematicLine,
          pdfName: input.pdfName ?? article.pdfName,
          version: newPdf ? article.version + 1 : article.version,
        };
      }),
    );
  }, []);

  const disableArticle = useCallback((articleId: string) => {
    setArticles((current) => current.map((article) => (article.id === articleId ? { ...article, state: 'Deshabilitado' } : article)));
  }, []);

  const submitReview = useCallback(
    (articleId: string, decision: Decision, comment: string) => {
      if (!currentUser) return;
      const article = articles.find((item) => item.id === articleId);
      if (!article || !article.reviewerIds.includes(currentUser.id)) return;

      const newReview: Review = {
        id: crypto.randomUUID(),
        articleId,
        reviewerId: currentUser.id,
        decision,
        comment: comment.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const nextReviews = [...reviews.filter((review) => !(review.articleId === articleId && review.reviewerId === currentUser.id)), newReview];
      setReviews(nextReviews);

      const nextState = stateFromReviews(article.state, nextReviews.filter((review) => review.articleId === articleId));
      setArticles((current) => current.map((item) => (item.id === articleId ? { ...item, state: nextState } : item)));
    },
    [articles, currentUser, reviews],
  );

  /** Schedules accepted articles one after another, grouped by thematic line, starting Monday 09:00. */
  const generateAgenda = useCallback(() => {
    const presentable = articles.filter((article) => PRESENTABLE.includes(article.state));
    const byLine = THEMATIC_LINES.flatMap((line) => presentable.filter((article) => article.thematicLine === line));
    const slots: AgendaSlot[] = byLine.map((article, index) => {
      const day = CONFERENCE_DAYS[Math.floor(index / 8) % CONFERENCE_DAYS.length];
      const slotInDay = index % 8;
      const hour = 9 + Math.floor(slotInDay / 2) + (slotInDay >= 4 ? 1 : 0);
      const minutes = slotInDay % 2 === 0 ? '00' : '30';
      return {
        id: crypto.randomUUID(),
        articleId: article.id,
        date: day,
        startTime: `${String(hour).padStart(2, '0')}:${minutes}`,
        room: ROOMS[index % ROOMS.length],
      };
    });
    setAgenda(slots);
  }, [articles]);

  const updateSlot = useCallback((slotId: string, patch: Partial<Pick<AgendaSlot, 'date' | 'startTime' | 'room'>>) => {
    setAgenda((current) => current.map((slot) => (slot.id === slotId ? { ...slot, ...patch } : slot)));
  }, []);

  const value: AppContextValue = {
    users,
    setUsers,
    currentUser,
    login,
    logout,
    registerAuthor,
    updateProfile,
    articles,
    createArticle,
    updateArticle,
    disableArticle,
    reviews,
    submitReview,
    agenda,
    generateAgenda,
    updateSlot,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
