import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Package,
  CheckSquare,
  Truck,
  Heart,
  Quote,
  Star,
  Minus,
  Plus,
  Trash2,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';
import { ProductItem, FormSubmission, ColorTheme } from '../../types/website';
import { StoreSettings } from '../../types/admin';
import { EditTrigger } from '../editor/EditTrigger';
import { InlineEditable } from '../editor/InlineEditable';
import { useVisualEditor } from '../editor/VisualEditorContext';
import { parseBangladeshAddress, BD_DISTRICTS, BD_ALL_UPAZILAS_THANAS, findMatchingLocation, DEFAULT_CUSTOM_LOCATIONS, isInsideDhakaMetro, resolveDeliveryFee } from '../../utils/bdAddressParser';

interface HalalBazarLandingProps {
  products: ProductItem[];
  storeSettings: StoreSettings;
  theme: ColorTheme;
  onOpenAdmin: () => void;
  onSubmitOrder: (submission: FormSubmission) => void;
}

export const HalalBazarLanding: React.FC<HalalBazarLandingProps> = ({
  products: liveProducts,
  storeSettings,
  theme,
  onOpenAdmin,
  onSubmitOrder,
}) => {
  const { isLivePreview, openQuickEdit } = useVisualEditor();

  // Fallback / standard showcase products matching user reference screenshots
  const defaultShowcaseProducts: ProductItem[] = [];

  const displayProducts = useMemo(() => {
    if (liveProducts && liveProducts.length > 0) {
      return liveProducts;
    }
    return defaultShowcaseProducts;
  }, [liveProducts]);

  // Cart & Product Details state
  const [cartItems, setCartItems] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Admin entry logic
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 500) {
      const newCount = logoClickCount + 1;
      if (newCount >= 3) {
        onOpenAdmin();
        setLogoClickCount(0);
      } else {
        setLogoClickCount(newCount);
      }
    } else {
      setLogoClickCount(1);
    }
    setLastLogoClickTime(now);
  };

  const addToCart = (product: ProductItem, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const updateCartItemQty = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: ProductItem; quantity: number }[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const handleCheckoutCart = () => {
    if (cartItems.length === 0) return;
    setQuickOrderItems([...cartItems]);
    setQuickName('');
    setQuickPhone('');
    setQuickAltPhone('');
    setQuickAddress('');
    setQuickDivision('ঢাকা');
    setQuickDistrict('');
    setQuickThana('');
    setQuickPostOffice('');
    setQuickNotes('');
    setQuickError('');
    setQuickSuccess(false);
    setIsCartOpen(false);
  };

  // Quick Order / Checkout Modal State
  const [quickOrderItems, setQuickOrderItems] = useState<{ product: ProductItem; quantity: number }[] | null>(null);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickAltPhone, setQuickAltPhone] = useState('');
  const [quickAddress, setQuickAddress] = useState('');
  const [quickDivision, setQuickDivision] = useState('ঢাকা');
  const [quickDistrict, setQuickDistrict] = useState('');
  const [quickThana, setQuickThana] = useState('');
  const [quickPostOffice, setQuickPostOffice] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [quickDeliveryArea, setQuickDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState('');
  const [quickSuccess, setQuickSuccess] = useState(false);
  const [quickAutoDetected, setQuickAutoDetected] = useState(false);

  // Effective Custom Locations (Admin configured + default preset sub-cities)
  const effectiveCustomLocations = useMemo(() => {
    if (storeSettings.customLocations && Array.isArray(storeSettings.customLocations) && storeSettings.customLocations.length > 0) {
      return storeSettings.customLocations;
    }
    return DEFAULT_CUSTOM_LOCATIONS;
  }, [storeSettings.customLocations]);

  const handleQuickAddressChange = (val: string) => {
    setQuickAddress(val);
    if (!val || !val.trim()) {
      setQuickAutoDetected(false);
      return;
    }
    const parsed = parseBangladeshAddress(val, effectiveCustomLocations);
    if (parsed.division) {
      setQuickDivision(parsed.division);
    }
    if (parsed.district) {
      setQuickDistrict(parsed.district);
    }
    if (parsed.thana) {
      setQuickThana(parsed.thana);
    }
    if (parsed.postCode) {
      setQuickPostOffice(parsed.postCode);
    }
    if (parsed.isInsideDhaka !== undefined) {
      setQuickDeliveryArea(parsed.isInsideDhaka ? 'dhaka' : 'outside');
      if (parsed.isInsideDhaka) {
        if (!parsed.district) setQuickDistrict('ঢাকা');
        if (!parsed.division) setQuickDivision('ঢাকা');
      }
    }
    if (parsed.district || parsed.thana || parsed.isInsideDhaka !== undefined) {
      setQuickAutoDetected(true);
    }
  };

  const getQuickDeliveryFee = () => {
    return quickDeliveryArea === 'dhaka'
      ? (storeSettings.deliveryFeeDhaka ?? 70)
      : (storeSettings.deliveryFeeOutside ?? 130);
  };

  const availableDistrictsQuick = useMemo(() => {
    const list = BD_DISTRICTS;
    let combined = list;
    if (effectiveCustomLocations) {
      const customDists = effectiveCustomLocations
        .filter((c) => c.type === 'district')
        .map((c) => ({ bn: c.nameBn, en: [c.nameEn || ''], division: c.division }));
      combined = [...list, ...customDists];
    }
    const seen = new Set<string>();
    return combined.filter((d) => {
      if (seen.has(d.bn)) return false;
      seen.add(d.bn);
      return true;
    });
  }, [effectiveCustomLocations]);

  const availableThanasQuick = useMemo(() => {
    let list = BD_ALL_UPAZILAS_THANAS;
    if (quickDistrict) {
      list = BD_ALL_UPAZILAS_THANAS.filter((t) => t.district === quickDistrict);
    }

    let combined = list;
    if (effectiveCustomLocations) {
      const customThs = effectiveCustomLocations
        .filter((c) => c.type !== 'district')
        .filter((c) => !quickDistrict || c.district === quickDistrict)
        .map((c) => ({
          bn: c.nameBn,
          en: [c.nameEn || ''],
          district: c.district,
          division: c.division,
        }));
      combined = [...customThs, ...list];
    }
    const seen = new Set<string>();
    return combined.filter((t) => {
      const key = `${t.district || ''}-${t.bn}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [quickDistrict, effectiveCustomLocations]);

  const handleOneClickOrder = (product: ProductItem) => {
    setQuickOrderItems([{ product, quantity: 1 }]);
    setQuickName('');
    setQuickPhone('');
    setQuickAltPhone('');
    setQuickAddress('');
    setQuickDivision('ঢাকা');
    setQuickDistrict('');
    setQuickThana('');
    setQuickPostOffice('');
    setQuickNotes('');
    setQuickDeliveryArea('dhaka');
    setQuickError('');
    setQuickSuccess(false);
    if (selectedProductDetails) {
      setSelectedProductDetails(null);
    }
    if (isCartOpen) {
      setIsCartOpen(false);
    }
  };

  const handleConfirmQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');

    if (!quickOrderItems || quickOrderItems.length === 0) return;

    if (!quickName.trim()) {
      setQuickError('অনুগ্রহ করে কাস্টমারের নাম লিখুন।');
      return;
    }

    if (!quickPhone.trim()) {
      setQuickError('অনুগ্রহ করে মোবাইল নম্বর লিখুন।');
      return;
    }

    if (!quickAddress.trim()) {
      setQuickError('অনুগ্রহ করে সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    if (!quickDistrict.trim()) {
      setQuickError('অনুগ্রহ করে জেলা লিখুন।');
      return;
    }

    if (!quickThana.trim()) {
      setQuickError('অনুগ্রহ করে থানা/উপজেলা লিখুন।');
      return;
    }

    setIsQuickSubmitting(true);

    try {
      const lineSubtotal = quickOrderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const delivery = getQuickDeliveryFee();
      const total = lineSubtotal + delivery;

      const fullDetails = [
        quickAddress.trim(),
        quickDivision ? `বিভাগ: ${quickDivision}` : '',
        quickDistrict ? `জেলা: ${quickDistrict}` : '',
        quickThana ? `থানা/উপজেলা: ${quickThana}` : '',
        quickPostOffice ? `পোস্ট অফিস: ${quickPostOffice}` : '',
        quickAltPhone ? `বিকল্প ফোন: ${quickAltPhone}` : '',
        quickNotes ? `নোট: ${quickNotes}` : '',
      ]
        .filter(Boolean)
        .join(', ');

      const cartItemsPayload = quickOrderItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBn,
        price: item.product.price,
        originalPrice: item.product.originalPrice || item.product.price,
        quantity: item.quantity,
        weightAmount: item.product.unit || '১ কেজি',
      }));

      const submission: FormSubmission = {
        id: `quick-sub-${Date.now()}`,
        name: quickName.trim(),
        email: 'customer@halalbazar.bd',
        phone: quickPhone.trim(),
        message: fullDetails,
        type: 'order',
        timestamp: new Date().toISOString(),
        details: {
          cartItems: cartItemsPayload,
          subtotal: lineSubtotal,
          deliveryFee: delivery,
          deliveryArea: quickDeliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
          total,
          address: quickAddress.trim(),
          paymentMethod: 'cod',
          notes: quickNotes.trim(),
          cartItemsJson: JSON.stringify(cartItemsPayload),
        },
      };

      await onSubmitOrder(submission);
      setQuickSuccess(true);
      setCartItems([]);
      setTimeout(() => {
        setQuickOrderItems(null);
        setQuickSuccess(false);
      }, 3000);
    } catch (err: any) {
      setQuickError(err?.message || 'অর্ডার করতে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।');
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  const renderStoreName = (name: string, isFooter = false) => {
    const regex = /(বিডি|BD|B\.D\.|B D)/i;
    const parts = name.split(regex);
    if (parts.length > 1) {
      return (
        <span className="flex items-center gap-1 flex-wrap">
          <span className="text-[13px] sm:text-base lg:text-2xl font-black leading-tight">{parts[0]}</span>
          <span className={isFooter ? "text-amber-400 text-base sm:text-xl lg:text-3xl font-black tracking-wider" : "text-amber-500 text-base sm:text-xl lg:text-3xl font-black tracking-wider"}>{parts[1]}</span>
        </span>
      );
    }
    return <span className="text-[13px] sm:text-base lg:text-2xl font-black leading-tight">{name}</span>;
  };

  // Order form state
  const [selectedProductMap, setSelectedProductMap] = useState<Record<string, number>>(() => ({
    [displayProducts[3]?.id || 'prod-4']: 1, // Default select 'বাছাইকৃত বাদাম' as in screenshot
  }));

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [division, setDivision] = useState('ঢাকা');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [notes, setNotes] = useState('');
  const [mainDeliveryArea, setMainDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [mainAutoDetected, setMainAutoDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleAddressChange = (val: string) => {
    setCustomerAddress(val);
    if (!val || !val.trim()) {
      setMainAutoDetected(false);
      return;
    }
    const parsed = parseBangladeshAddress(val, effectiveCustomLocations);
    if (parsed.division) {
      setDivision(parsed.division);
    }
    if (parsed.district) {
      setDistrict(parsed.district);
    }
    if (parsed.thana) {
      setThana(parsed.thana);
    }
    if (parsed.postCode) {
      setPostOffice(parsed.postCode);
    }
    if (parsed.isInsideDhaka !== undefined) {
      setMainDeliveryArea(parsed.isInsideDhaka ? 'dhaka' : 'outside');
      if (parsed.isInsideDhaka) {
        if (!parsed.district) setDistrict('ঢাকা');
        if (!parsed.division) setDivision('ঢাকা');
      }
    }
    if (parsed.district || parsed.thana || parsed.isInsideDhaka !== undefined) {
      setMainAutoDetected(true);
    }
  };

  const availableDistrictsMain = useMemo(() => {
    const list = BD_DISTRICTS;
    let combined = list;
    if (effectiveCustomLocations) {
      const customDists = effectiveCustomLocations
        .filter((c) => c.type === 'district')
        .map((c) => ({ bn: c.nameBn, en: [c.nameEn || ''], division: c.division }));
      combined = [...list, ...customDists];
    }
    const seen = new Set<string>();
    return combined.filter((d) => {
      if (seen.has(d.bn)) return false;
      seen.add(d.bn);
      return true;
    });
  }, [effectiveCustomLocations]);

  const availableThanasMain = useMemo(() => {
    let list = BD_ALL_UPAZILAS_THANAS;
    if (district) {
      list = BD_ALL_UPAZILAS_THANAS.filter((t) => t.district === district);
    }

    let combined = list;
    if (effectiveCustomLocations) {
      const customThs = effectiveCustomLocations
        .filter((c) => c.type !== 'district')
        .filter((c) => !district || c.district === district)
        .map((c) => ({
          bn: c.nameBn,
          en: [c.nameEn || ''],
          district: c.district,
          division: c.division,
        }));
      combined = [...customThs, ...list];
    }
    const seen = new Set<string>();
    return combined.filter((t) => {
      const key = `${t.district || ''}-${t.bn}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [district, effectiveCustomLocations]);

  // 5 Feature Cards configuration
  const defaultServices = [
    {
      id: 'srv-1',
      number: '০১',
      titleBn: 'মানসম্মত পণ্য নির্বাচন',
      descBn: 'প্রতিটি পণ্য যত্নের সাথে বাছাই করা হয়।',
      icon: CheckCircle2,
    },
    {
      id: 'srv-2',
      number: '০২',
      titleBn: 'পরিচ্ছন্ন ও যত্নসহকারে প্যাকেজিং',
      descBn: 'প্রতিটি অর্ডার পরিষ্কারভাবে প্যাক করে পাঠানো হয়।',
      icon: Package,
    },
    {
      id: 'srv-3',
      number: '০৩',
      titleBn: 'সহজ অর্ডার প্রক্রিয়া',
      descBn: 'কয়েক ধাপেই আপনার পছন্দের পণ্য অর্ডার করুন।',
      icon: CheckSquare,
    },
    {
      id: 'srv-4',
      number: '০৪',
      titleBn: 'সারা বাংলাদেশে ডেলিভারি',
      descBn: 'আপনার এলাকায় পৌঁছে দেওয়া হয় আপনার অর্ডার।',
      icon: Truck,
    },
    {
      id: 'srv-5',
      number: '০৫',
      titleBn: 'ক্রেতার সন্তুষ্টিকে গুরুত্ব',
      descBn: 'গ্রাহকের মতামতকে আমরা গুরুত্ব দিই ও সেবায় প্রতিফলিত করি।',
      icon: Heart,
    },
  ];

  const servicesList = useMemo(() => {
    if (storeSettings.customServices && storeSettings.customServices.length > 0) {
      return storeSettings.customServices.map((s, idx) => ({
        id: s.id || `srv-${idx + 1}`,
        number: s.number || `০${idx + 1}`,
        titleBn: s.titleBn,
        descBn: s.descBn,
        icon: defaultServices[idx % defaultServices.length]?.icon || CheckCircle2,
      }));
    }
    return defaultServices;
  }, [storeSettings.customServices]);

  // Testimonials configuration
  const defaultTestimonials = [
    {
      id: 'test-1',
      authorBn: 'তানভীর আহমেদ',
      roleBn: 'ঢাকা',
      quoteBn: 'খাবারের মান ও স্বাদ অসাধারণ ছিল। খেজুর ও বাদাম দুটিই একদম ফ্রেশ পেয়েছি। ডেলিভারিও খুব দ্রুত ছিল।',
      rating: 5,
    },
    {
      id: 'test-2',
      authorBn: 'ফারহানা রহমান',
      roleBn: 'চট্টগ্রাম',
      quoteBn: 'নারিকেলের নাড়ু এবং গুড়ের নাড়ুর স্বাদ চমৎকার, একদম খাঁটি ঘরোয়া স্বাদ। ধন্যবাদ হালাল বাজার বিডিকে।',
      rating: 5,
    },
    {
      id: 'test-3',
      authorBn: 'মাসুদ করিম',
      roleBn: 'সিলেট',
      quoteBn: 'প্যাকেজিং খুব যত্নসহকারে করা হয়েছিল। ড্রাই ফ্রুটসের মান নিয়ে কোনো সন্দেহ নেই। নিয়মিত কেনাকাটা করব।',
      rating: 5,
    },
  ];

  const testimonialsList = useMemo(() => {
    if (storeSettings.customTestimonials && storeSettings.customTestimonials.length > 0) {
      return storeSettings.customTestimonials;
    }
    return defaultTestimonials;
  }, [storeSettings.customTestimonials]);

  // Active Hero Banner Slides (blank unless explicitly added by admin)
  const heroSlidesList = useMemo(() => {
    if (storeSettings.heroSlides && Array.isArray(storeSettings.heroSlides) && storeSettings.heroSlides.length > 0) {
      const DEMO_SLIDE_IDS = new Set([
        'slide-default-1',
        'slide-1791282947239',
        'slide-1791282957471',
        'hero-main-slide',
        'default-landing-hero-slide',
      ]);
      const valid = storeSettings.heroSlides.filter(
        (s) => Boolean(s && s.id && !DEMO_SLIDE_IDS.has(s.id) && (s.titleBn || s.image || s.badgeBn || s.titleEn))
      );
      if (valid.length > 0) return valid;
    }
    return [];
  }, [storeSettings.heroSlides]);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    if (heroSlidesList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlidesList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlidesList.length]);

  const activeSlide = heroSlidesList.length > 0
    ? (heroSlidesList[Math.min(currentHeroSlide, heroSlidesList.length - 1)] || heroSlidesList[0])
    : null;

  // Toggle or select product
  const handleToggleProduct = (product: ProductItem) => {
    setSelectedProductMap((prev) => {
      const copy = { ...prev };
      if (copy[product.id]) {
        delete copy[product.id];
      } else {
        copy[product.id] = 1;
      }
      return copy;
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setSelectedProductMap((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      const copy = { ...prev };
      if (next <= 0) {
        delete copy[productId];
      } else {
        copy[productId] = next;
      }
      return copy;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedProductMap((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const scrollToOrderForm = (productToSelect?: ProductItem) => {
    if (productToSelect) {
      setSelectedProductMap((prev) => ({
        ...prev,
        [productToSelect.id]: prev[productToSelect.id] ? prev[productToSelect.id] : 1,
      }));
    }
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculations for order summary
  const selectedItemsList = useMemo(() => {
    return Object.entries(selectedProductMap)
      .map(([id, qty]) => {
        const prod = displayProducts.find((p) => p.id === id);
        if (!prod || qty <= 0) return null;
        return {
          product: prod,
          qty,
          lineTotal: prod.price * qty,
        };
      })
      .filter(Boolean) as { product: ProductItem; qty: number; lineTotal: number }[];
  }, [selectedProductMap, displayProducts]);

  const subtotal = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [selectedItemsList]);

  const matchedCustomLocation = useMemo(() => {
    return findMatchingLocation(effectiveCustomLocations, {
      address: customerAddress,
      thana: thana,
      district: district,
      division: division,
    });
  }, [customerAddress, thana, district, division, effectiveCustomLocations]);

  const mainDeliveryResolution = useMemo(() => {
    return resolveDeliveryFee(
      {
        address: customerAddress,
        thana: thana,
        district: district,
        division: division,
        deliveryArea: mainDeliveryArea,
      },
      {
        ...storeSettings,
        customLocations: effectiveCustomLocations,
      }
    );
  }, [customerAddress, thana, district, division, effectiveCustomLocations, storeSettings, mainDeliveryArea]);

  const deliveryFee = useMemo(() => {
    if (selectedItemsList.length === 0) return 0;
    return mainDeliveryArea === 'dhaka'
      ? (storeSettings.deliveryFeeDhaka ?? 70)
      : (storeSettings.deliveryFeeOutside ?? 130);
  }, [selectedItemsList.length, mainDeliveryArea, storeSettings.deliveryFeeDhaka, storeSettings.deliveryFeeOutside]);

  const grandTotal = subtotal + deliveryFee;

  // Handle Order Form Submit
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (selectedItemsList.length === 0) {
      setSubmitError('অনুগ্রহ করে অন্তত একটি পণ্য নির্বাচন করুন।');
      return;
    }

    if (!customerName.trim()) {
      setSubmitError('অনুগ্রহ করে কাস্টমারের নাম লিখুন।');
      return;
    }

    if (!customerPhone.trim()) {
      setSubmitError('অনুগ্রহ করে মোবাইল নম্বর লিখুন।');
      return;
    }

    if (!customerAddress.trim()) {
      setSubmitError('অনুগ্রহ করে আপনার সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const cartItemsPayload = selectedItemsList.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBn,
        price: item.product.price,
        originalPrice: item.product.originalPrice || item.product.price,
        quantity: item.qty,
        weightAmount: item.product.unit || '১ কেজি',
      }));

      const fullDetails = [
        customerAddress,
        division ? `বিভাগ: ${division}` : '',
        district ? `জেলা: ${district}` : '',
        thana ? `থানা/উপজেলা: ${thana}` : '',
        postOffice ? `পোস্ট অফিস: ${postOffice}` : '',
        altPhone ? `বিকল্প ফোন: ${altPhone}` : '',
        notes ? `নোট: ${notes}` : '',
      ]
        .filter(Boolean)
        .join(', ');

      const submission: FormSubmission = {
        id: `sub-${Date.now()}`,
        name: customerName.trim(),
        email: 'customer@halalbazar.bd',
        phone: customerPhone.trim(),
        message: fullDetails,
        type: 'order',
        timestamp: new Date().toISOString(),
        details: {
          cartItems: cartItemsPayload,
          subtotal,
          deliveryFee,
          deliveryArea: mainDeliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
          total: grandTotal,
          address: customerAddress.trim(),
          paymentMethod: 'cod',
          notes: notes.trim(),
          cartItemsJson: JSON.stringify(cartItemsPayload),
        },
      };

      await onSubmitOrder(submission);

      // Reset form after successful submission
      setCustomerName('');
      setCustomerPhone('');
      setAltPhone('');
      setCustomerAddress('');
      setDistrict('');
      setThana('');
      setPostOffice('');
      setNotes('');
    } catch (err: any) {
      setSubmitError(err?.message || 'অর্ডার করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#1a2e22] font-['Hind_Siliguri',sans-serif] selection:bg-[#0f5132] selection:text-white">
      {/* 1. TOP NAVBAR (Screenshot 1 top) */}
      <header className="sticky top-0 z-50 bg-[#e8f5e9]/95 backdrop-blur-md border-b border-[#c8e6c9] transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-20 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 group relative min-w-0">
            <div 
              onClick={handleLogoClick}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#0f5132] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative shrink-0 cursor-pointer"
            >
              {storeSettings.logoImage ? (
                <img src={storeSettings.logoImage} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🍃</span>
              )}
              <EditTrigger
                variant="image"
                className="scale-75 top-0 right-0"
                label="লোগো"
                target={{
                  id: 'logo-img',
                  field: 'logoImage',
                  type: 'image',
                  title: 'লোগো ছবি পরিবর্তন',
                  label: 'লোগো ইমেজ',
                  value: storeSettings.logoImage || '',
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black text-[#0f5132] leading-tight tracking-tight flex items-center">
                  <InlineEditable
                    target={{
                      id: 'store-name',
                      field: 'storeName',
                      type: 'text',
                      title: 'দোকানের নাম পরিবর্তন',
                      label: 'দোকানের নাম',
                      value: storeSettings.storeName || 'হালাল বাজার বিডি',
                    }}
                  >
                    {renderStoreName(storeSettings.storeName || 'হালাল বাজার বিডি')}
                  </InlineEditable>
                </span>
                <EditTrigger
                  variant="icon-only"
                  target={{
                    id: 'store-name',
                    field: 'storeName',
                    type: 'text',
                    title: 'দোকানের নাম পরিবর্তন',
                    label: 'দোকানের নাম',
                    value: storeSettings.storeName || 'হালাল বাজার বিডি',
                  }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-[11px] text-[#55695d] font-medium leading-none">
                  <InlineEditable
                    target={{
                      id: 'store-badge',
                      field: 'storeBadgeBn',
                      type: 'text',
                      title: 'ট্যাগলাইন পরিবর্তন',
                      label: 'ট্যাগলাইন',
                      value: storeSettings.storeBadgeBn || 'বিশ্বাস ও শুদ্ধতার আস্থা',
                    }}
                  >
                    {storeSettings.storeBadgeBn || 'বিশ্বাস ও শুদ্ধতার আস্থা'}
                  </InlineEditable>
                </span>
                <EditTrigger
                  variant="icon-only"
                  className="w-4 h-4 ml-1"
                  target={{
                    id: 'store-badge',
                    field: 'storeBadgeBn',
                    type: 'text',
                    title: 'ট্যাগলাইন পরিবর্তন',
                    label: 'ট্যাগলাইন',
                    value: storeSettings.storeBadgeBn || 'বিশ্বাস ও শুদ্ধতার আস্থা',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#3b4c41]">
            <a href="#" className="hover:text-[#0f5132] transition-colors">
              হোম
            </a>
            <a href="#products" className="hover:text-[#0f5132] transition-colors">
              আমাদের পণ্য
            </a>
            <a href="#about" className="hover:text-[#0f5132] transition-colors">
              আমাদের সম্পর্কে
            </a>
            <a href="#features" className="hover:text-[#0f5132] transition-colors">
              কেন আমাদের থেকে কিনবেন
            </a>
            <a href="#order-form" className="hover:text-[#0f5132] transition-colors">
              যোগাযোগ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Facebook Page Icon */}
            <a
              href={storeSettings.facebookUrl || "https://facebook.com/halalbazarbd"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-[#1565d8] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
              title="আমাদের ফেসবুক পেজ"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* WhatsApp Direct Chat Button */}
            <a
              href={`https://wa.me/${(storeSettings.whatsappNumber || storeSettings.phone || '01329571899').replace(/\D/g, '').replace(/^0/, '880')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer ring-2 ring-emerald-400/30"
              title="হোয়াটসঅ্যাপে চ্যাট ও অর্ডার করুন"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {storeSettings.phone && (
              <a
                href={`tel:${storeSettings.phone.split(',')[0].trim()}`}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#0f5132] bg-white/80 hover:bg-white px-3 py-2 rounded-xl border border-[#c8e6c9] transition-all shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{storeSettings.phone.split(',')[0].trim()}</span>
              </a>
            )}
            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white hover:bg-[#f0fdf4] text-[#0f5132] border border-[#c8e6c9] transition-all shadow-xs cursor-pointer flex items-center justify-center"
              title="শপিং কার্ট দেখুন"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => scrollToOrderForm()}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#0b3d26] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Screenshot 1 - blank unless admin adds slide) */}
      {heroSlidesList.length > 0 && activeSlide ? (
        <section className="py-12 sm:py-16 lg:py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20] text-xs sm:text-sm font-bold shadow-xs">
                <span>🌱</span>
                <span>{activeSlide.badgeBn || storeSettings.heroBadge || '১০০% বাংলা — খাঁটি ও বাছাইকৃত খাবার'}</span>
                <EditTrigger
                  variant="icon-only"
                  className="w-5 h-5 ml-1"
                  target={{
                    id: `hero-badge-${activeSlide.id || currentHeroSlide}`,
                    field: currentHeroSlide === 0 ? 'heroBadge' : 'heroSlideBadge',
                    slideIndex: currentHeroSlide,
                    type: 'text',
                    title: `হিরো ব্যাজ পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                    label: 'ব্যানার ব্যাজ টেক্সট',
                    value: activeSlide.badgeBn || storeSettings.heroBadge || '১০০% বাংলা — খাঁটি ও বাছাইকৃত খাবার',
                  }}
                />
              </div>

              {/* Main Headline */}
              <div className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#0f3d2e] leading-[1.2] tracking-tight">
                  <InlineEditable
                    target={{
                      id: `hero-title-${activeSlide.id || currentHeroSlide}`,
                      field: currentHeroSlide === 0 ? 'heroTitle' : 'heroSlideTitle',
                      slideIndex: currentHeroSlide,
                      type: 'text',
                      title: `হিরো প্রধান শিরোনাম পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                      label: 'হেডলাইন',
                      value: activeSlide.titleBn || storeSettings.heroTitle || 'প্রাকৃতিক স্বাদে, বিশুদ্ধ খাবারের আস্থা',
                    }}
                    multiline
                  >
                    {activeSlide.titleBn || storeSettings.heroTitle || 'প্রাকৃতিক স্বাদে,\nবিশুদ্ধ খাবারের আস্থা'}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: `hero-title-${activeSlide.id || currentHeroSlide}`,
                      field: currentHeroSlide === 0 ? 'heroTitle' : 'heroSlideTitle',
                      slideIndex: currentHeroSlide,
                      type: 'text',
                      title: `হিরো প্রধান শিরোনাম পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                      label: 'হেডলাইন',
                      value: activeSlide.titleBn || storeSettings.heroTitle || 'প্রাকৃতিক স্বাদে, বিশুদ্ধ খাবারের আস্থা',
                    }}
                  />
                </h1>
              </div>

              {/* Subtitle */}
              <div className="relative">
                <p className="text-base sm:text-lg text-[#4a5f52] max-w-lg leading-relaxed font-medium">
                  <InlineEditable
                    target={{
                      id: `hero-subtitle-${activeSlide.id || currentHeroSlide}`,
                      field: currentHeroSlide === 0 ? 'heroSubtitle' : 'heroSlideSubtitle',
                      slideIndex: currentHeroSlide,
                      type: 'textarea',
                      title: `হিরো সাবটাইটেল পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                      label: 'সাবটাইটেল বিবরণ',
                      value: activeSlide.subtitleBn || storeSettings.heroSubtitle || 'খেজুর, ঘরে তৈরি নাড়ু, বাদাম ও বাছাইকৃত খাবার পৌঁছে যাক আপনার ঘরে।',
                    }}
                    multiline
                  >
                    {activeSlide.subtitleBn || storeSettings.heroSubtitle || 'খেজুর, ঘরে তৈরি নাড়ু, বাদাম ও বাছাইকৃত খাবার পৌঁছে যাক আপনার ঘরে।'}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: `hero-subtitle-${activeSlide.id || currentHeroSlide}`,
                      field: currentHeroSlide === 0 ? 'heroSubtitle' : 'heroSlideSubtitle',
                      slideIndex: currentHeroSlide,
                      type: 'textarea',
                      title: `হিরো সাবটাইটেল পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                      label: 'সাবটাইটেল বিবরণ',
                      value: activeSlide.subtitleBn || storeSettings.heroSubtitle || 'খেজুর, ঘরে তৈরি নাড়ু, বাদাম ও বাছাইকৃত খাবার পৌঁছে যাক আপনার ঘরে।',
                    }}
                  />
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => scrollToOrderForm()}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0f5132] hover:bg-[#0b3d26] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{activeSlide.ctaBn || storeSettings.heroCtaText || 'এখনই অর্ডার করুন'}</span>
                  </button>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: `hero-cta-${activeSlide.id || currentHeroSlide}`,
                      field: currentHeroSlide === 0 ? 'heroCtaText' : 'heroSlideCta',
                      slideIndex: currentHeroSlide,
                      type: 'text',
                      title: `হিরো বাটন টেক্সট পরিবর্তন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                      label: 'বাটন টেক্সট',
                      value: activeSlide.ctaBn || storeSettings.heroCtaText || 'এখনই অর্ডার করুন',
                    }}
                  />
                </div>

                <a
                  href="#products"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#f3f1e9] text-[#2c3e34] border border-[#d6d4c8] font-bold text-base shadow-xs transition-all cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-[#4a5f52]" />
                  <span>পণ্য দেখুন</span>
                </a>
              </div>
            </div>

            {/* Right Food Collage Image Card */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-white max-w-lg w-full aspect-[4/3] bg-[#f0eee4] group">
                <img
                  key={`${activeSlide.id}-${activeSlide.image}`}
                  src={activeSlide.image || storeSettings.heroImage || '/src/assets/images/hero_food_assortment_1792735602404.jpg'}
                  alt="হালাল বাজার বিডি ফুড অ্যাসর্টমেন্ট"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <EditTrigger
                  variant="image"
                  label={`হিরো ছবি পরিবর্তন ${heroSlidesList.length > 1 ? `(#${currentHeroSlide + 1})` : ''}`}
                  target={{
                    id: `hero-img-${activeSlide.id || currentHeroSlide}`,
                    field: currentHeroSlide === 0 ? 'heroImage' : 'heroSlideImage',
                    slideIndex: currentHeroSlide,
                    type: 'image',
                    title: `হিরো ছবি পরিবর্তন করুন ${heroSlidesList.length > 1 ? `(স্লাইড #${currentHeroSlide + 1})` : ''}`,
                    label: 'হিরো ছবি',
                    value: activeSlide.image || storeSettings.heroImage || '/src/assets/images/hero_food_assortment_1792735602404.jpg',
                  }}
                />
              </div>

              {/* Slider Navigation Arrows if Multiple Slides */}
              {heroSlidesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentHeroSlide((prev) => (prev === 0 ? heroSlidesList.length - 1 : prev - 1))}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0f5132] border border-[#c8e6c9] shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlidesList.length)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0f5132] border border-[#c8e6c9] shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          {heroSlidesList.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {heroSlidesList.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    currentHeroSlide === idx
                      ? 'w-8 h-2.5 bg-[#0f5132]'
                      : 'w-2.5 h-2.5 bg-[#c8e6c9] hover:bg-[#a3d9a5]'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      ) : null}

      {/* 3. POPULAR PRODUCTS SECTION (Screenshot 1 bottom) */}
      <section id="products" className="py-16 sm:py-20 border-t border-[#ebe9e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 relative">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d2e] tracking-tight flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'products-title',
                  field: 'spicesTitleBn',
                  type: 'text',
                  title: 'পণ্য সেকশন শিরোনাম পরিবর্তন',
                  label: 'সেকশন শিরোনাম',
                  value: storeSettings.spicesTitleBn || 'আমাদের জনপ্রিয় পণ্য',
                }}
              >
                {storeSettings.spicesTitleBn || 'আমাদের জনপ্রিয় পণ্য'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                target={{
                  id: 'products-title',
                  field: 'spicesTitleBn',
                  type: 'text',
                  title: 'পণ্য সেকশন শিরোনাম পরিবর্তন',
                  label: 'সেকশন শিরোনাম',
                  value: storeSettings.spicesTitleBn || 'আমাদের জনপ্রিয় পণ্য',
                }}
              />
            </h2>
            <p className="text-sm sm:text-base text-[#5c7063] mt-2 font-medium flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'products-desc',
                  field: 'spicesDescBn',
                  type: 'text',
                  title: 'পণ্য সেকশন বিবরণ পরিবর্তন',
                  label: 'সেকশন বিবরণ',
                  value: storeSettings.spicesDescBn || 'যত্নের সাথে বাছাই করা প্রতিটি পণ্য — এক ক্লিকেই অর্ডার করুন।',
                }}
              >
                {storeSettings.spicesDescBn || 'যত্নের সাথে বাছাই করা প্রতিটি পণ্য — এক ক্লিকেই অর্ডার করুন।'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                className="w-4 h-4 ml-1"
                target={{
                  id: 'products-desc',
                  field: 'spicesDescBn',
                  type: 'text',
                  title: 'পণ্য সেকশন বিবরণ পরিবর্তন',
                  label: 'সেকশন বিবরণ',
                  value: storeSettings.spicesDescBn || 'যত্নের সাথে বাছাই করা প্রতিটি পণ্য — এক ক্লিকেই অর্ডার করুন।',
                }}
              />
            </p>
          </div>

          {/* Product Cards Grid (6 Products) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  setSelectedProductDetails(prod);
                  setModalQuantity(1);
                  setActiveGalleryIndex(0);
                }}
                className="bg-white rounded-2xl border border-[#e5e3d8] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c9c6b8] transition-all duration-300 flex flex-col justify-between group relative cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[4/3] bg-[#f4f3ec] overflow-hidden">
                  <img
                    src={prod.image || '/src/assets/images/hero_food_assortment_1792735602404.jpg'}
                    alt={prod.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Visual Quick Edit on image */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <EditTrigger
                      variant="image"
                      label="পণ্য ও ছবি এডিট"
                      target={{
                        id: `prod-img-${prod.id}`,
                        field: 'product',
                        type: 'product',
                        title: `${prod.nameBn} এর ছবি ও তথ্য পরিবর্তন`,
                        label: 'পণ্য এডিটর',
                        productId: prod.id,
                        value: prod,
                      }}
                    />
                  </div>
                  {prod.inStock === false && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-rose-600/90 text-white text-[11px] font-bold">
                      স্টক শেষ
                    </span>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-black text-[#0f3d2e] group-hover:text-[#0f5132] transition-colors flex items-center">
                        <InlineEditable
                          target={{
                            id: `prod-title-${prod.id}-inline`,
                            field: 'product',
                            type: 'product',
                            title: `${prod.nameBn} নাম পরিবর্তন`,
                            label: 'পণ্যের নাম',
                            productId: prod.id,
                            value: prod.nameBn,
                          }}
                        >
                          {prod.nameBn}
                        </InlineEditable>
                        <div onClick={(e) => e.stopPropagation()}>
                          <EditTrigger
                            variant="icon-only"
                            target={{
                              id: `prod-title-${prod.id}`,
                              field: 'product',
                              type: 'product',
                              title: `${prod.nameBn} এডিট করুন`,
                              label: 'পণ্য এডিটর',
                              productId: prod.id,
                              value: prod,
                            }}
                          />
                        </div>
                      </h3>
                      {isLivePreview && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => openQuickEdit({
                              id: `prod-quick-${prod.id}`,
                              field: 'product',
                              type: 'product',
                              title: `${prod.nameBn} এডিট করুন`,
                              label: 'পণ্য এডিটর',
                              productId: prod.id,
                              value: prod,
                            })}
                            className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0"
                            title="পণ্য সম্পূর্ণ এডিট"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                            <span>এডিট</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#667a6e] mt-1.5 leading-snug line-clamp-2">
                      <InlineEditable
                        target={{
                          id: `prod-desc-${prod.id}-inline`,
                          field: 'product',
                          type: 'product',
                          title: `${prod.nameBn} বিবরণ পরিবর্তন`,
                          label: 'পণ্যের বিবরণ',
                          productId: prod.id,
                          value: prod.descBn,
                        }}
                        multiline
                      >
                        {prod.descBn || 'বাছাইকৃত, সেরা মানের খাদ্যপণ্য।'}
                      </InlineEditable>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#f0eee4] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-[#0f5132] font-mono">
                        ৳{prod.price}
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-xs text-neutral-400 line-through ml-2 font-mono">
                          ৳{prod.originalPrice}
                        </span>
                      )}
                      <span className="text-xs text-[#718477] ml-1.5 font-medium">
                        {prod.unit || 'প্রতি কেজি'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => addToCart(prod, 1)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#0f5132] hover:bg-[#f0fdf4] text-[#0f5132] font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                        title="কার্টে যোগ করুন"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>কার্ট</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOneClickOrder(prod)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                        title="১ ক্লিকে দ্রুত অর্ডার করুন"
                      >
                        <Zap className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" />
                        <span>১-ক্লিক অর্ডার</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID ("কেন আমাদের থেকে কিনবেন" - Screenshot 2 top) */}
      <section id="features" className="py-16 sm:py-20 bg-[#f4f2ea] border-y border-[#ebe9e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 flex items-center justify-center">
            <span className="text-sm font-bold text-[#0f5132]">
              <InlineEditable
                target={{
                  id: 'features-badge-text',
                  field: 'servicesSectionDescBn',
                  type: 'text',
                  title: 'ফিচার সেকশন ট্যাগলাইন পরিবর্তন',
                  label: 'ট্যাগলাইন',
                  value: storeSettings.servicesSectionDescBn || 'আপনার আস্থাই আমাদের সবচেয়ে বড় অর্জন।',
                }}
              >
                {storeSettings.servicesSectionDescBn || 'আপনার আস্থাই আমাদের সবচেয়ে বড় অর্জন।'}
              </InlineEditable>
            </span>
            <EditTrigger
              variant="icon-only"
              className="w-4 h-4 ml-1.5"
              target={{
                id: 'features-badge-text',
                field: 'servicesSectionDescBn',
                type: 'text',
                title: 'ফিচার সেকশন ট্যাগলাইন পরিবর্তন',
                label: 'ট্যাগলাইন',
                value: storeSettings.servicesSectionDescBn || 'আপনার আস্থাই আমাদের সবচেয়ে বড় অর্জন।',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesList.map((srv) => {
              const IconComp = srv.icon || CheckCircle2;
              return (
                <div
                  key={srv.id}
                  className="p-6 rounded-2xl bg-white border border-[#e2e0d5] shadow-xs flex items-start gap-4 relative group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0f3d2e]">
                        <InlineEditable
                          target={{
                            id: `feature-${srv.id}-title`,
                            field: 'services',
                            type: 'text',
                            title: `${srv.titleBn} শিরোনাম পরিবর্তন`,
                            label: 'শিরোনাম',
                            value: srv.descBn,
                            secondaryValue: srv.titleBn,
                            productId: srv.id,
                          }}
                        >
                          {srv.titleBn}
                        </InlineEditable>
                      </h4>
                      <EditTrigger
                        variant="icon-only"
                        className="w-5 h-5"
                        target={{
                          id: `feature-${srv.id}`,
                          field: 'services',
                          type: 'text',
                          title: `${srv.titleBn} কার্ড এডিট`,
                          label: 'বিবরণ ও শিরোনাম',
                          value: srv.descBn,
                          secondaryValue: srv.titleBn,
                          productId: srv.id,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#62776a] mt-1 leading-relaxed">
                      <InlineEditable
                        target={{
                          id: `feature-${srv.id}-desc`,
                          field: 'services',
                          type: 'text',
                          title: `${srv.titleBn} বিবরণ পরিবর্তন`,
                          label: 'বিবরণ',
                          value: srv.descBn,
                          secondaryValue: srv.titleBn,
                          productId: srv.id,
                        }}
                      >
                        {srv.descBn}
                      </InlineEditable>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PROMOTIONAL SPLIT BANNER (Screenshot 2 middle) */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[32px] overflow-hidden shadow-xl border border-[#0f5132]/20 grid grid-cols-1 lg:grid-cols-12 bg-[#0f5132] text-white relative">
            {/* Banner Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight flex items-center">
                  <InlineEditable
                    target={{
                      id: 'promo-title',
                      field: 'announcementText',
                      type: 'text',
                      title: 'প্রমো ব্যানার শিরোনাম পরিবর্তন',
                      label: 'ব্যানার শিরোনাম',
                      value: storeSettings.announcementText || 'প্রিয়জনের জন্য বেছে নিন সুস্বাদু খাবার',
                    }}
                    multiline
                  >
                    {storeSettings.announcementText || 'প্রিয়জনের জন্য বেছে নিন সুস্বাদু খাবার'}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: 'promo-title',
                      field: 'announcementText',
                      type: 'text',
                      title: 'প্রমো ব্যানার শিরোনাম পরিবর্তন',
                      label: 'ব্যানার শিরোনাম',
                      value: storeSettings.announcementText || 'প্রিয়জনের জন্য বেছে নিন সুস্বাদু খাবার',
                    }}
                  />
                </h2>
              </div>

              <div className="relative">
                <p className="text-base sm:text-lg text-[#d0e5d9] leading-relaxed flex items-center">
                  <InlineEditable
                    target={{
                      id: 'promo-subtitle',
                      field: 'promoBannerSubtitle',
                      type: 'text',
                      title: 'প্রমো ব্যানার সাবটাইটেল পরিবর্তন',
                      label: 'ব্যানার সাবটাইটেল',
                      value: storeSettings.promoBannerSubtitle || 'আপনার পছন্দের পণ্য অর্ডার করুন সহজেই।',
                    }}
                    multiline
                  >
                    {storeSettings.promoBannerSubtitle || 'আপনার পছন্দের পণ্য অর্ডার করুন সহজেই।'}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: 'promo-subtitle',
                      field: 'promoBannerSubtitle',
                      type: 'text',
                      title: 'প্রমো ব্যানার সাবটাইটেল পরিবর্তন',
                      label: 'ব্যানার সাবটাইটেল',
                      value: storeSettings.promoBannerSubtitle || 'আপনার পছন্দের পণ্য অর্ডার করুন সহজেই।',
                    }}
                  />
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToOrderForm()}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-[#0f5132] hover:bg-[#f0fdf4] font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-[#0f5132]" />
                  <span>
                    <InlineEditable
                      target={{
                        id: 'promo-cta',
                        field: 'promoBannerCta',
                        type: 'text',
                        title: 'প্রমো বাটন টেক্সট পরিবর্তন',
                        label: 'বাটন টেক্সট',
                        value: storeSettings.promoBannerCta || 'অর্ডার করতে ক্লিক করুন',
                      }}
                    >
                      {storeSettings.promoBannerCta || 'অর্ডার করতে ক্লিক করুন'}
                    </InlineEditable>
                  </span>
                </button>
                <EditTrigger
                  variant="icon-only"
                  target={{
                    id: 'promo-cta',
                    field: 'promoBannerCta',
                    type: 'text',
                    title: 'প্রমো বাটন টেক্সট পরিবর্তন',
                    label: 'বাটন টেক্সট',
                    value: storeSettings.promoBannerCta || 'অর্ডার করতে ক্লিক করুন',
                  }}
                />
              </div>
            </div>

            {/* Banner Right Image */}
            <div className="lg:col-span-6 min-h-[300px] lg:min-h-full relative overflow-hidden bg-[#073320]">
              <img
                src={storeSettings.spicesImage || '/src/assets/images/promo_banner_food_1792735628792.jpg'}
                alt="সুস্বাদু খাবার উপহার"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <EditTrigger
                variant="image"
                label="ব্যানার ছবি"
                target={{
                  id: 'promo-image',
                  field: 'spicesImage',
                  type: 'image',
                  title: 'প্রমো ব্যানার ছবি পরিবর্তন করুন',
                  label: 'ব্যানার ছবি',
                  value: storeSettings.spicesImage || '/src/assets/images/promo_banner_food_1792735628792.jpg',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. ABOUT US SECTION (Screenshot 2 bottom) */}
      <section id="about" className="py-16 sm:py-20 border-t border-[#ebe9e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white aspect-[4/3] w-full max-w-md bg-[#f4f2e8] relative group">
                <img
                  src={storeSettings.aboutImage || '/src/assets/images/dry_fruits_assortment_1792735628210.jpg'}
                  alt="হালাল বাজার বিডি খাদ্যপণ্য"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <EditTrigger
                  variant="image"
                  label="আমাদের ছবি"
                  target={{
                    id: 'about-img',
                    field: 'aboutImage',
                    type: 'image',
                    title: 'আমাদের সম্পর্কে ছবি পরিবর্তন করুন',
                    label: 'আমাদের ছবি',
                    value: storeSettings.aboutImage || '/src/assets/images/dry_fruits_assortment_1792735628210.jpg',
                  }}
                />
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold border border-[#c8e6c9]">
                <span>🍃</span>
                <span>
                  <InlineEditable
                    target={{
                      id: 'about-badge',
                      field: 'aboutBadgeBn',
                      type: 'text',
                      title: 'আমাদের গল্প ব্যাজ পরিবর্তন',
                      label: 'ব্যাজ টেক্সট',
                      value: storeSettings.aboutBadgeBn || 'আমাদের সম্পর্কে',
                    }}
                  >
                    {storeSettings.aboutBadgeBn || 'আমাদের সম্পর্কে'}
                  </InlineEditable>
                </span>
                <EditTrigger
                  variant="icon-only"
                  className="w-4 h-4 ml-1"
                  target={{
                    id: 'about-badge',
                    field: 'aboutBadgeBn',
                    type: 'text',
                    title: 'আমাদের গল্প ব্যাজ পরিবর্তন',
                    label: 'ব্যাজ টেক্সট',
                    value: storeSettings.aboutBadgeBn || 'আমাদের সম্পর্কে',
                  }}
                />
              </div>

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d2e] leading-snug flex items-center">
                  <InlineEditable
                    target={{
                      id: 'about-title',
                      field: 'aboutTitleBn',
                      type: 'text',
                      title: 'আমাদের গল্প শিরোনাম পরিবর্তন',
                      label: 'শিরোনাম',
                      value: storeSettings.aboutTitleBn || 'হালাল বাজার বিডি — বিশ্বাস ও শুদ্ধতার আস্থা',
                    }}
                    multiline
                  >
                    {storeSettings.aboutTitleBn || 'হালাল বাজার বিডি — বিশ্বাস ও শুদ্ধতার আস্থা'}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: 'about-title',
                      field: 'aboutTitleBn',
                      type: 'text',
                      title: 'আমাদের গল্প শিরোনাম পরিবর্তন',
                      label: 'শিরোনাম',
                      value: storeSettings.aboutTitleBn || 'হালাল বাজার বিডি — বিশ্বাস ও শুদ্ধতার আস্থা',
                    }}
                  />
                </h2>
              </div>

              <div className="relative space-y-4">
                <p className="text-sm sm:text-base text-[#4a5f52] leading-relaxed">
                  <InlineEditable
                    target={{
                      id: 'about-desc',
                      field: 'aboutDescBn',
                      type: 'textarea',
                      title: 'আমাদের গল্প বর্ণনা পরিবর্তন',
                      label: 'বিবরণ টেক্সট',
                      value: storeSettings.aboutDescBn || 'হালাল বাজার বিডি একটি খাদ্যপণ্য ব্যবসা, যেখানে পাওয়া যায় বাছাইকৃত খেজুর, ঘরে তৈরি স্বাদের নাড়ু, বাদাম এবং নানা ধরনের বাছাইকৃত খাবার। আমরা বিশ্বাস করি — খাবার যত খাঁটি, আস্থা তত গভীর।\n\nপ্রতিটি পণ্য যত্নের সাথে বাছাই ও প্যাক করা হয়, যেন আপনি ও আপনার পরিবারের প্রিয়জনরা নিশ্চিন্তে উপভোগ করতে পারেন। সহজ অর্ডার প্রক্রিয়া আর নির্ভরযোগ্য ডেলিভারির মাধ্যমে আমরা চাই আপনার কেনাকাটার অভিজ্ঞতা হোক ঝামেলামুক্ত ও আনন্দময়।',
                    }}
                    multiline
                  >
                    {storeSettings.aboutDescBn ? (
                      storeSettings.aboutDescBn
                    ) : (
                      <>
                        হালাল বাজার বিডি একটি খাদ্যপণ্য ব্যবসা, যেখানে পাওয়া যায় বাছাইকৃত খেজুর, ঘরে তৈরি স্বাদের নাড়ু, বাদাম এবং নানা ধরনের বাছাইকৃত খাবার। আমরা বিশ্বাস করি — খাবার যত খাঁটি, আস্থা তত গভীর।
                      </>
                    )}
                  </InlineEditable>
                  <EditTrigger
                    variant="icon-only"
                    target={{
                      id: 'about-desc',
                      field: 'aboutDescBn',
                      type: 'textarea',
                      title: 'আমাদের গল্প বর্ণনা পরিবর্তন',
                      label: 'বিবরণ টেক্সট',
                      value: storeSettings.aboutDescBn || 'হালাল বাজার বিডি একটি খাদ্যপণ্য ব্যবসা, যেখানে পাওয়া যায় বাছাইকৃত খেজুর, ঘরে তৈরি স্বাদের নাড়ু, বাদাম এবং নানা ধরনের বাছাইকৃত খাবার। আমরা বিশ্বাস করি — খাবার যত খাঁটি, আস্থা তত গভীর।\n\nপ্রতিটি পণ্য যত্নের সাথে বাছাই ও প্যাক করা হয়, যেন আপনি ও আপনার পরিবারের প্রিয়জনরা নিশ্চিন্তে উপভোগ করতে পারেন। সহজ অর্ডার প্রক্রিয়া আর নির্ভরযোগ্য ডেলিভারির মাধ্যমে আমরা চাই আপনার কেনাকাটার অভিজ্ঞতা হোক ঝামেলামুক্ত ও আনন্দময়।',
                    }}
                  />
                </p>

                {!storeSettings.aboutDescBn && (
                  <p className="text-sm sm:text-base text-[#4a5f52] leading-relaxed">
                    প্রতিটি পণ্য যত্নের সাথে বাছাই ও প্যাক করা হয়, যেন আপনি ও আপনার পরিবারের প্রিয়জনরা নিশ্চিন্তে উপভোগ করতে পারেন। সহজ অর্ডার প্রক্রিয়া আর নির্ভরযোগ্য ডেলিভারির মাধ্যমে আমরা চাই আপনার কেনাকাটার অভিজ্ঞতা হোক ঝামেলামুক্ত ও আনন্দময়।
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION (Screenshot 3 top) */}
      <section className="py-16 sm:py-20 bg-[#f8f7f2] border-t border-[#ebe9e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 relative">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d2e] flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'reviews-title',
                  field: 'testimonialsTitleBn',
                  type: 'text',
                  title: 'রিভিউ শিরোনাম পরিবর্তন',
                  label: 'শিরোনাম',
                  value: storeSettings.testimonialsTitleBn || 'গ্রাহকদের মতামত',
                }}
              >
                {storeSettings.testimonialsTitleBn || 'গ্রাহকদের মতামত'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                target={{
                  id: 'reviews-title',
                  field: 'testimonialsTitleBn',
                  type: 'text',
                  title: 'রিভিউ শিরোনাম পরিবর্তন',
                  label: 'শিরোনাম',
                  value: storeSettings.testimonialsTitleBn || 'গ্রাহকদের মতামত',
                }}
              />
            </h2>
            <p className="text-sm sm:text-base text-[#5c7063] mt-2 font-medium flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'reviews-desc',
                  field: 'testimonialsDescBn',
                  type: 'text',
                  title: 'রিভিউ সাবটাইটেল পরিবর্তন',
                  label: 'সাবটাইটেল',
                  value: storeSettings.testimonialsDescBn || 'গ্রাহকদের ভালোবাসাই আমাদের অনুপ্রেরণা।',
                }}
              >
                {storeSettings.testimonialsDescBn || 'গ্রাহকদের ভালোবাসাই আমাদের অনুপ্রেরণা।'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                className="w-4 h-4 ml-1"
                target={{
                  id: 'reviews-desc',
                  field: 'testimonialsDescBn',
                  type: 'text',
                  title: 'রিভিউ সাবটাইটেল পরিবর্তন',
                  label: 'সাবটাইটেল',
                  value: storeSettings.testimonialsDescBn || 'গ্রাহকদের ভালোবাসাই আমাদের অনুপ্রেরণা।',
                }}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsList.map((review) => (
              <div
                key={review.id}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#e5e3d8] shadow-xs flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-[#a0b5a8] font-serif font-black">❝</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-[#1b5e20] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full border border-[#c8e6c9]">
                        সন্তুষ্ট
                      </span>
                      <EditTrigger
                        variant="icon-only"
                        className="w-5 h-5"
                        target={{
                          id: `review-${review.id}`,
                          field: 'testimonials',
                          type: 'textarea',
                          title: `${review.authorBn} এর রিভিউ মন্তব্য এডিট`,
                          label: 'রিভিউ টেক্সট',
                          value: review.quoteBn,
                          productId: review.id,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a5f52] leading-relaxed">
                    <InlineEditable
                      target={{
                        id: `review-${review.id}`,
                        field: 'testimonials',
                        type: 'textarea',
                        title: `${review.authorBn} এর রিভিউ মন্তব্য এডিট`,
                        label: 'রিভিউ টেক্সট',
                        value: review.quoteBn,
                        productId: review.id,
                      }}
                      multiline
                    >
                      {review.quoteBn}
                    </InlineEditable>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f4f2ea] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#0f3d2e]">{review.authorBn}</h5>
                    <span className="text-[11px] text-[#718477]">{review.roleBn || 'ঢাকা'}</span>
                  </div>
                  <div className="flex text-emerald-600">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-emerald-600" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DEDICATED ORDER FORM SECTION (Screenshot 3 & 4) */}
      <section id="order-form" className="py-16 sm:py-24 border-t border-[#ebe9e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Title */}
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 relative">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d2e] tracking-tight flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'order-form-title',
                  field: 'orderFormTitleBn',
                  type: 'text',
                  title: 'অর্ডার ফর্মের শিরোনাম পরিবর্তন',
                  label: 'শিরোনাম',
                  value: storeSettings.orderFormTitleBn || 'আপনার পছন্দের পণ্য অর্ডার করুন',
                }}
              >
                {storeSettings.orderFormTitleBn || 'আপনার পছন্দের পণ্য অর্ডার করুন'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                target={{
                  id: 'order-form-title',
                  field: 'orderFormTitleBn',
                  type: 'text',
                  title: 'অর্ডার ফর্মের শিরোনাম পরিবর্তন',
                  label: 'শিরোনাম',
                  value: storeSettings.orderFormTitleBn || 'আপনার পছন্দের পণ্য অর্ডার করুন',
                }}
              />
            </h2>
            <p className="text-sm sm:text-base text-[#5c7063] mt-2 font-medium flex items-center justify-center">
              <InlineEditable
                target={{
                  id: 'order-form-subtitle',
                  field: 'orderFormSubtitleBn',
                  type: 'text',
                  title: 'অর্ডার ফর্মের সাবটাইটেল পরিবর্তন',
                  label: 'সাবটাইটেল',
                  value: storeSettings.orderFormSubtitleBn || 'নিচের ফর্মটি পূরণ করে আপনার অর্ডারটি সম্পন্ন করুন।',
                }}
              >
                {storeSettings.orderFormSubtitleBn || 'নিচের ফর্মটি পূরণ করে আপনার অর্ডারটি সম্পন্ন করুন।'}
              </InlineEditable>
              <EditTrigger
                variant="icon-only"
                className="w-4 h-4 ml-1"
                target={{
                  id: 'order-form-subtitle',
                  field: 'orderFormSubtitleBn',
                  type: 'text',
                  title: 'অর্ডার ফর্মের সাবটাইটেল পরিবর্তন',
                  label: 'সাবটাইটেল',
                  value: storeSettings.orderFormSubtitleBn || 'নিচের ফর্মটি পূরণ করে আপনার অর্ডারটি সম্পন্ন করুন।',
                }}
              />
            </p>
          </div>

          <form onSubmit={handleConfirmOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Product Selection & Delivery Information Form */}
              <div className="lg:col-span-7 space-y-6">
                {/* 8A. PRODUCT SELECTION CARD */}
                <div className="bg-white rounded-2xl border border-[#e5e3d8] p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f4f2ea]">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#0f5132]" />
                      <h3 className="font-bold text-base text-[#0f3d2e]">পণ্য নির্বাচন</h3>
                    </div>
                    <span className="text-xs text-[#6e8275]">
                      টিক দিয়ে পণ্য পছন্দ করুন
                    </span>
                  </div>

                  <div className="divide-y divide-[#f4f2ea]">
                    {displayProducts.map((prod) => {
                      const isSelected = Boolean(selectedProductMap[prod.id]);
                      const currentQty = selectedProductMap[prod.id] || 0;

                      return (
                        <div
                          key={prod.id}
                          className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          {/* Selection Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleProduct(prod)}
                            className="flex items-center gap-3 text-left cursor-pointer group flex-1"
                          >
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#0f5132] border-[#0f5132] text-white'
                                  : 'border-[#b5c5bb] group-hover:border-[#0f5132]'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <span
                              className={`text-xs sm:text-sm ${
                                isSelected
                                  ? 'font-bold text-[#0f3d2e]'
                                  : 'font-medium text-[#4a5f52] group-hover:text-[#0f3d2e]'
                              }`}
                            >
                              {prod.nameBn}{' '}
                              <span className="text-[#0f5132] font-mono font-bold">
                                ৳{prod.price}
                              </span>{' '}
                              / {prod.unit || 'প্রতি কেজি'}
                            </span>
                          </button>

                          {/* Quantity Controls (Visible when selected) */}
                          {isSelected && (
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <div className="flex items-center border border-[#d6d4c8] rounded-lg overflow-hidden bg-[#faf9f5]">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(prod.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-[#e8e6dc] text-[#33463b] transition-colors cursor-pointer"
                                  title="কমান"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold font-mono text-[#0f3d2e]">
                                  {currentQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(prod.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-[#e8e6dc] text-[#33463b] transition-colors cursor-pointer"
                                  title="বাড়ান"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(prod.id)}
                                className="w-7 h-7 flex items-center justify-center text-[#99a89f] hover:text-rose-600 transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 8B. DELIVERY INFORMATION FORM CARD */}
                <div className="bg-white rounded-2xl border border-[#e5e3d8] p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-[#0f3d2e] pb-2 border-b border-[#f4f2ea]">
                    ডেলিভারি তথ্য
                  </h3>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                      কাস্টমারের নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>

                  {/* Phone & Alt Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                        বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                      </label>
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        placeholder="বিকল্প নম্বর"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                      সম্পূর্ণ ঠিকানা *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onInput={(e) => handleAddressChange((e.target as HTMLTextAreaElement).value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted) {
                          handleAddressChange(pasted);
                        }
                      }}
                      onBlur={(e) => handleAddressChange(e.target.value)}
                      placeholder="গ্রাম/মহল্লা, রাস্তা, বাসা নম্বর, ল্যান্ডমার্ক (যেমন: মিরপুর ১০, ঢাকা)"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                    {((mainAutoDetected && (district || thana)) || (customerAddress.trim().length > 6 && (district || thana))) && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/90 rounded-xl px-3 py-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="leading-tight">
                          ঠিকানা থেকে স্বয়ংক্রিয়ভাবে চিহ্নিত: 
                          {district ? <span className="font-black text-emerald-900"> জেলা ({district})</span> : null}
                          {thana ? <span className="font-black text-emerald-900">, থানা ({thana})</span> : null}
                          {postOffice ? <span className="font-black text-emerald-900">, পোস্ট কোড ({postOffice})</span> : null}
                          {' — '}
                          <span className="underline decoration-emerald-500 font-black">
                            {mainDeliveryArea === 'dhaka' ? 'ঢাকার ভেতরে (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)'}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* District & Thana */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                        জেলা *
                      </label>
                      <input
                        type="text"
                        required
                        list="main-districts-list"
                        value={district}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDistrict(val);
                          const isInside = isInsideDhakaMetro({ district: val, thana });
                          setMainDeliveryArea(isInside ? 'dhaka' : 'outside');
                          const customMatch = effectiveCustomLocations.find((c) =>
                            c.nameBn === val || (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase()) || (c.district === val)
                          );
                          if (customMatch) {
                            if (!division || division !== customMatch.division) setDivision(customMatch.division);
                            return;
                          }
                          const matched = BD_DISTRICTS.find((d) => d.bn === val || (d.altBn && d.altBn.includes(val)) || d.en.includes(val.toLowerCase()));
                          if (matched) {
                            setDivision(matched.division);
                          }
                        }}
                        placeholder="আপনার জেলা নির্বাচন বা লিখুন"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                      <datalist id="main-districts-list">
                        {availableDistrictsMain.map((d, idx) => (
                          <option key={`${d.bn}-${idx}`} value={d.bn} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                        থানা / উপজেলা *
                      </label>
                      <input
                        type="text"
                        required
                        list="main-thanas-list"
                        value={thana}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThana(val);
                          const customMatch = effectiveCustomLocations.find((c) =>
                            c.nameBn === val || (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase())
                          );
                          if (customMatch) {
                            if (!district || district !== customMatch.district) setDistrict(customMatch.district);
                            if (!division || division !== customMatch.division) setDivision(customMatch.division);
                            const isInside = isInsideDhakaMetro({ district: customMatch.district, thana: val });
                            setMainDeliveryArea(isInside ? 'dhaka' : 'outside');
                            return;
                          }
                          const matched = BD_ALL_UPAZILAS_THANAS.find((t) => t.bn === val || (t.altBn && t.altBn.includes(val)));
                          if (matched) {
                            if (!district || district !== matched.district) setDistrict(matched.district);
                            if (!division || division !== matched.division) setDivision(matched.division);
                            const isInside = isInsideDhakaMetro({ district: matched.district, thana: val });
                            setMainDeliveryArea(isInside ? 'dhaka' : 'outside');
                          } else {
                            const isInside = isInsideDhakaMetro({ district: district || 'ঢাকা', thana: val });
                            setMainDeliveryArea(isInside ? 'dhaka' : 'outside');
                          }
                        }}
                        placeholder="থানা / উপজেলা নির্বাচন বা লিখুন"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                      <datalist id="main-thanas-list">
                        {availableThanasMain.map((t, idx) => (
                          <option key={`${t.district}-${t.bn}-${idx}`} value={t.bn} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Delivery Location / Charge Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#33463b] mb-1.5 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#0f5132]" />
                      <span>ডেলিভারি চার্জ নির্বাচন করুন *</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setMainDeliveryArea('dhaka');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          mainDeliveryArea === 'dhaka'
                            ? 'border-[#0f5132] bg-[#f0fdf4] text-[#0f5132] font-black shadow-xs ring-2 ring-[#0f5132]/20'
                            : 'border-[#d6d4c8] bg-[#faf9f5] text-[#33463b] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold">ঢাকার ভেতরে</div>
                          <div className="text-xs font-mono font-bold mt-0.5 text-emerald-700">
                            ৳{storeSettings.deliveryFeeDhaka ?? 70}
                          </div>
                        </div>
                        {mainDeliveryArea === 'dhaka' && (
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#0f5132] shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMainDeliveryArea('outside');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          mainDeliveryArea === 'outside'
                            ? 'border-[#0f5132] bg-[#f0fdf4] text-[#0f5132] font-black shadow-xs ring-2 ring-[#0f5132]/20'
                            : 'border-[#d6d4c8] bg-[#faf9f5] text-[#33463b] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold">ঢাকার বাইরে</div>
                          <div className="text-xs font-mono font-bold mt-0.5 text-emerald-700">
                            ৳{storeSettings.deliveryFeeOutside ?? 130}
                          </div>
                        </div>
                        {mainDeliveryArea === 'outside' && (
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#0f5132] shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Post Code */}
                  <div>
                    <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                      পোস্ট অফিস / পোস্ট কোড (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={postOffice}
                      onChange={(e) => setPostOffice(e.target.value)}
                      placeholder="পোস্ট কোড"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#33463b] mb-1.5">
                      অতিরিক্ত নির্দেশনা (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ডেলিভারি সংক্রান্ত বিশেষ নির্দেশনা থাকলে লিখুন"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary (Sticky) */}
              <div className="lg:col-span-5 sticky top-28">
                <div className="bg-white rounded-2xl border border-[#e5e3d8] p-6 sm:p-7 shadow-md space-y-5">
                  <h3 className="font-bold text-base text-[#0f3d2e] pb-3 border-b border-[#f4f2ea]">
                    অর্ডার সারসংক্ষেপ
                  </h3>

                  {/* Selected Items List */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {selectedItemsList.length === 0 ? (
                      <p className="text-xs text-[#8c9e93] py-2 text-center">
                        কোনো পণ্য নির্বাচন করা হয়নি।
                      </p>
                    ) : (
                      selectedItemsList.map(({ product, qty, lineTotal }) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between text-xs sm:text-sm text-[#3b4e42]"
                        >
                          <span className="font-medium">
                            {product.nameBn} × {qty}
                          </span>
                          <span className="font-mono font-bold text-[#0f3d2e]">
                            ৳{lineTotal.toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculation Details */}
                  <div className="pt-3 border-t border-[#f4f2ea] space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-[#62776a]">
                      <span>সাবটোটাল</span>
                      <span className="font-mono font-bold text-[#1f3327]">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#62776a] items-center">
                      <span className="flex items-center">
                        ডেলিভারি চার্জ ({mainDeliveryArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})
                      </span>
                      <span className="font-mono font-bold text-[#1f3327]">
                        ৳{deliveryFee.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#e2e0d5] flex justify-between items-center text-base sm:text-lg font-black text-[#0f3d2e]">
                      <span>সর্বমোট</span>
                      <span className="font-mono text-xl sm:text-2xl text-[#0f5132]">
                        ৳{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-tight">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedItemsList.length === 0}
                    className="w-full py-3.5 rounded-xl bg-[#0f5132] hover:bg-[#0b3d26] disabled:bg-[#83a193] text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      </>
                    ) : (
                      <span>অর্ডার কনফার্ম করুন</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center text-[11px] text-[#73887c] leading-tight font-medium text-center">
                    <span>
                      {storeSettings.orderFooterNoteBn || 'অর্ডার কনফার্ম করার পর আমাদের প্রতিনিধি ফোনে নিশ্চিত করবেন।'}
                    </span>
                    <EditTrigger
                      variant="icon-only"
                      className="w-4 h-4 ml-1"
                      target={{
                        id: 'order-note',
                        field: 'orderFooterNoteBn',
                        type: 'text',
                        title: 'অর্ডার নোট বার্তা পরিবর্তন',
                        label: 'নোট টেক্সট',
                        value: storeSettings.orderFooterNoteBn || 'অর্ডার কনফার্ম করার পর আমাদের প্রতিনিধি ফোনে নিশ্চিত করবেন।',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 9. FOOTER (Screenshot 4 bottom) */}
      <footer id="contact" className="bg-[#0a422d] text-white pt-16 pb-8 border-t border-[#063322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#14563d]">
            {/* Column 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-md overflow-hidden relative shrink-0 border border-white/10">
                  {Boolean(storeSettings.logoImage && storeSettings.logoImage.trim()) ? (
                    <img 
                      src={storeSettings.logoImage} 
                      alt={storeSettings.storeName || 'Logo'} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-xl">🍃</span>
                  )}

                  {/* EditTrigger for Live Preview mode (visible only to admin in Live Preview) */}
                  <EditTrigger
                    variant="image"
                    className="scale-75 top-0 right-0"
                    label="লোগো"
                    target={{
                      id: 'footer-logo-img',
                      field: 'logoImage',
                      type: 'image',
                      title: 'লোগো পরিবর্তন / আপলোড',
                      label: 'লোগো ইমেজ',
                      value: storeSettings.logoImage || '',
                    }}
                  />
                </div>
                <h4 className="text-xl font-black text-white flex items-center">
                  {renderStoreName(storeSettings.storeName || 'হালাল বাজার বিডি', true)}
                </h4>
              </div>
              <p className="text-xs text-[#a2cbba] font-medium">
                {storeSettings.storeBadgeBn || 'বিশ্বাস ও শুদ্ধতার আস্থা'}
              </p>
              {Boolean(
                (storeSettings.footerText &&
                  storeSettings.footerText.trim() &&
                  !storeSettings.footerText.includes('হালাল বাজার বিডি — আপনার আস্থার বিশ্বস্ত অনলাইন গ্রোসারি শপ।') &&
                  !storeSettings.footerText.includes('খেজুর, ঘরে তৈরি নাড়ু, বাদাম ও বাছাইকৃত খাবার — পৌঁছে যাক আপনার ঘরে।')) ||
                  isLivePreview
              ) && (
                <div className="flex items-start">
                  <p className="text-xs text-[#c3ded2] leading-relaxed pt-1">
                    <InlineEditable
                      target={{
                        id: 'footer-text-edit',
                        field: 'footerText',
                        type: 'textarea',
                        title: 'ফুটার বার্তা পরিবর্তন',
                        label: 'ফুটার টেক্সট',
                        value: storeSettings.footerText || '',
                      }}
                      multiline
                    >
                      {storeSettings.footerText}
                    </InlineEditable>
                  </p>
                  <EditTrigger
                    variant="icon-only"
                    className="w-4 h-4 ml-1 mt-1 text-white"
                    target={{
                      id: 'footer-text-edit',
                      field: 'footerText',
                      type: 'textarea',
                      title: 'ফুটার বার্তা পরিবর্তন',
                      label: 'ফুটার টেক্সট',
                      value: storeSettings.footerText || '',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-sm text-[#e8f5ee] mb-3">দ্রুত লিংক</h5>
              <ul className="space-y-2 text-xs text-[#b8d9cb]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    হোম
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-white transition-colors">
                    আমাদের পণ্য
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    আমাদের সম্পর্কে
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    কেন আমাদের থেকে কিনবেন
                  </a>
                </li>
                <li>
                  <a href="#order-form" className="hover:text-white transition-colors">
                    অর্ডার করুন
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-sm text-[#e8f5ee] mb-3 flex items-center">
                যোগাযোগ
                <EditTrigger
                  variant="icon-only"
                  className="w-4 h-4 ml-1.5"
                  target={{
                    id: 'contact-phone-edit',
                    field: 'phone',
                    type: 'text',
                    title: 'যোগাযোগ ফোন নম্বর পরিবর্তন',
                    label: 'হটলাইন নম্বর',
                    value: storeSettings.phone || '',
                  }}
                />
              </h5>
              <p className="text-xs text-[#b8d9cb] leading-relaxed">
                {storeSettings.phone ? (
                  <>
                    হটলাইন: <strong>{storeSettings.phone}</strong>
                    <br />
                    {storeSettings.address || 'হেমায়েতপুর, সাভার, ঢাকা।'}
                  </>
                ) : (
                  'যোগাযোগের তথ্য শীঘ্রই যুক্ত করা হবে।'
                )}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-[11px] text-[#719b88] hover:text-[#c3ded2] transition-colors cursor-pointer"
                >
                  অ্যাডমিন পোর্টাল
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 text-center text-xs text-[#7ea895] flex items-center justify-center">
            <span>
              <InlineEditable
                target={{
                  id: 'copyright-edit',
                  field: 'copyrightText',
                  type: 'text',
                  title: 'কপিরাইট টেক্সট পরিবর্তন',
                  label: 'কপিরাইট টেক্সট',
                  value: storeSettings.copyrightText || '© ২০২৬ হালাল বাজার বিডি — সর্বস্বত্ব সংরক্ষিত',
                }}
              >
                {storeSettings.copyrightText || '© ২০২৬ হালাল বাজার বিডি — সর্বস্বত্ব সংরক্ষিত'}
              </InlineEditable>
            </span>
            <EditTrigger
              variant="icon-only"
              className="w-4 h-4 ml-1"
              target={{
                id: 'copyright-edit',
                field: 'copyrightText',
                type: 'text',
                title: 'কপিরাইট টেক্সট পরিবর্তন',
                label: 'কপিরাইট টেক্সট',
                value: storeSettings.copyrightText || '© ২০২৬ হালাল বাজার বিডি — সর্বস্বত্ব সংরক্ষিত',
              }}
            />
          </div>
        </div>
      </footer>

      {/* Product Details Modal (1-5 images gallery, Add to Cart, 1-Click Order) */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e3d8] animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-8 relative">
              <button
                type="button"
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f4f3ec] hover:bg-[#e8e6dc] text-[#1a2e22] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Gallery */}
                <div className="space-y-3">
                  <div className="w-full aspect-square rounded-2xl bg-[#f4f3ec] overflow-hidden border border-[#e5e3d8]">
                    <img
                      src={
                        [selectedProductDetails.image, ...(selectedProductDetails.additionalImages || [])].filter(Boolean)[activeGalleryIndex] ||
                        selectedProductDetails.image ||
                        '/src/assets/images/hero_food_assortment_1792735602404.jpg'
                      }
                      alt={selectedProductDetails.nameBn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnails (1 to 5 images) */}
                  {(() => {
                    const imgs = [selectedProductDetails.image, ...(selectedProductDetails.additionalImages || [])].filter(Boolean) as string[];
                    if (imgs.length <= 1) return null;
                    return (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {imgs.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveGalleryIndex(idx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                              activeGalleryIndex === idx ? 'border-[#0f5132] ring-2 ring-[#0f5132]/30' : 'border-[#e5e3d8] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#0f5132] text-xs font-bold">
                    <span>{selectedProductDetails.categoryBn || 'খাদ্যপণ্য'}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d2e]">
                    {selectedProductDetails.nameBn}
                  </h2>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-[#0f5132] font-mono">
                      ৳{selectedProductDetails.price * modalQuantity}
                    </span>
                    {selectedProductDetails.originalPrice && selectedProductDetails.originalPrice > selectedProductDetails.price && (
                      <span className="text-sm text-neutral-400 line-through font-mono">
                        ৳{selectedProductDetails.originalPrice * modalQuantity}
                      </span>
                    )}
                    <span className="text-xs text-[#718477] font-medium">
                      ({selectedProductDetails.unit || 'প্রতি কেজি'})
                    </span>
                  </div>

                  <p className="text-sm text-[#55695d] leading-relaxed">
                    {selectedProductDetails.descBn || 'বাছাইকৃত, সেরা মানের শতভাগ খাঁটি ও পুষ্টিকর খাদ্যপণ্য।'}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-sm font-bold text-[#1a2e22]">পরিমাণ:</span>
                    <div className="flex items-center rounded-xl border border-[#d0cebe] bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setModalQuantity((prev) => Math.max(1, prev - 1))}
                        className="px-3.5 py-2 bg-[#f4f3ec] hover:bg-[#eae8de] text-[#1a2e22] transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-mono font-bold text-sm text-[#0f5132] min-w-[3rem] text-center">
                        {modalQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalQuantity((prev) => prev + 1)}
                        className="px-3.5 py-2 bg-[#f4f3ec] hover:bg-[#eae8de] text-[#1a2e22] transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f0eee4]">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(selectedProductDetails, modalQuantity);
                        setSelectedProductDetails(null);
                      }}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border-2 border-[#0f5132] hover:bg-[#f0fdf4] text-[#0f5132] font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>কার্টে যোগ করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductMap({
                          [selectedProductDetails.id]: modalQuantity,
                        });
                        setSelectedProductDetails(null);
                        scrollToOrderForm(selectedProductDetails);
                      }}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-neutral-950" />
                      <span>১-ক্লিক অর্ডার</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-6 border-b border-[#e5e3d8] flex items-center justify-between bg-[#f8f9fa]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#0f5132]" />
                <h2 className="text-lg font-black text-[#0f3d2e]">আপনার শপিং কার্ট ({totalCartCount})</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-[#f4f3ec] hover:bg-[#e8e6dc] text-[#1a2e22] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0f5132]">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <p className="text-base font-bold text-[#55695d]">আপনার কার্ট খালি আছে।</p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#0f5132] text-white text-sm font-bold shadow-md hover:bg-[#0b3d26] transition-colors cursor-pointer"
                  >
                    কেনাকাটা শুরু করুন
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#e5e3d8] bg-[#fbfaf7]">
                    <img
                      src={item.product.image || '/src/assets/images/hero_food_assortment_1792735602404.jpg'}
                      alt={item.product.nameBn}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#e5e3d8]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#0f3d2e] truncate">{item.product.nameBn}</h4>
                      <p className="text-xs font-mono font-bold text-[#0f5132] mt-0.5">৳{item.product.price} × {item.quantity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center rounded-lg border border-[#d0cebe] bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateCartItemQty(item.product.id, -1)}
                            className="px-2 py-1 bg-[#f4f3ec] hover:bg-[#eae8de] text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 font-mono font-bold text-xs text-[#0f5132]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQty(item.product.id, 1)}
                            className="px-2 py-1 bg-[#f4f3ec] hover:bg-[#eae8de] text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-auto"
                          title="রিমুভ করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#e5e3d8] bg-[#f8f9fa] space-y-4">
                <div className="flex items-center justify-between text-base font-bold text-[#1a2e22]">
                  <span>মোট সাবটোটাল:</span>
                  <span className="font-mono text-lg font-black text-[#0f5132]">৳{cartSubtotal}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckoutCart}
                  className="w-full py-3.5 rounded-xl bg-[#0f5132] hover:bg-[#0b3d26] text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>অর্ডার করুন (চেকআউট)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Order / Checkout Popup Modal */}
      {quickOrderItems && quickOrderItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-[#e5e3d8] animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-8 relative">
              <button
                type="button"
                onClick={() => setQuickOrderItems(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f4f3ec] hover:bg-[#e8e6dc] text-[#1a2e22] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-sm">
                  <Zap className="w-5 h-5 fill-neutral-950" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0f3d2e]">অর্ডার চেকআউট</h3>
                  <p className="text-xs text-[#667a6e]">আপনার তথ্য দিয়ে অর্ডার সম্পন্ন করুন</p>
                </div>
              </div>

              {quickSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#0f5132] flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-2xl font-black text-[#0f3d2e]">অর্ডার সফল হয়েছে!</h4>
                  <p className="text-sm text-[#55695d]">খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন। ধন্যবাদ!</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmQuickOrder} className="space-y-4">
                  {/* Selected Products Summary List */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#e5e3d8] max-h-48 overflow-y-auto">
                    {quickOrderItems.map((item, idx) => (
                      <div key={item.product.id || idx} className="flex items-center gap-3 py-1.5 border-b border-[#f0eee4] last:border-0">
                        <img
                          src={item.product.image || '/src/assets/images/hero_food_assortment_1792735602404.jpg'}
                          alt={item.product.nameBn}
                          className="w-12 h-12 rounded-xl object-cover border border-[#e5e3d8] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-[#0f3d2e] truncate">{item.product.nameBn}</h4>
                          <p className="text-[11px] font-mono font-bold text-[#0f5132] mt-0.5">
                            ৳{item.product.price} × {item.quantity} = ৳{item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {quickError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      {quickError}
                    </div>
                  )}

                  <div className="border-t border-[#f0eee4] pt-3">
                    <h4 className="text-sm font-black text-[#0f3d2e] mb-3">ডেলিভারি তথ্য</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b4c41] mb-1">কাস্টমরের নাম *</label>
                    <input
                      type="text"
                      required
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3b4c41] mb-1">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3b4c41] mb-1">বিকল্প মোবাইল নম্বর (ঐচ্ছিক)</label>
                      <input
                        type="tel"
                        value={quickAltPhone}
                        onChange={(e) => setQuickAltPhone(e.target.value)}
                        placeholder="বিকল্প নম্বর"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b4c41] mb-1">
                      সম্পূর্ণ ঠিকানা *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={quickAddress}
                      onChange={(e) => handleQuickAddressChange(e.target.value)}
                      onInput={(e) => handleQuickAddressChange((e.target as HTMLTextAreaElement).value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted) {
                          handleQuickAddressChange(pasted);
                        }
                      }}
                      onBlur={(e) => handleQuickAddressChange(e.target.value)}
                      placeholder="গ্রাম/মহল্লা, রাস্তা, বাসা নম্বর, ল্যান্ডমার্ক (যেমন: মিরপুর ১০, ঢাকা)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] resize-none"
                    />
                    {((quickAutoDetected && (quickDistrict || quickThana)) || (quickAddress.trim().length > 6 && (quickDistrict || quickThana))) && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/90 rounded-xl px-3 py-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="leading-tight">
                          ঠিকানা থেকে স্বয়ংক্রিয়ভাবে চিহ্নিত: 
                          {quickDistrict ? <span className="font-black text-emerald-900"> জেলা ({quickDistrict})</span> : null}
                          {quickThana ? <span className="font-black text-emerald-900">, থানা ({quickThana})</span> : null}
                          {quickPostOffice ? <span className="font-black text-emerald-900">, পোস্ট কোড ({quickPostOffice})</span> : null}
                          {' — '}
                          <span className="underline decoration-emerald-500 font-black">
                            {quickDeliveryArea === 'dhaka' ? 'ঢাকার ভেতরে (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)'}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3b4c41] mb-1">জেলা *</label>
                      <input
                        type="text"
                        required
                        list="quick-districts-list"
                        value={quickDistrict}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuickDistrict(val);
                          const isInside = isInsideDhakaMetro({ district: val, thana: quickThana });
                          setQuickDeliveryArea(isInside ? 'dhaka' : 'outside');
                          const customMatch = effectiveCustomLocations.find((c) =>
                            c.nameBn === val || (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase()) || (c.district === val)
                          );
                          if (customMatch) {
                            if (!quickDivision || quickDivision !== customMatch.division) setQuickDivision(customMatch.division);
                            return;
                          }
                          const matched = BD_DISTRICTS.find((d) => d.bn === val || (d.altBn && d.altBn.includes(val)) || d.en.includes(val.toLowerCase()));
                          if (matched) {
                            setQuickDivision(matched.division);
                          }
                        }}
                        placeholder="আপনার জেলা নির্বাচন বা লিখুন"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                      <datalist id="quick-districts-list">
                        {availableDistrictsQuick.map((d, idx) => (
                          <option key={`${d.bn}-${idx}`} value={d.bn} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3b4c41] mb-1">থানা / উপজেলা *</label>
                      <input
                        type="text"
                        required
                        list="quick-thanas-list"
                        value={quickThana}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuickThana(val);
                          const customMatch = effectiveCustomLocations.find((c) =>
                            c.nameBn === val || (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase())
                          );
                          if (customMatch) {
                            if (!quickDistrict || quickDistrict !== customMatch.district) setQuickDistrict(customMatch.district);
                            if (!quickDivision || quickDivision !== customMatch.division) setQuickDivision(customMatch.division);
                            const isInside = isInsideDhakaMetro({ district: customMatch.district, thana: val });
                            setQuickDeliveryArea(isInside ? 'dhaka' : 'outside');
                            return;
                          }
                          const matched = BD_ALL_UPAZILAS_THANAS.find((t) => t.bn === val || (t.altBn && t.altBn.includes(val)));
                          if (matched) {
                            if (!quickDistrict || quickDistrict !== matched.district) setQuickDistrict(matched.district);
                            if (!quickDivision || quickDivision !== matched.division) setQuickDivision(matched.division);
                            const isInside = isInsideDhakaMetro({ district: matched.district, thana: val });
                            setQuickDeliveryArea(isInside ? 'dhaka' : 'outside');
                          } else {
                            const isInside = isInsideDhakaMetro({ district: quickDistrict || 'ঢাকা', thana: val });
                            setQuickDeliveryArea(isInside ? 'dhaka' : 'outside');
                          }
                        }}
                        placeholder="থানা / উপজেলা নির্বাচন বা লিখুন"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                      />
                      <datalist id="quick-thanas-list">
                        {availableThanasQuick.map((t, idx) => (
                          <option key={`${t.district}-${t.bn}-${idx}`} value={t.bn} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Delivery Location / Charge Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#3b4c41] mb-1.5 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#0f5132]" />
                      <span>ডেলিভারি চার্জ নির্বাচন করুন *</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setQuickDeliveryArea('dhaka');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          quickDeliveryArea === 'dhaka'
                            ? 'border-[#0f5132] bg-[#f0fdf4] text-[#0f5132] font-black shadow-xs ring-2 ring-[#0f5132]/20'
                            : 'border-[#d0cebe] bg-white text-[#3b4c41] hover:bg-[#faf9f5]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">ঢাকার ভেতরে</div>
                          <div className="text-xs font-mono font-bold mt-0.5 text-emerald-700">
                            ৳{storeSettings.deliveryFeeDhaka ?? 70}
                          </div>
                        </div>
                        {quickDeliveryArea === 'dhaka' && (
                          <CheckCircle2 className="w-4 h-4 text-[#0f5132] shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuickDeliveryArea('outside');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          quickDeliveryArea === 'outside'
                            ? 'border-[#0f5132] bg-[#f0fdf4] text-[#0f5132] font-black shadow-xs ring-2 ring-[#0f5132]/20'
                            : 'border-[#d0cebe] bg-white text-[#3b4c41] hover:bg-[#faf9f5]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">ঢাকার বাইরে</div>
                          <div className="text-xs font-mono font-bold mt-0.5 text-emerald-700">
                            ৳{storeSettings.deliveryFeeOutside ?? 130}
                          </div>
                        </div>
                        {quickDeliveryArea === 'outside' && (
                          <CheckCircle2 className="w-4 h-4 text-[#0f5132] shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b4c41] mb-1">পোস্ট অফিস / পোস্ট কোড (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={quickPostOffice}
                      onChange={(e) => setQuickPostOffice(e.target.value)}
                      placeholder="পোস্ট কোড"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b4c41] mb-1">অতিরিক্ত নির্দেশনা (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      value={quickNotes}
                      onChange={(e) => setQuickNotes(e.target.value)}
                      placeholder="ডেলিভারি সংক্রান্ত বিশেষ নির্দেশনা থাকলে লিখুন"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d0cebe] bg-white text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <div className="px-4 py-3 rounded-xl bg-[#f0fdf4] border border-[#c8e6c9] space-y-1.5 text-sm font-bold text-[#0f5132]">
                      <div className="flex items-center justify-between text-xs text-[#4b6354]">
                        <span>
                          ডেলিভারি চার্জ ({quickDeliveryArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):
                        </span>
                        <span className="font-mono font-bold text-[#0f5132]">
                          ৳{getQuickDeliveryFee()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#c8e6c9]/60 pt-1.5">
                        <span>সর্বমোট মূল্য:</span>
                        <span className="font-mono text-lg font-black">
                          ৳{(quickOrderItems ? quickOrderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) : 0) + getQuickDeliveryFee()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isQuickSubmitting}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isQuickSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>অর্ডার প্রসেস হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-neutral-950" />
                        <span>অর্ডার কনফার্ম করুন (৳{quickOrderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + getQuickDeliveryFee()})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
