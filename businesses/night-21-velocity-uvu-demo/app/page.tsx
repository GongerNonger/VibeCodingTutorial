"use client";

import { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  uvid: string;
  major: string;
  minor: string | null;
  college: string;
  gpa: number;
  completedCredits: number;
  requiredCredits: number;
  expectedGraduation: string;
  skills: string[];
  careerGoals: string[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  skillsTaught: string[];
  description: string;
}

interface Recommendation {
  recommendedCourses: { course: Course; reasoning: string }[];
  graduationTimeline: {
    estimatedSemesters: number;
    estimatedGraduation: string;
    onTrack: boolean;
  };
  riskAlerts: { type: string; severity: string; message: string }[];
  progressSummary: {
    percentComplete: number;
    creditsRemaining: number;
    creditsCompleted: number;
    requiredCredits: number;
  };
}

interface CareerMatch {
  career: {
    id: string;
    title: string;
    averageSalary: number;
    growthRate: number;
    requiredSkills: string[];
  };
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

interface CareerAnalysis {
  matchedPaths: CareerMatch[];
  skillGapAnalysis: {
    currentSkills: string[];
    neededSkills: string[];
    gaps: string[];
  };
}

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"progress" | "courses" | "career" | "skills">("progress");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students);
        if (data.students.length > 0) {
          loadStudentData(data.students[0].id);
        }
        setLoading(false);
      });
  }, []);

  async function loadStudentData(id: string) {
    setLoading(true);
    const [studentRes, adviseRes, careerRes] = await Promise.all([
      fetch(`/api/students/${id}`).then((r) => r.json()),
      fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id }),
      }).then((r) => r.json()),
      fetch("/api/career-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id }),
      }).then((r) => r.json()),
    ]);
    setSelectedStudent(studentRes.student);
    setRecommendation(adviseRes.recommendation);
    setCareerAnalysis(careerRes.analysis);
    setLoading(false);
  }

  if (loading && !selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading Velocity x UVU...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* UVU-branded Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ backgroundColor: "#275D38" }}>
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Velocity</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#275D38", color: "white" }}>
                  UVU
                </span>
              </div>
              <p className="text-xs text-gray-500">AI Academic Advisor &middot; Utah Valley University</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
              Admin Dashboard
            </a>
            {selectedStudent && (
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1"
                style={{ borderColor: selectedStudent ? "#275D38" : undefined }}
                value={selectedStudent.id}
                onChange={(e) => loadStudentData(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.major}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedStudent && recommendation && (
          <>
            {/* Student Info Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                  <p className="text-gray-400 mt-1">
                    {selectedStudent.major}
                    {selectedStudent.minor ? ` / Minor: ${selectedStudent.minor}` : ""}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {selectedStudent.college} &middot; UVID: {selectedStudent.uvid} &middot; Expected {selectedStudent.expectedGraduation}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: "#4CAF50" }}>{selectedStudent.gpa}</div>
                    <div className="text-xs text-gray-500">GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{recommendation.progressSummary.percentComplete}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${recommendation.graduationTimeline.onTrack ? "text-green-400" : "text-amber-400"}`}>
                      {recommendation.graduationTimeline.onTrack ? "On Track" : "Behind"}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    {recommendation.progressSummary.creditsCompleted} / {recommendation.progressSummary.requiredCredits} credits
                  </span>
                  <span className="text-gray-400">
                    {recommendation.progressSummary.creditsRemaining} remaining
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${recommendation.progressSummary.percentComplete}%`, backgroundColor: "#275D38" }}
                  />
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            {recommendation.riskAlerts.length > 0 && (
              <div className="mb-8 space-y-3">
                {recommendation.riskAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 ${
                      alert.severity === "high"
                        ? "bg-red-950/30 border-red-800 text-red-300"
                        : alert.severity === "medium"
                        ? "bg-amber-950/30 border-amber-800 text-amber-300"
                        : "bg-green-950/30 border-green-800 text-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                        alert.severity === "high" ? "bg-red-900 text-red-200" :
                        alert.severity === "medium" ? "bg-amber-900 text-amber-200" :
                        "bg-green-900 text-green-200"
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-semibold text-sm">{alert.type}</span>
                    </div>
                    <p className="text-sm opacity-90">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Navigation - UVU green */}
            <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg border border-gray-800 w-fit">
              {(["progress", "courses", "career", "skills"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  style={activeTab === tab ? { backgroundColor: "#275D38" } : undefined}
                >
                  {tab === "progress" ? "Graduation Progress" : tab === "courses" ? "Recommended Courses" : tab === "career" ? "Career Pathways" : "Skills Tracker"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "progress" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Graduation Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Graduation</span>
                      <span className="text-white font-medium">{recommendation.graduationTimeline.estimatedGraduation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Semesters Remaining</span>
                      <span className="text-white font-medium">{recommendation.graduationTimeline.estimatedSemesters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credits Completed</span>
                      <span className="text-white font-medium">{recommendation.progressSummary.creditsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credits Remaining</span>
                      <span className="text-white font-medium">{recommendation.progressSummary.creditsRemaining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-medium ${recommendation.graduationTimeline.onTrack ? "text-green-400" : "text-amber-400"}`}>
                        {recommendation.graduationTimeline.onTrack ? "On Track" : "Needs Attention"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Advisor Insights</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg p-4 border" style={{ backgroundColor: "rgba(39, 93, 56, 0.1)", borderColor: "rgba(39, 93, 56, 0.3)" }}>
                      <p className="text-sm text-gray-300">
                        {recommendation.graduationTimeline.onTrack
                          ? `Great progress, ${selectedStudent.name.split(" ")[0]}! You are on track to graduate by ${recommendation.graduationTimeline.estimatedGraduation}. Keep maintaining your course load of 15 credits per semester.`
                          : `${selectedStudent.name.split(" ")[0]}, you are currently behind schedule. Consider taking summer courses at UVU or increasing your semester course load to get back on track for your ${selectedStudent.expectedGraduation} target.`}
                      </p>
                    </div>
                    <div className="rounded-lg p-4 border" style={{ backgroundColor: "rgba(39, 93, 56, 0.1)", borderColor: "rgba(39, 93, 56, 0.3)" }}>
                      <p className="text-sm text-gray-300">
                        With a GPA of {selectedStudent.gpa},{" "}
                        {selectedStudent.gpa >= 3.5
                          ? "you are in excellent academic standing. Consider applying for UVU Honors or undergraduate research opportunities."
                          : selectedStudent.gpa >= 3.0
                          ? "you have solid academic standing. Focus on maintaining this while building practical skills through UVU's experiential learning programs."
                          : "consider utilizing UVU's Student Success Center and tutoring services to strengthen your academic performance."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Recommended Next Courses at UVU</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendation.recommendedCourses.map((rec, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xs font-mono" style={{ color: "#4CAF50" }}>{rec.course.code}</span>
                          <h4 className="text-white font-semibold mt-1">{rec.course.name}</h4>
                        </div>
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{rec.course.credits} cr</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{rec.reasoning}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.course.skillsTaught.map((skill) => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(39, 93, 56, 0.2)", color: "#81C784", border: "1px solid rgba(39, 93, 56, 0.4)" }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "career" && careerAnalysis && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Career Pathway Matches</h3>
                <div className="space-y-4">
                  {careerAnalysis.matchedPaths.map((match, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{match.career.title}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Avg. Salary: ${match.career.averageSalary.toLocaleString()} &middot; Growth: {match.career.growthRate}%
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <div className={`text-2xl font-bold ${match.matchScore >= 70 ? "text-green-400" : match.matchScore >= 40 ? "text-amber-400" : "text-red-400"}`}>
                            {match.matchScore}%
                          </div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${match.matchScore >= 70 ? "bg-green-500" : match.matchScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Skills You Have</p>
                          <div className="flex flex-wrap gap-1.5">
                            {match.matchedSkills.map((skill) => (
                              <span key={skill} className="text-xs bg-green-950/50 text-green-300 border border-green-800/50 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Skills to Develop</p>
                          <div className="flex flex-wrap gap-1.5">
                            {match.missingSkills.map((skill) => (
                              <span key={skill} className="text-xs bg-red-950/50 text-red-300 border border-red-800/50 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && careerAnalysis && selectedStudent && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Current Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(39, 93, 56, 0.2)", color: "#81C784", border: "1px solid rgba(39, 93, 56, 0.4)" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Skill Gaps for Career Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {careerAnalysis.skillGapAnalysis.gaps.map((skill) => (
                      <span key={skill} className="bg-amber-950/50 text-amber-300 border border-amber-800/50 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {careerAnalysis.skillGapAnalysis.gaps.length === 0 && (
                    <p className="text-gray-400 text-sm">No significant skill gaps identified. You are well-prepared for your career goals!</p>
                  )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Career Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.careerGoals.map((goal) => (
                      <span key={goal} className="bg-gray-800 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* UVU Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>Velocity AI Academic Advisor &middot; Built for Utah Valley University</p>
        <p className="mt-1 text-gray-600">Orem, Utah &middot; Go Wolverines</p>
      </footer>
    </div>
  );
}
