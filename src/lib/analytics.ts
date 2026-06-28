type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: PlausibleProps; interactive?: boolean }) => void;
  }
}

export function trackEvent(eventName: string, props?: PlausibleProps) {
  if (typeof window === "undefined") return;
  window.plausible?.(eventName, props ? { props } : undefined);
}
