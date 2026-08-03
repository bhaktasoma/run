export const ONBOARDING_STORAGE_KEY = "soma-plan-onboarding-dismissed-v1";
export const onboardingWasDismissed = (storage: Pick<Storage, "getItem"> = localStorage) => storage.getItem(ONBOARDING_STORAGE_KEY) === "true";
export const saveOnboardingDismissal = (storage: Pick<Storage, "setItem"> = localStorage) => storage.setItem(ONBOARDING_STORAGE_KEY, "true");
