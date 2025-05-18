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
        name: "Science",
        icon: "🧪",
        color: "bg-green-100 dark:bg-green-900",
    },
    {
        name: "History",
        icon: "📜",
        color: "bg-amber-100 dark:bg-amber-900",
    },
];