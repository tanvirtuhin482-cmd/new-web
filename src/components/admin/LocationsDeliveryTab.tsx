import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  Navigation,
  Sparkles,
  X,
  Save,
  RotateCcw,
  Sliders,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { StoreSettings, CustomLocationItem, LocationType } from '../../types/admin';
import { BD_DISTRICTS, BD_ALL_UPAZILAS_THANAS, DEFAULT_CUSTOM_LOCATIONS, isInsideDhakaMetro } from '../../utils/bdAddressParser';

interface LocationsDeliveryTabProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const LocationsDeliveryTab: React.FC<LocationsDeliveryTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomLocationItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(100);

  // Form State
  const [formData, setFormData] = useState<{
    nameBn: string;
    nameEn: string;
    type: LocationType;
    division: string;
    district: string;
    deliveryFee: string;
    notes: string;
    isSubCity: boolean;
  }>({
    nameBn: '',
    nameEn: '',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'ঢাকা',
    deliveryFee: '100',
    notes: '',
    isSubCity: true,
  });

  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const customLocations: CustomLocationItem[] = useMemo(() => {
    if (settings.customLocations && settings.customLocations.length > 0) {
      return settings.customLocations;
    }
    return DEFAULT_CUSTOM_LOCATIONS;
  }, [settings.customLocations]);

  // Combined list for search and display
  const allDisplayItems = useMemo(() => {
    const list: {
      id: string;
      nameBn: string;
      nameEn?: string;
      type: LocationType;
      division: string;
      district: string;
      deliveryFee?: number;
      isCustom: boolean;
      isSubCity?: boolean;
      notes?: string;
    }[] = [];

    // 1. Add Custom locations first
    customLocations.forEach((c) => {
      list.push({
        id: c.id,
        nameBn: c.nameBn,
        nameEn: c.nameEn,
        type: c.type,
        division: c.division,
        district: c.district,
        deliveryFee: c.deliveryFee,
        isCustom: true,
        isSubCity: c.isSubCity,
        notes: c.notes,
      });
    });

    const customNames = new Set(customLocations.map((c) => c.nameBn.trim()));

    // 2. Add System Default 64 Districts
    BD_DISTRICTS.forEach((d, idx) => {
      if (!customNames.has(d.bn.trim())) {
        list.push({
          id: `sys-district-${idx}`,
          nameBn: d.bn,
          nameEn: d.en ? d.en[0] : '',
          type: 'district',
          division: d.division,
          district: d.bn,
          deliveryFee: d.bn === 'ঢাকা' ? settings.deliveryFeeDhaka : settings.deliveryFeeOutside,
          isCustom: false,
          isSubCity: false,
        });
      }
    });

    // 3. Add System Default Thanas/Upazilas (avoid duplicates with custom)
    BD_ALL_UPAZILAS_THANAS.forEach((t, idx) => {
      if (!customNames.has(t.bn.trim())) {
        const isMetro = isInsideDhakaMetro({ thana: t.bn, district: t.district, division: t.division });
        list.push({
          id: `sys-upazila-${idx}`,
          nameBn: t.bn,
          nameEn: t.en ? t.en[0] : '',
          type: 'upazila',
          division: t.division,
          district: t.district,
          deliveryFee: isMetro ? settings.deliveryFeeDhaka : settings.deliveryFeeOutside,
          isCustom: false,
          isSubCity: false,
        });
      }
    });

    return list;
  }, [customLocations, settings.deliveryFeeDhaka, settings.deliveryFeeOutside]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return allDisplayItems.filter((item) => {
      // Division filter
      if (selectedDivisionFilter !== 'all' && item.division !== selectedDivisionFilter) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter === 'custom') {
        if (!item.isCustom) return false;
      } else if (selectedTypeFilter === 'sub_city') {
        if (!item.isSubCity && item.type !== 'sub_city') return false;
      } else if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchBn = item.nameBn.toLowerCase().includes(q);
        const matchEn = (item.nameEn || '').toLowerCase().includes(q);
        const matchDist = item.district.toLowerCase().includes(q);
        const matchDiv = item.division.toLowerCase().includes(q);
        if (!matchBn && !matchEn && !matchDist && !matchDiv) {
          return false;
        }
      }

      return true;
    });
  }, [allDisplayItems, selectedDivisionFilter, selectedTypeFilter, searchQuery]);

  // Open modal for new item
  const handleOpenAddModal = (preset?: Partial<CustomLocationItem>) => {
    setEditingItem(null);
    setFormError('');
    setFormData({
      nameBn: preset?.nameBn || '',
      nameEn: preset?.nameEn || '',
      type: preset?.type || 'sub_city',
      division: preset?.division || 'ঢাকা',
      district: preset?.district || 'ঢাকা',
      deliveryFee: preset?.deliveryFee !== undefined ? String(preset.deliveryFee) : '100',
      notes: preset?.notes || '',
      isSubCity: preset?.isSubCity ?? true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing custom item
  const handleOpenEditModal = (item: CustomLocationItem) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      nameBn: item.nameBn,
      nameEn: item.nameEn || '',
      type: item.type,
      division: item.division,
      district: item.district,
      deliveryFee: item.deliveryFee !== undefined ? String(item.deliveryFee) : '',
      notes: item.notes || '',
      isSubCity: item.isSubCity ?? false,
    });
    setIsModalOpen(true);
  };

  // Save / Update Custom Location
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn.trim()) {
      setFormError('অনুগ্রহ করে লোকেশন বা থানার নাম লিখুন।');
      return;
    }
    if (!formData.district.trim()) {
      setFormError('অনুগ্রহ করে জেলা নির্বাচন বা লিখুন।');
      return;
    }

    const feeNum = formData.deliveryFee.trim() !== '' ? Number(formData.deliveryFee) : undefined;
    if (feeNum !== undefined && (isNaN(feeNum) || feeNum < 0)) {
      setFormError('ডেলিভারি চার্জ সঠিক সংখ্যা হতে হবে।');
      return;
    }

    let updatedList = [...customLocations];

    if (editingItem) {
      // Edit
      updatedList = updatedList.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              nameBn: formData.nameBn.trim(),
              nameEn: formData.nameEn.trim() || undefined,
              type: formData.type,
              division: formData.division,
              district: formData.district.trim(),
              deliveryFee: feeNum,
              notes: formData.notes.trim() || undefined,
              isSubCity: formData.isSubCity,
            }
          : item
      );
      showToast(`'${formData.nameBn.trim()}' সফলভাবে আপডেট করা হয়েছে।`);
    } else {
      // Add new
      const newItem: CustomLocationItem = {
        id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        nameBn: formData.nameBn.trim(),
        nameEn: formData.nameEn.trim() || undefined,
        type: formData.type,
        division: formData.division,
        district: formData.district.trim(),
        deliveryFee: feeNum,
        notes: formData.notes.trim() || undefined,
        isSubCity: formData.isSubCity,
        createdAt: new Date().toISOString(),
      };
      updatedList.unshift(newItem);
      showToast(`নতুন লোকেশন '${formData.nameBn.trim()}' যোগ করা হয়েছে।`);
    }

    onUpdateSettings({
      ...settings,
      customLocations: updatedList,
    });

    setIsModalOpen(false);
  };

  // Delete Custom Location
  const handleDeleteCustomLocation = (id: string, name: string) => {
    if (window.confirm(`আপনি কি '${name}' লোকেশনটি মুছে ফেলতে চান?`)) {
      const updated = customLocations.filter((item) => item.id !== id);
      onUpdateSettings({
        ...settings,
        customLocations: updated,
      });
      showToast(`'${name}' মুছে ফেলা হয়েছে।`);
    }
  };

  // Fast 1-click Preset Adders for Dhaka Sub-Cities
  const handleAddDhakaSubCityPreset = (nameBn: string, nameEn: string, district: string, fee = 100) => {
    const exists = customLocations.some((c) => c.nameBn === nameBn);
    if (exists) {
      showToast(`'${nameBn}' ইতিমধ্যে তালিকায় আছে।`);
      return;
    }
    const newItem: CustomLocationItem = {
      id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nameBn,
      nameEn,
      type: 'sub_city',
      division: 'ঢাকা',
      district,
      deliveryFee: fee,
      isSubCity: true,
      notes: 'ঢাকা সাব-সিটি ডেলিভারি জোন',
      createdAt: new Date().toISOString(),
    };
    onUpdateSettings({
      ...settings,
      customLocations: [newItem, ...customLocations],
    });
    showToast(`'${nameBn}' সাব-সিটি (চার্জ ৳${fee}) যোগ হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0f5132] text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-br from-[#0f5132] via-[#145d3b] to-[#1c7a4f] text-white p-6 rounded-3xl shadow-md border border-emerald-700/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-black backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5" />
              <span>বাংলাদেশ জিও ও ডেলিভারি চার্জ কন্ট্রোল</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              জেলা, উপজেলা, সাব-সিটি ও এরিয়া ম্যানেজার
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              বাংলাদেশের সকল ৬৪টি জেলা ও ৪৯৫+ উপজেলার পাশাপাশি আপনার ব্যবসার সুবিধার্থে যেকোনো নতুন জেলা, থানা বা সাব-সিটি (যেমন: সাভার, কেরানীগঞ্জ, গাজীপুর ইত্যাদি) যোগ করুন এবং নির্দিষ্ট ডেলিভারি চার্জ সেট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenAddModal()}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>নতুন লোকেশন / সাব-সিটি যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-bold block mb-1">মোট জেলা</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono">৬৪</span>
              <span className="text-[10px] text-amber-300 font-bold">সকল অন্তর্ভুক্ত</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-bold block mb-1">উপজেলা / থানা</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono">৪৯৫+</span>
              <span className="text-[10px] text-amber-300 font-bold">অটো-ম্যাপড</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-bold block mb-1">কাস্টম সাব-সিটি / এরিয়া</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                {customLocations.length}
              </span>
              <span className="text-[10px] text-white/80 font-bold">এডমিন কর্তৃক যুক্ত</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-200 font-bold block mb-1">ডিফল্ট ডেলিভারি চার্জ</span>
            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              <span className="text-amber-300">ঢাকা: ৳{settings.deliveryFeeDhaka ?? 70}</span>
              <span className="text-white/60">|</span>
              <span className="text-emerald-200">বাইরে: ৳{settings.deliveryFeeOutside ?? 130}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Dhaka Sub-City Presets Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e5e3d8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <h3 className="text-xs font-extrabold text-[#1a2e22]">
              জনপ্রিয় ঢাকা সাব-সিটি ১-ক্লিকে যোগ করুন (স্পেশাল ৳১০০ চার্জসহ):
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
            ক্লিক করলেই স্বয়ংক্রিয়ভাবে তালিকাভুক্ত হবে
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { bn: 'সাভার', en: 'Savar', dist: 'ঢাকা', fee: 100 },
            { bn: 'কেরানীগঞ্জ', en: 'Keraniganj', dist: 'ঢাকা', fee: 100 },
            { bn: 'টঙ্গী', en: 'Tongi', dist: 'গাজীপুর', fee: 100 },
            { bn: 'গাজীপুর সদর', en: 'Gazipur Sadar', dist: 'গাজীপুর', fee: 100 },
            { bn: 'কালিয়াকৈর', en: 'Kaliakair', dist: 'গাজীপুর', fee: 100 },
            { bn: 'ধামরাই', en: 'Dhamrai', dist: 'ঢাকা', fee: 100 },
            { bn: 'সোনারগাঁও', en: 'Sonargaon', dist: 'নারায়ণগঞ্জ', fee: 100 },
            { bn: 'আশুলিয়া', en: 'Ashulia', dist: 'ঢাকা', fee: 100 },
            { bn: 'রূপগঞ্জ', en: 'Rupganj', dist: 'নারায়ণগঞ্জ', fee: 100 },
          ].map((preset) => {
            const isAlreadyAdded = customLocations.some((c) => c.nameBn === preset.bn);
            return (
              <button
                key={preset.bn}
                disabled={isAlreadyAdded}
                onClick={() => handleAddDhakaSubCityPreset(preset.bn, preset.en, preset.dist, preset.fee)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAlreadyAdded
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 opacity-80 cursor-default'
                    : 'bg-[#faf9f5] hover:bg-emerald-50 text-[#1a2e22] hover:text-[#0f5132] border border-[#d6d4c8] hover:border-emerald-300 active:scale-95 shadow-xs'
                }`}
              >
                <span>{preset.bn}</span>
                <span className="font-mono text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                  ৳{preset.fee}
                </span>
                {isAlreadyAdded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e5e3d8] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="যেকোনো জেলা, উপজেলা, সাব-সিটি বা এলাকার নাম লিখে খুঁজুন (বাংলা বা ইংরেজি)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] text-xs sm:text-sm text-[#1a2e22] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedDivisionFilter}
              onChange={(e) => setSelectedDivisionFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] cursor-pointer"
            >
              <option value="all">সকল বিভাগ (৮টি)</option>
              <option value="ঢাকা">ঢাকা বিভাগ</option>
              <option value="চট্টগ্রাম">চট্টগ্রাম বিভাগ</option>
              <option value="রাজশাহী">রাজশাহী বিভাগ</option>
              <option value="খুলনা">খুলনা বিভাগ</option>
              <option value="বরিশাল">বরিশাল বিভাগ</option>
              <option value="সিলেট">সিলেট বিভাগ</option>
              <option value="রংপুর">রংপুর বিভাগ</option>
              <option value="ময়মনসিংহ">ময়মনসিংহ বিভাগ</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] cursor-pointer"
            >
              <option value="all">সকল লোকেশন</option>
              <option value="custom">কাস্টম যোগ করা ({customLocations.length})</option>
              <option value="sub_city">সাব-সিটি (Sub-City)</option>
              <option value="upazila">উপজেলা / থানা</option>
              <option value="district">জেলা</option>
            </select>
          </div>
        </div>

        {/* Counter & Clear */}
        <div className="flex items-center justify-between text-xs text-neutral-600 font-medium pt-1">
          <span>
            প্রদর্শিত হচ্ছে: <strong className="text-[#0f5132]">{filteredItems.length}</strong> টি লোকেশন
            {customLocations.length > 0 && ` (কাস্টম সংরক্ষিত: ${customLocations.length} টি)`}
          </span>
          {(searchQuery || selectedDivisionFilter !== 'all' || selectedTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDivisionFilter('all');
                setSelectedTypeFilter('all');
              }}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-2xl border border-[#e5e3d8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#f4f2ea] border-b border-[#e5e3d8] text-[#33463b] font-black uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">লোকেশন / থানার নাম</th>
                <th className="py-3.5 px-4">টাইপ</th>
                <th className="py-3.5 px-4">জেলা</th>
                <th className="py-3.5 px-4">বিভাগ</th>
                <th className="py-3.5 px-4">ডেলিভারি চার্জ</th>
                <th className="py-3.5 px-4 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
                    <p className="font-bold text-sm text-neutral-600">কোনো লোকেশন খুঁজে পাওয়া যায়নি</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      ভিন্ন কোনো নাম লিখে খুঁজুন অথবা নতুন লোকেশন হিসেবে যোগ করুন।
                    </p>
                    <button
                      onClick={() => handleOpenAddModal({ nameBn: searchQuery })}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#0f5132] hover:bg-[#145d3b] text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>'{searchQuery || 'নতুন'}' লোকেশন যোগ করুন</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.slice(0, visibleCount).map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#faf9f5] transition-colors ${
                        item.isCustom ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1a2e22]">{item.nameBn}</span>
                          {item.nameEn && (
                            <span className="text-[11px] text-neutral-400 font-mono">
                              ({item.nameEn})
                            </span>
                          )}
                          {item.isCustom && (
                            <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md">
                              কাস্টম
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">{item.notes}</p>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        {item.isSubCity || item.type === 'sub_city' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg">
                            <Building className="w-3 h-3 text-amber-700" />
                            <span>সাব-সিটি (Sub-City)</span>
                          </span>
                        ) : item.type === 'district' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                            <Navigation className="w-3 h-3 text-blue-700" />
                            <span>জেলা</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            <span>উপজেলা / থানা</span>
                          </span>
                        )}
                      </td>

                      {/* District */}
                      <td className="py-3.5 px-4 font-medium text-neutral-800">
                        {item.district}
                      </td>

                      {/* Division */}
                      <td className="py-3.5 px-4 font-medium text-neutral-600">
                        {item.division}
                      </td>

                      {/* Delivery Charge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-[#0f5132]">
                            ৳{item.deliveryFee !== undefined ? item.deliveryFee : (item.division === 'ঢাকা' ? settings.deliveryFeeDhaka : settings.deliveryFeeOutside)}
                          </span>
                          {item.deliveryFee !== undefined && item.isCustom && (
                            <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                              ফিক্সড চার্জ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.isCustom ? (
                            <>
                              <button
                                onClick={() => {
                                  const customMatch = customLocations.find((c) => c.id === item.id);
                                  if (customMatch) handleOpenEditModal(customMatch);
                                }}
                                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                                title="সম্পাদনা করুন"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomLocation(item.id, item.nameBn)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpenAddModal({
                                  nameBn: item.nameBn,
                                  nameEn: item.nameEn,
                                  type: 'sub_city',
                                  division: item.division,
                                  district: item.district,
                                  deliveryFee: item.division === 'ঢাকা' ? 100 : item.deliveryFee,
                                  isSubCity: true,
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#faf9f5] hover:bg-[#0f5132] text-[#33463b] hover:text-white border border-[#d6d4c8] hover:border-[#0f5132] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              title="কাস্টম ডেলিভারি চার্জ বা সাব-সিটি হিসেবে সেট করুন"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>চার্জ কাস্টমাইজ</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredItems.length > visibleCount && (
          <div className="p-4 bg-[#faf9f5] border-t border-[#e5e3d8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600 font-medium">
            <span>
              মোট <strong className="text-[#0f5132] font-mono">{filteredItems.length}</strong> টির মধ্যে <strong className="text-[#0f5132] font-mono">{Math.min(visibleCount, filteredItems.length)}</strong> টি প্রদর্শিত হচ্ছে।
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 100)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-[#1a2e22] border border-[#d6d4c8] font-bold shadow-2xs transition-all cursor-pointer"
              >
                আরো ১০০টি দেখুন (+১০০)
              </button>
              <button
                type="button"
                onClick={() => setVisibleCount(filteredItems.length)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0f5132] hover:bg-[#145d3b] text-white font-bold shadow-2xs transition-all cursor-pointer"
              >
                সকল {filteredItems.length}টি দেখুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5e3d8] space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e3d8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1a2e22]">
                    {editingItem ? 'লোকেশন তথ্য সম্পাদনা' : 'নতুন লোকেশন / সাব-সিটি যোগ'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    বিভাগ, জেলা, থানা/উপজেলা ও ডেলিভারি চার্জ নির্ধারণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveLocation} className="space-y-4">
              {/* Name Bn & En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">
                    লোকেশন / থানার নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="যেমন: সাভার, কালিয়াকৈর, রূপগঞ্জ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">
                    ইংরেজি নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Savar, Kaliakair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>
              </div>

              {/* Division & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">বিভাগ *</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] cursor-pointer"
                  >
                    <option value="ঢাকা">ঢাকা বিভাগ</option>
                    <option value="চট্টগ্রাম">চট্টগ্রাম বিভাগ</option>
                    <option value="রাজশাহী">রাজশাহী বিভাগ</option>
                    <option value="খুলনা">খুলনা বিভাগ</option>
                    <option value="বরিশাল">বরিশাল বিভাগ</option>
                    <option value="সিলেট">সিলেট বিভাগ</option>
                    <option value="রংপুর">রংপুর বিভাগ</option>
                    <option value="ময়মনসিংহ">ময়মনসিংহ বিভাগ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">জেলা *</label>
                  <input
                    type="text"
                    required
                    list="modal-districts-list"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="জেলার নাম লিখুন বা সিলেক্ট করুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                  <datalist id="modal-districts-list">
                    {BD_DISTRICTS.map((d) => (
                      <option key={d.bn} value={d.bn} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Location Type & Delivery Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">
                    লোকেশন ক্যাটাগরি / টাইপ
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value as LocationType;
                      setFormData({
                        ...formData,
                        type: newType,
                        isSubCity: newType === 'sub_city',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] cursor-pointer"
                  >
                    <option value="sub_city">সাব-সিটি (Sub-City)</option>
                    <option value="upazila">উপজেলা / থানা</option>
                    <option value="district">জেলা (District)</option>
                    <option value="area">বিশেষ এলাকা / মহল্লা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#33463b] mb-1">
                    নির্দিষ্ট ডেলিভারি চার্জ (টাকা)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-sm">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.deliveryFee}
                      onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                      placeholder="যেমন: 100"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    খালি রাখলে বিভাগের সাধারণ চার্জ (৳{formData.division === 'ঢাকা' ? (settings.deliveryFeeDhaka ?? 70) : (settings.deliveryFeeOutside ?? 130)}) কার্যকর হবে
                  </span>
                </div>
              </div>

              {/* Sub-City Toggle Checkbox */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1a2e22] block">
                    সাব-সিটি (Sub-City) হিসেবে চিহ্নিত করুন
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    ঢাকা বা বিভাগীয় শহরের উপকণ্ঠের এলাকা (যেমন: সাভার, টঙ্গী, কেরানীগঞ্জ)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isSubCity}
                  onChange={(e) => setFormData({ ...formData, isSubCity: e.target.checked })}
                  className="w-5 h-5 rounded text-[#0f5132] focus:ring-[#0f5132] cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#33463b] mb-1">
                  নোট বা ডেলিভারি নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="যেমন: ২৪ ঘণ্টার মধ্যে ডেলিভারি, স্পেশাল সাব-সিটি রেট"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6d4c8] bg-[#faf9f5] focus:bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e3d8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0f5132] hover:bg-[#145d3b] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'পরিবর্তন সংরক্ষণ করুন' : 'লোকেশন সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
