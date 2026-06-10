import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
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
    <div className="flex min-h-screen bg-ink-950 text-txt">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-x-hidden px-4 py-5 md:px-6 md:py-6">
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
    </div>
  );
}
