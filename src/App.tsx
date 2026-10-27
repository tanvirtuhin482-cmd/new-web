/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BannerSlide,
  CartItem,
  ColorTheme,
  FormSubmission,
  Language,
  NavItem,
  ProductItem,
  TemplateId,
  TestimonialItem,
  WebsiteData,
} from './types/website';
import { COLOR_THEMES, TEMPLATES, DEFAULT_REAL_PRODUCTS, DEFAULT_BANNER_SLIDES } from './data/templates';
import { AdminOrder, AdminTab, AdminUserItem, OrderStatus, StoreSettings } from './types/admin';
import { SiteHeader } from './components/site/SiteHeader';
import { ProductDetail } from './components/site/ProductDetail';
import { CategoryNavBar, DEFAULT_CATEGORY_NAV_ITEMS } from './components/site/CategoryNavBar';
import { HeroSection } from './components/site/HeroSection';
import { AboutSection } from './components/site/AboutSection';
import { ServicesSection } from './components/site/ServicesSection';
import { SpicesSection } from './components/site/SpicesSection';
import { PortfolioSection } from './components/site/PortfolioSection';
import { PricingSection } from './components/site/PricingSection';
import { TestimonialsSection } from './components/site/TestimonialsSection';
import { FaqSection } from './components/site/FaqSection';
import { ContactSection } from './components/site/ContactSection';
import { SiteFooter } from './components/site/SiteFooter';
import { CartDrawer } from './components/site/CartDrawer';
import { WishlistDrawer } from './components/site/WishlistDrawer';
import { BookingModal } from './components/site/BookingModal';
import { OrderTrackerModal } from './components/site/OrderTrackerModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { SecretAccessModal } from './components/admin/SecretAccessModal';
import { ExpressOrderModal } from './components/site/ExpressOrderModal';
import { InvoiceReceiptModal } from './components/site/InvoiceReceiptModal';
import { ProductReviewModal } from './components/site/ProductReviewModal';
import { HalalBazarLanding } from './components/site/HalalBazarLanding';
import { VisualEditorProvider, useVisualEditor } from './components/editor/VisualEditorContext';
import { VisualQuickEditModal } from './components/editor/VisualQuickEditModal';
import { LivePreviewTopBar } from './components/editor/LivePreviewTopBar';
import { safeLocalStorageSet } from './utils/imageCompressor';
import { CheckCircle, Eye, Package, Pencil } from 'lucide-react';
import { formatOrderDateTime } from './utils/date';
import {
  sendBrowserOrderNotification,
  requestNotificationPermission,
  playOrderNotificationSound
} from './utils/notifications';
import { db, auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocFromServer, onSnapshot, collection, query, orderBy, getDocs, deleteDoc, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType, sanitizeForFirestore, splitSettingsForFirestore, safeFirestoreWrite } from './utils/firebaseUtils';
import { DEFAULT_CUSTOM_LOCATIONS, findMatchingLocation, parseBangladeshAddress, isInsideDhakaMetro, resolveDeliveryFee } from './utils/bdAddressParser';
import logoImageSrc from './assets/images/logo_halal_bazar_1792836248205.jpg';

const CLIENT_ID = Math.random().toString(36).substring(2, 9);

const DEMO_SLIDE_IDS = new Set(['slide-default-1', 'slide-1791282947239', 'slide-1791282957471', 'hero-main-slide']);
export const sanitizeHeroSlides = (slides?: any[]): BannerSlide[] => {
  if (!slides || !Array.isArray(slides)) return [];
  return slides.filter((s) => s && s.id && !DEMO_SLIDE_IDS.has(s.id));
};
export const sanitizeFooterText = (text: any): string => {
  if (!text || typeof text !== 'string') return '';
  if (text.includes('হালাল বাজার বিডি — আপনার আস্থার বিশ্বস্ত অনলাইন গ্রোসারি শপ।')) return '';
  return text;
};

export const isClothingItem = (p: any): boolean => {
  if (!p) return false;
  const text = `${p.categoryBn || ''} ${p.categoryEn || ''} ${p.nameBn || ''} ${p.nameEn || ''} ${p.descBn || ''}`.toLowerCase();
  return (
    text.includes('পোশাক') ||
    text.includes('পাঞ্জাবি') ||
    text.includes('শাড়ি') ||
    text.includes('থ্রি-পিস') ||
    text.includes('টি-শার্ট') ||
    text.includes('বোরকা') ||
    text.includes('হিজাব') ||
    text.includes('panjabi') ||
    text.includes('saree') ||
    text.includes('t-shirt') ||
    text.includes('abaya') ||
    text.includes('clothing') ||
    text.includes('apparel') ||
    text.includes('কামিজ') ||
    text.includes('ফ্যাব্রিক')
  );
};

const VisualQuickEditConsumer: React.FC<{
  onSave: (field: string, newValue: any, productId?: string) => Promise<void> | void;
  onNavigateToAdminTab?: (tab: AdminTab) => void;
  products: ProductItem[];
}> = ({ onSave, onNavigateToAdminTab, products }) => {
  const { activeQuickEdit, closeQuickEdit } = useVisualEditor();
  return (
    <VisualQuickEditModal
      target={activeQuickEdit}
      onClose={closeQuickEdit}
      onSave={onSave}
      onNavigateToAdminTab={onNavigateToAdminTab}
      products={products}
    />
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [activeTemplateId] = useState<TemplateId>('spices');
  const [activeTheme, setActiveTheme] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem('hb_active_theme_id');
      const found = COLOR_THEMES.find((t) => t.id === savedThemeId);
      if (found) return found;
    }
    return COLOR_THEMES[0]; // গাঢ় সবুজ (রয়েল এমারেল্ড)
  });

  const handleToggleTheme = () => {
    setActiveTheme((prev) => {
      // Toggle between emerald-deep-green (গাঢ় সবুজ) and sky-blue-cyan (আকাশী ব্লু)
      const nextTheme = prev.id === 'emerald-deep-green' ? COLOR_THEMES[1] : COLOR_THEMES[0];
      if (typeof window !== 'undefined') {
        localStorage.setItem('hb_active_theme_id', nextTheme.id);
      }
      setStoreSettings((currentSettings) => {
        const updated = {
          ...currentSettings,
          themeId: nextTheme.id,
          primaryColor: nextTheme.primary,
          secondaryColor: nextTheme.accent,
        };
        safeFirestoreWrite('Update Theme', async () => {
          const cloudPayload = splitSettingsForFirestore(updated);
          await setDoc(doc(db, 'settings', 'global'), cloudPayload, { merge: true });
        });
        fetch('/api/settings/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: updated }),
        }).catch(() => {});
        return updated;
      });
      return nextTheme;
    });
  };

  const handleSelectTheme = (themeId: string) => {
    const found = COLOR_THEMES.find((t) => t.id === themeId);
    if (found) {
      setActiveTheme(found);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hb_active_theme_id', found.id);
      }
      setStoreSettings((currentSettings) => {
        const updated = {
          ...currentSettings,
          themeId: found.id,
          primaryColor: found.primary,
          secondaryColor: found.accent,
        };
        safeFirestoreWrite('Update Theme', async () => {
          const cloudPayload = splitSettingsForFirestore(updated);
          await setDoc(doc(db, 'settings', 'global'), cloudPayload, { merge: true });
        });
        fetch('/api/settings/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: updated }),
        }).catch(() => {});
        return updated;
      });
    }
  };

  // Dedicated Separate Admin Portal State & Auth
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hb_admin_auth') === 'true';
    }
    return false;
  });
  const [currentUser, setCurrentUser] = useState<AdminUserItem | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hb_admin_current_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [isLiveEditActive, setIsLiveEditActive] = useState(false);
  const [isHideFloatingAdminBar, setIsHideFloatingAdminBar] = useState(false);



  // Secret Code Prompt Modal State
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const secretCode = 'tanvir88';

  // Global Secret Code & Keyboard Listeners (Typing tanvir88, admin, Alt+A, or URL hash)
  useEffect(() => {
    let buffer = '';
    let bufferTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
        return;
      }

      // Hotkey: Alt+A or Ctrl+Shift+A
      if (
        (e.altKey && e.key.toLowerCase() === 'a') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        setIsSecretModalOpen(true);
        return;
      }

      // Key sequence buffer (e.g. typing tanvir88 or admin)
      buffer += e.key;
      clearTimeout(bufferTimer);
      bufferTimer = setTimeout(() => {
        buffer = '';
      }, 2500);

      if (buffer.endsWith('tanvir88') || buffer.toLowerCase().endsWith('admin')) {
        buffer = '';
        setIsSecretModalOpen(true);
      }
    };

    const handleHashCheck = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.hash === '#tanvir88' ||
        window.location.search.includes('code=tanvir88')
      ) {
        setIsSecretModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashCheck);

    handleHashCheck();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashCheck);
      clearTimeout(bufferTimer);
    };
  }, []);

  // Store Settings with localStorage
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const defaultSettings: StoreSettings = {
      storeName: 'Halal Bazar BD',
      storeTagline: 'শতভাগ প্রিমিয়াম ড্রাই ফ্রুটস, বাদাম ও খাঁটি অর্গানিক খাদ্যপণ্য',
      storeBadgeBn: 'বিশ্বাস ও শুদ্ধতার আস্থা',
      logoLetter: 'হ',
      logoImage: logoImageSrc,
      primaryColor: '#064e3b', // গাঢ় সবুজ (Deep Green)
      secondaryColor: '#0284c7', // আকর্ষণীয় আকাশী ব্লু (Sky Blue)
      themeId: 'emerald-deep-green',
      phone: '01329571899,01793439488',
      email: 'tanvir.ahmed.personal.access88@gmail.com',
      address: 'Hemayetpur , Savar ,Dhaka .',
      deliveryFeeDhaka: 70,
      deliveryFeeOutside: 130,
      lowStockThreshold: 15,
      enableLowStockAlerts: true,
      nextInvoiceNumber: 1,
      invoicePrefix: 'INV-',
      bkashNumber: '01793439488',
      bkashType: 'personal',
      nagadNumber: '01329571899',
      nagadType: 'personal',
      whatsappNumber: '01329571899',
      paymentInstructionsBn: 'বিকাশ বা নগদ থেকে উপরের নম্বরে Send Money / পেমেন্ট করার পর নিচের বক্সে আপনার বিকাশ/নগদ নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।',
      announcementText: 'বিশেষ ধামাকা অফার: সকল প্রিমিয়াম ড্রাই ফ্রুটস ও বাদামে আকর্ষণীয় মূল্যছাড়!',
      isAnnouncementActive: true,
      heroBadge: 'আমাদের বিশুদ্ধতার অঙ্গীকার',
      heroTitle: 'কোনো ভেজাল নেই, শতভাগ প্রাকৃতিক স্বাদে রান্নায় আনুন খাঁটি তৃপ্তি',
      heroSubtitle: 'বিশ্বের সেরা বাগান থেকে বাছাইকৃত ১০০% প্রিমিয়াম কাজুবাদাম, কাঠবাদাম, পেস্তা, কিসমিস ও খেজুরের সেরা সমাহার।',
      heroCtaText: 'অর্ডার করুন',
      heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
      heroSlides: [],
      footerText: '',
      navItems: TEMPLATES.spices.navItems,
      categoryNavItems: DEFAULT_CATEGORY_NAV_ITEMS,
      facebookUrl: 'https://www.facebook.com/profile.php?id=100069870883835',
      spicesImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      promoBannerSubtitle: 'আপনার পছন্দের পণ্য অর্ডার করুন সহজেই।',
      promoBannerCta: 'অর্ডার করতে ক্লিক করুন',
      aboutImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      customLocations: DEFAULT_CUSTOM_LOCATIONS,
    };
    const saved = localStorage.getItem('hb_store_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged: StoreSettings = { ...defaultSettings, ...parsed };
        if (!merged.customLocations || !Array.isArray(merged.customLocations) || merged.customLocations.length === 0) {
          merged.customLocations = DEFAULT_CUSTOM_LOCATIONS;
        }
        if (!merged.nextInvoiceNumber || isNaN(merged.nextInvoiceNumber) || merged.nextInvoiceNumber < 1) {
          merged.nextInvoiceNumber = 1;
        }
        return merged;
      } catch (e) {}
    }
    return defaultSettings;
  });

  // Helper to clean, deduplicate, and strictly sequence orders
  const cleanAndNormalizeOrders = (rawOrders: any[], prefix = 'INV-', filterArchived: boolean | null = null) => {
    if (!Array.isArray(rawOrders)) return [];

    let filtered = rawOrders.filter((ord: any) => {
      if (!ord || !ord.id) return false;
      if (ord.id.startsWith('demo-') || ord.isDeleted === true || ord.deletedAt) return false;
      return true;
    });

    if (filterArchived === true) {
      filtered = filtered.filter(o => o.isArchived !== true); // Allow false, undefined, or missing
    } else if (filterArchived === false) {
      filtered = filtered.filter(o => o.isArchived === true); // Strict true check
    }

    const mapById = new Map<string, any>();
    for (const ord of filtered) {
      mapById.set(ord.id, ord);
    }
    const uniqueOrders = Array.from(mapById.values());

    const getOrderTimestamp = (ord: any): number => {
      if (ord.createdAtTimestamp && typeof ord.createdAtTimestamp === 'number') {
        return ord.createdAtTimestamp;
      }
      if (ord.id) {
        const match = String(ord.id).match(/\d{10,}/);
        if (match) {
          return parseInt(match[0], 10);
        }
      }
      if (ord.createdAt && typeof ord.createdAt === 'string') {
        const parts = ord.createdAt.match(/(\d{1,2})-(\d{1,2})-(\d{4}),?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (parts) {
          const [_, day, month, year, hours, mins, ampm] = parts;
          let h = parseInt(hours, 10);
          if (ampm && ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
          return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), h, parseInt(mins, 10)).getTime();
        }
      }
      return 0;
    };

    // Sort strictly from oldest to newest
    uniqueOrders.sort((a: any, b: any) => getOrderTimestamp(a) - getOrderTimestamp(b));

    // Map without shifting existing valid numbers, ensuring unique serial and invoice numbers
    const usedSerials = new Set<number>();
    const usedInvoices = new Set<string>();

    const processed = uniqueOrders.map((ord: any, idx: number) => {
      let candidateSerial = Number(ord.serialNo);
      if (isNaN(candidateSerial) || candidateSerial <= 0 || usedSerials.has(candidateSerial)) {
        const parsedOrdNo = Number(ord.orderNumber);
        if (!isNaN(parsedOrdNo) && parsedOrdNo > 0 && !usedSerials.has(parsedOrdNo)) {
          candidateSerial = parsedOrdNo;
        } else {
          let fallback = idx + 1;
          while (usedSerials.has(fallback)) {
            fallback++;
          }
          candidateSerial = fallback;
        }
      }
      usedSerials.add(candidateSerial);

      let invoiceNo = ord.invoiceNumber;
      if (!invoiceNo || usedInvoices.has(invoiceNo)) {
        invoiceNo = prefix ? `${prefix}${String(candidateSerial).padStart(4, '0')}` : `${candidateSerial}`;
      }
      while (usedInvoices.has(invoiceNo)) {
        candidateSerial++;
        invoiceNo = prefix ? `${prefix}${String(candidateSerial).padStart(4, '0')}` : `${candidateSerial}`;
      }
      usedInvoices.add(invoiceNo);

      return {
        ...ord,
        serialNo: candidateSerial,
        orderNumber: `${candidateSerial}`,
        invoiceNumber: invoiceNo,
      };
    });

    // Display newest orders first
    return processed.reverse();
  };

  // One-time purge of previously removed / test sample invoices from Firestore and local storage (Admin only)
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const purgeOldSampleOrders = async () => {
      try {
        const ordersCol = collection(db, 'orders');
        const snap = await getDocs(ordersCol);
        const deletePromises: Promise<void>[] = [];

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (
            docSnap.id.startsWith('demo-') ||
            data?.isDeleted === true
          ) {
            deletePromises.push(deleteDoc(docSnap.ref));
          }
        });

        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
        }

        // Purge any order LocalStorage caching completely per mandate
        try {
          localStorage.removeItem('hb_admin_orders');
          localStorage.removeItem('hb_admin_archived_orders');
          localStorage.removeItem('orders');
        } catch (e) {}
      } catch (err) {
        console.warn('Sample order purge notice:', err);
      }
    };

    purgeOldSampleOrders();
  }, []);

  // Real-time synchronization across all open tabs, windows, and devices
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('halal_bazar_realtime_sync');
      channel.onmessage = (event) => {
        if (!event.data || event.data.sender === CLIENT_ID) return;
        const { type, payload } = event.data;
        if (type === 'SYNC_PRODUCTS') {
          setProducts(Array.isArray(payload) ? payload.filter(p => !isClothingItem(p)) : payload);
        } else if (type === 'SYNC_SETTINGS') {
          setStoreSettings(payload);
        } else if (type === 'SYNC_ORDERS') {
          const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
          setOrders(cleanAndNormalizeOrders(payload, prefix, true));
        } else if (type === 'SYNC_SUBMISSIONS') {
          setSubmissions(payload);
        } else {
          fetch('/api/sync').then(res => res.json()).then(data => {
            if (data && Array.isArray(data.orders)) {
              const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
              setOrders(cleanAndNormalizeOrders(data.orders, prefix, true).filter((o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived !== true));
            }
            if (data && Array.isArray(data.products)) {
              setProducts(data.products.filter((p: any) => !isClothingItem(p)));
            }
            if (data && data.settings) {
              setStoreSettings((prev) => ({ ...prev, ...data.settings }));
            }
          }).catch(() => {});
        }
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hb_live_products' && e.newValue) {
        try { 
          const parsed = JSON.parse(e.newValue);
          setProducts(Array.isArray(parsed) ? parsed.filter(p => !isClothingItem(p)) : parsed);
        } catch (err) {}
      } else if (e.key === 'hb_store_settings' && e.newValue) {
        try { setStoreSettings(JSON.parse(e.newValue)); } catch (err) {}
      } else if (e.key === 'hb_admin_submissions' && e.newValue) {
        try { setSubmissions(JSON.parse(e.newValue)); } catch (err) {}
      } else {
        fetch('/api/sync').then(res => res.json()).then(data => {
          if (data && Array.isArray(data.orders)) {
            const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
            setOrders(cleanAndNormalizeOrders(data.orders, prefix, true).filter((o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived !== true));
          }
        }).catch(() => {});
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [storeSettings]);

  // Real-time synchronization across multiple physical devices & tabs (SSE + Polling + Window Focus Auto-Refresh)
  useEffect(() => {
    let active = true;

    const processSyncData = (data: any) => {
      if (!data || !active) return;
      // Protect recent local edits from being overwritten by delayed server responses
      if (Date.now() - lastLocalUpdateRef.current < 4000) return;

      if (Array.isArray(data.orders)) {
        const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
        const cleanActive = cleanAndNormalizeOrders(data.orders, prefix, true).filter(
          (o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived !== true
        );
        setOrders(cleanActive);
      }

      if (Array.isArray(data.archivedOrders)) {
        const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
        const cleanArchived = cleanAndNormalizeOrders(data.archivedOrders, prefix, false).filter(
          (o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived === true
        );
        setArchivedOrders(cleanArchived);
      }

      if (Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }

      if (Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }

      // Products synchronization from server (only update if non-empty array provided)
      if (Array.isArray(data.products) && data.products.length > 0) {
        const cleanProds = data.products.filter((p: any) => !isClothingItem(p));
        if (cleanProds.length > 0) {
          setProducts(cleanProds);
          try {
            safeLocalStorageSet('hb_live_products', JSON.stringify(cleanProds));
          } catch (e) {}
        }
      }

      if (data.settings && typeof data.settings === 'object' && Object.keys(data.settings).length > 0) {
        setStoreSettings((prev) => {
          const s = data.settings;
          const cleanSlides = sanitizeHeroSlides(s.heroSlides);
          const cleanFooter = sanitizeFooterText(s.footerText || s.footerTextBn);
          const merged: StoreSettings = {
            ...prev,
            ...s,
            heroSlides: cleanSlides,
            footerText: cleanFooter,
            footerTextBn: cleanFooter,
            customServices: (Array.isArray(s.customServices) && s.customServices.length > 0) ? s.customServices : prev.customServices,
            customFaqs: (Array.isArray(s.customFaqs) && s.customFaqs.length > 0) ? s.customFaqs : prev.customFaqs,
            customTestimonials: (Array.isArray(s.customTestimonials) && s.customTestimonials.length > 0) ? s.customTestimonials : prev.customTestimonials,
            customLocations: (Array.isArray(s.customLocations) && s.customLocations.length > 0) ? s.customLocations : prev.customLocations,
            categoryNavItems: (Array.isArray(s.categoryNavItems) && s.categoryNavItems.length > 0) ? s.categoryNavItems : prev.categoryNavItems,
            navItems: (Array.isArray(s.navItems) && s.navItems.length > 0) ? s.navItems : prev.navItems,
            themeId: s.themeId || prev.themeId,
          };
          try {
            safeLocalStorageSet('hb_store_settings', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    };

    // 1. Instant Push with EventSource (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          processSyncData(data);
        } catch (e) {}
      };
      eventSource.onerror = () => {
        // Browser automatically attempts reconnect on stream disruption
      };
    } catch (e) {}

    // 2. Continuous Polling Fallback (Every 2 seconds for ultra-fast sync)
    const syncWithServer = async () => {
      try {
        const res = await fetch('/api/sync');
        if (!res.ok) return;
        const data = await res.json();
        processSyncData(data);
      } catch (e) {}
    };

    // Initial server sync
    syncWithServer();

    // 3. Tab Focus Auto-Refresh: Sync instantly when user switches back to this tab
    const handleWindowFocus = () => {
      syncWithServer();
    };
    window.addEventListener('focus', handleWindowFocus);

    const interval = setInterval(syncWithServer, 2000);
    return () => {
      active = false;
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, []);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live Products State with localStorage
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hb_live_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter((p: any) => p && !!p.nameBn && !isClothingItem(p));
            if (filtered.length > 0) return filtered;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_REAL_PRODUCTS || [];
  });

  useEffect(() => {
    safeLocalStorageSet('hb_live_products', JSON.stringify(products));
    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_PRODUCTS', payload: products, sender: CLIENT_ID });
      ch.close();
    } catch (e) {}
  }, [products]);

  // Purge any lingering clothing products from live state and localStorage
  useEffect(() => {
    setProducts((curr) => {
      const filtered = curr.filter((p) => !isClothingItem(p));
      if (filtered.length !== curr.length) {
        try {
          safeLocalStorageSet('hb_live_products', JSON.stringify(filtered));
        } catch (e) {}
      }
      return filtered;
    });
  }, []);



  useEffect(() => {
    try {
      safeLocalStorageSet('hb_store_settings', JSON.stringify(storeSettings));
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_SETTINGS', payload: storeSettings, sender: CLIENT_ID });
      ch.close();
    } catch (e) {
      console.error('Failed to save/sync settings:', e);
    }
  }, [storeSettings]);

  useEffect(() => {
    if (storeSettings.themeId && storeSettings.themeId !== activeTheme.id) {
      const found = COLOR_THEMES.find((t) => t.id === storeSettings.themeId);
      if (found) {
        setActiveTheme(found);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hb_active_theme_id', found.id);
        }
      }
    }
  }, [storeSettings.themeId]);


  // Orders State (Strictly live DB only, LocalStorage caching DISABLED per mandate)
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<AdminOrder[]>([]);

  // Purge any legacy cached orders from LocalStorage on mount
  useEffect(() => {
    try {
      localStorage.removeItem('hb_admin_orders');
      localStorage.removeItem('hb_admin_archived_orders');
      localStorage.removeItem('orders');
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_ORDERS', payload: orders, sender: CLIENT_ID });
      ch.close();
    } catch (e) {}
  }, [orders]);

  // Shop & Booking States
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigateToProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hb_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [initialTrackQuery, setInitialTrackQuery] = useState<string>('');

  // Real-time Order Notification States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });
  const [newOrderToast, setNewOrderToast] = useState<AdminOrder | null>(null);

  const isInitialOrdersLoad = useRef(true);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const lastLocalUpdateRef = useRef<number>(0);
  const isAdminAuthenticatedRef = useRef(isAdminAuthenticated);
  isAdminAuthenticatedRef.current = isAdminAuthenticated;
  const storeSettingsRef = useRef(storeSettings);
  storeSettingsRef.current = storeSettings;

  const handleRequestNotificationPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      playOrderNotificationSound();
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setNotificationPermission(perm);
        }).catch(() => {});
      }
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackVal = params.get('track') || params.get('order');
    if (trackVal) {
      setInitialTrackQuery(trackVal.trim());
      setTrackerOpen(true);
    }
  }, []);

  // Express Order & Invoice & Review Modals State
  const [expressProduct, setExpressProduct] = useState<ProductItem | null>(null);
  const [isExpressModalOpen, setIsExpressModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<AdminOrder | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenExpressOrder = (product: ProductItem) => {
    setExpressProduct(product);
    setIsExpressModalOpen(true);
  };

  // Live Testimonials / Reviews State with localStorage (starts blank)
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('hb_live_testimonials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out default demo reviews if any
          const demoIds = new Set(['1', '2', '3', 'rev-1', 'rev-2', 'rev-3', 't_sp1', 't_sp2', 't_sp3']);
          return parsed.filter((t: any) => !demoIds.has(t.id));
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hb_live_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const handleAddReview = (newReview: {
    author: string;
    location?: string;
    productName?: string;
    rating: number;
    comment: string;
  }) => {
    const avatar = newReview.author.slice(0, 2).toUpperCase();
    const item: TestimonialItem = {
      id: `rev-${Date.now()}`,
      quoteBn: newReview.comment,
      quoteEn: newReview.comment,
      authorBn: newReview.author,
      authorEn: newReview.author,
      roleBn: newReview.productName ? `ক্রেতা (${newReview.productName})` : 'সন্তুষ্ট ক্রেতা',
      roleEn: newReview.productName ? `Buyer (${newReview.productName})` : 'Verified Buyer',
      organizationBn: newReview.location || 'বাংলাদেশ',
      organizationEn: newReview.location || 'Bangladesh',
      avatarText: avatar || 'HB',
      rating: newReview.rating || 5,
      productName: newReview.productName,
      date: 'আজকে'
    };
    setTestimonials((prev) => [item, ...prev]);
    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonial: item }),
    }).catch(() => {});
    showToast('🎉 আপনার রিভিউটি সফলভাবে গৃহীত ও ওয়েবসাইটে যুক্ত হয়েছে!');
  };

  // Submissions (Contact & Wholesale Messages) with localStorage (starts blank)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [archivedSubmissions, setArchivedSubmissions] = useState<FormSubmission[]>([]);

  useEffect(() => {
    safeLocalStorageSet('hb_admin_submissions', JSON.stringify(submissions));
    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_SUBMISSIONS', payload: submissions, sender: CLIENT_ID });
      ch.close();
    } catch (e) {}
  }, [submissions]);

  const handleUpdateMessage = async (updatedMessage: FormSubmission) => {
    if (updatedMessage.isArchived) {
      setArchivedSubmissions((prev) => prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)));
    } else {
      setSubmissions((prev) => {
        const exists = prev.find(m => m.id === updatedMessage.id);
        if (exists) {
            return prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m));
        } else {
            return [updatedMessage, ...prev];
        }
      });
      setArchivedSubmissions((prev) => prev.filter((m) => m.id !== updatedMessage.id));
    }

    safeFirestoreWrite('Update Submission Status', () =>
      setDoc(doc(db, 'submissions', updatedMessage.id), sanitizeForFirestore(updatedMessage))
    );

    fetch('/api/submissions/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissions: updatedMessage.isArchived ? [...submissions, updatedMessage] : submissions }),
    }).catch(() => {});
    showToast(isBn ? 'পাইকারি অনুসন্ধানের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!' : 'Wholesale inquiry updated!');
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isBn = language === 'bn';

  // Dynamic descriptive contents based on active tab (Dry Fruits vs Clothing)
  const categoryContents = {
    spices: {
      taglineBn: 'শতভাগ প্রিমিয়াম ড্রাই ফ্রুটস, কাজুবাদাম, কাঠবাদাম, ইরানি মরিয়ম খেজুর ও সোনালী কিসমিস',
      heroHeadlineBn: 'কোনো কেমিক্যাল নেই, ১০০% প্রাকৃতিক ও পুষ্টিকর প্রিমিয়াম ড্রাই ফ্রুটস',
      heroSubheadlineBn: 'বিশ্বসেরা বাগান থেকে সংগৃহীত রোস্টেড কাজুবাদাম, ক্যালিফোর্নিয়া কাঠবাদাম, ইরানি মরিয়ম খেজুর, আফগানি কিসমিস ও শুকনো আঞ্জির।',
      heroCtaPrimaryBn: 'ড্রাই ফ্রুটস ও বাদাম কিনুন',
      aboutBadgeBn: '১০০% বিশুদ্ধতা ও কোয়ালিটির নিশ্চয়তা',
      aboutTitleBn: 'পুষ্টি, স্বাদ ও স্বাস্থ্য সুরক্ষায় অনন্য — প্রতিটি ড্রাই ফ্রুটসে শতভাগ প্রিমিয়াম মান',
      aboutDescBn: 'বিশ্বসেরা বাগান থেকে সরাসরি সংগৃহীত প্রিমিয়াম কাজুবাদাম, ক্যালিফোর্নিয়া কাঠবাদাম, রোস্টেড পেস্তাবাদাম, শুকনো আঞ্জির, ইরানি মরিয়ম খেজুর ও সোনালী কিসমিস। প্রতিটি ড্রাই ফ্রুটসে আমরা নিশ্চিত করি সর্বোচ্চ সতেজতা ও প্রিমিয়াম কোয়ালিটি।',
      metrics: [
        { value: '১০০%', labelBn: 'খাঁটি ও প্রিমিয়াম কোয়ালিটি', labelEn: '100% Quality Guaranteed' },
        { value: '২৪-৪৮ঘণ্টা', labelBn: 'সারা দেশে দ্রুত হোম ডেলিভারি', labelEn: 'Fast Nationwide Delivery' },
      ],
      servicesSectionTitleBn: 'কেন আমাদের প্রিমিয়াম ড্রাই ফ্রুটস কিনবেন?',
      servicesSectionDescBn: 'সরাসরি বিশ্বসেরা বাগান থেকে সংগৃহীত সর্বোচ্চ কোয়ালিটি, সতেজতা ও পুষ্টিগুণের প্রতিশ্রুতি',
      services: [
        {
          id: 'sp_s1',
          number: '01',
          titleBn: '১০০% অরিজিনাল ও কেমিক্যালমুক্ত ড্রাই ফ্রুটস',
          titleEn: 'Triple-Sorted & Fresh Dry Fruits',
          descBn: 'সরাসরি আন্তর্জাতিক সেরা বাগান থেকে সংগ্রহ করে সম্পূর্ণ প্রাকৃতিকভাবে সংরক্ষিত প্রিমিয়াম কাজুবাদাম, কাঠবাদাম, পেস্তা ও কিসমিস।',
          descEn: 'Whole premium jumbo nuts and dried fruits harvested ethically without artificial dyes or preservatives.',
          metric: '১০০%',
          metricLabelBn: 'ভেজালমুক্ত ও তাজা',
          metricLabelEn: 'Fresh & Chemical-Free'
        },
        {
          id: 'sp_s2',
          number: '02',
          titleBn: 'ভিআইপি ইরানি মরিয়ম ও আজওয়া খেজুর',
          titleEn: 'VIP Iranian & Saudi Dates',
          descBn: 'আসল মদিনার আজওয়া ও প্রিমিয়াম ইরানি মরিয়ম খেজুর। নরম, রসালো ও প্রাকৃতিক শক্তিবর্ধক।',
          descEn: 'Authentic Ajwa and Maryam dates packed with natural caramel taste and energy.',
          metric: '১০০%',
          metricLabelBn: 'প্রাকৃতিক ও মিষ্টি',
          metricLabelEn: 'Pure & Natural'
        },
        {
          id: 'sp_s3',
          number: '03',
          titleBn: 'ফুড-গ্রেড এয়ারটাইট জিপলক ও নিরাপদ প্যাকেজিং',
          titleEn: 'Airtight Food-Grade Packaging',
          descBn: 'প্রতিটি ড্রাই ফ্রুটস ফুড-গ্রেড এয়ারটাইট জিপলক প্যাকেজে সিল করা হয়, যা বাদাম ও ফলের মচমচে ভাব ও পুষ্টি দীর্ঘদিন অক্ষুণ্ণ রাখে।',
          descEn: 'Multi-layer food-grade resealable pouches ensure moisture-proof and long-lasting crispness.',
          metric: '২৪-৪৮ঘণ্টা',
          metricLabelBn: 'দ্রুততম হোম ডেলিভারি',
          metricLabelEn: 'Express Shipping Delivery'
        }
      ]
    }
  };

  const activeContent = categoryContents.spices;

  // Active Website Data synced with Store Settings
  const currentSiteData: WebsiteData = {
    ...TEMPLATES.spices,
    nameBn: storeSettings.storeName,
    nameEn: storeSettings.storeName,
    storeBadgeBn: storeSettings.storeBadgeBn || 'প্রিমিয়াম স্টোর',
    logoLetter: storeSettings.logoLetter,
    logoImage: storeSettings.logoImage,
    taglineBn: storeSettings.storeTagline || activeContent.taglineBn,
    taglineEn: storeSettings.storeTagline || activeContent.taglineBn,
    heroHeadlineBn: storeSettings.heroTitle || activeContent.heroHeadlineBn,
    heroHeadlineEn: storeSettings.heroTitle || activeContent.heroHeadlineBn,
    heroSubheadlineBn: storeSettings.heroSubtitle || activeContent.heroSubheadlineBn,
    heroSubheadlineEn: storeSettings.heroSubtitle || activeContent.heroSubheadlineBn,
    heroCtaPrimaryBn: storeSettings.heroCtaText || activeContent.heroCtaPrimaryBn,
    heroCtaPrimaryEn: storeSettings.heroCtaText || activeContent.heroCtaPrimaryBn,
    heroImage: storeSettings.heroImage || '',
    heroBadge: storeSettings.heroBadge || '',
    aboutBadgeBn: storeSettings.aboutBadgeBn || storeSettings.heroBadge || activeContent.aboutBadgeBn,
    aboutBadgeEn: storeSettings.heroBadge || activeContent.aboutBadgeBn,
    aboutTitleBn: storeSettings.aboutTitleBn || activeContent.aboutTitleBn,
    aboutDescBn: storeSettings.aboutDescBn || activeContent.aboutDescBn,
    metrics: Array.isArray(storeSettings.customMetrics) && storeSettings.customMetrics.length > 0
      ? storeSettings.customMetrics
      : activeContent.metrics,
    servicesSectionTitleBn: storeSettings.servicesSectionTitleBn || storeSettings.spicesTitleBn || activeContent.servicesSectionTitleBn,
    servicesSectionDescBn: storeSettings.servicesSectionDescBn || storeSettings.spicesDescBn || activeContent.servicesSectionDescBn,
    services: Array.isArray(storeSettings.customServices) && storeSettings.customServices.length > 0
      ? storeSettings.customServices.map((s) => ({
          id: s.id,
          number: s.number,
          titleBn: s.titleBn,
          titleEn: s.titleBn,
          descBn: s.descBn,
          descEn: s.descBn,
          metric: s.metric,
          metricLabelBn: s.metricLabelBn,
          metricLabelEn: s.metricLabelBn,
        }))
      : (activeContent.services || TEMPLATES.spices.services),
    faqs: Array.isArray(storeSettings.customFaqs) && storeSettings.customFaqs.length > 0
      ? storeSettings.customFaqs.map((f) => ({
          id: f.id,
          questionBn: f.questionBn,
          questionEn: f.questionBn,
          answerBn: f.answerBn,
          answerEn: f.answerBn,
        }))
      : TEMPLATES.spices.faqs,
    testimonials: Array.isArray(storeSettings.customTestimonials) && storeSettings.customTestimonials.length > 0
      ? storeSettings.customTestimonials.map((t) => ({
          id: t.id,
          quoteBn: t.quoteBn,
          quoteEn: t.quoteBn,
          authorBn: t.authorBn,
          authorEn: t.authorBn,
          roleBn: t.roleBn || 'সম্মানিত গ্রাহক',
          roleEn: t.roleBn || 'Valued Customer',
          organizationBn: 'হালাল বাজার বিডি',
          organizationEn: 'Halal Bazar BD',
          avatarText: t.authorBn ? t.authorBn.charAt(0) : 'গ',
          rating: t.rating || 5,
          productName: t.productName,
        }))
      : TEMPLATES.spices.testimonials,
    contactTitleBn: storeSettings.contactTitleBn || TEMPLATES.spices.contactTitleBn,
    contactDescBn: storeSettings.contactDescBn || TEMPLATES.spices.contactDescBn,
    faqSectionTitleBn: storeSettings.faqTitleBn || TEMPLATES.spices.faqSectionTitleBn,
    faqSectionDescBn: storeSettings.faqDescBn || TEMPLATES.spices.faqSectionDescBn || 'আপনার প্রয়োজনীয় সব প্রশ্নের স্পষ্ট ও সুনির্দিষ্ট উত্তর',
    faqSectionDescEn: storeSettings.faqDescBn || TEMPLATES.spices.faqSectionDescEn || 'Direct answers to our most common operational inquiries',
    contactEmail: storeSettings.email,
    contactPhone: storeSettings.phone,
    contactAddressBn: storeSettings.address,
    contactAddressEn: storeSettings.address,
    facebookUrl: storeSettings.facebookUrl,
    whatsappNumber: storeSettings.whatsappNumber,
    spicesImage: storeSettings.spicesImage,
    announcementText: storeSettings.announcementText,
    isAnnouncementActive: storeSettings.isAnnouncementActive,
    footerTextBn: storeSettings.footerTextBn || storeSettings.footerText,
    footerTextEn: storeSettings.footerTextBn || storeSettings.footerText,
    trustPurityTitleBn: storeSettings.trustPurityTitleBn || '১০০% খাঁটি ও প্রিমিয়াম',
    trustPurityDescBn: storeSettings.trustPurityDescBn || 'প্রিমিয়াম ড্রাই ফ্রুটস ও অর্গানিক খাদ্যপণ্য',
    trustDeliveryTitleBn: storeSettings.trustDeliveryTitleBn || 'সারা দেশে ডেলিভারি',
    trustDeliveryDescBn: storeSettings.trustDeliveryDescBn || 'ক্যাশ অন ডেলিভারি সুবিধা',
    trustSupportTitleBn: storeSettings.trustSupportTitleBn || '২৪/৭ গ্রাহক সেবা',
    trustSupportDescBn: storeSettings.trustSupportDescBn || (storeSettings.phone ? `হটলাইন: ${storeSettings.phone}` : 'হটলাইন: ০১৭১১-৮৮৯৯০০'),
    heroSlides: (Array.isArray(storeSettings.heroSlides))
      ? storeSettings.heroSlides
      : [],
    products: products,
    navItems: Array.isArray(storeSettings.navItems) && storeSettings.navItems.length > 0
      ? storeSettings.navItems
      : TEMPLATES.spices.navItems,
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Handlers
  const handleAddToCart = (product: ProductItem) => {
    if (product.inStock === false) {
      showToast(isBn ? `দুঃখিত, "${product.nameBn}" বর্তমানে স্টক আউট (Out of Stock)` : `Sorry, "${product.nameEn}" is currently Out of Stock`);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(isBn ? `"${product.nameBn}" ব্যাগে যোগ হয়েছে` : `Added "${product.nameEn}" to bag`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: ProductItem) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      let updated: string[];
      if (exists) {
        updated = prev.filter((id) => id !== product.id);
        showToast(isBn ? `"${product.nameBn}" পছন্দের তালিকা থেকে সরানো হয়েছে` : `Removed from Wishlist`);
      } else {
        updated = [...prev, product.id];
        showToast(isBn ? `❤️ "${product.nameBn}" পছন্দের তালিকায় যুক্ত হয়েছে!` : `❤️ Added to Wishlist!`);
      }
      try {
        localStorage.setItem('hb_wishlist_ids', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update wishlist in storage:', err);
      }
      return updated;
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.filter((id) => id !== productId);
      try {
        localStorage.setItem('hb_wishlist_ids', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update wishlist in storage:', err);
      }
      return updated;
    });
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    try {
      localStorage.removeItem('hb_wishlist_ids');
    } catch (err) {
      console.error(err);
    }
    showToast(isBn ? 'পছন্দের তালিকা খালি করা হয়েছে' : 'Wishlist cleared');
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Mandatory Initial Hydration from Database on Mount (Async Fetch)
  useEffect(() => {
    const hydrateFromDatabase = async () => {
      try {
        console.log('🔄 [DB Hydration] Requesting direct server fetch for settings...');
        const settingsDocRef = doc(db, 'settings', 'global');
        const settingsSnap = await getDocFromServer(settingsDocRef).catch(() => getDoc(settingsDocRef));
        
        if (settingsSnap.exists()) {
          const raw = settingsSnap.data();
          console.log('✅ [DB Hydration Success] Live Database Settings Loaded:', Object.keys(raw || {}));
          if (raw) {
            const unpacked: Partial<StoreSettings> = {
              ...(raw.general || {}),
              ...(raw.appearance || {}),
              ...(raw.homepage || {}),
              ...(raw.payments || {}),
              ...(raw.content || {}),
              ...(raw.seo || {}),
              ...(raw.security || {}),
              ...raw,
            };
            delete (unpacked as any).general;
            delete (unpacked as any).appearance;
            delete (unpacked as any).homepage;
            delete (unpacked as any).payments;
            delete (unpacked as any).content;
            delete (unpacked as any).seo;
            delete (unpacked as any).security;

            setStoreSettings((prev) => {
              const merged: StoreSettings = {
                ...prev,
                ...unpacked,
                logoImage: unpacked.logoImage || prev.logoImage,
                heroImage: unpacked.heroImage || prev.heroImage,
                spicesImage: unpacked.spicesImage || prev.spicesImage,
                aboutImage: unpacked.aboutImage || prev.aboutImage,
                promoBannerSubtitle: unpacked.promoBannerSubtitle || prev.promoBannerSubtitle,
                promoBannerCta: unpacked.promoBannerCta || prev.promoBannerCta,
                heroSlides: sanitizeHeroSlides(unpacked.heroSlides),
                footerText: sanitizeFooterText(unpacked.footerText),
                footerTextBn: sanitizeFooterText(unpacked.footerTextBn),
                customServices: (unpacked.customServices && unpacked.customServices.length > 0) ? unpacked.customServices : prev.customServices,
                customFaqs: (unpacked.customFaqs && unpacked.customFaqs.length > 0) ? unpacked.customFaqs : prev.customFaqs,
                customTestimonials: (unpacked.customTestimonials && unpacked.customTestimonials.length > 0) ? unpacked.customTestimonials : prev.customTestimonials,
                navItems: (unpacked.navItems && unpacked.navItems.length > 0) ? unpacked.navItems : prev.navItems,
                adminUsers: (unpacked.adminUsers && unpacked.adminUsers.length > 0) ? unpacked.adminUsers : prev.adminUsers,
                categoryNavItems: (unpacked.categoryNavItems && Array.isArray(unpacked.categoryNavItems) && unpacked.categoryNavItems.length > 0)
                  ? unpacked.categoryNavItems
                  : prev.categoryNavItems,
                themeId: unpacked.themeId || prev.themeId,
                customLocations: (unpacked.customLocations && Array.isArray(unpacked.customLocations) && unpacked.customLocations.length > 0)
                  ? unpacked.customLocations
                  : (prev.customLocations || DEFAULT_CUSTOM_LOCATIONS),
              };
              try { safeLocalStorageSet('hb_store_settings', JSON.stringify(merged)); } catch (e) {}
              return merged;
            });
          }
        }

        const productsColRef = collection(db, 'products');
        const prodsSnap = await getDocs(productsColRef);
        if (!prodsSnap.empty) {
          const liveProds = prodsSnap.docs
            .map((d) => d.data() as ProductItem)
            .filter((p) => !!p && !!p.nameBn && !isClothingItem(p));
          if (liveProds.length > 0) {
            console.log(`✅ [DB Hydration Success] ${liveProds.length} Live Products Loaded from Firestore.`);
            setProducts(liveProds);
            try { safeLocalStorageSet('hb_live_products', JSON.stringify(liveProds)); } catch (e) {}
          }
        }
      } catch (err: any) {
        console.warn('⚠️ [DB Hydration Notice]:', err?.message || err);
      }
    };

    hydrateFromDatabase();
  }, []);

  // Unified Real-Time Cloud Listeners (Firebase Firestore)
  useEffect(() => {
    // 1. Listen for real-time Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (Date.now() - lastLocalUpdateRef.current < 4000) {
        return;
      }
      if (docSnap.exists()) {
        const raw = docSnap.data();
        console.log('📡 [Realtime Subscription] Live Settings Document Snapshot Received.');
        if (raw) {
          // Unpack nested categories saved by splitSettingsForFirestore
          const unpacked: Partial<StoreSettings> = {
            ...(raw.general || {}),
            ...(raw.appearance || {}),
            ...(raw.homepage || {}),
            ...(raw.payments || {}),
            ...(raw.content || {}),
            ...(raw.seo || {}),
            ...(raw.security || {}),
            ...raw,
          };
          delete (unpacked as any).general;
          delete (unpacked as any).appearance;
          delete (unpacked as any).homepage;
          delete (unpacked as any).payments;
          delete (unpacked as any).content;
          delete (unpacked as any).seo;
          delete (unpacked as any).security;

          setStoreSettings((prev) => {
            const merged: StoreSettings = {
              ...prev,
              ...unpacked,
              logoImage: unpacked.logoImage || prev.logoImage,
              heroImage: unpacked.heroImage || prev.heroImage,
              spicesImage: unpacked.spicesImage || prev.spicesImage,
              aboutImage: unpacked.aboutImage || prev.aboutImage,
              promoBannerSubtitle: unpacked.promoBannerSubtitle || prev.promoBannerSubtitle,
              promoBannerCta: unpacked.promoBannerCta || prev.promoBannerCta,
              heroSlides: sanitizeHeroSlides(unpacked.heroSlides),
              footerText: sanitizeFooterText(unpacked.footerText),
              footerTextBn: sanitizeFooterText(unpacked.footerTextBn),
              customServices: (unpacked.customServices && unpacked.customServices.length > 0) ? unpacked.customServices : prev.customServices,
              customFaqs: (unpacked.customFaqs && unpacked.customFaqs.length > 0) ? unpacked.customFaqs : prev.customFaqs,
              customTestimonials: (unpacked.customTestimonials && unpacked.customTestimonials.length > 0) ? unpacked.customTestimonials : prev.customTestimonials,
              navItems: (unpacked.navItems && unpacked.navItems.length > 0) ? unpacked.navItems : prev.navItems,
              adminUsers: (unpacked.adminUsers && unpacked.adminUsers.length > 0) ? unpacked.adminUsers : prev.adminUsers,
              categoryNavItems: (unpacked.categoryNavItems && Array.isArray(unpacked.categoryNavItems) && unpacked.categoryNavItems.length > 0)
                ? unpacked.categoryNavItems
                : prev.categoryNavItems,
              themeId: unpacked.themeId || prev.themeId,
              customLocations: (unpacked.customLocations && Array.isArray(unpacked.customLocations) && unpacked.customLocations.length > 0)
                ? unpacked.customLocations
                : (prev.customLocations || DEFAULT_CUSTOM_LOCATIONS),
            };
            try {
              safeLocalStorageSet('hb_store_settings', JSON.stringify(merged));
            } catch (e) {}

            fetch('/api/settings/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ settings: merged }),
            }).catch(() => {});

            return merged;
          });
        }
      }
    }, (err) => {
      console.warn('Firestore Settings Listener:', err.message);
    });

    // 2. Listen for real-time Products & Inventory
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (Date.now() - lastLocalUpdateRef.current < 4000) {
        return;
      }
      if (!snapshot.empty) {
        const firestoreProducts = snapshot.docs
          .map((doc) => doc.data() as ProductItem)
          .filter((p) => !!p && !!p.nameBn && !isClothingItem(p));
        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
          safeLocalStorageSet('hb_live_products', JSON.stringify(firestoreProducts));
          localStorage.removeItem('hb_products_empty');

          fetch('/api/products/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: firestoreProducts }),
          }).catch(() => {});
        }
      }
    }, (err) => {
      console.warn('Firestore Products Listener:', err.message);
    });

    // 3. Listen for real-time Orders (Active and Archived separately for source-level filtering)
    // ADDED isDeleted != true check where possible (though Firestore doesn't support NOT EQUAL perfectly for missing fields)
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
      const ords: AdminOrder[] = [];
      const arch: AdminOrder[] = [];

      snap.forEach(d => {
        const data = d.data() as AdminOrder;
        if (data && data.isDeleted !== true && !data.deletedAt) {
          if (data.isArchived === true) {
            arch.push(data);
          } else {
            ords.push(data);
          }
        }
      });

      const cleanActive = cleanAndNormalizeOrders(ords, prefix, true).filter(
        (o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived !== true
      );
      const cleanArchived = cleanAndNormalizeOrders(arch, prefix, false).filter(
        (o: any) => o && !o.isDeleted && !o.deletedAt && o.isArchived === true
      );

      if (isInitialOrdersLoad.current) {
        cleanActive.forEach((o) => knownOrderIds.current.add(o.id));
        isInitialOrdersLoad.current = false;
      } else if (isAdminAuthenticatedRef.current) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newOrd = change.doc.data() as AdminOrder;
            if (!knownOrderIds.current.has(newOrd.id) && newOrd.isDeleted !== true && !newOrd.deletedAt && newOrd.isArchived !== true) {
              knownOrderIds.current.add(newOrd.id);
              sendBrowserOrderNotification(newOrd, () => setActiveTab('orders'));
              setNewOrderToast(newOrd);
              document.title = `🚨 (নতুন অর্ডার!) ${storeSettingsRef.current.storeName}`;
            }
          }
        });
      }
      setOrders(cleanActive);
      setArchivedOrders(cleanArchived);
    }, (error) => {
      console.warn('Firestore Orders Listener Error:', error);
    });

    // 4. Listen for real-time Submissions & Wholesale Inquiries
    const unsubSubs = onSnapshot(query(collection(db, 'submissions'), orderBy('timestamp', 'desc')), (snap) => {
      const subs: FormSubmission[] = [];
      const arch: FormSubmission[] = [];
      snap.forEach((d) => {
        const data = d.data() as FormSubmission;
        if (data.isArchived) {
          arch.push(data);
        } else {
          subs.push(data);
        }
      });
      setSubmissions(subs);
      setArchivedSubmissions(arch);
    }, (error) => {
      console.warn('Firestore Submissions Listener Error:', error);
    });

    return () => {
      unsubSettings();
      unsubProducts();
      unsubOrders();
      unsubSubs();
    };
  }, []);

  // Admin Portal Tab Management
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // New Order / Form Submission Handler
  const handleNewSubmission = async (sub: Omit<FormSubmission, 'id' | 'timestamp'>) => {
    const orderTimestamp = formatOrderDateTime(new Date());
    const subId = `sub-${Date.now()}`;
    const newEntry: FormSubmission = {
      ...sub,
      id: subId,
      timestamp: orderTimestamp,
    };
    setSubmissions((prev) => [newEntry, ...prev]);

    // Save to Firebase (Permanent Storage)
    safeFirestoreWrite('New Submission', () =>
      setDoc(doc(db, 'submissions', subId), sanitizeForFirestore(newEntry))
    );

    // If it's a shop checkout order, create an AdminOrder
    if (sub.type === 'order' || sub.type === 'express_order') {
      let itemsToOrder: AdminOrder['items'] = [];
      
      // Extract items from submission details (handle multiple possible keys: cartItems, items, cartItemsJson)
      if (Array.isArray(sub.details?.cartItems) && sub.details.cartItems.length > 0) {
        itemsToOrder = sub.details.cartItems;
      } else if (Array.isArray(sub.details?.items) && sub.details.items.length > 0) {
        itemsToOrder = sub.details.items;
      } else if (sub.details?.cartItemsJson) {
        try {
          const parsed = JSON.parse(sub.details.cartItemsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // FIX: Ensure item format is correct for AdminOrder
            itemsToOrder = parsed.map((it: any) => ({
              productName: it.productName || it.name || it.nameBn || 'অজ্ঞাত পণ্য',
              quantity: Number(it.quantity || 1),
              price: Number(it.price || 0),
              originalPrice: Number(it.originalPrice || it.price || 0),
              discountPercent: Number(it.discountPercent || 0),
              weightAmount: it.weightAmount || it.unit || '',
            }));
          }
        } catch (e) {}
      }
      
      // Fallback to React state cartItems if details were empty but user has items in cart
      if (itemsToOrder.length === 0 && cartItems.length > 0) {
        itemsToOrder = cartItems.map((ci) => ({
          productName: ci.product.nameBn,
          quantity: ci.quantity,
          price: ci.product.price,
          originalPrice: ci.product.originalPrice || ci.product.price,
          discountPercent: ci.product.discountPercent || 0,
        }));
      }
      
      // REAL PRODUCT NAME FIX: If still empty, try to parse from message but with better logic
      if (itemsToOrder.length === 0) {
        // Look for common patterns in the message like "Product Name x Quantity"
        const lines = sub.message?.split('\n') || [];
        for (const line of lines) {
          if (line.includes(' x ')) {
            const [namePart, qtyPart] = line.split(' x ');
            const name = namePart.trim();
            const qty = parseInt(qtyPart.trim(), 10);
            if (name && !isNaN(qty)) {
              itemsToOrder.push({
                productName: name,
                quantity: qty,
                price: 0, // Will be updated if possible
              });
            }
          }
        }
      }

      // Final hard fallback
      if (itemsToOrder.length === 0) {
        const msgParts = sub.message?.split('|') || [];
        let extractedName = 'অনলাইন অর্ডারকৃত পণ্য';
        
        for (const part of msgParts) {
          if (part.includes('অর্ডার তালিকা:')) {
            extractedName = part.replace('অর্ডার তালিকা:', '').split('x')[0].trim();
            break;
          }
        }
        
        itemsToOrder = [{ 
          productName: extractedName, 
          quantity: 1, 
          price: sub.details?.totalAmount ? Number(String(sub.details.totalAmount).replace(/\D/g, '')) : 500 
        }];
      }

      const subtotal = itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const originalSubtotal = itemsToOrder.reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0);
      
      // Additional coupon discount from details if present
      const extraDiscount = Number(sub.details?.discountAmount || 0);
      
      const discountAmount = Math.max(0, originalSubtotal - subtotal) + extraDiscount;
      const discountPercent = originalSubtotal > 0 && discountAmount > 0 ? Math.round((discountAmount / originalSubtotal) * 100) : 0;
      // Strict resolution of customized delivery fee:
      // 1. If explicit deliveryFee was passed from form, prioritize it!
      // 2. Otherwise look up matching location in storeSettings.customLocations using address/thana/district/division
      // 3. Fall back to the strict 49 Dhaka Metro thanas rule: ONLY the 49 thanas get deliveryFeeDhaka (৳70), all others get deliveryFeeOutside (৳130)
      const fullAddress = sub.details?.address || sub.message || '';
      const parsedAddr = parseBangladeshAddress(fullAddress, storeSettings.customLocations);
      const deliveryCriteria = {
        address: fullAddress,
        thana: sub.details?.thana || parsedAddr.thana,
        district: sub.details?.district || parsedAddr.district,
        division: sub.details?.division || parsedAddr.division,
        deliveryArea: sub.details?.deliveryArea,
      };

      const resolvedDelivery = resolveDeliveryFee(deliveryCriteria, storeSettings);
      const isInsideDhaka = resolvedDelivery.isInsideDhaka;

      let resolvedDeliveryFee: number;
      if (sub.details?.deliveryFee !== undefined && sub.details?.deliveryFee !== null && !isNaN(Number(sub.details.deliveryFee))) {
        resolvedDeliveryFee = Number(sub.details.deliveryFee);
      } else {
        resolvedDeliveryFee = resolvedDelivery.fee;
      }

      const deliveryFee = resolvedDeliveryFee;
      const total = (subtotal - extraDiscount) + deliveryFee;
      const isDhakaArea = isInsideDhaka;

      const paymentMethodRaw = sub.details?.paymentMethod || '';
      let resolvedPaymentMethod: 'cod' | 'bkash' | 'nagad' = 'cod';
      if (paymentMethodRaw.toLowerCase().includes('nagad') || paymentMethodRaw.includes('নগদ')) {
        resolvedPaymentMethod = 'nagad';
      } else if (paymentMethodRaw.toLowerCase().includes('bkash') || paymentMethodRaw.includes('বিকাশ')) {
        resolvedPaymentMethod = 'bkash';
      }

      const initialAdvance = resolvedPaymentMethod !== 'cod' ? total : 0;
      const initialDue = total - initialAdvance;

      // Calculate highest serial number ever assigned across active and archived orders, and collect all existing numbers
      const existingSerials = new Set<number>();
      const existingInvoices = new Set<string>();

      [...orders, ...archivedOrders].forEach((o) => {
        if (o.serialNo) existingSerials.add(Number(o.serialNo));
        if (o.orderNumber && !isNaN(Number(o.orderNumber))) existingSerials.add(Number(o.orderNumber));
        if (o.invoiceNumber) existingInvoices.add(o.invoiceNumber);
      });

      let maxExistingSerial = 0;
      existingSerials.forEach((s) => {
        if (s > maxExistingSerial) maxExistingSerial = s;
      });

      const configuredStart = Number(storeSettings.nextInvoiceNumber);
      const validConfigured = !isNaN(configuredStart) && configuredStart > 0 ? configuredStart : 1;

      let candidateSerial = Math.max(maxExistingSerial + 1, validConfigured);
      const prefix = storeSettings.invoicePrefix !== undefined ? storeSettings.invoicePrefix : 'INV-';
      let candidateInvoiceNo = prefix ? `${prefix}${String(candidateSerial).padStart(4, '0')}` : `${candidateSerial}`;

      while (existingSerials.has(candidateSerial) || existingInvoices.has(candidateInvoiceNo)) {
        candidateSerial++;
        candidateInvoiceNo = prefix ? `${prefix}${String(candidateSerial).padStart(4, '0')}` : `${candidateSerial}`;
      }

      const nextSerial = candidateSerial;
      const formattedInvoiceNo = candidateInvoiceNo;

      // Update storeSettings nextInvoiceNumber for subsequent orders without overwriting global settings
      setStoreSettings((prev) => ({
        ...prev,
        nextInvoiceNumber: nextSerial + 1,
      }));
      safeFirestoreWrite('Update Next Invoice Number', () =>
        setDoc(doc(db, 'settings', 'global'), { nextInvoiceNumber: nextSerial + 1 }, { merge: true })
      );
      fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { nextInvoiceNumber: nextSerial + 1 } }),
      }).catch(() => {});

      const newAdminOrder: AdminOrder = {
        id: `ord-${Date.now()}`,
        serialNo: nextSerial,
        orderNumber: `${nextSerial}`,
        invoiceNumber: formattedInvoiceNo,
        customerName: sub.name,
        customerPhone: sub.phone || '',
        customerAddress: sub.details?.address || sub.message,
        deliveryArea: isDhakaArea ? 'dhaka' : 'outside',
        paymentMethod: resolvedPaymentMethod,
        paymentChannel: resolvedPaymentMethod,
        trxId: sub.details?.trxId || undefined,
        senderNumber: sub.details?.senderNumber || undefined,
        items: itemsToOrder,
        subtotal,
        originalSubtotal: originalSubtotal > subtotal ? originalSubtotal : undefined,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        deliveryFee,
        total,
        advancePaid: initialAdvance,
        dueAmount: initialDue,
        orderNotes: sub.details?.orderNotes || sub.details?.notes || undefined,
        status: 'pending',
        createdAt: orderTimestamp,
        isArchived: false,
      };

      setOrders((prev) => [newAdminOrder, ...prev]);
      triggerGlobalTabSync();

      // Automated Inventory Deduction on Order Placement (Only if explicitly enabled by admin)
      if (storeSettings.autoDeductStockOnOrder) {
        setProducts((currentProducts) => {
          let changed = false;
          const updated = currentProducts.map((p) => {
            const matchItem = itemsToOrder.find(
              (it) => it.productName && (
                it.productName === p.nameBn ||
                it.productName.includes(p.nameBn) ||
                p.nameBn.includes(it.productName) ||
                (p.nameEn && it.productName.toLowerCase().includes(p.nameEn.toLowerCase()))
              )
            );
            if (matchItem) {
              changed = true;
              const currentQty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock === false ? 0 : 12);
              const deduct = matchItem.quantity || 1;
              const newQty = Math.max(0, currentQty - deduct);
              return {
                ...p,
                stockQuantity: newQty,
                inStock: newQty > 0 ? (p.inStock !== false) : false,
                stockStatusText: newQty === 0 ? (p.stockStatusText || 'স্টক আউট') : p.stockStatusText,
              };
            }
            return p;
          });
          if (changed) {
            fetch('/api/products/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ products: updated }),
            }).catch(() => {});
          }
          return changed ? updated : currentProducts;
        });
      }

      if (isAdminAuthenticated) {
        sendBrowserOrderNotification(newAdminOrder, () => {
          setActiveTab('orders');
        });
        setNewOrderToast(newAdminOrder);
      }

      // Save to Firebase (Permanent Storage)
      safeFirestoreWrite('New Order', () =>
        setDoc(doc(db, 'orders', newAdminOrder.id), sanitizeForFirestore(newAdminOrder))
      );

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newAdminOrder }),
      }).catch(() => {});
    }

    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission: newEntry }),
    }).catch(() => {});

    showToast(
      isBn
        ? 'আপনার অর্ডার / বার্তা সফলভাবে গৃহীত হয়েছে! এডমিন প্যানেলে এটি যুক্ত হয়েছে।'
        : 'Order received and logged in Admin Panel!'
    );
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    lastLocalUpdateRef.current = Date.now();
    triggerGlobalTabSync();
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      
      const orderToUpdate = next.find(o => o.id === orderId);
      if (orderToUpdate) {
        safeFirestoreWrite('Update Order Status', () =>
          setDoc(doc(db, 'orders', orderId), sanitizeForFirestore(orderToUpdate))
        );
      }

      try {
        safeLocalStorageSet('hb_admin_orders', JSON.stringify(next));
        const ch = new BroadcastChannel('halal_bazar_realtime_sync');
        ch.postMessage({ type: 'SYNC_ORDERS', payload: next, sender: CLIENT_ID });
        ch.close();
      } catch (e) {}

      fetch('/api/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: next }),
      }).catch(() => {});
      return next;
    });
    showToast(`অর্ডার স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus}`);
  };

  // Admin Bulk Order Status Update
  const handleUpdateBulkOrderStatus = async (orderIds: string[], newStatus: OrderStatus) => {
    if (!orderIds || orderIds.length === 0) return;
    lastLocalUpdateRef.current = Date.now();
    const idSet = new Set(orderIds);
    setOrders((prev) => {
      const next = prev.map((o) => (idSet.has(o.id) ? { ...o, status: newStatus } : o));

      orderIds.forEach((id) => {
        const orderToUpdate = next.find(o => o.id === id);
        if (orderToUpdate) {
          safeFirestoreWrite('Bulk Status Update', () =>
            setDoc(doc(db, 'orders', id), sanitizeForFirestore(orderToUpdate))
          );
        }
      });

      try {
        const ch = new BroadcastChannel('halal_bazar_realtime_sync');
        ch.postMessage({ type: 'SYNC_ORDERS', payload: next, sender: CLIENT_ID });
        ch.close();
      } catch (e) {}

      fetch('/api/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: next }),
      }).catch(() => {});
      return next;
    });
    showToast(`${orderIds.length}টি অর্ডারের স্ট্যাটাস সফলভাবে '${newStatus}'-এ আপডেট করা হয়েছে!`);
  };

  // Admin Bulk Order Mark Full Paid
  const handleBulkMarkOrdersFullPaid = async (orderIds: string[]) => {
    if (!orderIds || orderIds.length === 0) return;
    const idSet = new Set(orderIds);
    setOrders((prev) => {
      const next = prev.map((o) =>
        idSet.has(o.id)
          ? {
              ...o,
              advancePaid: o.total,
              dueAmount: 0,
              paymentStatus: 'paid' as const,
              paymentMethod: o.paymentMethod === 'cod' ? ('admin_paid' as const) : o.paymentMethod,
              paymentChannel: (!o.paymentChannel || o.paymentChannel === 'cod') ? ('admin_paid' as const) : o.paymentChannel,
            }
          : o
      );

      orderIds.forEach((id) => {
        const orderToUpdate = next.find((o) => o.id === id);
        if (orderToUpdate) {
          safeFirestoreWrite('Bulk Mark Full Paid', () =>
            setDoc(doc(db, 'orders', id), sanitizeForFirestore(orderToUpdate))
          );
        }
      });

      try {
        const ch = new BroadcastChannel('halal_bazar_realtime_sync');
        ch.postMessage({ type: 'SYNC_ORDERS', payload: next, sender: CLIENT_ID });
        ch.close();
      } catch (e) {}

      fetch('/api/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: next }),
      }).catch(() => {});
      return next;
    });
    showToast(`${orderIds.length}টি অর্ডার সফলভাবে 'ফুল পেইড' (Full Paid) করা হয়েছে!`);
  };

  const handleUpdateOrder = async (updatedOrder: AdminOrder) => {
    // Automatically guarantee full paid / partial / due consistency
    const isPaid = (updatedOrder.dueAmount === 0) || ((updatedOrder.advancePaid ?? 0) >= updatedOrder.total);
    const finalOrder: AdminOrder = {
      ...updatedOrder,
      paymentStatus: isPaid ? 'paid' : ((updatedOrder.advancePaid ?? 0) > 0 ? 'partial' : 'due'),
      dueAmount: isPaid ? 0 : (updatedOrder.dueAmount !== undefined ? updatedOrder.dueAmount : Math.max(0, updatedOrder.total - (updatedOrder.advancePaid ?? 0))),
      advancePaid: isPaid ? updatedOrder.total : (updatedOrder.advancePaid ?? 0),
    };

    lastLocalUpdateRef.current = Date.now();
    if (finalOrder.isArchived) {
      setArchivedOrders((prev) => {
        const exists = prev.find((o) => o.id === finalOrder.id);
        const nextArchived = exists ? prev.map((o) => (o.id === finalOrder.id ? finalOrder : o)) : [finalOrder, ...prev];
        return nextArchived;
      });
      setOrders((prev) => {
        const nextActive = prev.filter((o) => o.id !== finalOrder.id);
        
        // Broadcast and update local server
        const ch = new BroadcastChannel('halal_bazar_realtime_sync');
        ch.postMessage({ type: 'SYNC_ORDERS', payload: nextActive, sender: CLIENT_ID });
        ch.close();

        fetch('/api/orders/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: nextActive, order: finalOrder }),
        }).catch(() => {});

        return nextActive;
      });
    } else {
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === finalOrder.id);
        const next = exists
          ? prev.map((o) => (o.id === finalOrder.id ? finalOrder : o))
          : [finalOrder, ...prev];

        try {
          const ch = new BroadcastChannel('halal_bazar_realtime_sync');
          ch.postMessage({ type: 'SYNC_ORDERS', payload: next, sender: CLIENT_ID });
          ch.close();
        } catch (e) {}

        // Send the fresh updated list AND the specific order to backend
        fetch('/api/orders/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: next, order: finalOrder }),
        }).catch(() => {});

        return next;
      });
      setArchivedOrders((prev) => {
        const nextArchived = prev.filter((o) => o.id !== finalOrder.id);
        return nextArchived;
      });
    }

    safeFirestoreWrite('Update Order', () =>
      setDoc(doc(db, 'orders', finalOrder.id), sanitizeForFirestore(finalOrder))
    );

    showToast(isBn ? 'অর্ডারের তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Order updated successfully!');
  };

  const handleUpdateOrderDeliveryFee = async (orderId: string, newFee: number) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              deliveryFee: newFee,
              total: o.subtotal + newFee,
            }
          : o
      );

      const orderToUpdate = next.find(o => o.id === orderId);
      if (orderToUpdate) {
        safeFirestoreWrite('Update Delivery Fee', () =>
          setDoc(doc(db, 'orders', orderId), sanitizeForFirestore(orderToUpdate))
        );
      }

      fetch('/api/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: next }),
      }).catch(() => {});
      return next;
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    lastLocalUpdateRef.current = Date.now();
    const updatedActive = orders.filter((o) => o.id !== orderId);
    const updatedArchived = archivedOrders.filter((o) => o.id !== orderId);

    setOrders(updatedActive);
    setArchivedOrders(updatedArchived);

    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_ORDERS', payload: updatedActive, sender: CLIENT_ID });
      ch.close();
    } catch (e) {}

    safeFirestoreWrite('Delete Order', () =>
      deleteDoc(doc(db, 'orders', orderId))
    );

    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: updatedActive }),
    }).catch(() => {});

    showToast(isBn ? 'অর্ডারটি স্থায়ীভাবে মুছে ফেলা হয়েছে।' : 'Order permanently deleted.');
  };

  const handleDeleteMessage = (messageId: string) => {
    const msgToArchive = submissions.find(m => m.id === messageId) || archivedSubmissions.find(m => m.id === messageId);
    const updatedMsg: FormSubmission = msgToArchive ? { ...msgToArchive, isArchived: true } : { id: messageId, name: 'Unknown', email: '', message: '', type: 'contact', timestamp: new Date().toISOString(), isArchived: true };

    safeFirestoreWrite('Archive Message', () =>
      setDoc(doc(db, 'submissions', messageId), sanitizeForFirestore(updatedMsg), { merge: true })
    );

    setSubmissions((prev) => {
      const next = prev.filter((m) => m.id !== messageId);
      fetch('/api/submissions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissions: next }),
      }).catch(() => {});
      return next;
    });

    setArchivedSubmissions((prev) => {
      if (!prev.some(m => m.id === messageId)) {
        return [updatedMsg, ...prev];
      }
      return prev;
    });

    showToast(isBn ? 'বার্তাটি সফলভাবে সরানো হয়েছে।' : 'Message successfully removed.');
  };

  const handlePermanentDeleteOrder = (orderId: string) => {
    lastLocalUpdateRef.current = Date.now();
    const updatedActive = orders.filter((o) => o.id !== orderId);
    const updatedArchived = archivedOrders.filter((o) => o.id !== orderId);
    
    setOrders(updatedActive);
    setArchivedOrders(updatedArchived);

    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_ORDERS', payload: updatedActive, sender: CLIENT_ID });
      ch.close();
    } catch (e) {}

    safeFirestoreWrite('Permanent Delete Order', () =>
      deleteDoc(doc(db, 'orders', orderId))
    );

    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: updatedActive }),
    }).catch(() => {});

    showToast(isBn ? 'অর্ডারটি স্থায়ীভাবে ডিলিট করা হয়েছে।' : 'Order permanently deleted.');
  };

  const handleClearAllOrders = async () => {
    const confirmed = window.confirm(
      isBn 
        ? 'আপনি কি নিশ্চিত যে আপনি ডাটাবেসের সকল অর্ডার (Active & Archived) স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।' 
        : 'Are you sure you want to PERMANENTLY delete ALL orders (Active & Archived)? This cannot be undone.'
    );
    if (!confirmed) return;

    lastLocalUpdateRef.current = Date.now();
    
    // Get all IDs to delete from Firestore
    const allIds = [...orders.map(o => o.id), ...archivedOrders.map(o => o.id)];
    
    setOrders([]);
    setArchivedOrders([]);

    try {
      const ch = new BroadcastChannel('halal_bazar_realtime_sync');
      ch.postMessage({ type: 'SYNC_ORDERS', payload: [], sender: CLIENT_ID });
      ch.close();
    } catch (e) {}

    // 1. Clear Firestore
    for (const id of allIds) {
      safeFirestoreWrite('Bulk Delete Order', () => deleteDoc(doc(db, 'orders', id)));
    }

    // 2. Clear Backend
    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: [] }),
    }).catch(() => {});

    showToast(isBn ? 'সকল অর্ডার সফলভাবে মুছে ফেলা হয়েছে!' : 'All orders cleared successfully!');
  };

  const handlePermanentDeleteMessage = (messageId: string) => {
    setArchivedSubmissions((prev) => prev.filter((m) => m.id !== messageId));
    setSubmissions((prev) => prev.filter((m) => m.id !== messageId));
    safeFirestoreWrite('Permanent Delete Message', () =>
      deleteDoc(doc(db, 'submissions', messageId))
    );
    showToast(isBn ? 'মেসেজটি স্থায়ীভাবে ডিলিট করা হয়েছে।' : 'Message permanently deleted.');
  };

  const triggerGlobalTabSync = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hb_global_sync_trigger', String(Date.now()));
        const ch = new BroadcastChannel('halal_bazar_realtime_sync');
        ch.postMessage({ type: 'FORCE_SYNC_ALL', sender: CLIENT_ID });
        ch.close();
      }
    } catch (e) {}
  };

  const handleUpdateProducts = async (newProductsOrFn: ProductItem[] | ((prev: ProductItem[]) => ProductItem[])) => {
    lastLocalUpdateRef.current = Date.now();
    triggerGlobalTabSync();
    
    setProducts((prev) => {
      const updatedProducts = typeof newProductsOrFn === 'function' ? newProductsOrFn(prev) : newProductsOrFn;
      
      setTimeout(() => {
        try {
          if (updatedProducts.length === 0) {
            localStorage.setItem('hb_products_empty', 'true');
            localStorage.removeItem('hb_live_products');
          } else {
            localStorage.removeItem('hb_products_empty');
            safeLocalStorageSet('hb_live_products', JSON.stringify(updatedProducts));
          }
          const ch = new BroadcastChannel('halal_bazar_realtime_sync');
          ch.postMessage({ type: 'SYNC_PRODUCTS', payload: updatedProducts, sender: CLIENT_ID });
          ch.close();
        } catch (e) {}

        // 1. Sync to Express Server
        fetch('/api/products/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: updatedProducts }),
        }).catch(() => {});

        // 2. Sync to Firebase Cloud Firestore (Protected by quota shield)
        safeFirestoreWrite('Sync Products', async () => {
          const productsCol = collection(db, 'products');
          const snapshot = await getDocs(productsCol);
          
          const newProductIds = new Set(updatedProducts.map((p) => p.id));
          const toDelete = snapshot.docs.filter((d) => !newProductIds.has(d.id));
          if (toDelete.length > 0) {
            await Promise.all(toDelete.map((d) => deleteDoc(d.ref)));
          }

          await Promise.all(
            updatedProducts.filter((p) => !!p.id).map((p) =>
              setDoc(doc(db, 'products', p.id), sanitizeForFirestore(p))
            )
          );
        });
      }, 0);

      return updatedProducts;
    });
  };

  const handleUpdateSettings = async (newSettingsOrFn: StoreSettings | ((prev: StoreSettings) => StoreSettings)) => {
    lastLocalUpdateRef.current = Date.now();
    triggerGlobalTabSync();
    
    setStoreSettings((prev) => {
      const nextSettings = typeof newSettingsOrFn === 'function' ? newSettingsOrFn(prev) : newSettingsOrFn;
      
      // Side effects (execute after render cycle)
      setTimeout(() => {
        try {
          safeLocalStorageSet('hb_store_settings', JSON.stringify(nextSettings));
          const ch = new BroadcastChannel('halal_bazar_realtime_sync');
          ch.postMessage({ type: 'SYNC_SETTINGS', payload: nextSettings, sender: CLIENT_ID });
          ch.close();
        } catch (e) {}

        // Save to Firebase (Permanent Storage with quota shield)
        safeFirestoreWrite('Sync Settings', async () => {
          const cloudPayload = splitSettingsForFirestore(nextSettings);
          await setDoc(doc(db, 'settings', 'global'), cloudPayload, { merge: true });
        });

        // Save to Express API
        fetch('/api/settings/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: nextSettings }),
        }).catch(() => {});
      }, 0);

      return nextSettings;
    });
  };

  const handleQuickEditSave = async (field: string, newValue: any, productId?: string) => {
    // 1. Handle Product Edits
    if (field === 'product' && productId) {
      await handleUpdateProducts((prevProducts) => {
        let found = false;
        const nextProducts = prevProducts.map((p) => {
          if (p.id === productId) {
            found = true;
            return {
              ...p,
              nameBn: newValue.nameBn,
              nameEn: newValue.nameEn || p.nameEn,
              price: Number(newValue.price),
              originalPrice: Number(newValue.originalPrice || newValue.price),
              inStock: Boolean(newValue.inStock),
              image: newValue.image || p.image,
            };
          }
          return p;
        });

        if (!found) {
          const newP: ProductItem = {
            id: productId,
            nameBn: newValue.nameBn || 'নতুন পণ্য',
            nameEn: newValue.nameEn || 'New Product',
            descBn: newValue.descBn || 'বাছাইকৃত, সেরা মানের খাদ্যপণ্য।',
            descEn: newValue.descEn || 'Handpicked premium food product.',
            categoryBn: 'জনপ্রিয় পণ্য',
            categoryEn: 'Popular Products',
            price: Number(newValue.price) || 0,
            originalPrice: Number(newValue.originalPrice || newValue.price) || 0,
            inStock: Boolean(newValue.inStock),
            image: newValue.image || '',
            currency: '৳',
            unit: 'প্রতি কেজি',
            rating: 5,
            reviewsCount: 15,
          };
          return [...prevProducts, newP];
        }
        return nextProducts;
      });
      showToast('🎉 পণ্য সফলভাবে আপডেট করা হয়েছে!');
      return;
    }

    // 2. Handle Settings Edits
    await handleUpdateSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings };

      // Specially handle Hero Banner Image & Slides
      if (field === 'heroImage' || field === 'heroSlideImage') {
        const imgVal = typeof newValue === 'string' ? newValue : (newValue?.image || newValue?.primary || '');
        const currentSlides = updatedSettings.heroSlides && updatedSettings.heroSlides.length > 0 
          ? [...updatedSettings.heroSlides] 
          : [{
              id: `slide-${Date.now()}`,
              badgeBn: '✨ স্পেশাল অফার',
              badgeEn: 'Special Offer',
              titleBn: '',
              titleEn: '',
              subtitleBn: '',
              subtitleEn: '',
              ctaBn: 'অর্ডার করুন',
              ctaEn: 'Order Now',
              image: imgVal,
              targetAnchor: '#products',
            }];
        
        const targetIdx = productId !== undefined && !isNaN(Number(productId)) ? Number(productId) : 0;
        if (currentSlides[targetIdx]) {
          currentSlides[targetIdx] = { ...currentSlides[targetIdx], image: imgVal };
        } else {
          currentSlides[0] = { ...currentSlides[0], image: imgVal };
        }

        updatedSettings.heroImage = targetIdx === 0 ? imgVal : (updatedSettings.heroImage || imgVal);
        updatedSettings.heroSlides = currentSlides;
        showToast('🎉 হিরো ব্যানার ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Hero Title & Slide Titles
      if (field === 'heroTitle' || field === 'heroSlideTitle') {
        const titleVal = typeof newValue === 'string' ? newValue : String(newValue || '');
        const currentSlides = updatedSettings.heroSlides && updatedSettings.heroSlides.length > 0 
          ? [...updatedSettings.heroSlides] 
          : [{
              id: `slide-${Date.now()}`,
              badgeBn: '✨ স্পেশাল অফার',
              badgeEn: 'Special Offer',
              titleBn: titleVal,
              titleEn: titleVal,
              subtitleBn: '',
              subtitleEn: '',
              ctaBn: 'অর্ডার করুন',
              ctaEn: 'Order Now',
              image: '',
              targetAnchor: '#products',
            }];
        const targetIdx = productId !== undefined && !isNaN(Number(productId)) ? Number(productId) : 0;
        if (currentSlides[targetIdx]) {
          currentSlides[targetIdx] = { ...currentSlides[targetIdx], titleBn: titleVal, titleEn: titleVal };
        }

        updatedSettings.heroTitle = targetIdx === 0 ? titleVal : (updatedSettings.heroTitle || titleVal);
        updatedSettings.heroSlides = currentSlides;
        showToast('🎉 ব্যানার হেডলাইন সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Hero Subtitle & Slide Subtitles
      if (field === 'heroSubtitle' || field === 'heroSlideSubtitle') {
        const subVal = typeof newValue === 'string' ? newValue : String(newValue || '');
        const currentSlides = updatedSettings.heroSlides && updatedSettings.heroSlides.length > 0 
          ? [...updatedSettings.heroSlides] 
          : [{
              id: `slide-${Date.now()}`,
              badgeBn: '✨ স্পেশাল অফার',
              badgeEn: 'Special Offer',
              titleBn: '',
              titleEn: '',
              subtitleBn: subVal,
              subtitleEn: subVal,
              ctaBn: 'অর্ডার করুন',
              ctaEn: 'Order Now',
              image: '',
              targetAnchor: '#products',
            }];
        const targetIdx = productId !== undefined && !isNaN(Number(productId)) ? Number(productId) : 0;
        if (currentSlides[targetIdx]) {
          currentSlides[targetIdx] = { ...currentSlides[targetIdx], subtitleBn: subVal, subtitleEn: subVal };
        }

        updatedSettings.heroSubtitle = targetIdx === 0 ? subVal : (updatedSettings.heroSubtitle || subVal);
        updatedSettings.heroSlides = currentSlides;
        showToast('🎉 ব্যানার সাবটাইটেল সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Hero Badge & Slide Badges
      if (field === 'heroBadge' || field === 'heroSlideBadge') {
        const badgeVal = typeof newValue === 'string' ? newValue : String(newValue || '');
        const currentSlides = updatedSettings.heroSlides && updatedSettings.heroSlides.length > 0 
          ? [...updatedSettings.heroSlides] 
          : [{
              id: `slide-${Date.now()}`,
              badgeBn: badgeVal,
              badgeEn: badgeVal,
              titleBn: '',
              titleEn: '',
              subtitleBn: '',
              subtitleEn: '',
              ctaBn: 'অর্ডার করুন',
              ctaEn: 'Order Now',
              image: '',
              targetAnchor: '#products',
            }];
        const targetIdx = productId !== undefined && !isNaN(Number(productId)) ? Number(productId) : 0;
        if (currentSlides[targetIdx]) {
          currentSlides[targetIdx] = { ...currentSlides[targetIdx], badgeBn: badgeVal, badgeEn: badgeVal };
        }

        updatedSettings.heroBadge = targetIdx === 0 ? badgeVal : (updatedSettings.heroBadge || badgeVal);
        updatedSettings.heroSlides = currentSlides;
        showToast('🎉 ব্যানার অফার ব্যাজ সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Hero CTA Button & Slide Buttons
      if (field === 'heroCtaText' || field === 'heroSlideCta') {
        const ctaVal = typeof newValue === 'string' ? newValue : String(newValue || '');
        const currentSlides = updatedSettings.heroSlides && updatedSettings.heroSlides.length > 0 
          ? [...updatedSettings.heroSlides] 
          : [{
              id: `slide-${Date.now()}`,
              badgeBn: '✨ স্পেশাল অফার',
              badgeEn: 'Special Offer',
              titleBn: '',
              titleEn: '',
              subtitleBn: '',
              subtitleEn: '',
              ctaBn: ctaVal,
              ctaEn: ctaVal,
              image: '',
              targetAnchor: '#products',
            }];
        const targetIdx = productId !== undefined && !isNaN(Number(productId)) ? Number(productId) : 0;
        if (currentSlides[targetIdx]) {
          currentSlides[targetIdx] = { ...currentSlides[targetIdx], ctaBn: ctaVal, ctaEn: ctaVal };
        }

        updatedSettings.heroCtaText = targetIdx === 0 ? ctaVal : (updatedSettings.heroCtaText || ctaVal);
        updatedSettings.heroSlides = currentSlides;
        showToast('🎉 ব্যানার বাটন টেক্সট সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle FAQ Question & Answer inline edits
      if (field === 'faqItem' || field === 'faqQuestion' || field === 'faqAnswer' || field === 'faqs') {
        const baseFaqs = Array.isArray(updatedSettings.customFaqs) && updatedSettings.customFaqs.length > 0
          ? [...updatedSettings.customFaqs]
          : TEMPLATES.spices.faqs.map((f) => ({
              id: f.id,
              questionBn: f.questionBn,
              answerBn: f.answerBn,
            }));

        const targetId = productId;
        let newQ = '';
        let newA = '';
        let isObject = false;

        if (typeof newValue === 'object' && newValue !== null) {
          isObject = true;
          newQ = String(newValue.questionBn || newValue.primary || '').trim();
          newA = String(newValue.answerBn || newValue.secondary || '').trim();
        } else if (field === 'faqAnswer') {
          newA = String(newValue || '').trim();
        } else {
          newQ = String(newValue || '').trim();
        }

        let found = false;
        const updatedFaqs = baseFaqs.map((f, idx) => {
          const cleanTarget = targetId ? String(targetId).replace(/^faq-[qa]?-?/, '').trim() : '';
          const isMatch = Boolean(
            targetId && (
              f.id === targetId ||
              f.id === cleanTarget ||
              targetId.includes(f.id) ||
              f.id.includes(targetId) ||
              (cleanTarget && (cleanTarget.includes(f.id) || f.id.includes(cleanTarget))) ||
              targetId === String(idx) ||
              targetId === `faq-${idx}` ||
              targetId === `faq-${idx + 1}`
            )
          );

          if (isMatch) {
            found = true;
            return {
              ...f,
              questionBn: isObject ? (newQ || f.questionBn) : (field === 'faqAnswer' ? f.questionBn : (newQ || f.questionBn)),
              answerBn: isObject ? (newA || f.answerBn) : (field === 'faqAnswer' ? (newA || f.answerBn) : f.answerBn),
              questionEn: isObject ? (newQ || f.questionBn) : (field === 'faqAnswer' ? ((f as any).questionEn || f.questionBn) : (newQ || f.questionBn)),
              answerEn: isObject ? (newA || f.answerBn) : (field === 'faqAnswer' ? (newA || f.answerBn) : ((f as any).answerEn || f.answerBn)),
            };
          }
          return f;
        });

        if (!found && targetId) {
          updatedFaqs.push({
            id: targetId,
            questionBn: newQ || 'নতুন প্রশ্ন',
            answerBn: newA || 'নতুন উত্তর',
            questionEn: newQ || 'New Question',
            answerEn: newA || 'New Answer',
          });
        }

        updatedSettings.customFaqs = updatedFaqs;
        showToast('🎉 এফএকিউ প্রশ্ন ও উত্তর সফলভাবে সংরক্ষণ করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle FAQ Title & Description
      if (field === 'faqTitle' || field === 'faqTitleBn') {
        updatedSettings.faqTitleBn = String(newValue || '');
        showToast('🎉 এফএকিউ শিরোনাম সফলভাবে আপডেট হয়েছে!');
        return updatedSettings;
      }

      if (field === 'faqDesc' || field === 'faqDescBn') {
        updatedSettings.faqDescBn = String(newValue || '');
        showToast('🎉 এফএকিউ বিবরণ সফলভাবে আপডেট হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Store Sub-Tagline / Badge (প্রিমিয়াম স্টোর)
      if (field === 'storeBadgeBn' || field === 'headerSubTagline') {
        updatedSettings.storeBadgeBn = String(newValue || '');
        showToast('🎉 স্টোর সাব-টাইটেল সফলভাবে পরিমার্জন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Testimonials card edit
      if (field === 'testimonials' && productId) {
        const baseReviews = Array.isArray(updatedSettings.customTestimonials) && updatedSettings.customTestimonials.length > 0
          ? [...updatedSettings.customTestimonials]
          : TEMPLATES.spices.testimonials.map((t) => ({
              id: t.id,
              authorBn: t.authorBn,
              quoteBn: t.quoteBn,
              roleBn: t.roleBn,
              rating: t.rating,
              productName: t.productName,
            }));

        const valStr = typeof newValue === 'string' ? newValue : (newValue?.primary || '');
        const updatedReviews = baseReviews.map((t) => {
          if (t.id === productId || productId.includes(t.id)) {
            return { ...t, quoteBn: valStr };
          }
          return t;
        });

        updatedSettings.customTestimonials = updatedReviews;
        showToast('🎉 কাস্টমার রিভিউ সফলভাবে আপডেট করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Services / Feature card edit
      if (field === 'services' && productId) {
        const baseServices = Array.isArray(updatedSettings.customServices) && updatedSettings.customServices.length > 0
          ? [...updatedSettings.customServices]
          : TEMPLATES.spices.services.map((s) => ({
              id: s.id,
              number: s.number,
              titleBn: s.titleBn,
              descBn: s.descBn,
              metric: s.metric,
              metricLabelBn: s.metricLabelBn,
            }));

        const titleVal = typeof newValue === 'object' && newValue !== null ? (newValue.secondary || '') : '';
        const descVal = typeof newValue === 'object' && newValue !== null ? (newValue.primary || '') : String(newValue || '');

        const updatedServices = baseServices.map((s) => {
          if (s.id === productId || productId.includes(s.id)) {
            return { 
              ...s, 
              titleBn: titleVal || s.titleBn, 
              descBn: descVal || s.descBn 
            };
          }
          return s;
        });

        updatedSettings.customServices = updatedServices;
        showToast('🎉 বৈশিষ্ট্য কার্ড সফলভাবে আপডেট করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Trust Badges / Pillars
      if (field === 'trustPurity') {
        const title = typeof newValue === 'object' && newValue !== null ? (newValue.primary || '') : String(newValue || '');
        const desc = typeof newValue === 'object' && newValue !== null ? (newValue.secondary || '') : '';
        updatedSettings.trustPurityTitleBn = title || '১০০% খাঁটি ও প্রিমিয়াম';
        if (desc) updatedSettings.trustPurityDescBn = desc;
        showToast('🎉 খাঁটি ও প্রিমিয়াম ব্যাজ তথ্য সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      if (field === 'trustDelivery') {
        const title = typeof newValue === 'object' && newValue !== null ? (newValue.primary || '') : String(newValue || '');
        const desc = typeof newValue === 'object' && newValue !== null ? (newValue.secondary || '') : '';
        updatedSettings.trustDeliveryTitleBn = title || 'সারা দেশে ডেলিভারি';
        if (desc) updatedSettings.trustDeliveryDescBn = desc;
        showToast('🎉 ডেলিভারি সুবিধা তথ্য সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      if (field === 'trustSupport') {
        const title = typeof newValue === 'object' && newValue !== null ? (newValue.primary || '') : String(newValue || '');
        const desc = typeof newValue === 'object' && newValue !== null ? (newValue.secondary || '') : '';
        updatedSettings.trustSupportTitleBn = title || '২৪/৭ গ্রাহক সেবা';
        if (desc) updatedSettings.trustSupportDescBn = desc;
        showToast('🎉 গ্রাহক সেবা ও হটলাইন তথ্য সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Footer text
      if (field === 'footerText' || field === 'footerTextBn') {
        const txt = String(newValue || '');
        updatedSettings.footerText = txt;
        updatedSettings.footerTextBn = txt;
        showToast('🎉 ফুটার টেক্সট সফলভাবে সংরক্ষণ করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Phone
      if (field === 'phone' || field === 'contactPhone') {
        const ph = String(newValue || '');
        updatedSettings.phone = ph;
        showToast('🎉 ফোন নম্বর সফলভাবে সংরক্ষণ করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Promo Banner Image
      if (field === 'spicesImage' || field === 'promoBannerImage') {
        const imgVal = typeof newValue === 'string' ? newValue : (newValue?.image || newValue?.primary || '');
        updatedSettings.spicesImage = imgVal;
        updatedSettings.promoBannerImage = imgVal;
        showToast('🎉 প্রমো ব্যানার ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle About Us Image
      if (field === 'aboutImage') {
        const imgVal = typeof newValue === 'string' ? newValue : (newValue?.image || newValue?.primary || '');
        updatedSettings.aboutImage = imgVal;
        showToast('🎉 আমাদের সম্পর্কে ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Store Logo Image
      if (field === 'logoImage') {
        const imgVal = typeof newValue === 'string' ? newValue : (newValue?.image || newValue?.primary || '');
        updatedSettings.logoImage = imgVal;
        showToast('🎉 স্টোর লোগো সফলভাবে পরিবর্তন ও সংরক্ষণ করা হয়েছে!');
        return updatedSettings;
      }

      // Specially handle Promo Banner Texts
      if (field === 'promoBannerSubtitle' || field === 'promoBannerCta') {
        const val = typeof newValue === 'string' ? newValue : (newValue?.primary || '');
        (updatedSettings as any)[field] = val;
        showToast('🎉 ব্যানার তথ্য সফলভাবে আপডেট করা হয়েছে!');
        return updatedSettings;
      }

      // Generic fallback for simple fields
      const finalVal = (typeof newValue === 'object' && newValue !== null && 'primary' in newValue) 
        ? newValue.primary 
        : newValue;
      
      (updatedSettings as any)[field] = finalVal;
      showToast('🎉 তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
      return updatedSettings;
    });
  };

  // Render Offline Blocker if user is offline
  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white p-6 select-none font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            {/* Warning Icon with Amber Ring and Wave animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="relative w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center text-amber-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M21 3L3 21M8.464 8.464a5 5 0 017.072 0M12 13a1 1 0 110-2 1 1 0 010 2zM5.636 5.636a9 9 0 000 12.728m0-12.728L3 3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-amber-400">
                ইন্টারনেট সংযোগ বিচ্ছিন্ন!
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                এই ওয়েবসাইটটি ভিজিট করতে এবং অর্ডার করতে আপনার সচল ইন্টারনেট সংযোগ (ওয়াইফাই অথবা মোবাইল ডাটা) প্রয়োজন।
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const status = navigator.onLine;
                  setIsOnline(status);
                  if (status) {
                    window.location.reload();
                  }
                }}
                className="w-full py-3 px-6 rounded-xl font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 active:scale-98 transition-all shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                </svg>
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Dedicated Admin Portal if open
  if (isAdminOpen) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          storeName={storeSettings.storeName}
          settings={storeSettings}
          theme={activeTheme}
          onLoginSuccess={(user) => {
            setIsAdminAuthenticated(true);
            if (user) setCurrentUser(user);
          }}
          onBackToStore={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
        />
      );
    }

    // If activeTab is 'live_preview', fall through to render the full live store with the preview bar
    if (activeTab !== 'live_preview') {
      return (
        <AdminDashboard
          products={products}
          onUpdateProducts={handleUpdateProducts}
          orders={orders}
          archivedOrders={archivedOrders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateBulkOrderStatus={handleUpdateBulkOrderStatus}
          onUpdateBulkOrdersFullPaid={handleBulkMarkOrdersFullPaid}
          onUpdateOrder={handleUpdateOrder}
          onUpdateOrderDeliveryFee={handleUpdateOrderDeliveryFee}
          onDeleteOrder={handleDeleteOrder}
          onPermanentDeleteOrder={handlePermanentDeleteOrder}
          settings={storeSettings}
          onUpdateSettings={handleUpdateSettings}
          messages={submissions}
          archivedMessages={archivedSubmissions}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
          onPermanentDeleteMessage={handlePermanentDeleteMessage}
          onClearAllOrders={handleClearAllOrders}
          theme={activeTheme}
          onToggleTheme={handleToggleTheme}
          onSelectTheme={handleSelectTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notificationPermission={notificationPermission}
          onRequestNotificationPermission={handleRequestNotificationPermission}
          newOrderToast={newOrderToast}
          onClearNewOrderToast={() => {
            setNewOrderToast(null);
            document.title = storeSettings.storeName;
          }}
          onBackToStore={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
          onLogout={() => {
            localStorage.removeItem('hb_admin_auth');
            localStorage.removeItem('hb_admin_current_user');
            setIsAdminAuthenticated(false);
            setIsAdminOpen(false);
            setIsLiveEditActive(false);
            setIsHideFloatingAdminBar(false);
            showToast('লগআউট সফল হয়েছে! ওয়েবসাইট এখন সাধারণ কাস্টমার ভিউতে রয়েছে।');
          }}
        />
      );
    }
  }

  const isLivePreviewEffective = isAdminOpen && activeTab === 'live_preview' && isAdminAuthenticated === true;

  // Render Live Store (or Full Store Live Preview)
  return (
    <VisualEditorProvider isLivePreview={isLivePreviewEffective} onSave={handleQuickEditSave}>
      <div 
        className="min-h-screen text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white transition-colors duration-300"
        style={{
          backgroundColor: activeTheme.bgLight,
          // @ts-ignore
          '--color-primary': activeTheme.primary,
          '--color-primary-hover': activeTheme.primaryHover,
          '--color-accent': activeTheme.accent,
          '--color-accent-bg': activeTheme.accentBg,
        }}
      >
        {/* Live Preview Mode Sticky Admin Topbar */}
        {isLivePreviewEffective && (
          <LivePreviewTopBar
            onBackToDashboard={() => {
              setIsLiveEditActive(false);
              setIsAdminOpen(true);
              setActiveTab('overview');
            }}
            onCloseAdmin={() => {
              setIsLiveEditActive(false);
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
          />
        )}
      {selectedProductId && selectedProduct ? (
        <>
          <SiteHeader
            siteData={currentSiteData}
            theme={activeTheme}
            language={language}
            cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistCount={wishlistIds.length}
            products={products}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setCartOpen(true)}
            onOpenWishlist={() => setWishlistOpen(true)}
            onOpenBooking={() => setBookingOpen(true)}
            onOpenTracker={() => setTrackerOpen(true)}
            onToggleLanguage={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            onOpenAdmin={() => setIsSecretModalOpen(true)}
            onToggleTheme={handleToggleTheme}
          />
          <ProductDetail
            product={selectedProduct}
            theme={activeTheme}
            language={language}
            onClose={() => handleNavigateToProduct(null)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProductId)}
            isBn={language === 'bn'}
            allProducts={products}
            onSelectProduct={(id) => handleNavigateToProduct(id)}
            onExpressOrder={handleOpenExpressOrder}
            whatsappNumber={storeSettings.whatsappNumber || storeSettings.phone}
          />
          <SiteFooter
            siteData={currentSiteData}
            theme={activeTheme}
            language={language}
            onOpenAdmin={() => setIsSecretModalOpen(true)}
          />
        </>
      ) : (
        <HalalBazarLanding
          products={products}
          storeSettings={storeSettings}
          theme={activeTheme}
          onOpenAdmin={() => {
            if (isAdminAuthenticated) {
              setIsAdminOpen(true);
            } else {
              setIsSecretModalOpen(true);
            }
          }}
          onSubmitOrder={handleNewSubmission}
        />
      )}

      {/* Secret Code Access Modal */}
      <SecretAccessModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onSuccess={(role) => {
          setIsAdminAuthenticated(true);
          setIsAdminOpen(true);
          console.log('Authenticated as:', role); // Placeholder for role handling
        }}
      />

      {/* Shopping Bag Drawer (For E-commerce) */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        theme={activeTheme}
        language={language}
        settings={storeSettings}
        onCheckoutComplete={handleNewSubmission}
      />

      {/* Wishlist Drawer (Dedicated Saved Products Drawer) */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToCart={handleAddToCart}
        onExpressOrder={handleOpenExpressOrder}
        theme={activeTheme}
        language={language}
      />

      {/* Table Booking Modal (For Restaurant) */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        theme={activeTheme}
        language={language}
        onBookingComplete={handleNewSubmission}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        orders={orders}
        language={language}
        theme={activeTheme}
        initialQuery={initialTrackQuery}
      />

      {/* 1-Click Express Checkout Modal */}
      <ExpressOrderModal
        isOpen={isExpressModalOpen}
        onClose={() => setIsExpressModalOpen(false)}
        product={expressProduct}
        settings={storeSettings}
        onSubmitOrder={handleNewSubmission}
        language={language}
        theme={activeTheme}
      />

      {/* Instant Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setInvoiceOrder(null);
        }}
        order={invoiceOrder}
        settings={storeSettings}
        language={language}
        theme={activeTheme}
      />

      {/* Product Review Submission Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        products={products}
        onSubmitReview={handleAddReview}
        language={language}
      />

      {/* Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      </div>

      {/* Visual Quick Editor Modal (opens when clicking any edit icon in Live Preview) */}
      <VisualQuickEditConsumer
        onSave={handleQuickEditSave}
        onNavigateToAdminTab={(tab) => {
          setActiveTab(tab);
        }}
        products={products}
      />
    </VisualEditorProvider>
  );
}
