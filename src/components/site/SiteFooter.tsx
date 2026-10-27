import React from 'react';
import { ColorTheme, Language, WebsiteData } from '../../types/website';
import { ShieldCheck, Truck, RotateCcw, Headphones, Phone, Mail, MapPin } from 'lucide-react';
import { EditTrigger } from '../editor/EditTrigger';
import { InlineEditable } from '../editor/InlineEditable';

interface SiteFooterProps {
  siteData: WebsiteData;
  theme: ColorTheme;
  language: Language;
  onOpenAdmin?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  siteData,
  theme,
  language,
  onOpenAdmin,
}) => {

  const [footerTapCount, setFooterTapCount] = React.useState(0);

  const handleFooterTap = () => {
    const next = footerTapCount + 1;
    if (next >= 3) {
      setFooterTapCount(0);
      onOpenAdmin?.();
    } else {
      setFooterTapCount(next);
      setTimeout(() => setFooterTapCount(0), 1200);
    }
  };

  const isBn = language === 'bn';
  const siteName = isBn ? siteData.nameBn : siteData.nameEn;

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-white/5 relative overflow-hidden">
      {/* Glow Effects */}
      <div 
        className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.primary }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.accent }}
      />

      {/* Purity & Trust Pillars */}
      <div className="border-b border-white/5 bg-white/[0.02] py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 group relative">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundColor: `${theme.primary}25`,
                color: theme.accent,
                borderColor: `${theme.primary}40`,
              }}
            >
              <ShieldCheck className="w-6 h-6" style={{ color: theme.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-black text-sm tracking-tight">
                  <InlineEditable
                    target={{ 
                      id: 'trust-purity', 
                      field: 'trustPurity', 
                      type: 'text', 
                      title: '১০০% খাঁটি ও প্রিমিয়াম ব্যাজ তথ্য এডিট', 
                      label: 'ব্যাজ শিরোনাম (Title)', 
                      secondaryLabel: 'বিবরণ বা সাবটাইটেল (Subtitle)', 
                      value: siteData.trustPurityTitleBn || (isBn ? '১০০% খাঁটি ও প্রিমিয়াম' : '100% Pure & Premium'), 
                      secondaryValue: siteData.trustPurityDescBn || (isBn ? 'প্রিমিয়াম ড্রাই ফ্রুটস ও অর্গানিক পণ্য' : 'Premium dry fruits & organic pantry'), 
                      adminTabShortcut: 'settings_header_footer',
                    }}
                  >
                    {siteData.trustPurityTitleBn || (isBn ? '১০০% খাঁটি ও প্রিমিয়াম' : '100% Pure & Premium')}
                  </InlineEditable>
                </span>
                <EditTrigger 
                  target={{ 
                    id: 'trust-purity', 
                    field: 'trustPurity', 
                    type: 'text', 
                    title: '১০০% খাঁটি ও প্রিমিয়াম ব্যাজ তথ্য এডিট', 
                    label: 'ব্যাজ শিরোনাম (Title)', 
                    secondaryLabel: 'বিবরণ বা সাবটাইটেল (Subtitle)', 
                    value: siteData.trustPurityTitleBn || (isBn ? '১০০% খাঁটি ও প্রিমিয়াম' : '100% Pure & Premium'), 
                    secondaryValue: siteData.trustPurityDescBn || (isBn ? 'প্রিমিয়াম ড্রাই ফ্রুটস ও অর্গানিক পণ্য' : 'Premium dry fruits & organic pantry'), 
                    adminTabShortcut: 'settings_header_footer',
                  }} 
                  variant="icon-only" 
                  className="!w-5 !h-5" 
                />
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                <InlineEditable
                  target={{ 
                    id: 'trust-purity-desc', 
                    field: 'trustPurity', 
                    type: 'text', 
                    title: '১০০% খাঁটি ও প্রিমিয়াম ব্যাজ বিবরণ এডিট', 
                    label: 'ব্যাজ বিবরণ (Description)', 
                    value: siteData.trustPurityDescBn || (isBn ? 'প্রিমিয়াম ড্রাই ফ্রুটস ও অর্গানিক পণ্য' : 'Premium dry fruits & organic pantry'), 
                    secondaryValue: siteData.trustPurityTitleBn || (isBn ? '১০০% খাঁটি ও প্রিমিয়াম' : '100% Pure & Premium'), 
                    adminTabShortcut: 'settings_header_footer',
                  }}
                >
                  {siteData.trustPurityDescBn || (isBn ? 'প্রিমিয়াম ড্রাই ফ্রুটস ও অর্গানিক পণ্য' : 'Premium dry fruits & organic pantry')}
                </InlineEditable>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 group relative">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/50 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-black text-sm tracking-tight">
                  {siteData.trustDeliveryTitleBn || (isBn ? 'সারা দেশে ডেলিভারি' : 'Nationwide Delivery')}
                </span>
                <EditTrigger 
                  target={{ 
                    id: 'trust-delivery', 
                    field: 'trustDelivery', 
                    type: 'text', 
                    title: 'সারা দেশে ডেলিভারি তথ্য এডিট', 
                    label: 'ডেলিভারি শিরোনাম (Title)', 
                    secondaryLabel: 'ডেলিভারি বিবরণ বা সাবটাইটেল (Subtitle)', 
                    value: siteData.trustDeliveryTitleBn || (isBn ? 'সারা দেশে ডেলিভারি' : 'Nationwide Delivery'), 
                    secondaryValue: siteData.trustDeliveryDescBn || (isBn ? 'ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on delivery available'), 
                    adminTabShortcut: 'settings_header_footer',
                  }} 
                  variant="icon-only" 
                  className="!w-5 !h-5" 
                />
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {siteData.trustDeliveryDescBn || (isBn ? 'ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on delivery available')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 group relative">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundColor: `${theme.accent}25`,
                color: theme.accent,
                borderColor: `${theme.accent}40`,
              }}
            >
              <Headphones className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-black text-sm tracking-tight">
                  {siteData.trustSupportTitleBn || (isBn ? '২৪/৭ গ্রাহক সেবা' : 'Customer Support')}
                </span>
                <EditTrigger 
                  target={{ 
                    id: 'trust-support', 
                    field: 'trustSupport', 
                    type: 'text', 
                    title: '২৪/৭ গ্রাহক সেবা ও হটলাইন তথ্য এডিট', 
                    label: 'সেবা শিরোনাম (Title)', 
                    secondaryLabel: 'হটলাইন নম্বর বা সময় (Subtitle)', 
                    value: siteData.trustSupportTitleBn || (isBn ? '২৪/৭ গ্রাহক সেবা' : 'Customer Support'), 
                    secondaryValue: siteData.trustSupportDescBn || (isBn ? `হটলাইন: ${siteData.contactPhone || '০১৭১১-৮৮৯৯০০'}` : `Hotline: ${siteData.contactPhone || '+880 1711-889900'}`), 
                    adminTabShortcut: 'settings_header_footer',
                  }} 
                  variant="icon-only" 
                  className="!w-5 !h-5" 
                />
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 font-bold">
                {siteData.trustSupportDescBn || (isBn ? `হটলাইন: ${siteData.contactPhone || '০১৭১১-৮৮৯৯০০'}` : `Hotline: ${siteData.contactPhone || '+880 1711-889900'}`)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl overflow-hidden text-amber-300 flex items-center justify-center font-black text-sm shadow-xl relative shrink-0 border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                {Boolean(siteData.logoImage && siteData.logoImage.trim()) ? (
                  <img src={siteData.logoImage} alt={siteName} className="w-full h-full object-cover" />
                ) : (
                  <span>{siteData.logoLetter || siteName.charAt(0)}</span>
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
                    value: siteData.logoImage || '',
                  }}
                />
              </div>
              <span className="text-2xl font-black tracking-tighter inline-flex items-baseline gap-1">
                <span className="text-amber-400 font-black drop-shadow-xs">
                  {siteName.toUpperCase().endsWith('BD') ? siteName.substring(0, siteName.length - 2).trim() : siteName}
                </span>
                {siteName.toUpperCase().endsWith('BD') && (
                  <span className="text-emerald-400 text-3xl font-black ml-0.5" style={{ color: theme.accent || '#34d399' }}>
                    BD
                  </span>
                )}
              </span>
            </div>
            {(Boolean(siteData.footerTextBn && siteData.footerTextBn.trim()) || Boolean(siteData.footerTextEn && siteData.footerTextEn.trim())) && (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-neutral-400 max-w-md text-sm leading-relaxed font-medium">
                    <InlineEditable
                      target={{ 
                        id: 'tagline-text', 
                        field: 'footerText', 
                        type: 'textarea', 
                        title: 'ফুটার ট্যাগলাইন ও বিবরণ এডিট', 
                        label: 'ট্যাগলাইন', 
                        value: siteData.footerTextBn || siteData.footerTextEn || '', 
                        adminTabShortcut: 'settings_header_footer' 
                      }}
                      multiline
                    >
                      {siteData.footerTextBn || siteData.footerTextEn}
                    </InlineEditable>
                  </p>
                  <EditTrigger 
                    target={{ 
                      id: 'tagline', 
                      field: 'footerText', 
                      type: 'textarea', 
                      title: 'ফুটার ট্যাগলাইন ও বিবরণ এডিট', 
                      label: 'ট্যাগলাইন', 
                      value: siteData.footerTextBn || siteData.footerTextEn || '', 
                      adminTabShortcut: 'settings_header_footer' 
                    }} 
                  />
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-600 to-amber-400 rounded-full" />
              </>
            )}
          </div>

          <div className="md:col-span-3 space-y-5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                {isBn ? 'গুরুত্বপূর্ণ লিংক' : 'Navigation'}
              </h4>
              <EditTrigger 
                target={{ 
                  id: 'footerNav', 
                  field: 'navItems', 
                  type: 'text', 
                  title: 'ফুটার মেনু লিংক পরিবর্তন করুন', 
                  label: 'মেনু এডিট', 
                  value: 'হেডার ও ফুটার সেটিংস থেকে মেনু লিংক সাজান', 
                  adminTabShortcut: 'settings_header_footer' 
                }} 
                variant="icon-only" 
                className="!w-5 !h-5"
              />
            </div>
            <div className="flex flex-col space-y-3 text-xs font-bold">
              {siteData.navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="hover:text-amber-400 transition-all hover:translate-x-1"
                >
                  {isBn ? item.labelBn : item.labelEn}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                {isBn ? 'যোগাযোগ' : 'Get In Touch'}
              </h4>
              <EditTrigger 
                target={{ 
                  id: 'footerContact', 
                  field: 'contactPhone', 
                  type: 'text', 
                  title: 'ফুটার যোগাযোগ তথ্য এডিট', 
                  label: 'যোগাযোগ', 
                  value: siteData.contactPhone, 
                  adminTabShortcut: 'settings_general' 
                }} 
                variant="icon-only" 
                className="!w-5 !h-5"
              />
            </div>
            <div className="space-y-4 text-xs text-neutral-400 font-medium">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-white tracking-wider">{siteData.contactPhone}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>{siteData.contactEmail}</span>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="leading-relaxed">{isBn ? siteData.contactAddressBn : siteData.contactAddressEn}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span>{isBn ? siteData.footerTextBn : siteData.footerTextEn}</span>
            <EditTrigger 
              target={{ 
                id: 'footerCopy', 
                field: 'footerTextBn', 
                type: 'text', 
                title: 'কপিরাইট বিবরণ এডিট', 
                label: 'কপিরাইট', 
                value: isBn ? siteData.footerTextBn : siteData.footerTextEn, 
                adminTabShortcut: 'settings_header_footer' 
              }} 
              variant="icon-only" 
              className="!w-5 !h-5"
            />
          </div>
          <div onClick={handleFooterTap} className="font-mono tabular-nums cursor-pointer select-none bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-colors" title="Secret Access">
            &copy; {new Date().getFullYear()} {siteName} &bull; BUILT FOR EXCELLENCE
          </div>
        </div>
      </div>
    </footer>
  );
};
