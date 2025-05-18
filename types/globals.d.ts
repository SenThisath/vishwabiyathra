export {}

// Create a type for the roles
export type Roles = 'admin' | 'competitor' | 'teacher'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export const subjects: Subject[] = [
  {
    name: "Mathematics",
    icon: "➗",
    color: "bg-blue-100 dark:bg-blue-900",
  },
  {
    name: "Biology",
    icon: "🧬",
    color: "bg-green-100 dark:bg-green-900",
  },
  {
    name: "Physics",
    icon: "🧲",
    color: "bg-purple-100 dark:bg-purple-900",
  },
  {
    name: "Chemistry",
    icon: "⚗️",
    color: "bg-pink-100 dark:bg-pink-900",
  },
  {
    name: "ICT",
    icon: "💻",
    color: "bg-yellow-100 dark:bg-yellow-900",
  },
];