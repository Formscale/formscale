import { z } from "zod";

export enum SubscriptionTier {
  FREE = "free",
  PRO = "pro",
  BUSINESS = "business",
  ENTERPRISE = "enterprise",
  TEAM = "team",
}

const FeaturesSchema = z.object({
  customSlug: z.boolean(),
  utmTracking: z.boolean(),
  customDomain: z.boolean(),
  successUrl: z.boolean(),
  emailNotifications: z.boolean(),
  reCaptcha: z.boolean(),
  webhook: z.boolean(),
  fileUploads: z.boolean(),
  customTheme: z.boolean(),
});

const TierConfigSchema = z.object({
  maxForms: z.number(),
  maxSubmissionsPerMonth: z.number(),
  maxMembers: z.number(),
  features: FeaturesSchema,
});

export const SubscriptionConfigSchema = z.record(z.nativeEnum(SubscriptionTier), TierConfigSchema);

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
} as const;

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
} as const;

export const TierLimits = SubscriptionConfigSchema.parse({
  [SubscriptionTier.FREE]: {
    maxForms: 3,
    maxSubmissionsPerMonth: 100,
    maxMembers: 3,
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
    maxMembers: 10,
    features: {
      ...baseFeatures,
      ...fullFeatures,
      customDomain: false,
    },
  },
  [SubscriptionTier.BUSINESS]: {
    maxForms: 100,
    maxSubmissionsPerMonth: 100000,
    maxMembers: 50,
    features: {
      ...baseFeatures,
      ...fullFeatures,
      customDomain: false,
    },
  },
  [SubscriptionTier.ENTERPRISE]: {
    maxForms: -1,
    maxSubmissionsPerMonth: -1,
    maxMembers: -1,
    features: fullFeatures,
  },
  [SubscriptionTier.TEAM]: {
    maxForms: -1,
    maxSubmissionsPerMonth: -1,
    maxMembers: -1,
    features: fullFeatures,
  },
});

export const UsageSchema = z.object({
  forms: z.number().default(0),
  submissions: z.number().default(0),
  members: z.number().default(1),
  maxForms: z.number().default(TierLimits[SubscriptionTier.FREE]?.maxForms ?? 0),
  maxSubmissionsPerMonth: z.number().default(TierLimits[SubscriptionTier.FREE]?.maxSubmissionsPerMonth ?? 0),
  maxMembers: z.number().default(TierLimits[SubscriptionTier.FREE]?.maxMembers ?? 0),
});

export type Features = z.infer<typeof FeaturesSchema>;
export type TierConfig = z.infer<typeof TierConfigSchema>;
export type Usage = z.infer<typeof UsageSchema>;
export type SubscriptionConfig = z.infer<typeof SubscriptionConfigSchema>;

export function isFeatureAvailable(tier: SubscriptionTier, feature: keyof Features) {
  return TierLimits[tier]?.features[feature];
}
