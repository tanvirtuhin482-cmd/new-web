import React, { useState } from 'react';
import { ColorTheme } from '../../types/website';
import { AdminOrder, StoreSettings } from '../../types/admin';
import {
  X,
  MapPin,
  Phone,
  Calendar,
  Printer,
  CheckCircle,
  FileText,
  CreditCard,
  Truck,
  Receipt,
  Download,
  ShieldCheck,
  Mail,
  Clock,
  Hash,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder | null;
  settings: StoreSettings;
  language: 'bn' | 'en';
  theme?: ColorTheme;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  settings,
  language,
  theme,
}) => {
  const [printFormat, setPrintFormat] = useState<'a4' | 'receipt'>('a4');

  if (!isOpen) return null;
  if (!order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-5">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
          <p className="text-neutral-500 font-bold italic">অর্ডার ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const isBn = language === 'bn';
  const storePhone = settings.phone || '+880 1711-889900';
  const storeEmail = settings.email || 'info@halalbazarbd.com';
  const storeAddress = settings.address || 'ঢাকা, বাংলাদেশ';
  const invoiceNumber = order.invoiceNumber || `${settings.invoicePrefix || 'INV-'}${String(order.serialNo || 1).padStart(4, '0')}`;
  
  const primaryColor = theme?.primary || '#064e3b';

  const paymentMethodLabel = (() => {
    switch (order.paymentMethod) {
      case 'bkash':
        return isBn ? 'বিকাশ (bKash)' : 'bKash';
      case 'nagad':
        return isBn ? 'নগদ (Nagad)' : 'Nagad';
      case 'admin_paid':
        return isBn ? 'অ্যাডমিন পেইড (Admin Paid)' : 'Admin Paid';
      case 'cod':
      default:
        return isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery';
    }
  })();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto font-['Hind_Siliguri',sans-serif]">
      {/* Premium Print-Specific Styles */}
      <style>{`
        @media print {
          @page {
            size: ${printFormat === 'receipt' ? '80mm auto' : 'A4 portrait'};
            margin: ${printFormat === 'receipt' ? '2mm' : '0mm'};
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #premium-invoice-container {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: ${printFormat === 'receipt' ? '4mm' : '15mm 20mm'} !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Main Wrapper */}
      <div
        id="premium-invoice-container"
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden my-auto border border-neutral-100 transition-all animate-in fade-in zoom-in-95 duration-500 print:shadow-none print:border-none print:rounded-none"
      >
        {/* Premium Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        {/* Top Branding Strip (Hidden in print if needed, but looks premium so keeping it) */}
        <div 
          className="h-2 w-full shrink-0" 
          style={{ backgroundColor: primaryColor }}
        />

        {/* Action Toolbar (No Print) */}
        <div className="no-print bg-neutral-950 text-white px-5 py-4 flex items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border border-white/20" style={{ backgroundColor: primaryColor }}>
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest text-neutral-100">
                {isBn ? 'প্রিমিয়াম মেমো' : 'PREMIUM INVOICE'}
              </h3>
              <p className="text-[10px] text-neutral-500 font-bold">
                {isBn ? 'ইনভয়েস নং:' : 'Invoice No:'} {invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-white/5 mr-2">
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${printFormat === 'a4' ? 'bg-white text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'}`}
              >
                A4 Paper
              </button>
              <button
                onClick={() => setPrintFormat('receipt')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${printFormat === 'receipt' ? 'bg-white text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'}`}
              >
                POS Slip
              </button>
            </div>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[11px] font-black shadow-lg transition-transform active:scale-95 cursor-pointer uppercase"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="relative p-6 sm:p-10 space-y-8 bg-white overflow-hidden">
          {/* Subtle Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none w-2/3 grayscale">
            {settings.logoImage ? (
              <img src={settings.logoImage} alt="Watermark" className="w-full h-auto" />
            ) : (
              <span className="text-[150px] font-black text-neutral-900">{settings.logoLetter || 'হ'}</span>
            )}
          </div>

          {/* Header: Identity */}
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-6 border-b-2 border-neutral-100 pb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-100 bg-white flex items-center justify-center shrink-0 p-1">
                {settings.logoImage ? (
                  <img src={settings.logoImage} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-2xl" style={{ backgroundColor: primaryColor }}>
                    {settings.logoLetter || 'প'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-neutral-950 tracking-tighter leading-none" style={{ color: primaryColor }}>
                  {settings.storeName || 'Halal Bazar BD'}
                </h1>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {settings.storeTagline || 'Authentic Premium Quality Food Store'}
                </p>
                <div className="pt-2 flex flex-col gap-1 text-[11px] text-neutral-600 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-neutral-400" /> {storeAddress}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-neutral-400" /> {storePhone}</span>
                  {settings.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-neutral-400" /> {settings.email}</span>}
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col md:items-end gap-2 text-right">
              <div 
                className="inline-block px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {isBn ? 'অফিসিয়াল ক্যাশ মেমো' : 'OFFICIAL CASH MEMO'}
              </div>
              <div className="space-y-0.5 pt-1">
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{isBn ? 'ইনভয়েস নম্বর' : 'Invoice Number'}</p>
                <p className="text-xl font-black text-neutral-900 font-mono tracking-tighter" style={{ color: primaryColor }}>#{invoiceNumber}</p>
              </div>
              <div className="flex items-center md:justify-end gap-3 pt-1 text-[11px] font-bold text-neutral-500 bg-neutral-50 md:bg-transparent px-3 py-1.5 rounded-lg border md:border-0 border-neutral-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-neutral-400" /> {order.createdAt.split(',')[0]}</span>
                <span className="w-px h-3 bg-neutral-300 hidden md:block" />
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-neutral-400" /> {order.createdAt.split(',')[1]?.trim() || ''}</span>
              </div>
            </div>
          </div>

          {/* Billing Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-3 bg-neutral-50/50 p-5 rounded-3xl border border-neutral-100">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{isBn ? 'গ্রাহকের ঠিকানা ও তথ্য' : 'SHIPPING & BILLING TO'}</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-neutral-900 leading-tight">{order.customerName}</h4>
                <p className="text-[13px] font-black text-neutral-700 font-mono tracking-wider flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {order.customerPhone}
                </p>
                <div className="pt-2 text-[12px] text-neutral-600 leading-relaxed font-medium">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase pb-0.5">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Full Address:'}</span>
                  {order.customerAddress}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-neutral-50/50 p-5 rounded-3xl border border-neutral-100">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{isBn ? 'পেমেন্ট ও অর্ডার বিবরণ' : 'ORDER & PAYMENT SUMMARY'}</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-bold">{isBn ? 'পেমেন্ট মেথড:' : 'Payment Mode:'}</span>
                  <span className="font-black text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-sm">{paymentMethodLabel}</span>
                </div>
                {order.trxId && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-bold">Transaction ID:</span>
                    <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-tighter">{order.trxId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-bold">{isBn ? 'অর্ডার স্ট্যাটাস:' : 'Order Status:'}</span>
                  <span className="flex items-center gap-1.5 font-black text-emerald-700 uppercase">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isBn ? 'নিশ্চিত করা হয়েছে' : 'Confirmed'}
                  </span>
                </div>
                {order.orderNotes && (
                  <div className="pt-2 mt-2 border-t border-dashed border-neutral-200">
                    <span className="text-[10px] font-black text-neutral-400 uppercase block pb-1">{isBn ? 'বিশেষ নোট:' : 'Special Instruction:'}</span>
                    <p className="text-[11px] font-medium text-neutral-600 italic">"{order.orderNotes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3 relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-neutral-400" />
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{isBn ? 'পণ্যের বিস্তারিত তালিকা' : 'ORDERED ITEMS LIST'}</h4>
              </div>
              <span className="text-[10px] font-black text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                {order.items.length} {isBn ? 'টি পণ্য' : 'Items'}
              </span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                    <th className="p-5 w-12 text-center text-neutral-500 border-r border-white/5">#</th>
                    <th className="p-5">{isBn ? 'পণ্যের নাম ও বিবরণ' : 'Description'}</th>
                    <th className="p-5 text-center w-20 border-l border-white/5">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                    <th className="p-5 text-right w-32 border-l border-white/5">{isBn ? 'একক মূল্য' : 'Price'}</th>
                    <th className="p-5 text-right w-32 border-l border-white/5">{isBn ? 'মোট মূল্য' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800 font-bold">
                  {order.items.map((it, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'}>
                      <td className="p-4 text-center text-neutral-300 font-mono text-[11px] border-r border-neutral-100">{idx + 1}</td>
                      <td className="p-4">
                        <span className="block text-[14px] text-neutral-900 leading-tight mb-0.5">{it.productName}</span>
                        {it.weightAmount && (
                          <span className="inline-block text-[9px] font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Size: {it.weightAmount}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono font-black text-neutral-900 border-l border-neutral-100">{it.quantity}</td>
                      <td className="p-4 text-right font-mono text-neutral-600 border-l border-neutral-100">
                        ৳{((it.originalPrice && it.originalPrice > it.price) ? it.originalPrice : it.price).toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono font-black text-neutral-950 border-l border-neutral-100 bg-neutral-50/20">
                        ৳{(((it.originalPrice && it.originalPrice > it.price) ? it.originalPrice : it.price) * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 pt-2">
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-6">
              <div className="bg-neutral-50 p-6 rounded-3xl border-2 border-dashed border-neutral-200 relative group transition-all hover:border-neutral-300">
                <span className="absolute -top-3 left-6 bg-white px-3 py-1 border border-neutral-200 rounded-full text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  Important Policy
                </span>
                <div className="space-y-2.5 text-[11px] text-neutral-500 leading-relaxed font-bold">
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{isBn ? 'ডেলিভারি ম্যানের সামনে পণ্য চেক করে গ্রহণ করুন। পরবর্তীতে কোনো অভিযোগ গ্রহণ করা হবে না।' : 'Please verify products in front of delivery staff. Claims won\'t be accepted later.'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{isBn ? 'ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে ডেলিভারি।' : 'Delivery: 24-48h (Inside Dhaka), 2-3 Days (Outside Dhaka).'}</span>
                  </p>
                  <div className="pt-3 flex items-center gap-3 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                     <span className="text-[10px] font-black text-neutral-400">PARTNERS:</span>
                     <div className="flex gap-2">
                       <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[8px] font-bold">STEADFAST</span>
                       <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[8px] font-bold">PATHAO</span>
                       <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[8px] font-bold">REDX</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border border-emerald-200">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                   <p className="text-[11px] font-black text-emerald-900 uppercase leading-none mb-1">Authenticity Guaranteed</p>
                   <p className="text-[10px] font-bold text-emerald-600/80">100% Purity Verified & Premium Choice</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[45%] space-y-4">
              <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                    <span>{isBn ? 'উপ-মোট (Subtotal):' : 'Order Subtotal:'}</span>
                    <span className="font-mono text-neutral-100">৳{((order.originalSubtotal && order.originalSubtotal > order.subtotal) ? order.originalSubtotal : (order.subtotal + (order.discountAmount || 0))).toLocaleString()}</span>
                  </div>

                  {order.discountAmount !== undefined && order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                      <span>{isBn ? 'মূল্যছাড় (Discount):' : 'Discount Applied:'}</span>
                      <span className="font-mono">- ৳{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                    <span>{isBn ? 'ডেলিভারি চার্জ:' : 'Shipping Fee:'}</span>
                    <span className="font-mono text-neutral-100">+ ৳{order.deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="h-px bg-white/10 my-4" />

                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{isBn ? 'সর্বমোট প্রদেয়' : 'TOTAL PAYABLE'}</p>
                      <p className="text-sm font-bold text-white/50">{isBn ? 'ভ্যাট সহ' : 'Inc. all taxes'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black font-mono tracking-tighter text-emerald-400 leading-none">৳{order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                     <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-tighter">{isBn ? 'পেমেন্ট স্ট্যাটাস' : 'PAYMENT STATUS'}</p>
                        {(() => {
                            const adv = order.advancePaid ?? (order.paymentMethod !== 'cod' ? order.total : 0);
                            const due = order.dueAmount !== undefined ? order.dueAmount : Math.max(0, order.total - adv);
                            const isPaid = due === 0 || adv >= order.total || order.paymentStatus === 'paid';
                            
                            return (
                               <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPaid ? 'bg-emerald-500 text-neutral-950' : 'bg-amber-500 text-neutral-950'}`}>
                                  {isPaid ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {isPaid ? (isBn ? 'পরিশোধিত' : 'PAID') : (isBn ? 'বকেয়া' : 'UNPAID')}
                               </div>
                            );
                        })()}
                     </div>
                     <div className="bg-white p-1 rounded-xl shadow-lg border border-white/10">
                        <QRCodeSVG
                          value={`INVOICE:${invoiceNumber}|TOTAL:${order.total}|CUSTOMER:${order.customerPhone}`}
                          size={50}
                          level="H"
                          fgColor="#000"
                        />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature & Official Footer */}
          <div className="pt-12 grid grid-cols-2 gap-12 text-center relative">
            {/* Signature 1 */}
            <div className="space-y-4">
              <div className="w-full h-12 flex items-end justify-center">
                 {/* Placeholder for actual signature image or stylized font */}
                 <span className="font-['Dancing_Script',cursive] text-2xl text-neutral-300 pointer-events-none">Customer</span>
              </div>
              <div className="border-t-2 border-neutral-100 pt-2">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{isBn ? 'গ্রাহকের স্বাক্ষর' : 'Customer Signature'}</p>
                <p className="text-[9px] text-neutral-300 font-bold mt-1">Authorized Receipt Holder</p>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-4">
              <div className="w-full h-12 flex items-end justify-center relative">
                 {/* Stylized Logo Initials for Seal */}
                 <div className="absolute top-0 opacity-10 rotate-12">
                   <ShieldCheck className="w-16 h-16 text-emerald-900" />
                 </div>
                 <span className="font-['Dancing_Script',cursive] text-3xl text-emerald-800 leading-none">Halal Bazar</span>
              </div>
              <div className="border-t-2 border-neutral-100 pt-2">
                <p className="text-[10px] font-black text-neutral-950 uppercase tracking-widest">{isBn ? 'অনুমোদিত স্বাক্ষর' : 'Authorized Signature'}</p>
                <p className="text-[9px] text-neutral-400 font-bold mt-1">Store Manager / Accounts Dept.</p>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="pt-8 border-t border-neutral-100 text-center space-y-2">
             <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-12 bg-neutral-100" />
                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em]">{isBn ? 'ধন্যবাদ' : 'THANK YOU'}</span>
                <div className="h-px w-12 bg-neutral-100" />
             </div>
             <p className="text-[11px] font-bold text-neutral-400 italic">
               {isBn 
                 ? `আমাদের সাথে কেনাকাটা করার জন্য ধন্যবাদ! আমরা আপনার আস্থার মূল্যায়ন করি।` 
                 : `Thank you for choosing us! We appreciate your trust in our premium products.`}
             </p>
             <div className="flex items-center justify-center gap-4 pt-2 text-[9px] font-black text-neutral-300 tracking-widest uppercase">
                <span>Facebook.com/halalbazarbd</span>
                <span className="w-1 h-1 rounded-full bg-neutral-200" />
                <span>www.halalbazarbd.com</span>
             </div>
          </div>
        </div>

        {/* Footer (No Print) */}
        <div className="no-print bg-neutral-50 px-6 py-5 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-neutral-200 text-neutral-400">
               <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold leading-tight">
               {isBn 
                 ? 'এটি একটি কম্পিউটার জেনারেটেড রসিদ, কোনো প্রকার এডিটযোগ্য নয়।' 
                 : 'Computer generated official receipt. Fully secured and encrypted.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-black shadow-xl transition-all active:scale-95 cursor-pointer uppercase"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'প্রিন্ট মেমো' : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-[11px] font-black shadow-sm transition-colors cursor-pointer uppercase"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
