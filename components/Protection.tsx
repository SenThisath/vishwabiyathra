"use client";

import { useEffect } from "react";

export default function ClientProtection() {
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Access Restricted").catch(() => {});
      }
      navigator.clipboard.writeText("").catch(() => {});
    };
    document.addEventListener("keyup", handleKeyUp);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && ["u", "c", "s", "a"].includes(e.key.toLowerCase())) ||
        e.ctrlKey
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
