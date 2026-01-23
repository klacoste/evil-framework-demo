import { UserDomain } from "./domains/userDomain";
import { UserLoadDomain } from "./domains/userLoadDomain";
import { UserService } from "./services/userService";
import { useSelector } from "./framework/useSelector";
import "./styles.css";

function UserProfileView() {
  const status = useSelector(UserLoadDomain.selectors.getStatus);
  const isLoading = useSelector(UserLoadDomain.selectors.isLoading);
  const user = useSelector(UserDomain.selectors.getUser);
  const hasUser = useSelector(UserDomain.selectors.hasUser);
  const error = useSelector(UserLoadDomain.selectors.getError);

  if (isLoading) {
    return (
      <section className="card">
        <h1>User Profile</h1>
        <p className="status">Loading…</p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="card">
        <h1>User Profile</h1>
        <p className="status error">{error}</p>
        <button onClick={UserService.loadUser}>Retry</button>
      </section>
    );
  }

  if (status === "idle" && hasUser && user) {
    return (
      <section className="card">
        <h1>User Profile</h1>
        <div className="profile">
          <div>
            <span className="label">Name</span>
            <span>{user.name}</span>
          </div>
          <div>
            <span className="label">Email</span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="label">ID</span>
            <span>{user.id}</span>
          </div>
        </div>
        <button onClick={UserService.loadUser}>Reload</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>User Profile</h1>
      <p className="status">Idle</p>
      <button onClick={UserService.loadUser}>Load User</button>
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <UserProfileView />
    </main>
  );
}
