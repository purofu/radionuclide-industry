import { useEffect, useLayoutEffect } from "react";

/**  useLayoutEffect in the browser, useEffect on the server (Next SSR safe) */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;