import { AuthDomain } from "./domains/authDomain";
import { DashboardDataDomain } from "./domains/dashboardDataDomain";
import { SessionLoadDomain } from "./domains/sessionLoadDomain";
import { UserProfileDomain } from "./domains/userProfileDomain";
import { SessionService } from "./services/sessionService";
import { useSelector } from "./framework/useSelector";
import "./styles.css";

function LoginView() {
  return (
    <section className="card">
      <h1>Welcome</h1>
      <p className="status">Anonymous session</p>
      <button onClick={() => SessionService.initializeSession("user-1")}>
        Login
      </button>
    </section>
  );
}

function DashboardView({ profile, items }) {
  return (
    <section className="card">
      <header className="header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">{profile.name}</p>
        </div>
        <button onClick={SessionService.logout}>Logout</button>
      </header>
      <div className="panel">
        <h2>Overview</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span className="label">{item.label}</span>
              <span className="value">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function App() {
  const isAuthenticated = useSelector(AuthDomain.selectors.isAuthenticated);
  const isLoading = useSelector(SessionLoadDomain.selectors.isLoading);
  const profile = useSelector(UserProfileDomain.selectors.getProfile);
  const items = useSelector(DashboardDataDomain.selectors.getItems);

  if (!isAuthenticated) {
    return (
      <main className="container">
        <LoginView />
      </main>
    );
  }

  if (isLoading || !profile) {
    return (
      <main className="container">
        <section className="card">
          <h1>Dashboard</h1>
          <p className="status">Loading session…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <DashboardView profile={profile} items={items} />
    </main>
  );
}
