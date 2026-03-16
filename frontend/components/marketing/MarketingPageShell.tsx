"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

const marketingRoutes = [
  "/home",
  "/about",
  "/features",
  "/pricing",
  "/contact",
  "/careers",
  "/press",
  "/news",
  "/helpdesk",
  "/support",
  "/privacy-policy",
  "/terms-and-conditions",
  "/return-policy",
];

const swipeThreshold = 70;
const verticalGuard = 0.6;

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (["input", "textarea", "select", "button", "a"].includes(tagName)) {
    return true;
  }

  return !!target.closest("[data-swipe-ignore]");
}

export default function MarketingPageShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState(1);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const prevPathRef = useRef(pathname);

  const currentIndex = useMemo(() => marketingRoutes.indexOf(pathname), [pathname]);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    if (prevPath === pathname) {
      return;
    }

    const prevIndex = marketingRoutes.indexOf(prevPath);
    if (prevIndex !== -1 && currentIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
    }

    prevPathRef.current = pathname;
  }, [pathname, currentIndex]);

  const goNext = () => {
    if (currentIndex === -1 || currentIndex >= marketingRoutes.length - 1) {
      return;
    }
    router.push(marketingRoutes[currentIndex + 1]);
  };

  const goPrev = () => {
    if (currentIndex <= 0) {
      return;
    }
    router.push(marketingRoutes[currentIndex - 1]);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      return;
    }

    if (isInteractiveTarget(event.target)) {
      return;
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start) {
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < swipeThreshold || absDx < absDy * (1 / verticalGuard)) {
      return;
    }

    if (dx < 0) {
      goNext();
      return;
    }

    if (dx > 0) {
      goPrev();
    }
  };

  return (
    <div
      className="relative overflow-x-hidden"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: (dir: number) => ({
              x: dir > 0 ? 80 : -80,
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (dir: number) => ({
              x: dir > 0 ? -80 : 80,
              opacity: 0,
            }),
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
