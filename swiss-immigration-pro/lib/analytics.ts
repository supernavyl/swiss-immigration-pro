declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
}

export const analytics = {
  quizStarted: () => trackEvent("quiz_started"),
  quizCompleted: (layer: string) => trackEvent("quiz_completed", { layer }),
  signup: (source?: string) =>
    trackEvent("signup", { source: source || "direct" }),
  login: () => trackEvent("login"),
  checkoutStarted: (packId: string) =>
    trackEvent("checkout_started", { pack: packId }),
  consultationBooked: (type: string) =>
    trackEvent("consultation_booked", { type }),
  chatLimitHit: () => trackEvent("chat_limit_hit"),
  moduleCompleted: (moduleId: string) =>
    trackEvent("module_completed", { module: moduleId }),
  cvCreated: () => trackEvent("cv_created"),
  pricingViewed: () => trackEvent("pricing_viewed"),
  paymentSuccess: (packId?: string) =>
    trackEvent("payment_success", { pack: packId || "unknown" }),
  exitIntentShown: () => trackEvent("exit_intent_shown"),
  exitIntentEmailCaptured: () => trackEvent("exit_intent_email_captured"),
  exitIntentTriggered: () => trackEvent("exit_intent_triggered"),
  exitIntentDismissed: () => trackEvent("exit_intent_dismissed"),
  exitIntentConverted: (email: string) =>
    trackEvent("exit_intent_converted", { email_domain: email.split("@")[1] }),
  exitIntentCtaClicked: () => trackEvent("exit_intent_cta_clicked"),
  upgradeModalShown: (feature: string) =>
    trackEvent("upgrade_modal_shown", { feature }),
  upgradeModalClicked: (packId: string) =>
    trackEvent("upgrade_modal_clicked", { pack: packId }),
};
