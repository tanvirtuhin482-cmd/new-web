import React, { useState } from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Zap, Check, Sparkles } from 'lucide-react';
import { ColorTheme, Language, ProductItem } from '../../types/website';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: ProductItem[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (product: ProductItem) => void;
  onExpressOrder?: (product: ProductItem) => void;
  theme: ColorTheme;
  language: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToCart,
  onExpressOrder,
  theme,
  language,
}) => {
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const inStockItems = wishlistItems.filter((item) => item.inStock !== false);

  const handleAddSingle = (product: ProductItem) => {
    onAddToCart(product);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  const handleAddAllToCart = () => {
    inStockItems.forEach((item) => {
      onAddToCart(item);
    });
    // Visual feedback for all items
    const newAdded: Record<string, boolean> = {};
    inStockItems.forEach((item) => {
      newAdded[item.id] = true;
    });
    setAddedItemIds(newAdded);
    setTimeout(() => {
      setAddedItemIds({});
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label={isBn ? 'পছন্দের তালিকা' : 'Wishlist'}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-white to-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-neutral-900">
                  {isBn ? 'আমার পছন্দের তালিকা' : 'My Wishlist'}
                </h2>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                  {wishlistItems.length} {isBn ? 'টি' : 'items'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-medium">
                {isBn ? 'পরবর্তীতে সহজে অর্ডার করতে সেভ করা পণ্যসমূহ' : 'Saved goods ready for easy checkout'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
                <Heart className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5 max-w-xs mx-auto">
                <h3 className="text-sm font-bold text-neutral-900">
                  {isBn ? 'আপনার পছন্দের তালিকা খালি' : 'Your Wishlist is Empty'}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isBn
                    ? 'যেকোনো পণ্যের ওপর হার্ট (❤️) আইকনে ক্লিক করে সহজেই এখানে সেভ করে রাখতে পারেন।'
                    : 'Click the heart icon on any product to save it here for later.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const target = document.getElementById('products') || document.getElementById('spices');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
                style={{ backgroundColor: theme.primary }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'পণ্যসমূহ দেখতে যান' : 'Browse Products'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Top Quick Actions Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
                <span className="text-neutral-500 font-medium">
                  {isBn ? 'মোট সংরক্ষিত:' : 'Total saved:'} <strong className="text-neutral-900">{wishlistItems.length}টি</strong>
                </span>
                <button
                  type="button"
                  onClick={onClearWishlist}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isBn ? 'তালিকা খালি করুন' : 'Clear All'}</span>
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="space-y-3">
                {wishlistItems.map((product) => {
                  const isAdded = !!addedItemIds[product.id];
                  const isOutOfStock = product.inStock === false;

                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl border border-neutral-200/80 bg-white hover:border-rose-200 hover:shadow-md transition-all duration-200 flex flex-col gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0 relative">
                          {Boolean(product.image && product.image.trim()) ? (
                            <img
                              src={product.image}
                              alt={product.nameBn}
                              className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                                isOutOfStock ? 'grayscale opacity-75' : ''
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400">
                              HB
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center">
                              <span className="text-[8px] font-black text-white px-1 py-0.5 rounded bg-rose-700">
                                {isBn ? 'স্টক শেষ' : 'OUT'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate leading-snug">
                              {isBn ? product.nameBn : product.nameEn}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveFromWishlist(product.id)}
                              className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                              title={isBn ? 'উইশলিস্ট থেকে মুছুন' : 'Remove item'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                              {isBn ? product.categoryBn : product.categoryEn}
                            </span>
                            {product.weightAmount && (
                              <span className="text-[10px] text-neutral-500 font-medium">
                                ({product.weightAmount})
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mt-1.5 font-mono">
                            <span className="font-black text-sm text-neutral-900">
                              ৳{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs line-through text-neutral-400">
                                ৳{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                            {product.discountPercent && product.discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                -{product.discountPercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons for this item */}
                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                        {isOutOfStock ? (
                          <div className="w-full py-1.5 px-3 rounded-xl bg-neutral-100 text-neutral-500 text-xs font-bold text-center">
                            {isBn ? 'পণ্যটি বর্তমানে স্টকে নেই' : 'Currently Out of Stock'}
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAddSingle(product)}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'ব্যাগে যোগ হয়েছে' : 'Added to Bag'}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{isBn ? 'ব্যাগে যোগ করুন' : 'Add to Bag'}</span>
                                </>
                              )}
                            </button>

                            {onExpressOrder && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onExpressOrder(product);
                                }}
                                className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 transition-all shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
                                title={isBn ? 'ঝটপট সরাসরি অর্ডার করুন' : 'Order Now'}
                              >
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                <span>{isBn ? 'সরাসরি অর্ডার' : 'Order Now'}</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Bulk Move */}
        {wishlistItems.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 font-semibold">
                {isBn ? 'পছন্দের পণ্যের মোট মূল্য:' : 'Wishlist Total Value:'}
              </span>
              <span className="font-mono font-black text-sm text-neutral-900">
                ৳{totalValue.toLocaleString()}
              </span>
            </div>

            {inStockItems.length > 0 && (
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer hover:opacity-95"
                style={{ backgroundColor: theme.primary }}
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>
                  {isBn 
                    ? `সবগুলো পণ্য শপিং ব্যাগে নিন (${inStockItems.length}টি)` 
                    : `Move All to Shopping Bag (${inStockItems.length})`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
