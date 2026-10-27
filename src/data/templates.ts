import { WebsiteData, ColorTheme, BannerSlide, ProductItem } from '../types/website';
import adminAddedProduct from './adminAddedProduct.json';

export const DEFAULT_REAL_PRODUCTS: ProductItem[] = (adminAddedProduct as ProductItem[]) || [];

export const DEFAULT_BANNER_SLIDES: BannerSlide[] = [];

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'emerald-deep-green',
    nameBn: 'গাঢ় সবুজ (রয়েল এমারেল্ড)',
    nameEn: 'Royal Deep Forest Green',
    primary: '#064e3b', // গাঢ় সবুজ (Deep Emerald Green)
    primaryHover: '#047857',
    accent: '#0284c7', // আকর্ষণীয় আকাশী ব্লু (Sky Blue)
    accentBg: '#e0f2fe',
    bgLight: '#f8fdfa',
    surfaceLight: '#ffffff',
    borderLight: '#bbf7d0',
    textLight: '#064e3b',
    textMuted: '#374151',
  },
  {
    id: 'sky-blue-cyan',
    nameBn: 'আকাশী ব্লু (রয়েল স্কাই ব্লু)',
    nameEn: 'Vibrant Sky Blue & Cyan',
    primary: '#0284c7', // আকাশী ব্লু (Sky Blue)
    primaryHover: '#0369a1',
    accent: '#064e3b', // গাঢ় সবুজ (Deep Green)
    accentBg: '#ecfdf5',
    bgLight: '#f0f9ff',
    surfaceLight: '#ffffff',
    borderLight: '#bae6fd',
    textLight: '#0c4a6e',
    textMuted: '#334155',
  },
  {
    id: 'emerald-sky-fusion',
    nameBn: 'গাঢ় সবুজ ও আকাশী ব্লু ফিউশন',
    nameEn: 'Deep Green & Sky Blue Duo',
    primary: '#065f46',
    primaryHover: '#047857',
    accent: '#0ea5e9',
    accentBg: '#e0f2fe',
    bgLight: '#f8fdf9',
    surfaceLight: '#ffffff',
    borderLight: '#bbf7d0',
    textLight: '#064e3b',
    textMuted: '#374151',
  },
  {
    id: 'emerald-halal',
    nameBn: 'রয়েল হালাল এমারেল্ড ও সোনালী জাফরান',
    nameEn: 'Halal Emerald & Royal Amber',
    primary: '#065f46', // গাঢ় সবুজ
    primaryHover: '#047857',
    accent: '#0284c7', // আকাশী
    accentBg: '#e0f2fe',
    bgLight: '#faf9f5',
    surfaceLight: '#ffffff',
    borderLight: '#e5e0d4',
    textLight: '#1f2937',
    textMuted: '#4b5563',
  },
  {
    id: 'maroon',
    nameBn: 'মরিচ লাল ও কারি ব্রাউন',
    nameEn: 'Fiery Chili & Cumin Brown',
    primary: '#7f1d1d',
    primaryHover: '#991b1b',
    accent: '#dc2626',
    accentBg: '#fef2f2',
    bgLight: '#ffffff',
    surfaceLight: '#fff5f5',
    borderLight: '#fecaca',
    textLight: '#450a0a',
    textMuted: '#991b1b',
  },
  {
    id: 'emerald',
    nameBn: 'অর্গানিক গ্রিন ও ভেষজ',
    nameEn: 'Organic Green & Herbal',
    primary: '#064e3b',
    primaryHover: '#047857',
    accent: '#059669',
    accentBg: '#ecfdf5',
    bgLight: '#ffffff',
    surfaceLight: '#f0fdf4',
    borderLight: '#d1fae5',
    textLight: '#064e3b',
    textMuted: '#047857',
  },
  {
    id: 'slate',
    nameBn: 'ক্ল্যাসিক ব্ল্যাক ও চারকোল',
    nameEn: 'Classic Slate & Black',
    primary: '#0f172a',
    primaryHover: '#1e293b',
    accent: '#d97706',
    accentBg: '#fffbeb',
    bgLight: '#ffffff',
    surfaceLight: '#f8fafc',
    borderLight: '#e2e8f0',
    textLight: '#0f172a',
    textMuted: '#64748b',
  }
];

export const TEMPLATES: Record<string, WebsiteData> = {
  spices: {
    id: 'spices',
    nameBn: 'হালাল বাজার বিডি',
    nameEn: 'Halal Bazar BD',
    taglineBn: 'শতভাগ প্রিমিয়াম ড্রাই ফ্রুটস, কাজুবাদাম, কাঠবাদাম ও খাঁটি অর্গানিক ফুড',
    taglineEn: '100% Premium Dry Fruits, Nuts, Dates & Pure Organic Food Collection',
    heroHeadlineBn: 'প্রিমিয়াম ড্রাই ফ্রুটস ও বাদাম কালেকশন — সেরা পণ্যের বিশ্বস্ত ঠিকানা',
    heroHeadlineEn: 'Premium Quality Dry Fruits, Nuts & Pantry Essentials — Everything for Your Family',
    heroSubheadlineBn: 'বিশ্বসেরা বাগান থেকে সংগৃহীত ১০০% প্রিমিয়াম কাজুবাদাম, কাঠবাদাম, পেস্তা, কিসমিস ও মরিয়ম খেজুরের সেরা সমাহার।',
    heroSubheadlineEn: 'Hand-picked premium cashews, California almonds, pistachios, dates, and golden raisins packed with care.',
    heroCtaPrimaryBn: 'সব ড্রাই ফ্রুটস ও পণ্য দেখুন',
    heroCtaPrimaryEn: 'Explore Dry Fruits & Products',
    heroCtaSecondaryBn: 'আমাদের মানের নিশ্চয়তা',
    heroCtaSecondaryEn: 'Quality & Purity Promise',
    heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    heroSlides: DEFAULT_BANNER_SLIDES,

    aboutBadgeBn: 'আমাদের কোয়ালিটি ও বিশুদ্ধতার অঙ্গীকার',
    aboutBadgeEn: 'Quality Benchmark',
    aboutTitleBn: 'কোয়ালিটি ও বিশুদ্ধতায় আপসহীন — প্রতিটি পণ্যে ১০০% প্রিমিয়াম মান',
    aboutTitleEn: 'Zero compromises on pure quality, rich aroma, and premium taste',
    aboutDescBn: 'আমরা নিয়ে এসেছি সেরা কোয়ালিটির ড্রাই ফ্রুটস, কাজুবাদাম, কাঠবাদাম, খেজুর ও কিসমিসের সেরা সমাহার। প্রতিটি পণ্য স্বাস্থ্যসম্মত ও প্রিমিয়াম মান নিশ্চিত করে প্রস্তুত ও গ্রাহকের কাছে দ্রুত সরবরাহ করা হয়।',
    aboutDescEn: 'We bring you the finest combination of premium imported dry fruits and healthy food essentials. From hand-picked nuts, dates, and dried figs to authentic pantry items.',
    metrics: [
      { value: '১০০%', labelBn: 'খাঁটি ও কোয়ালিটি নিশ্চয়তা', labelEn: '100% Quality Guaranteed' },
      { value: '২৪-৪৮ঘণ্টা', labelBn: 'সারা দেশে দ্রুত হোম ডেলিভারি', labelEn: 'Fast Nationwide Delivery' },
    ],

    servicesSectionTitleBn: 'কেন আমাদের থেকে কেনাকাটা করবেন?',
    servicesSectionTitleEn: 'Why Choose Our Store?',
    servicesSectionDescBn: 'প্রিমিয়াম ড্রাই ফ্রুটস ও পুষ্টিকর বাদাম — প্রতিটি পণ্যে সর্বোচ্চ কোয়ালিটি নিশ্চিত',
    servicesSectionDescEn: 'From premium selected dry fruits & nuts to organic pantry staples — uncompromised standards',
    services: [
      {
        id: 'sp_s1',
        number: '01',
        titleBn: '১০০% খাঁটি ও প্রিমিয়াম ড্রাই ফ্রুটস ও বাদাম',
        titleEn: '100% Pure & Fresh Dry Fruits and Nuts',
        descBn: 'সরাসরি বিশ্বসেরা বাগান থেকে সংগ্রহ করে স্বাস্থ্যকর উপায়ে এয়ারটাইট প্যাক করা প্রিমিয়াম কাজুবাদাম, কাঠবাদাম, কিসমিস, আঞ্জির ও খেজুর।',
        descEn: 'Whole jumbo nuts and sun-dried fruits ethically sourced and packed in airtight food-grade pouches.',
        metric: '১০০%',
        metricLabelBn: 'ভেজালমুক্ত ও খাঁটি',
        metricLabelEn: 'Pure & Chemical-Free'
      },
      {
        id: 'sp_s2',
        number: '02',
        titleBn: 'ফুড-গ্রেড এয়ারটাইট প্রটেক্টিভ প্যাকেজিং',
        titleEn: 'Food-Grade Protective Packaging',
        descBn: 'আর্দ্রতা ও ধুলাবালি থেকে মুক্ত রাখতে ফুড-গ্রেড জিপলক ও ভ্যাকুয়াম প্যাকেজিংয়ে পণ্য সরবরাহ করা হয়।',
        descEn: 'Premium airtight resealable pouches ensuring prolonged freshness, rich crunch, and natural aroma.',
        metric: '১০০%',
        metricLabelBn: 'তাজা ও সতেজ',
        metricLabelEn: 'Fresh & Crunchy'
      },
      {
        id: 'sp_s3',
        number: '03',
        titleBn: 'নিরাপদ প্যাকেজিং ও দ্রুত হোম ডেলিভারি',
        titleEn: 'Safe Packaging & Express Delivery',
        descBn: 'ফুড-গ্রেড এয়ারটাইট জিপলক প্যাকেজিং ও সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা।',
        descEn: 'Multi-layer food-grade pouches with fast nationwide cash-on-delivery service.',
        metric: '২৪-৪৮ঘণ্টা',
        metricLabelBn: 'দ্রুততম ডেলিভারি',
        metricLabelEn: 'Express Delivery Time'
      }
    ],

    productsSectionTitleBn: 'আমাদের জনপ্রিয় ড্রাই ফ্রুটস ও খাদ্যপণ্য কালেকশন',
    productsSectionTitleEn: 'Premium Dry Fruits & Pantry Essentials Collection',
    products: DEFAULT_REAL_PRODUCTS,

    testimonialsSectionTitleBn: 'গ্রাহকদের বাস্তব অভিজ্ঞতা ও রিভিউ',
    testimonialsSectionTitleEn: 'Verified Customer Reviews',
    testimonials: [],

    faqSectionTitleBn: 'পণ্য ও ডেলিভারি সম্পর্কিত সচরাচর জিজ্ঞাসা',
    faqSectionTitleEn: 'Frequently Asked Questions',
    faqs: [
      {
        id: 'sp_f1',
        questionBn: 'আপনাদের ড্রাই ফ্রুটস ও বাদাম শতভাগ সতেজ ও প্রিমিয়াম হওয়ার নিশ্চয়তা কী?',
        questionEn: 'How can I be assured that your dry fruits & nuts are 100% fresh?',
        answerBn: 'আমাদের প্রতিটি ড্রাই ফ্রুটস ও বাদাম প্রিমিয়াম গ্রেডের এবং নতুন মৌসুমের তাজা স্টক। কোনো প্রকার কৃত্রিম রঙ, কেমিক্যাল বা পুরনো তেল ব্যবহার করা হয় না। প্রতিটি প্যাকেট এয়ারটাইট ফুড-গ্রেড প্যাকেজিংয়ে সরবরাহ করা হয়।',
        answerEn: 'Our nuts and dried fruits are top-grade harvest with zero artificial glaze or chemicals. We pack in moisture-proof resealable pouches with a 100% satisfaction guarantee.'
      },
      {
        id: 'sp_f3',
        questionBn: 'ডেলিভারি চার্জ কত এবং কতদিনে পণ্য হাতে পাব?',
        questionEn: 'What are the delivery charges and delivery times across Bangladesh?',
        answerBn: 'ঢাকার ভেতর ডেলিভারি চার্জ ৭০ টাকা (২৪-৪৮ ঘণ্টায় হোম ডেলিভারি) এবং ঢাকার বাইরে ১৩০ টাকা (২-৩ দিনে কুরিয়ার হোম ডেলিভারি)। ক্যাশ অন ডেলিভারিতে পণ্য দেখে টাকা পরিশোধ করতে পারবেন।',
        answerEn: 'Within Dhaka, delivery fee is ৳70 (arrives in 24–48 hours). Outside Dhaka, fee is ৳130 (arrives in 2–3 business days). Cash on Delivery is supported nationwide.'
      }
    ],

    contactTitleBn: 'পাইকারি ও রিটেইল অর্ডার এবং সহায়তা',
    contactTitleEn: 'Customer Support & Bulk Inquiries',
    contactDescBn: 'যেকোনো ড্রাই ফ্রুটস, বাদাম বা পণ্যের অর্ডার ও সহায়তার জন্য কল করুন অথবা সরাসরি মেসেজ দিন।',
    contactDescEn: 'For customer orders or support inquiries, contact our customer relations team.',
    contactEmail: 'tanvir.ahmed.personal.access88@gmail.com',
    contactPhone: '01329571899, 01793439488',
    contactAddressBn: 'Hemayetpur , Savar ,Dhaka .',
    contactAddressEn: 'Hemayetpur, Savar, Dhaka',

    footerTextBn: 'সর্বস্বত্ব সংরক্ষিত। হালাল বাজার বিডি – প্রিমিয়াম ড্রাই ফ্রুটস ও বাদামের বিশ্বস্ত ঠিকানা।',
    footerTextEn: 'All rights reserved. Halal Bazar BD - Premium Dry Fruits & Nuts Store.',

    navItems: [
      { id: 'about', labelBn: 'বিশুদ্ধতা', labelEn: 'Purity', href: '#about' },
      { id: 'products', labelBn: 'ড্রাই ফ্রুটস ও পণ্যসম্ভার', labelEn: 'Dry Fruits & Nuts', href: '#products' },
      { id: 'services', labelBn: 'প্রক্রিয়াজাতকরণ', labelEn: 'Processing', href: '#services' },
      { id: 'faq', labelBn: 'প্রশ্নোত্তর', labelEn: 'FAQ', href: '#faq' },
      { id: 'contact', labelBn: 'অর্ডার ও সহায়তা', labelEn: 'Support', href: '#contact' },
    ]
  }
};
