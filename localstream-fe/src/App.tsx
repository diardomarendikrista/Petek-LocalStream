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
import MobileConnect from "./pages/MobileConnect";
import WebUI from "./pages/WebUI";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

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

  const handleExit = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require("electron");
      ipcRenderer.send("quit-app");
    } else {
      alert("This feature is only available in the Desktop App.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar untuk Desktop, Topbar untuk Mobile */}
      <aside className="w-full md:w-64 bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col md:flex-col flex-shrink-0">
        <div className="p-4 text-xl font-bold border-b border-gray-700 hidden md:flex items-center space-x-3">
          <img
            src="/petek.jpg"
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover border border-gray-600"
          />
          <span>LocalStream</span>
        </div>
        <nav className="flex flex-row md:flex-col flex-1 p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto items-center md:items-stretch">
          <div className="md:hidden p-2 font-bold mr-2">
            <img
              src="/petek.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover border border-gray-600"
            />
          </div>
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
            to="/mobile"
            className="px-3 py-2 rounded hover:bg-gray-700 whitespace-nowrap"
          >
            Mobile Connect
          </Link>
          <Link
            to="/web"
            className="px-3 py-2 rounded hover:bg-gray-700 whitespace-nowrap bg-blue-600 md:bg-transparent"
          >
            Web UI
          </Link>
        </nav>

        {/* Exit Button (Bottom of Sidebar, Desktop only) */}
        <div className="hidden md:block p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={handleExit}
            className="flex items-center text-red-400 hover:text-red-300 w-full px-3 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <LogOut
              className="mr-2"
              size={18}
            />
            <span>Exit App</span>
          </button>
        </div>
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
            path="/mobile"
            element={<MobileConnect />}
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
