"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Cart = {
  count: number;
  add: (name: string) => void;
  /** increments on every add so listeners can play the bump */
  pulse: number;
};

const CartCtx = createContext<Cart>({ count: 0, add: () => {}, pulse: 0 });
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const add = useCallback((name: string) => {
    setCount((c) => c + 1);
    setPulse((p) => p + 1);
    setToast(`${name} added to your bag`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <CartCtx.Provider value={{ count, add, pulse }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed right-4 bottom-4 z-[80] max-w-[calc(100vw-32px)] rounded-full bg-ivory px-5 py-3 text-[14px] font-semibold text-ink shadow-[0_20px_60px_-20px_rgba(0,0,0,.5)] transition-[opacity,transform] duration-300 sm:right-6 sm:bottom-6 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {toast ?? ""}
      </div>
    </CartCtx.Provider>
  );
}
