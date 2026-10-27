import React, { useState, useEffect } from 'react';
import { ColorTheme, Language, ProductItem, WebsiteData } from '../../types/website';
import { InlineEditable } from '../editor/InlineEditable';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  PhoneCall,
  Share2,
  Sparkles,
  Zap,
  Package,
  BadgePercent,
  Check
} from 'lucide-react';

interface ProductDetailProps {
  product: ProductItem;
  theme: ColorTheme;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onToggleWishlist: (product: ProductItem) => void;
  isWishlisted: boolean;
  isBn: boolean;
  allProducts?: ProductItem[];
  onSelectProduct?: (id: string) => void;
  onExpressOrder?: (product: ProductItem) => void;
  whatsappNumber?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  theme,
  language,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isBn,
  allProducts = [],
  onSelectProduct,
  onExpressOrder,
  whatsappNumber,
}) => {
  // Collect all images ensuring no empty or duplicate strings
  const rawList = [product.image, ...(product.additionalImages || [])]
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
  
  const allImages = rawList.length > 0 ? Array.from(new Set(rawList)) : [
    'https://images.unsplash.com/photo-1536591375315-1b836890327b?q=80&w=1000&auto=format&fit=crop'
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<{ label: string; price: number; originalPrice?: number } | null>(
    product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'benefits' | 'delivery'>('desc');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedWeight(
      product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : null
    );
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const currentPrice = selectedWeight ? selectedWeight.price : product.price;
  const currentOriginalPrice = selectedWeight?.originalPrice || product.originalPrice;
  const currentDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : product.discountPercent;
  const savingsAmount = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? currentOriginalPrice - currentPrice
    : 0;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCartWithSelected = () => {
    const itemToAdd: ProductItem = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      weightAmount: selectedWeight ? selectedWeight.label : product.weightAmount,
      nameBn: selectedWeight ? `${product.nameBn} (${selectedWeight.label})` : product.nameBn,
      quantity: quantity,
    };
    onAddToCart(itemToAdd);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const handleExpressOrderWithSelected = () => {
    const itemToOrder: ProductItem = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      weightAmount: selectedWeight ? selectedWeight.label : product.weightAmount,
      nameBn: selectedWeight ? `${product.nameBn} (${selectedWeight.label})` : product.nameBn,
      quantity: quantity,
    };
    if (onExpressOrder) {
      onExpressOrder(itemToOrder);
    } else {
      onAddToCart(itemToOrder);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const cleanWhatsappNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber.startsWith('88') ? cleanWhatsappNumber : `88${cleanWhatsappNumber}`}?text=${encodeURIComponent(
    `আসসালামু আলাইকুম, আমি আপনার "${isBn ? product.nameBn : product.nameEn}" পণ্যটি সম্পর্কে জানতে চাই। মূল্য: ৳${currentPrice}`
  )}`;

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-50/60 pt-20 pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200/70">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-medium">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-neutral-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'শপে ফিরে যান' : 'Back to Store'}</span>
          </button>
          <span>/</span>
          <span className="text-neutral-600 hidden sm:inline">
            {isBn ? product.categoryBn : product.categoryEn}
          </span>
          <span className="hidden sm:inline">/</span>
          <span className="text-emerald-900 font-semibold truncate max-w-[200px]">
            {isBn ? product.nameBn : product.nameEn}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 shadow-2xs transition-all cursor-pointer"
            title="লিংক কপি করুন"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'শেয়ার' : 'Share')}</span>
          </button>

          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-neutral-200 hover:border-rose-200 text-neutral-500 hover:text-rose-600'
            }`}
            title="উইশলিস্টে যুক্ত করুন"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Ultra-Premium Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative group rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center">
            {/* Main Displayed Image */}
            <img
              src={allImages[activeImageIndex] || product.image}
              alt={isBn ? product.nameBn : product.nameEn}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
              {currentDiscount && currentDiscount > 0 ? (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>{currentDiscount}% {isBn ? 'ছাড়' : 'OFF'}</span>
                </span>
              ) : null}
              {product.inStock !== false ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isBn ? '১০০% খাঁটি ও ইন স্টক' : '100% Pure & In Stock'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md text-neutral-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-neutral-700">
                  {isBn ? 'স্টক শেষ' : 'Out of Stock'}
                </span>
              )}
            </div>

            {/* Zoom / Fullscreen Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
              title="বড় করে দেখুন"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Next / Prev Navigation Buttons (when multiple images exist) */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-xl flex items-center justify-center transition-all opacity-90 hover:scale-110 active:scale-95 cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-xl flex items-center justify-center transition-all opacity-90 hover:scale-110 active:scale-95 cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Count Indicator */}
                <div className="absolute bottom-3 right-3 bg-neutral-900/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
                  {activeImageIndex + 1} / {allImages.length} {isBn ? 'ছবি' : 'Photos'}
                </div>
              </>
            )}
          </div>

          {/* Multiple Images Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-1">
                <span>{isBn ? 'সবগুলো ছবি দেখতে ক্লিক করুন:' : 'Click to view all photos:'}</span>
                <span className="text-emerald-700 font-bold">{allImages.length} {isBn ? 'টি ছবি উপলব্ধ' : 'Photos available'}</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer bg-white group shadow-2xs ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md scale-102'
                        : 'border-neutral-200/80 hover:border-emerald-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {activeImageIndex === idx && (
                      <div className="absolute inset-0 bg-emerald-600/10 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Trust Highlights under photo */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{isBn ? '১০০% খাঁটি ও বিশুদ্ধ' : '100% Pure & Organic'}</p>
                <p className="text-[10px] text-neutral-500">{isBn ? 'কেমিক্যাল ও ভেজালমুক্ত' : 'Chemical & preservative free'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{isBn ? 'হোম ডেলিভারি' : 'Fast Home Delivery'}</p>
                <p className="text-[10px] text-neutral-500">{isBn ? 'দেখে মূল্য পরিশোধ করুন' : 'Cash on delivery across BD'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info & Purchase Controls (7 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                {isBn ? product.categoryBn : product.categoryEn}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-neutral-800 font-extrabold">{product.rating || 5.0}</span>
                <span className="text-neutral-400">({product.reviewsCount || 128} {isBn ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
              <InlineEditable
                target={{ 
                  id: `prod-detail-name-${product.id}`, 
                  field: 'product', 
                  type: 'product', 
                  title: `${product.nameBn} নাম পরিবর্তন`, 
                  label: 'পণ্যের নাম', 
                  productId: product.id,
                  value: product.nameBn
                }}
              >
                {isBn ? product.nameBn : product.nameEn}
              </InlineEditable>
            </h1>

            {/* Short Tagline / Stock Status */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isBn
                  ? 'সরাসরি নিজস্ব সোর্সিং থেকে সংগৃহীত সর্বোচ্চ প্রিমিয়াম কোয়ালিটি'
                  : 'Sourced directly from authentic farms with premium grading'}
              </span>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-emerald-100/30 to-amber-50/50 border border-emerald-200/80 flex flex-wrap items-baseline justify-between gap-3 shadow-2xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                  ৳{currentPrice.toLocaleString('bn-BD')}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-lg text-neutral-400 line-through font-semibold">
                    ৳{currentOriginalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
              </div>

              {savingsAmount > 0 && (
                <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold px-3 py-1 rounded-full">
                  <span>{isBn ? `সাশ্রয় ৳${savingsAmount.toLocaleString('bn-BD')}` : `Save ৳${savingsAmount}`}</span>
                </div>
              )}
            </div>

            {/* Weight / Variant Options (if any) */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-neutral-800">
                  {isBn ? 'পরিমাণ / সাইজ নির্বাচন করুন:' : 'Select Weight / Quantity Variant:'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {product.weightOptions.map((opt, i) => {
                    const isSelected = selectedWeight?.label === opt.label;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedWeight(opt)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60'
                        }`}
                      >
                        <p className={`text-xs font-extrabold ${isSelected ? 'text-emerald-900' : 'text-neutral-800'}`}>
                          {opt.label}
                        </p>
                        <p className={`text-xs font-black mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-neutral-900'}`}>
                          ৳{opt.price}
                        </p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {isBn ? 'সংখ্যা (পরিমাণ):' : 'Quantity:'}
                </label>
                <div className="inline-flex items-center rounded-xl border border-neutral-300 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isBn
                      ? `স্টক প্রস্তুত (${product.stockQuantity || 25}+ প্যাকেট স্টকে রয়েছে)`
                      : `Ready to dispatch (${product.stockQuantity || 25}+ in stock)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Instant Order & Add to Cart */}
            <div className="space-y-2.5 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instant Buy Now Button */}
                <button
                  type="button"
                  onClick={handleExpressOrderWithSelected}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-base shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>{isBn ? 'এখনই অর্ডার করুন' : 'Order Now (Cash on Delivery)'}</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCartWithSelected}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>{isBn ? 'কার্টে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp direct order option */}
              {cleanWhatsappNumber && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 hover:bg-emerald-50/50 text-xs font-bold transition-all shadow-2xs"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার বা তথ্য জানুন' : 'Order via WhatsApp'}</span>
                </a>
              )}
            </div>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-3 text-xs text-neutral-700">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{isBn ? 'সারা দেশে ডেলিভারি:' : 'Nationwide Delivery:'}</strong>{' '}
                {isBn ? 'ঢাকার ভেতর ২৪ ঘণ্টায়, ঢাকার বাইরে ৪৮-৭২ ঘণ্টায় ক্যাশ অন ডেলিভারি।' : 'Cash on delivery within 24-48 hrs.'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-700">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{isBn ? 'সহজ রিটার্ন পলিসি:' : 'Easy Return Policy:'}</strong>{' '}
                {isBn ? 'পণ্য হাতে পেয়ে কোনো অসন্তুষ্টি থাকলে সাথে সাথে ফেরত দিতে পারবেন।' : 'Check before paying, instant return guarantee.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION: Details, Nutritional Benefits, and Delivery Policy */}
      <div className="mt-14 bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-emerald-700 text-emerald-900 bg-white shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isBn ? 'পণ্যের পূর্ণ বিবরণ' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'border-emerald-700 text-emerald-900 bg-white shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isBn ? 'পুষ্টিগুণ ও স্বাস্থ্য উপকারিতা' : 'Health Benefits'}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-emerald-700 text-emerald-900 bg-white shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isBn ? 'ডেলিভারি ও পেমেন্ট নিয়মাবলী' : 'Delivery & Policy'}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-lg font-bold text-neutral-900">
                {isBn ? `${product.nameBn} কেন সেরা?` : `Why choose ${product.nameEn}?`}
              </h3>
              <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                <InlineEditable
                  target={{ 
                    id: `prod-detail-desc-${product.id}`, 
                    field: 'product', 
                    type: 'product', 
                    title: `${product.nameBn} বিবরণ পরিবর্তন`, 
                    label: 'পণ্যের বিবরণ', 
                    productId: product.id,
                    value: product.descBn
                  }}
                  multiline
                >
                  {isBn ? product.descBn : product.descEn}
                </InlineEditable>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{isBn ? 'ন্যাচারাল সোর্সিং' : 'Natural Sourcing'}</h4>
                    <p className="text-xs text-neutral-500">{isBn ? 'কোনো কৃত্রিম রং, রাসায়নিক বা প্রিজারভেটিভ নেই।' : 'No artificial color or chemicals.'}</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{isBn ? 'হাইজিনিক ফুড-গ্রেড প্যাক' : 'Hygienic Packaging'}</h4>
                    <p className="text-xs text-neutral-500">{isBn ? 'সম্পূর্ণ এয়ারটাইট জিপলক পাউচে দীর্ঘমেয়াদে সতেজ থাকে।' : 'Airtight packaging locks freshness.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-lg font-bold text-neutral-900">
                {isBn ? 'দৈনন্দিন পুষ্টি ও বিশেষ উপকারিতা' : 'Nutritional Value & Benefits'}
              </h3>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span><strong>{isBn ? 'প্রাকৃতিক এনার্জি বুস্টার:' : 'Natural Energy Booster:'}</strong> {isBn ? 'শারীরিক দুর্বলতা দূর করে সারাদিনের কর্মক্ষমতা বজায় রাখতে সহায়তা করে।' : 'Provides clean daily sustenance.'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span><strong>{isBn ? 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি:' : 'Immunity Booster:'}</strong> {isBn ? 'প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট ও মাইক্রো-নিউট্রিয়েন্টস শরীরকে সুরক্ষিত রাখে।' : 'Rich in healthy antioxidants.'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span><strong>{isBn ? 'হৃদযন্ত্র ও মস্তিষ্কের সুরক্ষায়:' : 'Heart & Brain Health:'}</strong> {isBn ? 'গুড ফ্যাটস এবং ওমেগা এসিড রক্তচাপ নিয়ন্ত্রণে রাখতে ভূমিকা রাখে।' : 'Healthy fats support cardiovascular health.'}</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 max-w-4xl text-sm text-neutral-700">
              <h3 className="text-lg font-bold text-neutral-900">
                {isBn ? 'ডেলিভারি চার্জ ও শর্তাবলী' : 'Delivery Charges & Information'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <p className="font-bold text-neutral-900">{isBn ? 'ঢাকার ভিতরে' : 'Inside Dhaka'}</p>
                  <p className="text-xs text-neutral-500 mt-1">{isBn ? '২৪ ঘণ্টার মধ্যে হোম ডেলিভারি। ডেলিভারি চার্জ ৬০ টাকা।' : 'Within 24 hours. Delivery fee ৳60.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <p className="font-bold text-neutral-900">{isBn ? 'ঢাকার বাইরে (সারা দেশ)' : 'Outside Dhaka'}</p>
                  <p className="text-xs text-neutral-500 mt-1">{isBn ? '৪৮-৭২ ঘণ্টার মধ্যে জেলা ও থানা পর্যায়ে হোম ডেলিভারি। চার্জ ১২০ টাকা।' : 'Within 48-72 hours. Delivery fee ৳120.'}</p>
                </div>
              </div>
              <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                {isBn
                  ? '💡 গ্রাহকের সর্বোচ্চ সন্তুষ্টি নিশ্চিতে ডেলিভারিম্যানের সামনে পার্সেল খুলে দেখে নেওয়ার পূর্ণ অধিকার রয়েছে।'
                  : 'Customer satisfaction guarantee: Check products before completing payment.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              {isBn ? 'সম্পর্কিত আরও আকর্ষণীয় পণ্য' : 'You May Also Like'}
            </h2>
            <button
              onClick={onClose}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              {isBn ? 'সকল পণ্য দেখুন →' : 'View all products →'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => {
              const relImages = [p.image, ...(p.additionalImages || [])].filter(Boolean);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct?.(p.id)}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 hover:shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="rounded-xl overflow-hidden aspect-square bg-neutral-100 relative">
                      <img
                        src={p.image}
                        alt={isBn ? p.nameBn : p.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relImages.length > 1 && (
                        <span className="absolute bottom-1.5 right-1.5 bg-neutral-900/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {relImages.length} {isBn ? 'ছবি' : 'pics'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 font-semibold">{isBn ? p.categoryBn : p.categoryEn}</p>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-800 line-clamp-1">
                        {isBn ? p.nameBn : p.nameEn}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-950">৳{p.price}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      className="w-7 h-7 rounded-lg bg-emerald-100/70 hover:bg-emerald-800 text-emerald-800 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="কার্টে যোগ করুন"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={allImages[activeImageIndex]}
              alt={isBn ? product.nameBn : product.nameEn}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-neutral-300 text-xs font-semibold mt-4">
              {activeImageIndex + 1} / {allImages.length} - {isBn ? product.nameBn : product.nameEn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
