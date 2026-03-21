"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Task {
  id: string;
  text: string;
  urgency: string;
  effort: string;
  category: string;
  priority: number;
  encouragement: string;
  estimatedMinutes: number;
  status: string;
  completedAt?: number;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  skipped: number;
  completionRate: number;
  totalMinutesCompleted: number;
  streak: number;
}

type Screen = "dump" | "focus" | "done";

const CATEGORY_COLORS: Record<string, string> = {
  work: "text-blue-400",
  personal: "text-purple-400",
  health: "text-green-400",
  errands: "text-amber-400",
  creative: "text-pink-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  work: "briefcase",
  personal: "heart",
  health: "activity",
  errands: "shopping-bag",
  creative: "sparkles",
};

const EFFORT_LABELS: Record<string, string> = {
  tiny: "~5 min",
  small: "~15 min",
  medium: "~30 min",
  large: "~60 min",
};

export default function FocusFlow() {
  const [screen, setScreen] = useState<Screen>("dump");
  const [brainDump, setBrainDump] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleBrainDump = async () => {
    if (!brainDump.trim()) return;
    setIsLoading(true);

    const res = await fetch("/api/braindump", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: brainDump }),
    });

    const data = await res.json();
    if (res.ok) {
      setSessionId(data.id);
      setAllTasks(data.tasks);
      // Get next task
      const taskRes = await fetch(`/api/tasks?sessionId=${data.id}`);
      const taskData = await taskRes.json();
      setCurrentTask(taskData.nextTask);
      setStats(taskData.stats);
      setScreen("focus");
      setTimerSeconds(0);
      setTimerActive(true);
    }
    setIsLoading(false);
  };

  const handleAction = async (action: "complete" | "skip") => {
    if (!currentTask || !sessionId) return;
    setIsLoading(true);
    setCelebration(null);

    const res = await fetch(`/api/tasks/${currentTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action }),
    });

    const data = await res.json();
    if (res.ok) {
      setAllTasks(data.allTasks);
      setStats(data.stats);

      if (data.celebration) {
        setCelebration(data.celebration);
        setTimeout(() => setCelebration(null), 3000);
      }

      if (data.nextTask) {
        setCurrentTask(data.nextTask);
        setTimerSeconds(0);
        setTimerActive(true);
      } else {
        setCurrentTask(null);
        setTimerActive(false);
        setScreen("done");
      }
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setScreen("dump");
    setBrainDump("");
    setSessionId(null);
    setCurrentTask(null);
    setStats(null);
    setAllTasks([]);
    setCelebration(null);
    setTimerSeconds(0);
    setTimerActive(false);
    setShowTaskList(false);
  };

  // Brain Dump Screen
  if (screen === "dump") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p className="text-xl text-gray-400 mb-1">
              Your ADHD-friendly task manager
            </p>
            <p className="text-gray-500">
              Brain dump everything. We&apos;ll give you one task at a time.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="block text-lg font-medium text-gray-300 mb-3">
              What&apos;s on your mind? Dump it ALL here.
            </label>
            <textarea
              className="w-full h-48 bg-gray-800 rounded-xl p-4 text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none text-lg"
              placeholder={`Reply to Sarah's email\nGo to the gym\nFinish the quarterly report - urgent!\nBuy groceries for dinner tonight\nCall mom\nClean the kitchen\nWork on blog post idea...`}
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              autoFocus
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                One task per line. Don&apos;t overthink it.
              </p>
              <button
                onClick={handleBrainDump}
                disabled={!brainDump.trim() || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
              >
                {isLoading ? "Processing..." : "Focus me"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="text-2xl mb-1">1</div>
              <div>Brain dump everything</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="text-2xl mb-1">2</div>
              <div>We pick your next task</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="text-2xl mb-1">3</div>
              <div>Do one thing at a time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Focus Screen - One task at a time
  if (screen === "focus" && currentTask) {
    const progress = stats ? (stats.completed / stats.total) * 100 : 0;
    const categoryColor = CATEGORY_COLORS[currentTask.category] || "text-gray-400";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Celebration overlay */}
        {celebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-4xl font-bold text-amber-400 animate-bounce bg-gray-950/80 px-8 py-4 rounded-2xl">
              {celebration}
            </div>
          </div>
        )}

        <div className="w-full max-w-xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{stats?.completed || 0} of {stats?.total || 0} tasks</span>
              <span>{stats?.completionRate || 0}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* The ONE task */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
            <div className={`text-sm font-medium ${categoryColor} mb-2 uppercase tracking-wider`}>
              {currentTask.category}
            </div>

            <h2 className="text-3xl font-bold text-gray-100 mb-4 leading-relaxed">
              {currentTask.text}
            </h2>

            <p className="text-gray-400 italic mb-6 text-lg">
              &ldquo;{currentTask.encouragement}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-8">
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {EFFORT_LABELS[currentTask.effort] || currentTask.effort}
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {currentTask.urgency}
              </span>
            </div>

            {/* Timer */}
            <div className="text-5xl font-mono text-amber-400 mb-8">
              {formatTime(timerSeconds)}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAction("skip")}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-gray-200 transition-all font-medium"
              >
                Skip for now
              </button>
              <button
                onClick={() => handleAction("complete")}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-950 font-bold rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all text-lg"
              >
                Done!
              </button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowTaskList(!showTaskList)}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showTaskList ? "Hide task list" : "Peek at task list"}
            </button>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {timerActive ? "Pause timer" : "Resume timer"}
            </button>
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Start over
            </button>
          </div>

          {/* Task list (hidden by default - ADHD-friendly!) */}
          {showTaskList && (
            <div className="mt-4 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-3">All tasks</h3>
              <div className="space-y-2">
                {allTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 text-sm ${
                      task.status === "completed"
                        ? "text-green-500 line-through"
                        : task.status === "skipped"
                        ? "text-gray-600 line-through"
                        : task.id === currentTask.id
                        ? "text-amber-400 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <span>
                      {task.status === "completed"
                        ? "done"
                        : task.status === "skipped"
                        ? "skip"
                        : task.id === currentTask.id
                        ? "now"
                        : "next"}
                    </span>
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Done Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="text-6xl mb-6">All done</div>
        <h2 className="text-3xl font-bold text-amber-400 mb-4">
          Session Complete!
        </h2>

        {stats && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-400">{stats.skipped}</div>
                <div className="text-sm text-gray-500">Skipped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">{stats.totalMinutesCompleted}m</div>
                <div className="text-sm text-gray-500">Time saved</div>
              </div>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {stats.completionRate}% completion rate
            </p>
          </div>
        )}

        {/* Completed tasks summary */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8 text-left">
          <h3 className="text-sm font-medium text-gray-400 mb-3 text-center">What you accomplished</h3>
          <div className="space-y-2">
            {allTasks
              .filter((t) => t.status === "completed")
              .map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-green-400">
                  <span className="text-green-500">&#10003;</span>
                  <span>{task.text}</span>
                </div>
              ))}
            {allTasks
              .filter((t) => t.status === "skipped")
              .map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-gray-600">
                  <span>&#8212;</span>
                  <span>{task.text}</span>
                </div>
              ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all text-lg"
        >
          New brain dump
        </button>
      </div>
    </div>
  );
}
