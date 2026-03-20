export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  topic: string;
  description: string;
  audienceLevel: "beginner" | "intermediate" | "advanced";
  lessons: Lesson[];
  lessonsGenerated: boolean;
  createdAt: string;
}

const sampleCourse: Course = {
  id: "sample-ts-101",
  topic: "Introduction to TypeScript",
  description:
    "A comprehensive beginner-friendly course covering TypeScript fundamentals, from basic types to advanced patterns.",
  audienceLevel: "beginner",
  lessonsGenerated: true,
  createdAt: new Date().toISOString(),
  lessons: [
    {
      id: "lesson-1",
      title: "What is TypeScript and Why Use It?",
      content:
        "TypeScript is a strongly-typed superset of JavaScript developed by Microsoft. It adds optional static typing, classes, and interfaces to JavaScript, enabling developers to catch errors at compile time rather than runtime. TypeScript compiles down to plain JavaScript, meaning it runs anywhere JavaScript runs: browsers, Node.js, Deno, and more. The key advantage is that TypeScript provides tooling support with autocompletion, navigation, and refactoring, making large codebases significantly easier to maintain.",
      keyTakeaways: [
        "TypeScript is a superset of JavaScript that adds static typing",
        "It compiles to plain JavaScript and runs everywhere JS runs",
        "Static types catch bugs at compile time instead of runtime",
        "Excellent IDE support with autocompletion and refactoring tools",
      ],
      quiz: [
        {
          question: "What is TypeScript?",
          options: [
            "A completely new programming language",
            "A strongly-typed superset of JavaScript",
            "A JavaScript runtime environment",
            "A CSS preprocessor",
          ],
          correctIndex: 1,
        },
        {
          question: "What does TypeScript compile to?",
          options: ["Machine code", "WebAssembly", "Plain JavaScript", "Java bytecode"],
          correctIndex: 2,
        },
        {
          question: "When are type errors caught in TypeScript?",
          options: [
            "At runtime",
            "At compile time",
            "During deployment",
            "Never automatically",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "lesson-2",
      title: "Basic Types and Type Annotations",
      content:
        "TypeScript provides several basic types including string, number, boolean, array, tuple, enum, any, void, null, and undefined. Type annotations are added using a colon after the variable name, like `let name: string = 'Alice'`. TypeScript can also infer types automatically when you assign a value, so `let count = 5` is automatically typed as number. Arrays can be typed as `number[]` or `Array<number>`. Tuples allow you to express an array with a fixed number of elements whose types are known.",
      keyTakeaways: [
        "Basic types include string, number, boolean, array, and more",
        "Type annotations use colon syntax: let name: string",
        "TypeScript can infer types from assigned values",
        "Tuples represent fixed-length arrays with known element types",
      ],
      quiz: [
        {
          question: "How do you annotate a variable type in TypeScript?",
          options: [
            "let name = string('Alice')",
            "let name: string = 'Alice'",
            "let string name = 'Alice'",
            "let name as string = 'Alice'",
          ],
          correctIndex: 1,
        },
        {
          question: "What happens when you write `let count = 5` in TypeScript?",
          options: [
            "It causes a type error",
            "count is typed as 'any'",
            "count is automatically inferred as number",
            "count has no type",
          ],
          correctIndex: 2,
        },
        {
          question: "Which type represents a fixed-length array with known element types?",
          options: ["Array", "List", "Tuple", "Set"],
          correctIndex: 2,
        },
      ],
    },
    {
      id: "lesson-3",
      title: "Interfaces and Type Aliases",
      content:
        "Interfaces in TypeScript define the shape of an object. They specify what properties an object should have and their types. For example, `interface User { name: string; age: number; }` defines a User shape. Type aliases, created with the `type` keyword, can represent any type including primitives, unions, and intersections. While interfaces can be extended and merged, type aliases are more flexible for complex type compositions. Both are powerful tools for defining contracts in your code.",
      keyTakeaways: [
        "Interfaces define the shape of objects with named properties",
        "Type aliases can represent any type using the 'type' keyword",
        "Interfaces support extension and declaration merging",
        "Type aliases are better for unions, intersections, and complex types",
      ],
      quiz: [
        {
          question: "What do interfaces primarily define in TypeScript?",
          options: [
            "Function implementations",
            "The shape of an object",
            "Variable scoping rules",
            "Module imports",
          ],
          correctIndex: 1,
        },
        {
          question: "Which keyword is used to create a type alias?",
          options: ["interface", "typedef", "type", "alias"],
          correctIndex: 2,
        },
        {
          question: "What feature do interfaces support that type aliases do not?",
          options: [
            "Union types",
            "Declaration merging",
            "Primitive types",
            "Intersection types",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "lesson-4",
      title: "Functions and Generics",
      content:
        "TypeScript allows you to type function parameters and return values explicitly. Arrow functions, regular functions, and methods all support type annotations. Generics enable you to write reusable components that work with multiple types while maintaining type safety. A generic function like `function identity<T>(arg: T): T { return arg; }` works with any type while preserving the specific type information. Generics are used extensively in arrays, promises, and utility types throughout TypeScript.",
      keyTakeaways: [
        "Function parameters and return types can be explicitly annotated",
        "Generics let you write reusable, type-safe components",
        "Generic syntax uses angle brackets: <T>",
        "Generics preserve specific type information across usage",
      ],
      quiz: [
        {
          question:
            "What is the purpose of generics in TypeScript?",
          options: [
            "To make code run faster",
            "To write reusable components that work with multiple types",
            "To define CSS styles",
            "To handle errors",
          ],
          correctIndex: 1,
        },
        {
          question: "What syntax do generics use in TypeScript?",
          options: [
            "Square brackets []",
            "Parentheses ()",
            "Angle brackets <>",
            "Curly braces {}",
          ],
          correctIndex: 2,
        },
        {
          question:
            "In `function identity<T>(arg: T): T`, what does T represent?",
          options: [
            "The string 'T'",
            "A generic type parameter",
            "The TypeScript compiler",
            "A boolean value",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "lesson-5",
      title: "Modules, Enums, and Best Practices",
      content:
        "TypeScript supports ES modules with import/export syntax for organizing code across files. Enums allow you to define a set of named constants, making code more readable. String enums like `enum Direction { Up = 'UP', Down = 'DOWN' }` are particularly useful. Best practices include enabling strict mode in tsconfig.json, avoiding the `any` type, using readonly for immutable data, and leveraging utility types like Partial, Required, Pick, and Omit for type transformations.",
      keyTakeaways: [
        "ES modules with import/export help organize code across files",
        "Enums define named constants for improved code readability",
        "Enable strict mode in tsconfig.json for maximum type safety",
        "Use utility types (Partial, Pick, Omit) for type transformations",
      ],
      quiz: [
        {
          question: "What are enums used for in TypeScript?",
          options: [
            "Looping through arrays",
            "Defining a set of named constants",
            "Creating CSS animations",
            "Managing database connections",
          ],
          correctIndex: 1,
        },
        {
          question: "Which tsconfig.json setting provides maximum type safety?",
          options: ["noEmit", "strict", "allowJs", "skipLibCheck"],
          correctIndex: 1,
        },
        {
          question:
            "Which utility type makes all properties of a type optional?",
          options: ["Required", "Pick", "Partial", "Omit"],
          correctIndex: 2,
        },
      ],
    },
  ],
};

class CourseStore {
  private courses: Map<string, Course> = new Map();

  constructor() {
    this.courses.set(sampleCourse.id, sampleCourse);
  }

  getAll(): Course[] {
    return Array.from(this.courses.values());
  }

  getById(id: string): Course | undefined {
    return this.courses.get(id);
  }

  create(data: { topic: string; description: string; audienceLevel: Course["audienceLevel"] }): Course {
    const id = `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const course: Course = {
      id,
      topic: data.topic,
      description: data.description,
      audienceLevel: data.audienceLevel,
      lessons: [],
      lessonsGenerated: false,
      createdAt: new Date().toISOString(),
    };
    this.courses.set(id, course);
    return course;
  }

  update(id: string, data: Partial<Course>): Course | undefined {
    const course = this.courses.get(id);
    if (!course) return undefined;
    const updated = { ...course, ...data, id };
    this.courses.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.courses.delete(id);
  }
}

// Singleton
export const store = new CourseStore();
