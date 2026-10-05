"use client";

import { useEffect } from "react";

// Reveal fades in every `.reveal` element inside the landing page as it
// scrolls into view. Content stays visible if JS never runs, since the
// hiding class is only added here.
export default function Reveal() {
  useEffect(() => {
    const root = document.querySelector(".lp");
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) return;

    root.classList.add("lp--reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
