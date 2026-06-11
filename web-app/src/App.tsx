import { Routes, Route, Navigate } from "react-router-dom";
import { MobileNav, Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./screens/Dashboard";
import { Approvals } from "./screens/Approvals";
import { Activity } from "./screens/Activity";
import { Agents } from "./screens/Agents";
import { Policies } from "./screens/Policies";
import { Command } from "./screens/Command";
import { Settings } from "./screens/Settings";

// App shell: persistent sidebar + a scrollable content column with a sticky
// top bar. Each route renders its own dense desktop screen.
export default function App() {
  return (
    <div className="relative flex min-h-screen overflow-x-clip bg-ink-950 text-txt">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_45%_at_18%_-12%,rgba(139,92,246,0.20),transparent_58%),radial-gradient(ellipse_55%_45%_at_95%_0%,rgba(52,199,119,0.11),transparent_54%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent_78%)]" />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-x-hidden px-4 py-5 pb-28 md:px-6 md:py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/command" element={<Command />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
