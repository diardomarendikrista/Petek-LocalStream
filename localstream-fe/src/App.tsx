import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import WebUI from "./pages/WebUI";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Otomatis arahkan ke Web UI jika diakses dari jaringan LAN (bukan localhost)
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      location.pathname === "/"
    ) {
      navigate("/web", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar untuk Desktop, Topbar untuk Mobile */}
      <aside className="w-full md:w-64 bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col md:flex-col flex-shrink-0">
        <div className="p-4 text-xl font-bold border-b border-gray-700 hidden md:block">
          Petek LocalStream
        </div>
        <nav className="flex flex-row md:flex-col flex-1 p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto items-center md:items-stretch">
          <div className="md:hidden p-2 font-bold mr-2">LS</div>
          <Link
            to="/"
            className="px-3 py-2 rounded hover:bg-gray-700 whitespace-nowrap"
          >
            Dashboard
          </Link>
          <Link
            to="/settings"
            className="px-3 py-2 rounded hover:bg-gray-700 whitespace-nowrap"
          >
            Settings
          </Link>
          <Link
            to="/web"
            className="px-3 py-2 rounded hover:bg-gray-700 whitespace-nowrap bg-blue-600 md:bg-transparent"
          >
            Web UI
          </Link>
        </nav>
      </aside>
      <main
        className={`flex-1 overflow-auto ${location.pathname === "/web" ? "p-0" : "p-4 md:p-8"}`}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/settings"
            element={<Settings />}
          />
          <Route
            path="/web"
            element={<WebUI />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
