import { SubscriptionTier } from "@/types";

const baseFeatures = {
  customSlug: false,
  utmTracking: false,
  customDomain: false,
  successUrl: false,
  emailNotifications: false,
  reCaptcha: false,
  fileUploads: false,
  customTheme: false,
};

const fullFeatures = {
  ...baseFeatures,
  customSlug: true,
  utmTracking: true,
  customDomain: true,
  successUrl: true,
  emailNotifications: true,
  reCaptcha: true,
  fileUploads: true,
  customTheme: true,
};

export const TierLimits: Record<
  SubscriptionTier,
  {
    maxForms: number;
    maxSubmissionsPerMonth: number;
    features: typeof baseFeatures;
  }
> = {
  [SubscriptionTier.FREE]: {
    maxForms: 3,
    maxSubmissionsPerMonth: 100,
    features: {
      ...baseFeatures,
      emailNotifications: true,
      fileUploads: true,
    },
  },
  [SubscriptionTier.PRO]: {
    maxForms: 20,
    maxSubmissionsPerMonth: 5000,
    features: {
      ...baseFeatures,
      ...fullFeatures,
      customDomain: false,
    },
  },
  [SubscriptionTier.ENTERPRISE]: {
    maxForms: -1,
    maxSubmissionsPerMonth: -1,
    features: fullFeatures,
  },
  [SubscriptionTier.BENEFIT]: {
    maxForms: -1,
    maxSubmissionsPerMonth: -1,
    features: fullFeatures,
  },
};

export function isFeatureAvailable(tier: SubscriptionTier, feature: keyof (typeof TierLimits)[SubscriptionTier]["features"]) {
  return TierLimits[tier].features[feature];
}
