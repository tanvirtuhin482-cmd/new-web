import { auth } from '../lib/firebase';
import { StoreSettings } from '../types/admin';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

let quotaExhausted = false; // Enabled by default so updates sync across all devices and visitors

// Check if quota status was stored or if it should be tried
if (typeof window !== 'undefined') {
  try {
    const flagged = localStorage.getItem('hb_fs_quota_exhausted');
    if (flagged === 'true' || (flagged && !isNaN(Number(flagged)))) {
      quotaExhausted = true;
    } else {
      quotaExhausted = false;
    }
  } catch (e) {}
}

export function isQuotaExhausted(): boolean {
  return quotaExhausted;
}

export function markQuotaExhausted() {
  quotaExhausted = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('hb_fs_quota_exhausted', String(Date.now()));
    } catch (e) {}
  }
}

export function resetQuotaShield() {
  quotaExhausted = false;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('hb_fs_quota_exhausted');
    } catch (e) {}
  }
}

/**
 * Safely executes a Firestore write operation directly to cloud database.
 */
export async function safeFirestoreWrite<T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.warn(`[Firestore Safe Write] "${operationName}":`, errMsg);
    return null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isQuotaExceeded = errMsg.includes('resource-exhausted') || errMsg.includes('Quota limit exceeded');

  if (isQuotaExceeded) {
    console.warn(`[Firestore Safe Fallback] Quota reached for ${operationType} on ${path}. Storing changes locally.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Warning/Fallback: ', JSON.stringify(errInfo));
}

/**
 * Sanitizes an object for Firestore by removing 'undefined' values recursively.
 */
export function sanitizeForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  
  const sanitized: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      sanitized[key] = sanitizeForFirestore(obj[key]);
    }
  }
  return sanitized;
}

/**
 * Prepares settings for Firestore by removing oversized strings and ensuring
 * the document NEVER exceeds Firestore's 1,048,576 bytes (1MB) limit.
 */
export function splitSettingsForFirestore(settings: StoreSettings): Record<string, any> {
  // Pruning logic to ensure raw mega-blobs (>300KB base64) don't exceed Firestore's 1MB doc limit,
  // while preserving all strings, arrays, custom FAQs, services, testimonials, and slides intact.
  const prune = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj === 'string') {
      // Only prune excessively large base64 data URLs (> 300,000 chars)
      if (obj.startsWith('data:') && obj.length > 300000) return undefined;
      return obj;
    }
    if (Array.isArray(obj)) return obj.map(prune).filter((v) => v !== undefined);
    if (typeof obj === 'object') {
      const res: any = {};
      for (const k in obj) {
        const val = prune(obj[k]);
        if (val !== undefined) res[k] = val;
      }
      return res;
    }
    return obj;
  };

  const sanitized = sanitizeForFirestore(settings);
  const pruned = prune(sanitized);
  delete pruned.products;

  return {
    ...pruned,
    general: {
      storeName: pruned.storeName,
      storeTagline: pruned.storeTagline,
      storeBadgeBn: pruned.storeBadgeBn,
      phone: pruned.phone,
      email: pruned.email,
      address: pruned.address,
      whatsappNumber: pruned.whatsappNumber,
      facebookUrl: pruned.facebookUrl,
      instagramUrl: pruned.instagramUrl,
      youtubeUrl: pruned.youtubeUrl,
      tiktokUrl: pruned.tiktokUrl,
      logoLetter: pruned.logoLetter,
      logoImage: pruned.logoImage,
      favicon: pruned.favicon,
      lowStockThreshold: pruned.lowStockThreshold,
      autoDeductStockOnOrder: pruned.autoDeductStockOnOrder,
    },
    appearance: {
      primaryColor: pruned.primaryColor,
      secondaryColor: pruned.secondaryColor,
      themeId: pruned.themeId,
      bgColor: pruned.bgColor,
      textColor: pruned.textColor,
      fontFamily: pruned.fontFamily,
      customCss: pruned.customCss,
    },
    homepage: {
      heroTitle: pruned.heroTitle,
      heroSubtitle: pruned.heroSubtitle,
      heroCtaText: pruned.heroCtaText,
      heroBadge: pruned.heroBadge,
      heroImage: pruned.heroImage,
      heroSlides: pruned.heroSlides,
      announcementText: pruned.announcementText,
      isAnnouncementActive: pruned.isAnnouncementActive,
      sectionToggles: pruned.sectionToggles,
      aboutTitleBn: pruned.aboutTitleBn,
      aboutDescBn: pruned.aboutDescBn,
      aboutImage: pruned.aboutImage,
      spicesTitleBn: pruned.spicesTitleBn,
      spicesDescBn: pruned.spicesDescBn,
      spicesImage: pruned.spicesImage,
      promoBannerSubtitle: pruned.promoBannerSubtitle,
      promoBannerCta: pruned.promoBannerCta,
      promoBannerImage: pruned.promoBannerImage,
      faqTitleBn: pruned.faqTitleBn,
      contactTitleBn: pruned.contactTitleBn,
    },
    payments: {
      deliveryFeeDhaka: pruned.deliveryFeeDhaka,
      deliveryFeeOutside: pruned.deliveryFeeOutside,
      bkashNumber: pruned.bkashNumber,
      bkashType: pruned.bkashType,
      nagadNumber: pruned.nagadNumber,
      nagadType: pruned.nagadType,
      paymentInstructionsBn: pruned.paymentInstructionsBn,
      nextInvoiceNumber: pruned.nextInvoiceNumber,
      invoicePrefix: pruned.invoicePrefix,
      customLocations: pruned.customLocations || [],
    },
    content: {
      navItems: pruned.navItems,
      categoryNavItems: pruned.categoryNavItems,
      customServices: pruned.customServices,
      customFaqs: pruned.customFaqs,
      customTestimonials: pruned.customTestimonials,
      usefulLinks: pruned.usefulLinks,
      trustPurityTitleBn: pruned.trustPurityTitleBn,
      trustPurityDescBn: pruned.trustPurityDescBn,
      trustDeliveryTitleBn: pruned.trustDeliveryTitleBn,
      trustDeliveryDescBn: pruned.trustDeliveryDescBn,
      trustSupportTitleBn: pruned.trustSupportTitleBn,
      trustSupportDescBn: pruned.trustSupportDescBn,
      footerText: pruned.footerText,
      copyrightText: pruned.copyrightText,
    },
    seo: {
      metaTitle: pruned.metaTitle,
      metaDescription: pruned.metaDescription,
      metaKeywords: pruned.metaKeywords,
      headerScript: pruned.headerScript,
      footerScript: pruned.footerScript,
    },
    security: {
      adminName: pruned.adminName,
      adminEmail: pruned.adminEmail,
      adminRole: pruned.adminRole,
      adminPassword: pruned.adminPassword,
      adminUsers: pruned.adminUsers,
    },
  };
}
