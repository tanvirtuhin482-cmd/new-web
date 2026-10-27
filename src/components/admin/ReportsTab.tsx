import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminOrder, StoreSettings } from '../../types/admin';
import { ProductItem } from '../../types/website';
import { parseOrderDate } from '../../utils/date';
import {
  TrendingUp,
  Calendar,
  ShoppingBag,
  CircleDollarSign,
  Award,
  Download,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  Truck,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

interface ReportsTabProps {
  orders: AdminOrder[];
  products: ProductItem[];
  settings: StoreSettings;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ orders, products, settings }) => {
  const [timeRange, setTimeRange] = useState<'30days' | '12months' | 'all'>('30days');
  const [metricView, setMetricView] = useState<'both' | 'revenue' | 'orders'>('both');

  // Compute Daily & Monthly Sales Trends
  const { dailyData, monthlyData, summary } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyMap = new Map<string, { count: number; rev: number }>();
    const monthlyMap = new Map<string, { count: number; rev: number }>();

    let totalRev = 0;
    let totalOrd = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    const paymentMethodsMap: { cod: number; bkash: number; nagad: number; admin_paid: number } = { cod: 0, bkash: 0, nagad: 0, admin_paid: 0 };
    const deliveryAreaMap = { dhaka: 0, outside: 0 };
    const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    orders.forEach((ord) => {
      const d = parseOrderDate(ord.createdAt);
      const isCancelled = ord.status === 'cancelled';
      const orderTotal = Number(ord.total) || 0;

      if (!isCancelled) {
        totalRev += orderTotal;
        totalOrd += 1;
      }

      if (ord.status === 'delivered') deliveredCount += 1;
      if (isCancelled) cancelledCount += 1;

      // Payment Method stats
      const pm = (ord.paymentMethod || 'cod') as keyof typeof paymentMethodsMap;
      if (paymentMethodsMap[pm] !== undefined) {
        paymentMethodsMap[pm] += 1;
      } else {
        paymentMethodsMap.cod += 1;
      }

      // Delivery Area stats
      const da = ord.deliveryArea || 'dhaka';
      if (deliveryAreaMap[da] !== undefined) {
        deliveryAreaMap[da] += 1;
      }

      // Product sales stats from order items
      if (ord.items && Array.isArray(ord.items)) {
        ord.items.forEach((item) => {
          const pName = item.productName || 'Unknown Product';
          const qty = Number(item.quantity) || 1;
          const itemRev = qty * (Number(item.price) || 0);
          const existing = productSalesMap.get(pName) || { name: pName, quantity: 0, revenue: 0 };
          existing.quantity += qty;
          existing.revenue += itemRev;
          productSalesMap.set(pName, existing);
        });
      }

      if (d && !isNaN(d.getTime())) {
        // Daily key YYYY-MM-DD
        const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dayPrev = dailyMap.get(dayKey) || { count: 0, rev: 0 };
        dayPrev.count += 1;
        if (!isCancelled) dayPrev.rev += orderTotal;
        dailyMap.set(dayKey, dayPrev);

        // Monthly key YYYY-MM
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthPrev = monthlyMap.get(monthKey) || { count: 0, rev: 0 };
        monthPrev.count += 1;
        if (!isCancelled) monthPrev.rev += orderTotal;
        monthlyMap.set(monthKey, monthPrev);
      }
    });

    // Build Last 30 Days series
    const dailySeries = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 29; i >= 0; i--) {
      const target = new Date(today);
      target.setDate(today.getDate() - i);
      const key = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
      const dayNum = String(target.getDate()).padStart(2, '0');
      const monthStr = monthNames[target.getMonth()];

      const stats = dailyMap.get(key) || { count: 0, rev: 0 };
      dailySeries.push({
        dateKey: key,
        label: `${dayNum} ${monthStr}`,
        ordersCount: stats.count,
        revenue: stats.rev,
      });
    }

    // Build Last 12 Months series
    const monthlySeries = [];
    for (let i = 11; i >= 0; i--) {
      const target = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`;
      const monthStr = monthNames[target.getMonth()];
      const yearStr = String(target.getFullYear()).slice(-2);

      const stats = monthlyMap.get(key) || { count: 0, rev: 0 };
      monthlySeries.push({
        dateKey: key,
        label: `${monthStr} '${yearStr}`,
        ordersCount: stats.count,
        revenue: stats.rev,
      });
    }

    // Top selling products sorted by quantity sold
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    const aov = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;

    return {
      dailyData: dailySeries,
      monthlyData: monthlySeries,
      summary: {
        totalRevenue: totalRev,
        totalOrders: totalOrd,
        deliveredOrders: deliveredCount,
        cancelledOrders: cancelledCount,
        averageOrderValue: aov,
        paymentMethods: paymentMethodsMap,
        deliveryAreas: deliveryAreaMap,
        topProducts,
      },
    };
  }, [orders]);

  const activeChartData = timeRange === '12months' ? monthlyData : dailyData;

  const paymentPieData = [
    { name: 'Cash on Delivery', value: summary.paymentMethods.cod, color: '#059669' },
    { name: 'bKash', value: summary.paymentMethods.bkash, color: '#e11d48' },
    { name: 'Nagad', value: summary.paymentMethods.nagad, color: '#f59e0b' },
    { name: 'Admin Paid (অ্যাডমিন পেইড)', value: summary.paymentMethods.admin_paid, color: '#0284c7' },
  ].filter((item) => item.value > 0);

  const deliveryPieData = [
    { name: 'ঢাকার ভেতরে (Inside Dhaka)', value: summary.deliveryAreas.dhaka, color: '#0284c7' },
    { name: 'ঢাকার বাইরে (Outside Dhaka)', value: summary.deliveryAreas.outside, color: '#7c3aed' },
  ].filter((item) => item.value > 0);

  const handleExportCSV = () => {
    const headers = ['Date', 'Orders Count', 'Revenue (BDT)'];
    const rows = activeChartData.map((d) => [d.label, d.ordersCount, d.revenue]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>সেলস রিপোর্ট ও অ্যানালিটিক্স (Sales Reports & Analytics)</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
            অর্ডার এবং বিক্রয় ডেটার উপর ভিত্তি করে সম্পূর্ণ ভিজ্যুয়াল গ্রাফ ও ট্রেন্ড বিশ্লেষণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '30days' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              শেষ ৩০ দিন
            </button>
            <button
              onClick={() => setTimeRange('12months')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '12months' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ১২ মাস
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>সিএসভি এক্সপোর্ট (Export CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-3xl shadow-lg border border-emerald-700/50 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">মোট রেভিনিউ (Total Revenue)</p>
            <h3 className="text-2xl sm:text-3xl font-black font-mono mt-1 text-white">
              ৳{summary.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>সফল অর্ডার থেকে অর্জিত</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 text-xl font-bold">
            <CircleDollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs border border-neutral-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">মোট অর্ডার (Total Orders)</p>
            <h3 className="text-2xl sm:text-3xl font-black font-mono mt-1 text-neutral-900">
              {summary.totalOrders}টি
            </h3>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{summary.deliveredOrders} টি সফল ডেলিভারি</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs border border-neutral-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">গড় অর্ডার মূল্য (AOV)</p>
            <h3 className="text-2xl sm:text-3xl font-black font-mono mt-1 text-neutral-900">
              ৳{summary.averageOrderValue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1 font-medium">প্রত্য়েক অর্ডারের গড় মূল্য</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs border border-neutral-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">বাতিলকৃত অর্ডার</p>
            <h3 className="text-2xl sm:text-3xl font-black font-mono mt-1 text-red-600">
              {summary.cancelledOrders}টি
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1 font-medium">বাতিল বা রিজেক্টেড অর্ডার</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Sales Trend Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-neutral-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-neutral-900">
              {timeRange === '12months' ? 'মাসিক সেলস ও রেভিনিউ ট্রেন্ড (Monthly Sales Trend)' : 'দৈনিক সেলস ও রেভিনিউ ট্রেন্ড (Daily Sales Trend)'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">রেভিনিউ এবং অর্ডার সংখ্যার গ্রাফিক্যাল তুলনা</p>
          </div>

          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setMetricView('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricView === 'both' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-neutral-600'
              }`}
            >
              উভয় মেট্রিক
            </button>
            <button
              onClick={() => setMetricView('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricView === 'revenue' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-neutral-600'
              }`}
            >
              শুধু রেভিনিউ
            </button>
            <button
              onClick={() => setMetricView('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricView === 'orders' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-neutral-600'
              }`}
            >
              শুধু অর্ডার
            </button>
          </div>
        </div>

        <div className="h-[380px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#059669" fontSize={11} tickLine={false} tickFormatter={(val) => `৳${val}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#0284c7" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-neutral-900 text-white p-3.5 rounded-2xl shadow-xl border border-neutral-700 text-xs space-y-2 min-w-[180px]">
                        <p className="font-bold text-amber-300 border-b border-neutral-800 pb-1.5">{label}</p>
                        {(metricView === 'both' || metricView === 'revenue') && (
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-300">রেভিনিউ:</span>
                            <span className="font-mono font-bold text-emerald-400">৳{(data.revenue || 0).toLocaleString()}</span>
                          </div>
                        )}
                        {(metricView === 'both' || metricView === 'orders') && (
                          <div className="flex justify-between gap-4">
                            <span className="text-sky-300">অর্ডার সংখ্যা:</span>
                            <span className="font-mono font-bold text-sky-400">{data.ordersCount}টি</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              {(metricView === 'both' || metricView === 'revenue') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="রেভিনিউ (BDT)"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              )}
              {(metricView === 'both' || metricView === 'orders') && (
                <Bar yAxisId="right" dataKey="ordersCount" name="অর্ডার সংখ্যা" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={24} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Top Products & Payment/Delivery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-xs border border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>সর্বাধিক বিক্রীত পণ্যসমূহ (Top Selling Products)</span>
            </h3>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              Top {summary.topProducts.length}
            </span>
          </div>

          {summary.topProducts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs font-medium">
              কোনো বিক্রির ডেটা পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {summary.topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-emerald-50/50 transition-colors border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs sm:text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-neutral-500 font-medium">বিক্রিত পরিমাণ: <span className="font-bold text-neutral-800">{p.quantity} ইউনিট</span></p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-extrabold text-emerald-800 text-xs sm:text-sm">
                    ৳{p.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods & Delivery Area Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Payment Methods Breakdown */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-neutral-200/80 space-y-4">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>পেমেন্ট মাধ্যমভিত্তিক বিশ্লেষণ (Payment Methods)</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  Cash on Delivery (COD)
                </span>
                <span className="font-mono text-neutral-900">{summary.paymentMethods.cod} টি অর্ডার</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-3 h-3 rounded-full bg-rose-600" />
                  bKash পেমেন্ট
                </span>
                <span className="font-mono text-neutral-900">{summary.paymentMethods.bkash} টি অর্ডার</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  Nagad পেমেন্ট
                </span>
                <span className="font-mono text-neutral-900">{summary.paymentMethods.nagad} টি অর্ডার</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-sky-900">
                  <span className="w-3 h-3 rounded-full bg-sky-600" />
                  Admin Paid (অ্যাডমিন পেইড)
                </span>
                <span className="font-mono text-sky-950">{summary.paymentMethods.admin_paid} টি অর্ডার</span>
              </div>
            </div>
          </div>

          {/* Delivery Area Breakdown */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-neutral-200/80 space-y-4">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>ডেলিভারি এরিয়াভিত্তিক বিশ্লেষণ (Delivery Areas)</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-3 h-3 rounded-full bg-sky-600" />
                  ঢাকার ভেতরে (Inside Dhaka)
                </span>
                <span className="font-mono text-neutral-900">{summary.deliveryAreas.dhaka} টি অর্ডার</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  ঢাকার বাইরে (Outside Dhaka)
                </span>
                <span className="font-mono text-neutral-900">{summary.deliveryAreas.outside} টি অর্ডার</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
