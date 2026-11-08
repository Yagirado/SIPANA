import Landing from "./pages/landing.jsx";
import Privacy from "./pages/privacy.jsx";
import Terms from "./pages/terms.jsx";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/kebijakan-privasi") return <Privacy />;
  if (path === "/ketentuan-pengguna") return <Terms />;

  return <Landing />;
}
