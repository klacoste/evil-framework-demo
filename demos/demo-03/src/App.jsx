import { AuthUserDomain } from "./domains/authUserDomain";
import { DashboardLoadDomain } from "./domains/dashboardLoadDomain";
import { NotificationsDomain } from "./domains/notificationsDomain";
import { PreferencesDomain } from "./domains/preferencesDomain";
import { DashboardService } from "./services/dashboardService";
import { useSelector } from "./framework/useSelector";
import "./styles.css";

function DashboardView() {
  const isLoading = useSelector(DashboardLoadDomain.selectors.isLoading);
  const hasError = useSelector(DashboardLoadDomain.selectors.hasError);
  const error = useSelector(DashboardLoadDomain.selectors.getError);
  const user = useSelector(AuthUserDomain.selectors.getUser);
  const hasUser = useSelector(AuthUserDomain.selectors.hasUser);
  const notifications = useSelector(NotificationsDomain.selectors.getNotifications);
  const hasNotifications = useSelector(
    NotificationsDomain.selectors.hasNotifications
  );
  const preferences = useSelector(PreferencesDomain.selectors.getPreferences);
  const hasPreferences = useSelector(PreferencesDomain.selectors.hasPreferences);

  const isReady = hasUser && hasNotifications && hasPreferences;

  if (isLoading) {
    return (
      <section className="card">
        <h1>Dashboard</h1>
        <p className="status">Loading…</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="card">
        <h1>Dashboard</h1>
        <p className="status error">{error}</p>
        <button onClick={DashboardService.initializeDashboard}>
          Open Dashboard
        </button>
      </section>
    );
  }

  if (isReady && user && preferences) {
    return (
      <section className="card">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back, {user.name}</p>
          </div>
          <button onClick={DashboardService.initializeDashboard}>Reload</button>
        </header>
        <div className="panel">
          <h2>Preferences</h2>
          <div className="grid">
            <div>
              <span className="label">Theme</span>
              <span>{preferences.theme}</span>
            </div>
            <div>
              <span className="label">Layout</span>
              <span>{preferences.layout}</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((note) => (
              <li key={note.id}>{note.label}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p className="status">Idle</p>
      <button onClick={DashboardService.initializeDashboard}>
        Open Dashboard
      </button>
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <DashboardView />
    </main>
  );
}
