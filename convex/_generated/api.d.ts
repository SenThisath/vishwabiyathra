/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as competitions from "../competitions.js";
import type * as inter from "../inter.js";
import type * as intra from "../intra.js";
import type * as meetings from "../meetings.js";
import type * as posts from "../posts.js";
import type * as quizzes from "../quizzes.js";
import type * as reservations from "../reservations.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  competitions: typeof competitions;
  inter: typeof inter;
  intra: typeof intra;
  meetings: typeof meetings;
  posts: typeof posts;
  quizzes: typeof quizzes;
  reservations: typeof reservations;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
