# Agent Guidelines for grad-app

## Project Overview

This is a Next.js 15 application with React 19, TypeScript, Tailwind CSS v4, MongoDB, and better-auth. The app is a chat application with authentication.

## Build & Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server
```

**Note**: No lint or test scripts are configured. TypeScript strict mode is enabled in tsconfig.json.

## Code Style Guidelines

### Imports & Path Aliases

- Use path alias `@/*` for all imports from `src/`
- Order imports: external libs → internal libs → components
- Group "use client" or "use server" directive at the top of files

```typescript
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSignIn } from "../_hooks/use-signin";
```

### File & Component Naming

- **Components**: PascalCase (`SignInForm.tsx`, `ChatBubble.tsx`)
- **Hooks**: kebab-case with `use-` prefix (`use-signin.ts`, `use-mobile.ts`)
- **Server Actions**: kebab-case with `.actions.ts` suffix (`signin.actions.ts`)
- **API Routes**: `route.ts` in folder-based routing
- **Private folders** (components internal to a feature): prefix with `_` (`_components`, `_hooks`, `_actions`)

### TypeScript

- Enable strict mode; follow strict typing practices
- Explicitly type function parameters and return values
- Use interfaces for object shapes, types for unions/primitives
- Use `Record<string, unknown>` for flexible MongoDB filters

```typescript
type SignInFormValues = {
  email: string;
  password: string;
};

export async function signInWithEmail(values: SignInFormInput): Promise<AuthResult> {
  // implementation
}
```

### Component Patterns

- Use CVA (class-variance-authority) for component variants
- Export both the component and its variants

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("...", {
  variants: { variant: { default: "...", destructive: "..." } },
  defaultVariants: { variant: "default" },
});

function Button({ className, variant, ...props }: ButtonProps) {
  return <Comp className={cn(buttonVariants({ variant, className }))} {...props} />;
}

export { Button, buttonVariants };
```

- Use `"use client"` for components using hooks or browser APIs
- Use `"use server"` for server actions

### Forms & Validation

- Use react-hook-form with inline validation rules
- Use Zod for schema validation when needed
- Display validation errors inline below inputs

```typescript
<Input
  {...register("email", {
    required: "Email is required",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
  })}
/>
{errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
```

### Error Handling

- Wrap async operations in try/catch
- Use typed errors: `catch (error: any)`
- Provide user-friendly error messages
- Log errors for debugging

```typescript
try {
  await mutateAsync(values);
  router.push("/chat");
} catch (error: any) {
  console.error("Sign in error:", error);
  setFormError(error?.message ?? "Something went wrong");
}
```

### API Routes

- Return NextResponse with appropriate status codes
- Always validate authentication before processing
- Convert MongoDB ObjectId to strings for JSON responses

```typescript
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... process request
}
```

### Database (MongoDB/Mongoose)

- Use `connectMongoClient()` (idempotent connection helper)
- Use `db.collection()` for direct MongoDB access
- Call `connectMongoClient()` at the start of API routes/server actions

### UI/Styling

- Use Tailwind CSS with the `@/lib/utils` `cn()` helper for conditional classes
- Follow existing color patterns (e.g., `bg-zinc-800`, `text-zinc-200`)
- Use Radix UI primitives for accessible components
- Place reusable UI components in `src/components/ui/`
- Place feature-specific components in feature folders

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Route groups (no URL path)
│   ├── api/               # API routes
│   └── auth/              # Auth pages (signin, signup, etc.)
├── components/
│   ├── ui/                # Reusable UI components
│   └── common/            # Shared components (header, footer, etc.)
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities, auth, db config
```

### Additional Notes

- This project uses React 19 with Server Components by default
- Client components must explicitly declare `"use client"`
- Server actions use `"use server"` directive
- MongoDB connection is managed via the `connectMongoClient()` helper
- Authentication is handled by better-auth
