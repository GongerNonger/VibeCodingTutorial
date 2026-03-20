import { NextRequest, NextResponse } from "next/server";
import { store, Lesson, QuizQuestion } from "../../../store";

function generateQuiz(topic: string, lessonTitle: string, lessonNumber: number): QuizQuestion[] {
  const quizTemplates: QuizQuestion[][] = [
    [
      {
        question: `What is the primary focus of "${lessonTitle}"?`,
        options: [
          `Understanding core concepts of ${topic}`,
          "Unrelated programming paradigms",
          "Hardware architecture",
          "Network protocols",
        ],
        correctIndex: 0,
      },
      {
        question: `Why is lesson ${lessonNumber} important in learning ${topic}?`,
        options: [
          "It is not important",
          `It builds foundational knowledge for ${topic}`,
          "It only covers optional topics",
          "It replaces all previous lessons",
        ],
        correctIndex: 1,
      },
      {
        question: `What should you focus on when studying "${lessonTitle}"?`,
        options: [
          "Memorizing every detail without understanding",
          "Skipping to the next lesson immediately",
          "Understanding the key concepts and practicing examples",
          "Only reading the summary",
        ],
        correctIndex: 2,
      },
    ],
    [
      {
        question: `Which concept is central to "${lessonTitle}"?`,
        options: [
          "Database normalization",
          `Key principles discussed in this ${topic} lesson`,
          "Graphic design fundamentals",
          "Operating system internals",
        ],
        correctIndex: 1,
      },
      {
        question: `How does lesson ${lessonNumber} connect to the broader ${topic} curriculum?`,
        options: [
          "It does not connect at all",
          "It only repeats previous content",
          `It expands on earlier concepts and introduces new ${topic} skills`,
          "It is entirely theoretical with no applications",
        ],
        correctIndex: 2,
      },
      {
        question: `What is the best approach to master the content in "${lessonTitle}"?`,
        options: [
          `Practice with hands-on exercises related to ${topic}`,
          "Read once and never revisit",
          "Skip the exercises entirely",
          "Only watch videos about unrelated topics",
        ],
        correctIndex: 0,
      },
    ],
  ];

  return quizTemplates[lessonNumber % quizTemplates.length];
}

function generateLessons(topic: string, description: string, audienceLevel: string): Lesson[] {
  const levelDescriptor =
    audienceLevel === "beginner"
      ? "foundational"
      : audienceLevel === "intermediate"
        ? "intermediate-level"
        : "advanced";

  const lessonTemplates = [
    {
      titleSuffix: "Fundamentals and Core Concepts",
      contentFocus: "fundamental principles and core building blocks",
      takeaways: [
        `Understand the basic principles of ${topic}`,
        `Identify the core components and terminology used in ${topic}`,
        `Recognize why ${topic} matters in the current landscape`,
        "Set up your learning environment and tools",
      ],
    },
    {
      titleSuffix: "Essential Techniques and Methods",
      contentFocus: "essential techniques, patterns, and standard methods",
      takeaways: [
        `Apply essential techniques commonly used in ${topic}`,
        "Understand the standard methods and when to use them",
        "Recognize common patterns and best practices",
        "Build confidence through guided practice exercises",
      ],
    },
    {
      titleSuffix: "Practical Application and Hands-On Practice",
      contentFocus: "hands-on practice, real-world applications, and practical exercises",
      takeaways: [
        `Implement ${topic} concepts in practical scenarios`,
        "Work through real-world examples and case studies",
        "Debug and troubleshoot common issues",
        "Build a small project applying what you have learned",
      ],
    },
    {
      titleSuffix: "Advanced Patterns and Optimization",
      contentFocus: "advanced patterns, optimization strategies, and professional workflows",
      takeaways: [
        `Master ${levelDescriptor} patterns and strategies in ${topic}`,
        "Optimize your workflow for efficiency and quality",
        "Understand trade-offs between different approaches",
        "Learn professional tips and industry conventions",
      ],
    },
    {
      titleSuffix: "Mastery, Integration, and Next Steps",
      contentFocus: "integration strategies, mastery techniques, and paths for continued growth",
      takeaways: [
        `Integrate all ${topic} concepts into a cohesive skill set`,
        "Create a roadmap for continued learning and improvement",
        "Understand how to stay current with evolving practices",
        "Identify advanced resources for deeper exploration",
      ],
    },
  ];

  return lessonTemplates.map((template, index) => ({
    id: `lesson-${index + 1}`,
    title: `Lesson ${index + 1}: ${topic} - ${template.titleSuffix}`,
    content: `In this ${levelDescriptor} lesson on ${topic}, we dive deep into ${template.contentFocus}. ${description} This lesson is designed for ${audienceLevel} learners and provides a structured approach to mastering key aspects of ${topic}. Through a combination of explanations, examples, and exercises, you will gain a solid understanding of the material covered in this section. By the end of this lesson, you should feel confident applying these concepts independently.`,
    keyTakeaways: template.takeaways,
    quiz: generateQuiz(topic, `${topic} - ${template.titleSuffix}`, index),
  }));
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = store.getById(id);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (course.lessonsGenerated) {
    return NextResponse.json(
      { error: "Lessons have already been generated for this course" },
      { status: 400 }
    );
  }

  const lessons = generateLessons(course.topic, course.description, course.audienceLevel);

  const updated = store.update(id, {
    lessons,
    lessonsGenerated: true,
  });

  return NextResponse.json(updated);
}
