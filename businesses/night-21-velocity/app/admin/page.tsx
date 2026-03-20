"use client";

import { useState, useEffect } from "react";

interface RetentionIndicator {
  metric: string;
  value: string;
  status: "good" | "warning" | "critical";
}

interface Analytics {
  totalStudents: number;
  averageGPA: number;
  averageProgress: number;
  averageCreditsCompleted: number;
  retentionIndicators: RetentionIndicator[];
  popularCareerPaths: { path: string; count: number }[];
  commonSkillGaps: string[];
  departmentBreakdown: { department: string; students: number }[];
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setLoading(false);
      });
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">V</div>
            <h1 className="text-xl font-bold text-white">Velocity</h1>
            <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5">Institution Admin</span>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
            Student View
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Institutional Analytics</h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{analytics.totalStudents}</div>
            <div className="text-sm text-gray-400 mt-1">Total Students</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">{analytics.averageGPA}</div>
            <div className="text-sm text-gray-400 mt-1">Average GPA</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">{analytics.averageProgress}%</div>
            <div className="text-sm text-gray-400 mt-1">Avg. Degree Progress</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">{analytics.averageCreditsCompleted}</div>
            <div className="text-sm text-gray-400 mt-1">Avg. Credits Completed</div>
          </div>
        </div>

        {/* Retention Indicators */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Retention &amp; Success Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.retentionIndicators.map((indicator, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{indicator.metric}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      indicator.status === "good"
                        ? "bg-green-900/50 text-green-300"
                        : indicator.status === "warning"
                        ? "bg-amber-900/50 text-amber-300"
                        : "bg-red-900/50 text-red-300"
                    }`}
                  >
                    {indicator.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{indicator.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Department Breakdown</h3>
            <div className="space-y-3">
              {analytics.departmentBreakdown.map((dept, i) => {
                const pct = Math.round((dept.students / analytics.totalStudents) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{dept.department}</span>
                      <span className="text-gray-400">{dept.students} students ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Career Paths */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Popular Career Aspirations</h3>
            <div className="space-y-3">
              {analytics.popularCareerPaths.map((path, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <span className="text-gray-200">{path.path}</span>
                  <span className="text-sm text-blue-400 font-medium">{path.count} student{path.count !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workforce Readiness - Skill Gaps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">Workforce Readiness - Common Skill Gaps</h3>
          <p className="text-sm text-gray-400 mb-4">Skills students are missing relative to their career aspirations</p>
          <div className="flex flex-wrap gap-2">
            {analytics.commonSkillGaps.map((skill, i) => (
              <span key={i} className="bg-amber-950/50 text-amber-300 border border-amber-800/50 px-3 py-1.5 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Graduation Rate Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Graduation Rate Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">
                {analytics.retentionIndicators.find((r) => r.metric === "On-Track Graduation Rate")?.value || "N/A"}
              </div>
              <p className="text-sm text-gray-400 mt-2">On-Time Graduation Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">{analytics.averageProgress}%</div>
              <p className="text-sm text-gray-400 mt-2">Average Degree Completion</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{analytics.averageGPA}</div>
              <p className="text-sm text-gray-400 mt-2">Institution Average GPA</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>Velocity Admin Portal &middot; Institutional analytics and student success metrics</p>
      </footer>
    </div>
  );
}
