"use client";

import { createContext, useContext, type ReactNode } from "react";
import { toV2 } from "@/lib/v2";



/** v1 paths whose v2 file exists on disk (checked on the server, see app/v2/page.tsx). Empty on v1. */
const AvailableCtx = createContext<ReadonlySet<string>>(new Set());

export function ImageVersionProvider({ available, children }: { available: string[]; children: ReactNode }) {
  return <AvailableCtx.Provider value={new Set(available)}>{children}</AvailableCtx.Provider>;
}

/** The branded v2 path for `src` when this page is version 2 and that file has been added, otherwise `src`. */
export function useVersionedSrc(src: string) {
  return useContext(AvailableCtx).has(src) ? toV2(src) : src;
}
