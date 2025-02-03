import { SubscriptionTier } from "@formhook/types";

const baseFeatures = {
  customSlug: false,
  utmTracking: false,
  customDomain: false,
  successUrl: false,
  emailNotifications: false,
  reCaptcha: false,
  webhook: false,
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
  webhook: true,
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
      webhook: true,
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
  [SubscriptionTier.BUSINESS]: {
    maxForms: 100,
    maxSubmissionsPerMonth: 100000,
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

export function isFeatureAvailable(
  tier: SubscriptionTier,
  feature: keyof (typeof TierLimits)[SubscriptionTier]["features"]
) {
  return TierLimits[tier].features[feature];
}
