"use client";

import { useState, useEffect, useCallback } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

interface Course {
  id: string;
  topic: string;
  description: string;
  audienceLevel: "beginner" | "intermediate" | "advanced";
  lessons: Lesson[];
  lessonsGenerated: boolean;
  createdAt: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [audienceLevel, setAudienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) return;
    setCreating(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, audienceLevel }),
    });
    if (res.ok) {
      setTopic("");
      setDescription("");
      setAudienceLevel("beginner");
      fetchCourses();
    }
    setCreating(false);
  };

  const selectCourse = async (id: string) => {
    const res = await fetch(`/api/courses/${id}`);
    const data = await res.json();
    setSelectedCourse(data);
    setCurrentLessonIndex(0);
    setQuizAnswers({});
    setQuizSubmitted({});
  };

  const generateLessons = async (courseId: string) => {
    setGenerating(true);
    const res = await fetch(`/api/courses/${courseId}/generate`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setSelectedCourse(data);
      fetchCourses();
    }
    setGenerating(false);
  };

  const handleQuizAnswer = (lessonId: string, questionIndex: number, optionIndex: number) => {
    const key = `${lessonId}-${questionIndex}`;
    if (quizSubmitted[key]) return;
    setQuizAnswers((prev) => ({ ...prev, [key]: optionIndex }));
  };

  const submitQuizAnswer = (lessonId: string, questionIndex: number) => {
    const key = `${lessonId}-${questionIndex}`;
    setQuizSubmitted((prev) => ({ ...prev, [key]: true }));
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => new Set(prev).add(lessonId));
  };

  const currentLesson =
    selectedCourse?.lessons && selectedCourse.lessons.length > 0
      ? selectedCourse.lessons[currentLessonIndex]
      : null;

  const progressPercent =
    selectedCourse?.lessons && selectedCourse.lessons.length > 0
      ? Math.round(
          (completedLessons.size /
            selectedCourse.lessons.length) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 font-bold text-gray-950 text-lg">
              CF
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CourseForge</h1>
              <p className="text-xs text-gray-500">Mini-Course Builder</p>
            </div>
          </div>
          {selectedCourse && (
            <button
              onClick={() => setSelectedCourse(null)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-colors"
            >
              Back to Courses
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!selectedCourse ? (
          <>
            {/* Course Creation Form */}
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-white">Create a New Course</h2>
              <form
                onSubmit={createCourse}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-400">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Introduction to Machine Learning"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-400">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this course should cover..."
                      rows={3}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-400">
                      Target Audience
                    </label>
                    <select
                      value={audienceLevel}
                      onChange={(e) =>
                        setAudienceLevel(e.target.value as "beginner" | "intermediate" | "advanced")
                      }
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={creating}
                      className="rounded-lg bg-emerald-500 px-6 py-2.5 font-medium text-gray-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                    >
                      {creating ? "Creating..." : "Create Course"}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* Course List */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-white">Your Courses</h2>
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses yet. Create one above!</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => selectCourse(course.id)}
                      className="rounded-xl border border-gray-800 bg-gray-900 p-5 text-left hover:border-emerald-500/50 transition-colors"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            course.audienceLevel === "beginner"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : course.audienceLevel === "intermediate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {course.audienceLevel}
                        </span>
                        {course.lessonsGenerated && (
                          <span className="text-xs text-emerald-400">5 lessons</span>
                        )}
                      </div>
                      <h3 className="mb-1 font-semibold text-white">{course.topic}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Course Detail View */
          <div>
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedCourse.audienceLevel === "beginner"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : selectedCourse.audienceLevel === "intermediate"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedCourse.audienceLevel}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedCourse.topic}</h2>
              <p className="mt-1 text-gray-400">{selectedCourse.description}</p>
            </div>

            {!selectedCourse.lessonsGenerated ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-16">
                <p className="mb-4 text-gray-400">
                  This course doesn&apos;t have lessons yet.
                </p>
                <button
                  onClick={() => generateLessons(selectedCourse.id)}
                  disabled={generating}
                  className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-gray-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {generating ? "Generating Lessons..." : "Generate 5 Lessons"}
                </button>
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Course Progress</span>
                    <span className="font-medium text-emerald-400">
                      {completedLessons.size} / {selectedCourse.lessons.length} lessons ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Lesson Navigation Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        index === currentLessonIndex
                          ? "bg-emerald-500 text-gray-950"
                          : "border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                      }`}
                    >
                      {completedLessons.has(lesson.id) && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      Lesson {index + 1}
                    </button>
                  ))}
                </div>

                {/* Current Lesson Card */}
                {currentLesson && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">{currentLesson.title}</h3>
                    <p className="mb-6 leading-relaxed text-gray-300">{currentLesson.content}</p>

                    {/* Key Takeaways */}
                    <div className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <h4 className="mb-3 font-semibold text-emerald-400">Key Takeaways</h4>
                      <ul className="space-y-2">
                        {currentLesson.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quiz */}
                    <div className="mb-6">
                      <h4 className="mb-4 font-semibold text-white">Quiz - Test Your Knowledge</h4>
                      <div className="space-y-4">
                        {currentLesson.quiz.map((q, qIndex) => {
                          const key = `${currentLesson.id}-${qIndex}`;
                          const selectedAnswer = quizAnswers[key];
                          const isSubmitted = quizSubmitted[key];
                          return (
                            <div key={qIndex} className="rounded-lg border border-gray-700 p-4">
                              <p className="mb-3 text-sm font-medium text-gray-200">
                                {qIndex + 1}. {q.question}
                              </p>
                              <div className="space-y-2">
                                {q.options.map((option, oIndex) => {
                                  let optionClass =
                                    "border border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600";
                                  if (selectedAnswer === oIndex && !isSubmitted) {
                                    optionClass =
                                      "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                                  }
                                  if (isSubmitted) {
                                    if (oIndex === q.correctIndex) {
                                      optionClass =
                                        "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                                    } else if (selectedAnswer === oIndex) {
                                      optionClass =
                                        "border-red-500 bg-red-500/10 text-red-300";
                                    }
                                  }
                                  return (
                                    <button
                                      key={oIndex}
                                      onClick={() =>
                                        handleQuizAnswer(currentLesson.id, qIndex, oIndex)
                                      }
                                      disabled={isSubmitted}
                                      className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${optionClass}`}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                              {selectedAnswer !== null && selectedAnswer !== undefined && !isSubmitted && (
                                <button
                                  onClick={() => submitQuizAnswer(currentLesson.id, qIndex)}
                                  className="mt-3 rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-gray-950 hover:bg-emerald-400 transition-colors"
                                >
                                  Submit Answer
                                </button>
                              )}
                              {isSubmitted && (
                                <p
                                  className={`mt-2 text-sm font-medium ${
                                    selectedAnswer === q.correctIndex
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {selectedAnswer === q.correctIndex
                                    ? "Correct!"
                                    : `Incorrect. The correct answer is: ${q.options[q.correctIndex]}`}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lesson Actions */}
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                      <button
                        onClick={() => setCurrentLessonIndex((p) => Math.max(0, p - 1))}
                        disabled={currentLessonIndex === 0}
                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-600 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        Previous Lesson
                      </button>
                      <button
                        onClick={() => markLessonComplete(currentLesson.id)}
                        disabled={completedLessons.has(currentLesson.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          completedLessons.has(currentLesson.id)
                            ? "border border-emerald-500/50 text-emerald-400"
                            : "bg-emerald-500 text-gray-950 hover:bg-emerald-400"
                        }`}
                      >
                        {completedLessons.has(currentLesson.id)
                          ? "Completed"
                          : "Mark as Complete"}
                      </button>
                      <button
                        onClick={() =>
                          setCurrentLessonIndex((p) =>
                            Math.min(selectedCourse.lessons.length - 1, p + 1)
                          )
                        }
                        disabled={currentLessonIndex === selectedCourse.lessons.length - 1}
                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-600 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        Next Lesson
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-sm text-gray-600">
        CourseForge - $39/mo for course creators | Night 8 of 25
      </footer>
    </div>
  );
}
