/** Prefixes a /public path with the deploy base path (next/image does not do this for string sources). */
export function asset(path: string) {
  return path.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}` : path;
}
