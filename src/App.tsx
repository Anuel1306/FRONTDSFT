import AppShell from './components/AppShell';
import { EmptyState } from './components/ui';
import { useRoute, Route } from './lib/route';
import { AppProvider, useApp } from './state/AppContext';
import Agenda from './screens/Agenda';
import ArticleDetail from './screens/ArticleDetail';
import ArticleForm from './screens/ArticleForm';
import ArticleList from './screens/ArticleList';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import PasswordRecoveryWizard from './screens/PasswordRecoveryWizard';
import Profile from './screens/Profile';
import RegisterScreen from './screens/RegisterScreen';
import Reviews from './screens/Reviews';
import UserManagement from './screens/UserManagement';

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

function Router() {
  const route = useRoute();
  const { currentUser } = useApp();

  // Public screens: they render without the app shell.
  if (route.name === 'recuperar') return <PasswordRecoveryWizard />;
  if (route.name === 'registro') return <RegisterScreen />;

  if (!currentUser) return <LoginScreen />;

  // Signed-in users who land on the login screen go to their dashboard.
  const effective: Route = route.name === '' || route.name === 'login' ? { name: 'inicio' } : route;

  return (
    <AppShell route={effective}>
      <Screen route={effective} />
    </AppShell>
  );
}

function Screen({ route }: { route: Route }) {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  switch (route.name) {
    case 'inicio':
      return <Dashboard />;

    case 'articulos':
      if (route.param === 'nuevo') return <ArticleForm />;
      if (route.param && route.action === 'editar') return <ArticleForm articleId={route.param} />;
      if (route.param) return <ArticleDetail articleId={route.param} />;
      return <ArticleList />;

    case 'agenda':
      return <Agenda />;

    case 'revisiones':
      return <Reviews />;

    case 'usuarios':
      if (currentUser.role === 'Author') {
        return <EmptyState message="No tienes permiso para administrar usuarios." />;
      }
      return <UserManagement />;

    case 'perfil':
      return <Profile />;

    default:
      return <EmptyState message="Esta página no existe." />;
  }
}
