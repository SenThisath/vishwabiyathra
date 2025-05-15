import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    // Allow access to /admin/* only if role is "admin"
    if (isAdminRoute(req)) {
        if (role === "admin") {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Allow access to /teacher/* only if role is "teacher"
    if (isTeacherRoute(req)) {
        if (role === "teacher") {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next(); // Allow all other routes
});

export const config = {
    matcher: [
        // Skip Next.js internals ano nd all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
