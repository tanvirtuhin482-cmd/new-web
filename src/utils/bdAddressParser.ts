/**
 * Bangladesh Complete Geo-Location & Address Auto-Detection Engine
 * Contains all 8 Divisions, 64 Districts, and complete Upazilas/Thanas of Bangladesh
 */

export interface ParsedAddress {
  division?: string;
  district?: string;
  thana?: string;
  postCode?: string;
  deliveryFee?: number;
  isSubCity?: boolean;
  isInsideDhaka?: boolean;
}

export interface GeoItem {
  bn: string;
  en: string[];
  district: string;
  division: string;
  altBn?: string[];
}

export interface DistrictItem {
  bn: string;
  en: string[];
  division: string;
  altBn?: string[];
}

// 64 Districts of Bangladesh
export const BD_DISTRICTS: DistrictItem[] = [
  // Dhaka Division (13)
  { bn: 'ঢাকা', en: ['dhaka', 'dacca'], division: 'ঢাকা' },
  { bn: 'গাজীপুর', en: ['gazipur', 'gazipoor'], division: 'ঢাকা' },
  { bn: 'নারায়ণগঞ্জ', en: ['narayanganj', 'narayangonj'], division: 'ঢাকা', altBn: ['নারায়ণগঞ্জ'] },
  { bn: 'টাঙ্গাইল', en: ['tangail'], division: 'ঢাকা' },
  { bn: 'নরসিংদী', en: ['narsingdi', 'norshingdi'], division: 'ঢাকা' },
  { bn: 'মুন্সীগঞ্জ', en: ['munshiganj', 'munshigonj'], division: 'ঢাকা', altBn: ['মুন্সিগঞ্জ'] },
  { bn: 'মানিকগঞ্জ', en: ['manikganj', 'manikgonj'], division: 'ঢাকা' },
  { bn: 'ফরিদপুর', en: ['faridpur'], division: 'ঢাকা' },
  { bn: 'মাদারীপুর', en: ['madaripur'], division: 'ঢাকা' },
  { bn: 'গোপালগঞ্জ', en: ['gopalganj', 'gopalgonj'], division: 'ঢাকা' },
  { bn: 'রাজবাড়ী', en: ['rajbari'], division: 'ঢাকা', altBn: ['রাজবাড়ী'] },
  { bn: 'শরীয়তপুর', en: ['shariatpur'], division: 'ঢাকা', altBn: ['শরিয়তপুর', 'শরিয়তপুর'] },
  { bn: 'কিশোরগঞ্জ', en: ['kishoreganj', 'kishorgonj'], division: 'ঢাকা' },

  // Chattogram Division (11)
  { bn: 'চট্টগ্রাম', en: ['chattogram', 'chittagong', 'ctg'], division: 'চট্টগ্রাম', altBn: ['চিটাগং', 'চিটাগাং', 'চট্টলা'] },
  { bn: 'কুমিল্লা', en: ['cumilla', 'comilla'], division: 'চট্টগ্রাম' },
  { bn: 'ফেনী', en: ['feni'], division: 'চট্টগ্রাম' },
  { bn: 'ব্রাহ্মণবাড়িয়া', en: ['brahmanbaria', 'b-baria', 'bbaria'], division: 'চট্টগ্রাম', altBn: ['ব্রাহ্মণবাড়িয়া', 'বি বাড়িয়া', 'বিবাড়িয়া'] },
  { bn: 'নোয়াখালী', en: ['noakhali'], division: 'চট্টগ্রাম', altBn: ['নোয়াখালী'] },
  { bn: 'লক্ষ্মীপুর', en: ['lakshmipur', 'laxmipur'], division: 'চট্টগ্রাম', altBn: ['লক্ষীপুর'] },
  { bn: 'চাঁদপুর', en: ['chandpur'], division: 'চট্টগ্রাম' },
  { bn: 'কক্সবাজার', en: ['coxs bazar', 'coxsbazar', 'cox\'s bazar', 'coxs'], division: 'চট্টগ্রাম' },
  { bn: 'রাঙ্গামাটি', en: ['rangamati'], division: 'চট্টগ্রাম', altBn: ['রাঙামাটি'] },
  { bn: 'খাগড়াছড়ি', en: ['khagrachhari', 'khagrachari'], division: 'চট্টগ্রাম', altBn: ['খাগড়াছড়ি'] },
  { bn: 'বান্দরবান', en: ['bandarban'], division: 'চট্টগ্রাম' },

  // Rajshahi Division (8)
  { bn: 'রাজশাহী', en: ['rajshahi'], division: 'রাজশাহী' },
  { bn: 'বগুড়া', en: ['bogura', 'bogra'], division: 'রাজশাহী', altBn: ['বগুড়া'] },
  { bn: 'পাবনা', en: ['pabna'], division: 'রাজশাহী' },
  { bn: 'সিরাজগঞ্জ', en: ['sirajganj', 'sirajgonj'], division: 'রাজশাহী' },
  { bn: 'নওগাঁ', en: ['naogaon', 'naoga'], division: 'রাজশাহী' },
  { bn: 'নাটোর', en: ['natore'], division: 'রাজশাহী' },
  { bn: 'চাঁপাইনবাবগঞ্জ', en: ['chapainawabganj', 'chapai nawabganj', 'chapai'], division: 'রাজশাহী' },
  { bn: 'জয়পুরহাট', en: ['joypurhat', 'jaipurhat'], division: 'রাজশাহী', altBn: ['জয়পুরহাট'] },

  // Khulna Division (10)
  { bn: 'খুলনা', en: ['khulna'], division: 'খুলনা' },
  { bn: 'যশোর', en: ['jashore', 'jessore'], division: 'খুলনা' },
  { bn: 'কুষ্টিয়া', en: ['kushtia'], division: 'খুলনা', altBn: ['কুষ্টিয়া'] },
  { bn: 'ঝিনাইদহ', en: ['jhenaidah'], division: 'খুলনা' },
  { bn: 'সাতক্ষীরা', en: ['satkhira'], division: 'খুলনা' },
  { bn: 'বাগেরহাট', en: ['bagerhat'], division: 'খুলনা' },
  { bn: 'চুয়াডাঙ্গা', en: ['chuadanga'], division: 'খুলনা', altBn: ['চুয়াডাঙ্গা'] },
  { bn: 'মেহেরপুর', en: ['meherpur'], division: 'খুলনা' },
  { bn: 'নড়াইল', en: ['narail'], division: 'খুলনা', altBn: ['নড়াইল'] },
  { bn: 'মাগুরা', en: ['magura'], division: 'খুলনা' },

  // Barishal Division (6)
  { bn: 'বরিশাল', en: ['barishal', 'barisal'], division: 'বরিশাল' },
  { bn: 'পটুয়াখালী', en: ['patuakhali'], division: 'বরিশাল', altBn: ['পটুয়াখালী'] },
  { bn: 'ভোলা', en: ['bhola'], division: 'বরিশাল' },
  { bn: 'পিরোজপুর', en: ['pirojpur'], division: 'বরিশাল' },
  { bn: 'বরগুনা', en: ['barguna'], division: 'বরিশাল' },
  { bn: 'ঝালকাঠি', en: ['jhalokati', 'jhalakati'], division: 'বরিশাল' },

  // Sylhet Division (4)
  { bn: 'সিলেট', en: ['sylhet'], division: 'সিলেট' },
  { bn: 'মৌলভীবাজার', en: ['moulvibazar', 'moulavibazar'], division: 'সিলেট' },
  { bn: 'হবিগঞ্জ', en: ['habiganj', 'habigonj'], division: 'সিলেট' },
  { bn: 'সুনামগঞ্জ', en: ['sunamganj', 'sunamgonj'], division: 'সিলেট' },

  // Rangpur Division (8)
  { bn: 'রংপুর', en: ['rangpur'], division: 'রংপুর' },
  { bn: 'দিনাজপুর', en: ['dinajpur'], division: 'রংপুর' },
  { bn: 'গাইবান্ধা', en: ['gaibandha'], division: 'রংপুর' },
  { bn: 'কুড়িগ্রাম', en: ['kurigram'], division: 'রংপুর', altBn: ['কুড়িগ্রাম'] },
  { bn: 'নীলফামারী', en: ['nilphamari'], division: 'রংপুর' },
  { bn: 'লালমনিরহাট', en: ['lalmonirhat'], division: 'রংপুর' },
  { bn: 'ঠাকুরগাঁও', en: ['thakurgaon'], division: 'রংপুর' },
  { bn: 'পঞ্চগড়', en: ['panchagarh'], division: 'রংপুর', altBn: ['পঞ্চগড়'] },

  // Mymensingh Division (4)
  { bn: 'ময়মনসিংহ', en: ['mymensingh'], division: 'ময়মনসিংহ', altBn: ['ময়মনসিংহ'] },
  { bn: 'জামালপুর', en: ['jamalpur'], division: 'ময়মনসিংহ' },
  { bn: 'শেরপুর', en: ['sherpur'], division: 'ময়মনসিংহ' },
  { bn: 'নেত্রকোণা', en: ['netrokona', 'netrakona'], division: 'ময়মনসিংহ', altBn: ['নেত্রকোনা'] },
];

// ==================== DHAKA METROPOLITAN CITY (INSIDE DHAKA - 49 THANAS) ====================
// Strictly defined: ONLY these 49 thanas are Inside Dhaka (৳70 delivery charge).
// ALL other thanas/areas/districts in Bangladesh are Outside Dhaka (৳130 delivery charge).

export const DHAKA_METRO_CITY_THANAS: GeoItem[] = [
  { bn: 'আদাবর', en: ['adabor', 'adabar', 'shekhertek'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['আদাবর', 'শেখেরটেক', 'বায়তুল আমান', 'বায়তুল আমান', 'মনসুরাবাদ'] },
  { bn: 'বিমানবন্দর', en: ['biman bandar', 'bimanbandar', 'airport', 'dhaka airport'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['এয়ারপোর্ট', 'এয়ারপোর্ট', 'বিমান বন্দর', 'হযরত শাহজালাল'] },
  { bn: 'বাড্ডা', en: ['badda', 'bada'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['বাড্ডা', 'উত্তর বাড্ডা', 'মধ্য বাড্ডা', 'দক্ষিণ বাড্ডা', 'পূর্ব বাড্ডা', 'মেরুল বাড্ডা', 'মেরুল'] },
  { bn: 'বনানী', en: ['banani', 'mohakhali', 'kakoli'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['বনানী', 'মহাখালী', 'কাকলী', 'বনানী ডিওএইচএস', 'মহাখালী ডিওএইচএস', 'ওয়ারলেসগেট', 'ওয়ারলেসগেট'] },
  { bn: 'বংশাল', en: ['bangshal', 'bongshal'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['বংশাল', 'বংসাল', 'নাজিরাবাজার', 'আলু বাজার'] },
  { bn: 'ভাষানটেক', en: ['bhasantek', 'bhashantek', 'vasantek'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ভাষানটেক', 'ভাসানটেক', 'ভাষাণটেক', 'ভাসান টেক'] },
  { bn: 'ক্যান্টনমেন্ট', en: ['cantonment', 'dhaka cantonment', 'cantonment dhaka'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ক্যান্টনমেন্ট', 'ঢাকা ক্যান্টনমেন্ট', 'ক্যান্টমেন্ট', 'সেনানিবাস'] },
  { bn: 'চকবাজার', en: ['chawkbazar', 'chokbazar', 'chaukbazar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['চকবাজার', 'চক বাজার', 'চক সার্কুলার'] },
  { bn: 'দারুস সালাম', en: ['darus salam', 'darussalam', 'gabtoli'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['দারুস সালাম', 'দারুসসালাম', 'গাবতলী', 'গাবতলি', 'টেকনিক্যাল', 'টোলারবাগ'] },
  { bn: 'দক্ষিণখান', en: ['dakshinkhan', 'dakshin khan', 'dokkhinkhan'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['দক্ষিণখান', 'দক্ষিণ খান', 'দক্ষিনখান', 'দক্ষিন খান', 'গাওয়াইর', 'ফায়দাবাদ'] },
  { bn: 'ডেমরা', en: ['demra'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ডেমরা', 'সারুলিয়া', 'মাতুয়াইল', 'কোনাপাড়া', 'কোনাপাড়া'] },
  { bn: 'ধানমন্ডি', en: ['dhanmondi', 'dhanmandi'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ধানমন্ডি', 'ধানমণ্ডি', 'জিগাতলা', 'সোবহানবাগ', 'পান্থপথ', 'শুক্রাবাদ', 'ধানমন্ডি ২৭', 'ধানমন্ডি ১৫', 'ধানমন্ডি ৩২', 'ধানমন্ডি লেক', 'শংকর', 'সংকর'] },
  { bn: 'গেন্ডারিয়া', en: ['gendaria', 'gandaria'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['গেন্ডারিয়া', 'গেন্ডারিয়া', 'দয়াগঞ্জ', 'দয়াগঞ্জ', 'ধূপখোলা', 'মিলব্যারাক'] },
  { bn: 'গুলশান', en: ['gulshan', 'baridhara', 'niketon'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['গুলশান', 'গুলশান ১', 'গুলশান ২', 'নিকেতন', 'বারিধারা', 'বারিধারা ডিওএইচএস', 'শাহজাদপুর'] },
  { bn: 'হাজারীবাগ', en: ['hazaribagh', 'hazaribag', 'rayerbazar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['হাজারীবাগ', 'হাজারিবাগ', 'রায়েরবাজার', 'রায়েরবাজার', 'ট্যানারি মোড়', 'ট্যানারী মোড়'] },
  { bn: 'যাত্রাবাড়ী', en: ['jatrabari', 'sayedabad'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['যাত্রাবাড়ী', 'যাত্রাবাড়ী', 'যাত্রাবাড়ি', 'যাত্রাবারি', 'সায়েদাবাদ', 'সায়েদাবাদ', 'ধলপুর', 'কাজলা', 'শনির আখড়া', 'শনিরআখড়া'] },
  { bn: 'কদমতলী', en: ['kadamtali', 'kadamtoli'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কদমতলী', 'কদমতলি', 'দনিয়া', 'দনিয়া', 'রায়েরবাগ', 'রায়েরবাগ', 'মুরাদপুর'] },
  { bn: 'কাফরুল', en: ['kafrul', 'shewrapara'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কাফরুল', 'ইব্রাহিমপুর', 'শেওড়াপাড়া', 'শেওড়াপাড়া', 'শেওড়া পাড়া', 'সেনপাড়া পর্বতা', 'সেনপাড়া পর্বতা'] },
  { bn: 'কলাবাগান', en: ['kalabagan', 'green road'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কলাবাগান', 'গ্রিন রোড', 'গ্রীন রোড', 'কাঁঠালবাগান', 'কাঠালবাগান', 'বশির উদ্দিন রোড'] },
  { bn: 'কামরাঙ্গীরচর', en: ['kamrangirchar', 'kamrangir char'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কামরাঙ্গীরচর', 'কামরাঙ্গিরচর', 'কামরাঙ্গীর চর', 'লোহারপুল', 'মাদবর বাজার'] },
  { bn: 'খিলগাঁও', en: ['khilgaon', 'goran'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['খিলগাঁও', 'খিলগাও', 'তিলপাপাড়া', 'তিলপাপাড়া', 'গোড়ান', 'গোড়an', 'সিপাহীবাগ', 'মেরাদিয়া', 'মেরাদিয়া'] },
  { bn: 'খিলক্ষেত', en: ['khilkhet', 'nikunja', 'kuril'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['খিলক্ষেত', 'নিকুঞ্জ', 'নিকুঞ্জ ১', 'নিকুঞ্জ ২', 'কুড়িল', 'কুড়িল', 'ডুমনি', 'লেকরোড', 'কুড়িল বিশ্বরোড'] },
  { bn: 'কোতোয়ালী', en: ['kotwali dhaka', 'sadarghat', 'babu bazar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কোতোয়ালী', 'কোতোয়ালী', 'কোতয়ালী', 'কোতয়ালী', 'সদরঘাট', 'ইসলামপুর', 'বাবু বাজার', 'বাবুবাজার', 'আরমানিটোলা', 'পাটুয়াটুলী'] },
  { bn: 'লালবাগ', en: ['lalbagh', 'lalbag', 'azimpur'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['লালবাগ', 'আজিমপুর', 'লালবাগ কেল্লা', 'প্লাসি', 'পলাশী', 'আমলিগোলা'] },
  { bn: 'মিরপুর মডেল', en: ['mirpur', 'mirpur model', 'kazipara', 'paikpara'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['মিরপুর', 'মিরপুর মডেল', 'মিরপুর ১', 'মিরপুর ২', 'মিরপুর ১০', 'মিরপুর ১১', 'মিরপুর ১২', 'মিরপুর ১৩', 'মিরপুর ১৪', 'কাজীপাড়া', 'কাজীপাড়া', 'পাইকপাড়া', 'পাইকপাড়া', 'মিরপুর ডিওএইচএস', 'চিড়িয়াখানা রোড', 'চিড়িয়াখানা'] },
  { bn: 'মোহাম্মদপুর', en: ['mohammadpur', 'mohammedpur', 'shyamoli', 'kalyanpur'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['মোহাম্মদপুর', 'মোহাম্মাদপুর', 'শ্যামলী', 'শ্যামলি', 'কল্যাণপুর', 'কল্যানপুর', 'নবোদয়', 'নবোদয়', 'টোকিও স্কয়ার', 'চাঁনমিয়া হাউজিং', 'রিং রোড', 'নূরজাহান রোড'] },
  { bn: 'মতিঝিল', en: ['motijheel', 'motijhil', 'dilkusha', 'fakirapool'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['মতিঝিল', 'দিলকুশা', 'কমলাপুর', 'আরামবাগ', 'ফকিরাপুল', 'ফকিরাপোল', 'এজিবি কলোনি'] },
  { bn: 'মুগদা', en: ['mugda', 'maniknagar', 'manda'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['মুগদা', 'মুগদাপাড়া', 'মুগদাপাড়া', 'মানিকনগর', 'মান্দা', 'উত্তর মুগদা', 'দক্ষিণ মুগদা'] },
  { bn: 'নিউমার্কেট', en: ['newmarket', 'new market', 'nilkhet', 'elephant road', 'science lab'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['নিউমার্কেট', 'নিউ মার্কেট', 'নীলক্ষেত', 'সাইন্সল্যাব', 'সায়েন্সল্যাব', 'এলিফ্যান্ট রোড', 'হাতিরপুল'] },
  { bn: 'পল্লবী', en: ['pallabi'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['পল্লবী', 'পল্লবি', 'মিরপুর ৬', 'মিরপুর ৭', 'মিরপুর ১১', 'কালসী', 'কালশী', 'দুয়ারীপাড়া', 'দুয়ারীপাড়া'] },
  { bn: 'পল্টন মডেল', en: ['paltan', 'paltan model', 'poltan', 'bijoynagar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['পল্টন', 'পল্টন মডেল', 'নয়া পল্টন', 'নয়া পল্টন', 'পুরানা পল্টন', 'বিজয়নগর', 'বিজয়নগর', 'তোপখানা রোড'] },
  { bn: 'রামপুরা', en: ['rampura', 'banasree', 'aftabnagar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['রামপুরা', 'বনশ্রী', 'আফতাবনগর', 'উলন', 'মালিবাগ চৌধুরীপাড়া', 'পূর্ব রামপুরা', 'পশ্চিম রামপুরা'] },
  { bn: 'রূপনগর', en: ['rupnagar', 'tinshed'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['রূপনগর', 'রুপনগর', 'আরামবাগ মিরপুর', 'দুয়ারীপাড়া রূপনগর'] },
  { bn: 'সবুজবাগ', en: ['sabujbagh', 'sabujbag', 'basabo'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['সবুজবাগ', 'বাসাবো', 'কদমতলা', 'মাদারটেক', 'মায়াকানন', 'মায়াকানন', 'উত্তর বাসাবো', 'দক্ষিণ বাসাবো'] },
  { bn: 'শাহ আলী', en: ['shah ali', 'shahali'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['শাহ আলী', 'শাহআলী', 'শাহ্ আলী', 'মাজার রোড'] },
  { bn: 'শাহবাগ', en: ['shahbagh', 'shahbag', 'karwan bazar', 'banglamotor'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['শাহবাগ', 'রমনা', 'সেগুনবাগিচা', 'ইস্কাটন', 'বাংলামটর', 'বাংলামোটর', 'হাতিরপুল', 'কারওয়ান বাজার', 'কাওরান বাজার', 'কাওরানবাজার', 'ঢাকা বিশ্ববিদ্যালয়'] },
  { bn: 'শেরেবাংলা নগর', en: ['sher-e-bangla nagar', 'sherebangla nagar', 'farmgate', 'agargaon'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['শেরেবাংলা নগর', 'শেরে বাংলা নগর', 'আগারগাঁও', 'আগারগাও', 'ফার্মগেট', 'ইন্দিরা রোড', 'খামারবাড়ি', 'খামারবাড়ি'] },
  { bn: 'শ্যামপুর', en: ['shyampur', 'jurain', 'postogola'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['শ্যামপুর', 'পোস্তগোলা', 'জুরাইন', 'ধোলাইপাড়', 'ধোলাইপাড়'] },
  { bn: 'সূত্রাপুর', en: ['sutrapur', 'narinda'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['সূত্রাপুর', 'নারিন্দা', 'কলতাবাজার', 'টিপু সুলতান রোড', 'ধুপখোলা'] },
  { bn: 'শাহজাহানপুর', en: ['shahjahanpur', 'malibagh', 'shantinagar', 'mouchak'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['শাহজাহানপুর', 'মালিবাগ', 'শান্তিনগর', 'রাজারবাগ', 'মৌচাক', 'মালিবাগ মোড়'] },
  { bn: 'তেজগাঁও', en: ['tejgaon', 'nakhalpara'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['তেজগাঁও', 'তেজগাও', 'নাকহালপাড়া', 'নাখালপাড়া', 'নাখালপাড়া', 'তেজকুনিপাড়া', 'মণিপুরীপাড়া', 'ফার্মগেট পূর্ব'] },
  { bn: 'তেজগাঁও শিল্পাঞ্চল', en: ['tejgaon industrial area', 'tejgaon shilpanchal'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['তেজগাঁও শিল্পাঞ্চল', 'তেজগাঁও শিল্প এলাকা', 'তেজগাও শিল্পাঞ্চল', 'তেজগাঁও শিল্প'] },
  { bn: 'তুরাগ', en: ['turag', 'kamarpara'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['তুরাগ', 'রানাভোলা', 'কামারপাড়া', 'কামারপাড়া', 'ধলপুর তুরাগ'] },
  { bn: 'উত্তরা মডেল', en: ['uttara', 'uttara model', 'uttara sector'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['উত্তরা', 'উত্তরা মডেল', 'উত্তরা ১', 'উত্তরা ২', 'উত্তরা ৩', 'উত্তরা ৪', 'উত্তরা ৫', 'উত্তরা ৬', 'উত্তরা ৭', 'উত্তরা ৮', 'উত্তরা ৯', 'উত্তরা ১০', 'উত্তরা ১১', 'উত্তরা ১২', 'উত্তরা ১৩', 'উত্তরা ১৪', 'সেক্টর ১', 'সেক্টর ২', 'সেক্টর ৩', 'সেক্টর ৪', 'সেক্টর ৫', 'সেক্টর ৬', 'সেক্টর ৭', 'সেক্টর ৮', 'সেক্টর ৯', 'সেক্টর ১০', 'সেক্টর ১১', 'সেক্টর ১২', 'সেক্টর ১৩', 'সেক্টর ১৪'] },
  { bn: 'উত্তরখান', en: ['uttarkhan', 'uttar khan'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['উত্তরখান', 'উত্তর খান', 'মৈনারটেক', 'উওরখান'] },
  { bn: 'উত্তরা পশ্চিম', en: ['uttara paschim', 'uttara west'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['উত্তরা পশ্চিম', 'উত্তরা ওয়েস্ট', 'উত্তরা পশ্চিম থানা', 'সেক্টর ৭ উত্তরা', 'সেক্টর ৯ উত্তরা'] },
  { bn: 'ভাটারা', en: ['bhatara', 'vatara', 'bashundhara'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ভাটারা', 'বসুন্ধরা আবাসিক', 'বসুন্ধরা', 'বসুন্ধরা আর/এ', 'ছোলমাইদ', 'নুরনগর', 'জোয়ার সাহারা', 'কালাচাঁদপুর', 'শাহজাদপুর'] },
  { bn: 'ওয়ারী', en: ['wari', 'tikatuli'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['ওয়ারী', 'ওয়ারী', 'ওয়ারি', 'ওয়ারি', 'র‍্যাঙ্কিন স্ট্রিট', 'টিকাটুলী', 'টিকাটুলি', 'আরকে মিশন রোড', 'স্বামীবাগ'] },
  { bn: 'উত্তরা পূর্ব', en: ['uttara purba', 'uttara east', 'azampur', 'abdullahpur'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['উত্তরা পূর্ব', 'উত্তরা ইস্ট', 'উত্তরা পূর্ব থানা', 'আজমপুর', 'আব্দুল্লাহপুর', 'আবদুল্লাহপুর', 'রাজলক্ষ্মী'] },
];

// Suburban areas in Dhaka District (Administratively in Dhaka District, but physically OUTSIDE Dhaka City)
export const DHAKA_DISTRICT_SUBURBAN_THANAS: GeoItem[] = [
  { bn: 'সাভার', en: ['savar', 'shavar'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['সাভার সদর'] },
  { bn: 'হেমায়েতপুর', en: ['hemayetpur'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['হেমায়েতপুর'] },
  { bn: 'আশুলিয়া', en: ['ashulia'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['আশুলিয়া'] },
  { bn: 'ধামরাই', en: ['dhamrai'], district: 'ঢাকা', division: 'ঢাকা' },
  { bn: 'কেরানীগঞ্জ', en: ['keraniganj', 'keranigonj'], district: 'ঢাকা', division: 'ঢাকা', altBn: ['কেরানিগঞ্জ', 'জিনজিরা'] },
  { bn: 'নবাবগঞ্জ', en: ['nawabganj'], district: 'ঢাকা', division: 'ঢাকা' },
  { bn: 'দোহার', en: ['dohar'], district: 'ঢাকা', division: 'ঢাকা' },
];

export const DHAKA_OUTSIDE_METRO_KEYWORDS: string[] = [
  'সাভার', 'savar', 'হেমায়েতপুর', 'হেমায়েতপুর', 'hemayetpur',
  'আশুলিয়া', 'আশুলিয়া', 'ashulia',
  'ধামরাই', 'dhamrai',
  'কেরানীগঞ্জ', 'কেরানিগঞ্জ', 'keraniganj', 'জিনজিরা', 'zinjira', 'jinjira',
  'নবাবগঞ্জ', 'nawabganj',
  'দোহার', 'dohar',
  'গাজীপুর', 'gazipur', 'টঙ্গী', 'tongi', 'কালিয়াকৈর', 'কালিয়াকৈর', 'kaliakair',
  'নারায়ণগঞ্জ', 'নারায়ণগঞ্জ', 'narayanganj', 'ফতুল্লা', 'সিদ্ধিরগঞ্জ', 'রূপগঞ্জ', 'সোনারগাঁও',
  'টাঙ্গাইল', 'tangail',
  'মুন্সীগঞ্জ', 'মুন্সিগঞ্জ', 'munshiganj',
  'মানিকগঞ্জ', 'manikganj',
  'নরসিংদী', 'narsingdi',
  'কিশোরগঞ্জ', 'kishoreganj',
  'ফরিদপুর', 'faridpur', 'মাদারীপুর', 'madaripur', 'গোপালগঞ্জ', 'gopalganj',
  'রাজবাড়ী', 'রাজবাড়ি', 'rajbari', 'শরীয়তপুর', 'শরিয়তপুর', 'shariatpur'
];

// All Upazilas, Thanas, and Major Areas of Bangladesh mapped to their District & Division
export const BD_ALL_UPAZILAS_THANAS: GeoItem[] = [
  ...DHAKA_METRO_CITY_THANAS,
  ...DHAKA_DISTRICT_SUBURBAN_THANAS,

  // Gazipur District
  { bn: 'গাজীপুর সদর', en: ['gazipur sadar', 'joydebpur', 'জয়দেবপুর', 'বোর্ড বাজার', 'board bazar', 'কোনাবাড়ী', 'কোনাবাড়ী'], district: 'গাজীপুর', division: 'ঢাকা' },
  { bn: 'টঙ্গী', en: ['tongi'], district: 'গাজীপুর', division: 'ঢাকা' },
  { bn: 'কালিয়াকৈর', en: ['kaliakair', 'kaliakoir'], district: 'গাজীপুর', division: 'ঢাকা', altBn: ['কালিয়াকৈর'] },
  { bn: 'শ্রীপুর', en: ['sreepur', 'sripur'], district: 'গাজীপুর', division: 'ঢাকা' },
  { bn: 'কাপাসিয়া', en: ['kapasia'], district: 'গাজীপুর', division: 'ঢাকা', altBn: ['কাপাসিয়া'] },
  { bn: 'কালীগঞ্জ', en: ['kaliganj'], district: 'গাজীপুর', division: 'ঢাকা' },

  // Narayanganj District
  { bn: 'নারায়ণগঞ্জ সদর', en: ['narayanganj sadar', 'চাষাড়া', 'chasara', 'chashara'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা', altBn: ['নারায়ণগঞ্জ সদর', 'চাষাড়া'] },
  { bn: 'ফতুল্লা', en: ['fatullah', 'fatulla'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { bn: 'সিদ্ধিরগঞ্জ', en: ['siddhirganj'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { bn: 'বন্দর', en: ['bandar narayanganj'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { bn: 'রূপগঞ্জ', en: ['rupganj', 'rupgonj', 'ভুলতা', 'bhulta', 'গাউছিয়া', 'gawsia'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { bn: 'সোনারগাঁও', en: ['sonargaon', 'কাঁচপুর', 'kanchpur'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা' },
  { bn: 'আড়াইহাজার', en: ['araihazar'], district: 'নারায়ণগঞ্জ', division: 'ঢাকা', altBn: ['আড়াইহাজার'] },

  // Tangail District
  { bn: 'টাঙ্গাইল সদর', en: ['tangail sadar'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'মির্জাপুর', en: ['mirzapur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'দেলদুয়ার', en: ['delduar'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'নাগরপুর', en: ['nagarpur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'বাসাইল', en: ['basail'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'সখিপুর', en: ['sakhipur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'ঘাটাইল', en: ['ghatail'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'কালিহাতী', en: ['kalihati'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'মধুপুর', en: ['madhupur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'ধনবাড়ী', en: ['dhanbari'], district: 'টাঙ্গাইল', division: 'ঢাকা', altBn: ['ধনবাড়ী'] },
  { bn: 'গোপালপুর', en: ['gopalpur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },
  { bn: 'ভূঞাপুর', en: ['bhuapur', 'bhuiyapur'], district: 'টাঙ্গাইল', division: 'ঢাকা' },

  // Narsingdi District
  { bn: 'নরসিংদী সদর', en: ['narsingdi sadar'], district: 'নরসিংদী', division: 'ঢাকা' },
  { bn: 'পলাশ', en: ['palash'], district: 'নরসিংদী', division: 'ঢাকা' },
  { bn: 'বেলাব', en: ['belabo'], district: 'নরসিংদী', division: 'ঢাকা', altBn: ['বেলাবো'] },
  { bn: 'মনোহরদী', en: ['monohardi'], district: 'নরসিংদী', division: 'ঢাকা' },
  { bn: 'রায়পুরা', en: ['raipura'], district: 'নরসিংদী', division: 'ঢাকা', altBn: ['রায়পুরা'] },
  { bn: 'শিবপুর', en: ['shibpur'], district: 'নরসিংদী', division: 'ঢাকা' },

  // Munshiganj District
  { bn: 'মুন্সীগঞ্জ সদর', en: ['munshiganj sadar'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা', altBn: ['মুন্সিগঞ্জ সদর'] },
  { bn: 'শ্রীনগর', en: ['sreenagar'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা' },
  { bn: 'সিরাজদিখান', en: ['sirajdikhan'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা' },
  { bn: 'লৌহজং', en: ['louhajang'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা' },
  { bn: 'গজারিয়া', en: ['gajaria'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা', altBn: ['গজারিয়া'] },
  { bn: 'টংগিবাড়ী', en: ['tongibari'], district: 'মুন্সীগঞ্জ', division: 'ঢাকা', altBn: ['টঙ্গিবাড়ী'] },

  // Manikganj District
  { bn: 'মানিকগঞ্জ সদর', en: ['manikganj sadar'], district: 'মানিকগঞ্জ', division: 'ঢাকা' },
  { bn: 'সিংগাইর', en: ['singair'], district: 'মানিকগঞ্জ', division: 'ঢাকা' },
  { bn: 'শিবালয়', en: ['shibaloy', 'shibalaya'], district: 'মানিকগঞ্জ', division: 'ঢাকা', altBn: ['শিবালয়'] },
  { bn: 'সাটুরিয়া', en: ['saturia'], district: 'মানিকগঞ্জ', division: 'ঢাকা', altBn: ['সাটুরিয়া'] },
  { bn: 'হরিরামপুর', en: ['harirampur'], district: 'মানিকগঞ্জ', division: 'ঢাকা' },
  { bn: 'ঘিওর', en: ['ghior'], district: 'মানিকগঞ্জ', division: 'ঢাকা' },
  { bn: 'দৌলতপুর', en: ['daulatpur manikganj'], district: 'মানিকগঞ্জ', division: 'ঢাকা' },

  // Faridpur District
  { bn: 'ফরিদপুর সদর', en: ['faridpur sadar'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'বোয়ালমারী', en: ['boalmari'], district: 'ফরিদপুর', division: 'ঢাকা', altBn: ['বোয়ালমারী'] },
  { bn: 'আলফাডাঙ্গা', en: ['alfadanga'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'মধুখালী', en: ['madhukhali'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'নগরকান্দা', en: ['nagarkanda'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'সালথা', en: ['saltha'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'চরভদ্রাসন', en: ['charbhadrasan'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'সদরপুর', en: ['sadarpur'], district: 'ফরিদপুর', division: 'ঢাকা' },
  { bn: 'ভাঙ্গা', en: ['bhanga'], district: 'ফরিদপুর', division: 'ঢাকা' },

  // Madaripur District
  { bn: 'মাদারীপুর সদর', en: ['madaripur sadar'], district: 'মাদারীপুর', division: 'ঢাকা' },
  { bn: 'শিবচর', en: ['shivchar', 'sibchar'], district: 'মাদারীপুর', division: 'ঢাকা' },
  { bn: 'কালকিনি', en: ['kalkini'], district: 'মাদারীপুর', division: 'ঢাকা' },
  { bn: 'রাজৈর', en: ['rajoir'], district: 'মাদারীপুর', division: 'ঢাকা' },
  { bn: 'ডাসার', en: ['dasar'], district: 'মাদারীপুর', division: 'ঢাকা' },

  // Gopalganj District
  { bn: 'গোপালগঞ্জ সদর', en: ['gopalganj sadar'], district: 'গোপালগঞ্জ', division: 'ঢাকা' },
  { bn: 'টুঙ্গিপাড়া', en: ['tungipara'], district: 'গোপালগঞ্জ', division: 'ঢাকা', altBn: ['টুঙ্গিপাড়া'] },
  { bn: 'কোটালীপাড়া', en: ['kotalipara'], district: 'গোপালগঞ্জ', division: 'ঢাকা', altBn: ['কোটালীপাড়া'] },
  { bn: 'কাশিয়ানী', en: ['kashiani'], district: 'গোপালগঞ্জ', division: 'ঢাকা', altBn: ['কাশিয়ানী'] },
  { bn: 'মুকসুদপুর', en: ['muksudpur'], district: 'গোপালগঞ্জ', division: 'ঢাকা' },

  // Rajbari District
  { bn: 'রাজবাড়ী সদর', en: ['rajbari sadar'], district: 'রাজবাড়ী', division: 'ঢাকা', altBn: ['রাজবাড়ী সদর'] },
  { bn: 'গোয়ালন্দ', en: ['goalanda', 'goalondo'], district: 'রাজবাড়ী', division: 'ঢাকা', altBn: ['গোয়ালন্দ'] },
  { bn: 'পাংশা', en: ['pangsha'], district: 'রাজবাড়ী', division: 'ঢাকা' },
  { bn: 'বালিয়াকান্দি', en: ['baliakandi'], district: 'রাজবাড়ী', division: 'ঢাকা', altBn: ['বালিকান্দি'] },
  { bn: 'কালুখালী', en: ['kalukhali'], district: 'রাজবাড়ী', division: 'ঢাকা' },

  // Shariatpur District
  { bn: 'শরীয়তপুর সদর', en: ['shariatpur sadar'], district: 'শরীয়তপুর', division: 'ঢাকা', altBn: ['শরিয়তপুর সদর', 'শরিয়তপুর সদর'] },
  { bn: 'জাজিরা', en: ['jajira'], district: 'শরীয়তপুর', division: 'ঢাকা' },
  { bn: 'নড়িয়া', en: ['naria'], district: 'শরীয়তপুর', division: 'ঢাকা', altBn: ['নড়িয়া'] },
  { bn: 'ভেদরগঞ্জ', en: ['bhedarganj'], district: 'শরীয়তপুর', division: 'ঢাকা' },
  { bn: 'ডামুড্যা', en: ['damudya'], district: 'শরীয়তপুর', division: 'ঢাকা', altBn: ['ডামুড্ডা'] },
  { bn: 'গোসাইরহাট', en: ['gosairhat'], district: 'শরীয়তপুর', division: 'ঢাকা' },

  // Kishoreganj District
  { bn: 'কিশোরগঞ্জ সদর', en: ['kishoreganj sadar'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'ভৈরব', en: ['bhairab', 'bhoirob'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'বাজিতপুর', en: ['bajitpur'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'কুলিয়ারচর', en: ['kuliarchar'], district: 'কিশোরগঞ্জ', division: 'ঢাকা', altBn: ['কুলিয়ারচর'] },
  { bn: 'পাকুন্দিয়া', en: ['pakundia'], district: 'কিশোরগঞ্জ', division: 'ঢাকা', altBn: ['পাকুন্দিয়া'] },
  { bn: 'কটিয়াদী', en: ['katiadi'], district: 'কিশোরগঞ্জ', division: 'ঢাকা', altBn: ['কটিয়াদী'] },
  { bn: 'করিমগঞ্জ', en: ['karimganj'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'তাড়াইল', en: ['tarail'], district: 'কিশোরগঞ্জ', division: 'ঢাকা', altBn: ['তাড়াইল'] },
  { bn: 'হোসেনপুর', en: ['hossainpur'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'নিকলী', en: ['nikli'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'অষ্টগ্রাম', en: ['austagram'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'মিঠামইন', en: ['mithamain'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },
  { bn: 'ইটনা', en: ['itna'], district: 'কিশোরগঞ্জ', division: 'ঢাকা' },

  // ==================== CHATTOGRAM DIVISION ====================
  // Chattogram City Thanas & Upazilas
  { bn: 'কোতোয়ালী', en: ['kotwali ctg'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['কোতোয়ালী'] },
  { bn: 'পাঁচলাইশ', en: ['panchlaish', 'জিইসি', 'gec'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'খুলশী', en: ['khulshi'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'চান্দগাঁও', en: ['chandgaon'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'ডবলমুরিং', en: ['double mooring', 'doublemooring', 'আগ্রাবাদ', 'agrabad'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'হালিশহর', en: ['halishahar'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'পতেঙ্গা', en: ['patenga'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'পাহাড়তলী', en: ['pahartali'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['পাহাড়তলী'] },
  { bn: 'বায়েজিদ', en: ['bayezid'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['বায়েজিদ'] },
  { bn: 'চকবাজার', en: ['chawkbazar ctg'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'বাকলিয়া', en: ['bakalia'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['বাকলিয়া'] },
  { bn: 'সদরঘাট', en: ['sadarghat ctg'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'কর্ণফুলী', en: ['karnafuli'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'ইপিজেড', en: ['epz ctg'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'আকবর শাহ', en: ['akbar shah'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'হাটহাজারী', en: ['hathazari'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'সীতাকুণ্ড', en: ['sitakunda', 'sitakundu'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'মীরসরাই', en: ['mirsharai', 'mirsarai'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'রাউজান', en: ['raozan'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'রাঙ্গুনিয়া', en: ['rangunia'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['রাঙ্গুনিয়া'] },
  { bn: 'ফটিকছড়ি', en: ['fatikchhari'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['ফটিকছড়ি'] },
  { bn: 'পটিয়া', en: ['patiya'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['পটিয়া'] },
  { bn: 'বোয়ালখালী', en: ['boalkhali'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['বোয়ালখালী'] },
  { bn: 'আনোয়ারা', en: ['anwara'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['আনোয়ারা'] },
  { bn: 'চন্দনাইশ', en: ['chandanaiish'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'সাতকানিয়া', en: ['satkania'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['সাতকানিয়া'] },
  { bn: 'লোহাগাড়া', en: ['lohagara ctg'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম', altBn: ['লোহাগাড়া'] },
  { bn: 'বাঁশখালী', en: ['banshkhali'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },
  { bn: 'সন্দ্বীপ', en: ['sandwip'], district: 'চট্টগ্রাম', division: 'চট্টগ্রাম' },

  // Cumilla District
  { bn: 'কুমিল্লা আদর্শ সদর', en: ['cumilla adarsha sadar', 'cumilla sadar', 'comilla sadar'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'কুমিল্লা সদর দক্ষিণ', en: ['cumilla sadar dakshin'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'লাকসাম', en: ['laksam'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'দাউদকান্দি', en: ['daudkandi'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'চান্দিনা', en: ['chandina'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'দেবিদ্বার', en: ['debidwar'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'মুরাদনগর', en: ['muradnagar'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'হোমনা', en: ['homna'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'তিতাস', en: ['titas'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'মেঘনা', en: ['meghna'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'বরুড়া', en: ['barura'], district: 'কুমিল্লা', division: 'চট্টগ্রাম', altBn: ['বরুড়া'] },
  { bn: 'বুড়িচং', en: ['burichang'], district: 'কুমিল্লা', division: 'চট্টগ্রাম', altBn: ['বুড়িচং'] },
  { bn: 'ব্রাহ্মণপাড়া', en: ['brahmanpara'], district: 'কুমিল্লা', division: 'চট্টগ্রাম', altBn: ['ব্রাহ্মণপাড়া'] },
  { bn: 'চৌদ্দগ্রাম', en: ['chauddagram'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'নাঙ্গলকোট', en: ['nangalkot'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'মনোহরগঞ্জ', en: ['monoharganj'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },
  { bn: 'লালমাই', en: ['lalmai'], district: 'কুমিল্লা', division: 'চট্টগ্রাম' },

  // Feni District
  { bn: 'ফেনী সদর', en: ['feni sadar'], district: 'ফেনী', division: 'চট্টগ্রাম' },
  { bn: 'দাগনভূঞা', en: ['daganbhuiyan', 'daganbhuiya'], district: 'ফেনী', division: 'চট্টগ্রাম' },
  { bn: 'সোনাগাজী', en: ['sonagazi'], district: 'ফেনী', division: 'চট্টগ্রাম' },
  { bn: 'ছাগলনাইয়া', en: ['chhagalnaiya'], district: 'ফেনী', division: 'চট্টগ্রাম', altBn: ['ছাগলনাইয়া'] },
  { bn: 'পরশুরাম', en: ['parshuram'], district: 'ফেনী', division: 'চট্টগ্রাম' },
  { bn: 'ফুলগাজী', en: ['fulgazi'], district: 'ফেনী', division: 'চট্টগ্রাম' },

  // Brahmanbaria District
  { bn: 'ব্রাহ্মণবাড়িয়া সদর', en: ['brahmanbaria sadar'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম', altBn: ['ব্রাহ্মণবাড়িয়া সদর'] },
  { bn: 'সরাইল', en: ['sarail'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'আশুগঞ্জ', en: ['ashuganj'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'কসবা', en: ['kasba'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'আখাউড়া', en: ['akhaura'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম', altBn: ['আখাউড়া'] },
  { bn: 'নবীনগর', en: ['nabinagar'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'বাঞ্ছারামপুর', en: ['bancharampur'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'নাসিরনগর', en: ['nasirnagar'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম' },
  { bn: 'বিজয়নগর', en: ['bijoynagar'], district: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম', altBn: ['বিজয় নগর'] },

  // Noakhali District
  { bn: 'নোয়াখালী সদর', en: ['noakhali sadar', 'sudharam', 'সুধারাম', 'মাইজদী', 'maijdee'], district: 'নোয়াখালী', division: 'চট্টগ্রাম', altBn: ['নোয়াখালী সদর'] },
  { bn: 'বেগমগঞ্জ', en: ['begumganj', 'চৌমুহনী', 'choumuhani', 'chaumuhani'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'সোনাইমুড়ী', en: ['sonaimuri'], district: 'নোয়াখালী', division: 'চট্টগ্রাম', altBn: ['সোনাইমুড়ী'] },
  { bn: 'চাটখিল', en: ['chatkhil'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'সেনবাগ', en: ['senbagh', 'senbag'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'কোম্পানীগঞ্জ', en: ['companiganj noakhali'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'কবিরহাট', en: ['kabirhat'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'সুবর্ণচর', en: ['subarnachar'], district: 'নোয়াখালী', division: 'চট্টগ্রাম' },
  { bn: 'হাতিয়া', en: ['hatiya'], district: 'নোয়াখালী', division: 'চট্টগ্রাম', altBn: ['হাতিয়া'] },

  // Lakshmipur District
  { bn: 'লক্ষ্মীপুর সদর', en: ['lakshmipur sadar'], district: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম', altBn: ['লক্ষীপুর সদর'] },
  { bn: 'রায়পুর', en: ['raipur'], district: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম', altBn: ['রায়পুর'] },
  { bn: 'রামগঞ্জ', en: ['ramganj'], district: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম' },
  { bn: 'রামগতি', en: ['ramgati'], district: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম' },
  { bn: 'কমলনগর', en: ['kamalnagar'], district: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম' },

  // Chandpur District
  { bn: 'চাঁদপুর সদর', en: ['chandpur sadar'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'হাজীগঞ্জ', en: ['hajiganj'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'শাহরাস্তি', en: ['shahrasti'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'মতলব উত্তর', en: ['matlab uttar'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'মতলব দক্ষিণ', en: ['matlab dakshin'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'ফরিদগঞ্জ', en: ['faridganj'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'কচুয়া', en: ['kachua chandpur'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },
  { bn: 'হাইমচর', en: ['haimchar'], district: 'চাঁদপুর', division: 'চট্টগ্রাম' },

  // Cox's Bazar District
  { bn: 'কক্সবাজার সদর', en: ['coxs bazar sadar', 'coxsbazar sadar'], district: 'কক্সবাজার', division: 'চট্টগ্রাম' },
  { bn: 'রামু', en: ['ramu'], district: 'কক্সবাজার', division: 'চট্টগ্রাম' },
  { bn: 'চকরিয়া', en: ['chakaria'], district: 'কক্সবাজার', division: 'চট্টগ্রাম', altBn: ['চকরিয়া'] },
  { bn: 'পেকুয়া', en: ['pekua'], district: 'কক্সবাজার', division: 'চট্টগ্রাম', altBn: ['পেকুয়া'] },
  { bn: 'উখিয়া', en: ['ukhiya'], district: 'কক্সবাজার', division: 'চট্টগ্রাম', altBn: ['উখিয়া'] },
  { bn: 'টেকনাফ', en: ['teknaf'], district: 'কক্সবাজার', division: 'চট্টগ্রাম' },
  { bn: 'মহেশখালী', en: ['maheshkhali'], district: 'কক্সবাজার', division: 'চট্টগ্রাম' },
  { bn: 'কুতুবদিয়া', en: ['kutubdia'], district: 'কক্সবাজার', division: 'চট্টগ্রাম', altBn: ['কুতুবদিয়া'] },
  { bn: 'ঈদগাঁও', en: ['eidgaon'], district: 'কক্সবাজার', division: 'চট্টগ্রাম' },

  // Rangamati District
  { bn: 'রাঙ্গামাটি সদর', en: ['rangamati sadar'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম', altBn: ['রাঙামাটি সদর'] },
  { bn: 'কাপ্তাই', en: ['kaptai'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম' },
  { bn: 'বাঘাইছড়ি', en: ['baghaichhari'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম', altBn: ['বাঘাইছড়ি'] },
  { bn: 'বরকল', en: ['barkal'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম' },
  { bn: 'নানিয়ারচর', en: ['naniarchar'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম', altBn: ['নানিয়ারচর'] },
  { bn: 'রাজস্থলী', en: ['rajasthali'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম' },
  { bn: 'কাউখালী', en: ['kaukhali rangamati'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম' },
  { bn: 'জুরাছড়ি', en: ['jurachhari'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম', altBn: ['জুরাছড়ি'] },
  { bn: 'বিলাইছড়ি', en: ['bilaichhari'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম', altBn: ['বিলাইছড়ি'] },
  { bn: 'লংগদু', en: ['langadu'], district: 'রাঙ্গামাটি', division: 'চট্টগ্রাম' },

  // Khagrachhari District
  { bn: 'খাগড়াছড়ি সদর', en: ['khagrachhari sadar'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['খাগড়াছড়ি সদর'] },
  { bn: 'দীঘিনালা', en: ['dighinala'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম' },
  { bn: 'পানছড়ি', en: ['panchhari'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['পানছড়ি'] },
  { bn: 'মাটিরাঙ্গা', en: ['matiranga'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম' },
  { bn: 'মানিকছড়ি', en: ['manikchhari'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['মানিকছড়ি'] },
  { bn: 'রামগড়', en: ['ramgarh'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['রামগড়'] },
  { bn: 'মহালছড়ি', en: ['mohalchhari'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['মহালছড়ি'] },
  { bn: 'লক্ষ্মীছড়ি', en: ['lakshmichhari'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম', altBn: ['লক্ষ্মীছড়ি'] },
  { bn: 'গুইমারা', en: ['guimara'], district: 'খাগড়াছড়ি', division: 'চট্টগ্রাম' },

  // Bandarban District
  { bn: 'বান্দরবান সদর', en: ['bandarban sadar'], district: 'বান্দরবান', division: 'চট্টগ্রাম' },
  { bn: 'রুমা', en: ['ruma'], district: 'বান্দরবান', division: 'চট্টগ্রাম' },
  { bn: 'থানচি', en: ['thanchi'], district: 'বান্দরবান', division: 'চট্টগ্রাম' },
  { bn: 'রোয়াংছড়ি', en: ['rowangchhari'], district: 'বান্দরবান', division: 'চট্টগ্রাম', altBn: ['রোয়াংছড়ি'] },
  { bn: 'লামা', en: ['lama'], district: 'বান্দরবান', division: 'চট্টগ্রাম' },
  { bn: 'আলীকদম', en: ['alikadam'], district: 'বান্দরবান', division: 'চট্টগ্রাম' },
  { bn: 'নাইক্ষ্যংছড়ি', en: ['naikhongchhari'], district: 'বান্দরবান', division: 'চট্টগ্রাম', altBn: ['নাইক্ষ্যংছড়ি'] },

  // ==================== SYLHET DIVISION ====================
  // Sylhet District
  { bn: 'সিলেট সদর', en: ['sylhet sadar', 'জিন্দাবাজার', 'zindabazar', 'আম্বরখানা', 'amberkhana', 'টিলাগড়', 'tilagarh'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'দক্ষিণ সুরমা', en: ['dakshin surma', 'south surma'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'গোলাপগঞ্জ', en: ['golapganj'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'বিয়ানীবাজার', en: ['beanibazar'], district: 'সিলেট', division: 'সিলেট', altBn: ['বিয়ানীবাজার'] },
  { bn: 'জকিগঞ্জ', en: ['zakiganj'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'কানাইঘাট', en: ['kanaighat'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'জৈন্তাপুর', en: ['jaintiapur'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'গোয়াইনঘাট', en: ['gowainghat', 'জাফলং', 'jaflong'], district: 'সিলেট', division: 'সিলেট', altBn: ['গোয়াইনঘাট'] },
  { bn: 'কোম্পানীগঞ্জ', en: ['companiganj sylhet', 'ভোলাগঞ্জ', 'bholaganj'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'বালাগঞ্জ', en: ['balaganj'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'ফেঞ্চুগঞ্জ', en: ['fenchuganj'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'বিশ্বনাথ', en: ['bishwanath'], district: 'সিলেট', division: 'সিলেট' },
  { bn: 'ওসমানীনগর', en: ['osmani nagar', 'osmaninagar'], district: 'সিলেট', division: 'সিলেট' },

  // Moulvibazar District
  { bn: 'মৌলভীবাজার সদর', en: ['moulvibazar sadar'], district: 'মৌলভীবাজার', division: 'সিলেট' },
  { bn: 'শ্রীমঙ্গল', en: ['sreemangal', 'srimongol'], district: 'মৌলভীবাজার', division: 'সিলেট' },
  { bn: 'কমলগঞ্জ', en: ['kamalganj'], district: 'মৌলভীবাজার', division: 'সিলেট' },
  { bn: 'কুলাউড়া', en: ['kulaura'], district: 'মৌলভীবাজার', division: 'সিলেট', altBn: ['কুলাউড়া'] },
  { bn: 'বড়লেখা', en: ['barlekha'], district: 'মৌলভীবাজার', division: 'সিলেট', altBn: ['বড়লেখা'] },
  { bn: 'জুড়ী', en: ['juri'], district: 'মৌলভীবাজার', division: 'সিলেট', altBn: ['জুড়ী'] },
  { bn: 'রাজনগর', en: ['rajnagar'], district: 'মৌলভীবাজার', division: 'সিলেট' },

  // Habiganj District
  { bn: 'হবিগঞ্জ সদর', en: ['habiganj sadar'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'মাধবপুর', en: ['madhabpur'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'চুনারুঘাট', en: ['chunarughat'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'বাহুবল', en: ['bahubal'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'নবীগঞ্জ', en: ['nabiganj'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'বানিয়াচং', en: ['baniachong'], district: 'হবিগঞ্জ', division: 'সিলেট', altBn: ['বানিয়াচং'] },
  { bn: 'আজমিরীগঞ্জ', en: ['ajmiriganj'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'লাখাই', en: ['lakhai'], district: 'হবিগঞ্জ', division: 'সিলেট' },
  { bn: 'শায়েস্তাগঞ্জ', en: ['shayestaganj'], district: 'হবিগঞ্জ', division: 'সিলেট', altBn: ['শায়েস্তাগঞ্জ'] },

  // Sunamganj District
  { bn: 'সুনামগঞ্জ সদর', en: ['sunamganj sadar'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'ছাতক', en: ['chhatak'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'জগন্নাথপুর', en: ['jagannathpur'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'দিরাই', en: ['dirai'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'শাল্লা', en: ['shalla'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'তাহিরপুর', en: ['tahirpur'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'বিশ্বম্ভরপুর', en: ['bishwamvarpur'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'জামালগঞ্জ', en: ['jamalganj sunamganj'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'ধর্মপাশা', en: ['dharmapasha'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'দোয়ারাবাজার', en: ['dowarabazar'], district: 'সুনামগঞ্জ', division: 'সিলেট', altBn: ['দোয়ারা বাজার'] },
  { bn: 'শান্তিগঞ্জ', en: ['shantiganj', 'দক্ষিণ সুনামগঞ্জ'], district: 'সুনামগঞ্জ', division: 'সিলেট' },
  { bn: 'মধ্যনগর', en: ['madhyanagar'], district: 'সুনামগঞ্জ', division: 'সিলেট' },

  // ==================== RAJSHAHI DIVISION ====================
  // Rajshahi District
  { bn: 'বোয়ালিয়া', en: ['boalia'], district: 'রাজশাহী', division: 'রাজশাহী', altBn: ['বোয়ালিয়া'] },
  { bn: 'মতিহার', en: ['motihar'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'রাজপাড়া', en: ['rajpara'], district: 'রাজশাহী', division: 'রাজশাহী', altBn: ['রাজপাড়া'] },
  { bn: 'শাহ মখদুম', en: ['shah makhdum'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'পবা', en: ['paba'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'গোদাগাড়ী', en: ['godagari'], district: 'রাজশাহী', division: 'রাজশাহী', altBn: ['গোদাগাড়ী'] },
  { bn: 'তানোর', en: ['tanor'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'বাগমারা', en: ['bagmara'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'দুর্গাপুর', en: ['durgapur rajshahi'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'পুঠিয়া', en: ['puthia'], district: 'রাজশাহী', division: 'রাজশাহী', altBn: ['পুঠিয়া'] },
  { bn: 'চারঘাট', en: ['charghat'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'বাঘা', en: ['bagha'], district: 'রাজশাহী', division: 'রাজশাহী' },
  { bn: 'মোহনপুর', en: ['mohanpur'], district: 'রাজশাহী', division: 'রাজশাহী' },

  // Bogura District
  { bn: 'বগুড়া সদর', en: ['bogura sadar', 'bogra sadar', 'উপশহর'], district: 'বগুড়া', division: 'রাজশাহী', altBn: ['বগুড়া সদর'] },
  { bn: 'শাজাহানপুর', en: ['shajahanpur'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'শেরপুর', en: ['sherpur bogura'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'শিবগঞ্জ', en: ['shibganj bogura'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'গাবতলী', en: ['gabtali bogura'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'সোনাতলা', en: ['sonatala'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'ধুনট', en: ['dhunat'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'সারিয়াকান্দি', en: ['sariakandi'], district: 'বগুড়া', division: 'রাজশাহী', altBn: ['সারিয়া কান্দি'] },
  { bn: 'আদমদীঘি', en: ['adamdighi', 'সান্তাহার', 'santahar'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'দুপচাঁচিয়া', en: ['dupchanchia'], district: 'বগুড়া', division: 'রাজশাহী', altBn: ['দুপচাচিয়া'] },
  { bn: 'কাহালু', en: ['kahalu'], district: 'বগুড়া', division: 'রাজশাহী' },
  { bn: 'নন্দীগ্রাম', en: ['nandigram'], district: 'বগুড়া', division: 'রাজশাহী' },

  // Pabna District
  { bn: 'পাবনা সদর', en: ['pabna sadar'], district: 'পাবনা', division: 'রাজশাহী' },
  { bn: 'ঈশ্বরদী', en: ['ishwardi', 'iswardi'], district: 'পাবনা', division: 'রাজশাহী', altBn: ['ইশ্বরদী'] },
  { bn: 'সুজানগর', en: ['sujanagar'], district: 'পাবনা', division: 'রাজশাহী' },
  { bn: 'সাথিয়া', en: ['santhia'], district: 'পাবনা', division: 'রাজশাহী', altBn: ['সাঁথিয়া', 'সাথিয়া'] },
  { bn: 'চাটমোহর', en: ['chatmohar'], district: 'পাবনা', division: 'রাজশাহী' },
  { bn: 'বেড়া', en: ['bera pabna'], district: 'পাবনা', division: 'রাজশাহী', altBn: ['বেড়া'] },
  { bn: 'আটঘরিয়া', en: ['atgharia'], district: 'পাবনা', division: 'রাজশাহী', altBn: ['আটঘরিয়া'] },
  { bn: 'ভাঙ্গুড়া', en: ['bhangura'], district: 'পাবনা', division: 'রাজশাহী', altBn: ['ভাঙ্গুড়া'] },

  // Sirajganj District
  { bn: 'সিরাজগঞ্জ সদর', en: ['sirajganj sadar'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },
  { bn: 'বেলকুচি', en: ['belkuchi'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },
  { bn: 'উল্লাপাড়া', en: ['ullapara'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী', altBn: ['উল্লাপাড়া'] },
  { bn: 'শাহজাদপুর', en: ['shahjadpur'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },
  { bn: 'রায়গঞ্জ', en: ['raiganj'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী', altBn: ['রায়গঞ্জ'] },
  { bn: 'কাজীপুর', en: ['kazipur'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },
  { bn: 'তাড়াশ', en: ['tarash'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী', altBn: ['তাড়াশ'] },
  { bn: 'কামারখন্দ', en: ['kamarkhanda'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },
  { bn: 'চৌহালী', en: ['chauhali'], district: 'সিরাজগঞ্জ', division: 'রাজশাহী' },

  // Naogaon District
  { bn: 'নওগাঁ সদর', en: ['naogaon sadar'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'পত্নীতলা', en: ['patnitala'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'ধামইরহাট', en: ['dhamoirhat'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'মহাদেবপুর', en: ['mohadevpur'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'পোরশা', en: ['porsha'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'সাপাহার', en: ['sapahar'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'নিয়ামতপুর', en: ['niamatpur'], district: 'নওগাঁ', division: 'রাজশাহী', altBn: ['নিয়ামতপুর'] },
  { bn: 'মান্দা', en: ['manda'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'বদলগাছী', en: ['badalgachhi'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'রানীনগর', en: ['raninagar'], district: 'নওগাঁ', division: 'রাজশাহী' },
  { bn: 'আত্রাই', en: ['atrai'], district: 'নওগাঁ', division: 'রাজশাহী' },

  // Natore District
  { bn: 'নাটোর সদর', en: ['natore sadar'], district: 'নাটোর', division: 'রাজশাহী' },
  { bn: 'সিংড়া', en: ['singra'], district: 'নাটোর', division: 'রাজশাহী', altBn: ['সিংড়া'] },
  { bn: 'গুরুদাসপুর', en: ['gurudaspur'], district: 'নাটোর', division: 'রাজশাহী' },
  { bn: 'বড়াইগ্রাম', en: ['baraigram'], district: 'নাটোর', division: 'রাজশাহী', altBn: ['বড়াইগ্রাম'] },
  { bn: 'লালপুর', en: ['lalpur'], district: 'নাটোর', division: 'রাজশাহী' },
  { bn: 'বাগাতিপাড়া', en: ['bagatipara'], district: 'নাটোর', division: 'রাজশাহী', altBn: ['বাগাতিপাড়া'] },
  { bn: 'নলডাঙ্গা', en: ['naldanga'], district: 'নাটোর', division: 'রাজশাহী' },

  // Chapainawabganj District
  { bn: 'চাঁপাইনবাবগঞ্জ সদর', en: ['chapainawabganj sadar'], district: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী' },
  { bn: 'শিবগঞ্জ', en: ['shibganj chapai'], district: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী' },
  { bn: 'গোমস্তাপুর', en: ['gomastapur'], district: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী' },
  { bn: 'নাচোল', en: ['nachole'], district: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী' },
  { bn: 'ভোলাহাট', en: ['bholahat'], district: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী' },

  // Joypurhat District
  { bn: 'জয়পুরহাট সদর', en: ['joypurhat sadar'], district: 'জয়পুরহাট', division: 'রাজশাহী', altBn: ['জয়পুরহাট সদর'] },
  { bn: 'পাঁচবিবি', en: ['panchbibi'], district: 'জয়পুরহাট', division: 'রাজশাহী' },
  { bn: 'কালাই', en: ['kalai'], district: 'জয়পুরহাট', division: 'রাজশাহী' },
  { bn: 'ক্ষেতলাল', en: ['khetlal'], district: 'জয়পুরহাট', division: 'রাজশাহী' },
  { bn: 'আক্কেলপুর', en: ['akkelpur'], district: 'জয়পুরহাট', division: 'রাজশাহী' },

  // ==================== KHULNA DIVISION ====================
  // Khulna District
  { bn: 'খুলনা সদর', en: ['khulna sadar'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'সোনাডাঙ্গা', en: ['sonadanga'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'খালিশপুর', en: ['khalishpur'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'দৌলতপুর', en: ['daulatpur khulna'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'খানজাহান আলী', en: ['khan jahan ali'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'ডুমুরিয়া', en: ['dumuria'], district: 'খুলনা', division: 'খুলনা', altBn: ['ডুমুরিয়া'] },
  { bn: 'রূপসা', en: ['rupsha'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'তেরখাদা', en: ['terokhada'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'ফুলতলা', en: ['phultala'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'বটিয়াঘাটা', en: ['batiaghata'], district: 'খুলনা', division: 'খুলনা', altBn: ['বটিয়াঘাটা'] },
  { bn: 'দাকোপ', en: ['dacope'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'পাইকগাছা', en: ['paikgachha'], district: 'খুলনা', division: 'খুলনা' },
  { bn: 'কয়রা', en: ['koyra'], district: 'খুলনা', division: 'খুলনা', altBn: ['কয়রা'] },
  { bn: 'দিঘলিয়া', en: ['dighalia'], district: 'খুলনা', division: 'খুলনা', altBn: ['দিঘলিয়া'] },

  // Jashore District
  { bn: 'যশোর সদর', en: ['jashore sadar', 'jessore sadar'], district: 'যশোর', division: 'খুলনা' },
  { bn: 'ঝিকরগাছা', en: ['jhikargachha'], district: 'যশোর', division: 'খুলনা' },
  { bn: 'শার্শা', en: ['sharsha', 'বেনাপোল', 'benapole'], district: 'যশোর', division: 'খুলনা' },
  { bn: 'মণিরামপুর', en: ['manirampur'], district: 'যশোর', division: 'খুলনা' },
  { bn: 'কেশবপুর', en: ['keshabpur'], district: 'যশোর', division: 'খুলনা' },
  { bn: 'অভয়নগর', en: ['abhaynagar', 'নওয়াপাড়া', 'nawapara'], district: 'যশোর', division: 'খুলনা', altBn: ['অভয় নগর', 'নওয়াপাড়া'] },
  { bn: 'বাঘারপাড়া', en: ['bagherpara'], district: 'যশোর', division: 'খুলনা', altBn: ['বাঘারপাড়া'] },
  { bn: 'চৌগাছা', en: ['chaugachha'], district: 'যশোর', division: 'খুলনা' },

  // Kushtia District
  { bn: 'কুষ্টিয়া সদর', en: ['kushtia sadar'], district: 'কুষ্টিয়া', division: 'খুলনা', altBn: ['কুষ্টিয়া সদর'] },
  { bn: 'কুমারখালী', en: ['kumarkhali'], district: 'কুষ্টিয়া', division: 'খুলনা' },
  { bn: 'খোকসা', en: ['khoksa'], district: 'কুষ্টিয়া', division: 'খুলনা' },
  { bn: 'মিরপুর', en: ['mirpur kushtia'], district: 'কুষ্টিয়া', division: 'খুলনা' },
  { bn: 'ভেড়ামারা', en: ['bheramara'], district: 'কুষ্টিয়া', division: 'খুলনা', altBn: ['ভেড়ামারা'] },
  { bn: 'দৌলতপুর', en: ['daulatpur kushtia'], district: 'কুষ্টিয়া', division: 'খুলনা' },

  // Jhenaidah District
  { bn: 'ঝিনাইদহ সদর', en: ['jhenaidah sadar'], district: 'ঝিনাইদহ', division: 'খুলনা' },
  { bn: 'শৈলকূপা', en: ['shailkupa'], district: 'ঝিনাইদহ', division: 'খুলনা' },
  { bn: 'হরিণাকুণ্ডু', en: ['harinakundu'], district: 'ঝিনাইদহ', division: 'খুলনা' },
  { bn: 'কালীগঞ্জ', en: ['kaliganj jhenaidah'], district: 'ঝিনাইদহ', division: 'খুলনা' },
  { bn: 'কোটচাঁদপুর', en: ['kotchandpur'], district: 'ঝিনাইদহ', division: 'খুলনা' },
  { bn: 'মহেশপুর', en: ['maheshpur'], district: 'ঝিনাইদহ', division: 'খুলনা' },

  // Satkhira District
  { bn: 'সাতক্ষীরা সদর', en: ['satkhira sadar'], district: 'সাতক্ষীরা', division: 'খুলনা' },
  { bn: 'কলারোয়া', en: ['kalaroa'], district: 'সাতক্ষীরা', division: 'খুলনা', altBn: ['কলারোয়া'] },
  { bn: 'তালা', en: ['tala'], district: 'সাতক্ষীরা', division: 'খুলনা' },
  { bn: 'দেবহাটা', en: ['debhata'], district: 'সাতক্ষীরা', division: 'খুলনা' },
  { bn: 'কালিগঞ্জ', en: ['kaliganj satkhira'], district: 'সাতক্ষীরা', division: 'খুলনা' },
  { bn: 'আশাশুনি', en: ['assasuni'], district: 'সাতক্ষীরা', division: 'খুলনা' },
  { bn: 'শ্যামনগর', en: ['shyamnagar'], district: 'সাতক্ষীরা', division: 'খুলনা' },

  // Bagerhat District
  { bn: 'বাগেরহাট সদর', en: ['bagerhat sadar'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'ফকিরহাট', en: ['fakirhat'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'মোল্লাহাট', en: ['mollahat'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'রামপাল', en: ['rampal'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'মোংলা', en: ['mongla'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'মোরেলগঞ্জ', en: ['morrelganj'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'কচুয়া', en: ['kachua bagerhat'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'শরণখোলা', en: ['sarankhola'], district: 'বাগেরহাট', division: 'খুলনা' },
  { bn: 'চিতলমারী', en: ['chitalmari'], district: 'বাগেরহাট', division: 'খুলনা' },

  // Chuadanga District
  { bn: 'চুয়াডাঙ্গা সদর', en: ['chuadanga sadar'], district: 'চুয়াডাঙ্গা', division: 'খুলনা', altBn: ['চুয়াডাঙ্গা সদর'] },
  { bn: 'আলমডাঙ্গা', en: ['alamdanga'], district: 'চুয়াডাঙ্গা', division: 'খুলনা' },
  { bn: 'দামুড়হুদা', en: ['damurhuda', 'দর্শনা', 'darshana'], district: 'চুয়াডাঙ্গা', division: 'খুলনা', altBn: ['দামুড়হুদা'] },
  { bn: 'জীবননগর', en: ['jibannagar'], district: 'চুয়াডাঙ্গা', division: 'খুলনা' },

  // Meherpur District
  { bn: 'মেহেরপুর সদর', en: ['meherpur sadar'], district: 'মেহেরপুর', division: 'খুলনা' },
  { bn: 'গাংনী', en: ['gangni'], district: 'মেহেরপুর', division: 'খুলনা' },
  { bn: 'মুজিবনগর', en: ['mujibnagar'], district: 'মেহেরপুর', division: 'খুলনা' },

  // Narail District
  { bn: 'নড়াইল সদর', en: ['narail sadar'], district: 'নড়াইল', division: 'খুলনা', altBn: ['নড়াইল সদর'] },
  { bn: 'লোহাগড়া', en: ['lohagara narail'], district: 'নড়াইল', division: 'খুলনা', altBn: ['লোহাগড়া'] },
  { bn: 'কালিয়া', en: ['kalia'], district: 'নড়াইল', division: 'খুলনা', altBn: ['কালিয়া'] },

  // Magura District
  { bn: 'মাগুরা সদর', en: ['magura sadar'], district: 'মাগুরা', division: 'খুলনা' },
  { bn: 'শ্রীপুর', en: ['sreepur magura'], district: 'মাগুরা', division: 'খুলনা' },
  { bn: 'মহম্মদপুর', en: ['mohammadpur magura'], district: 'মাগুরা', division: 'খুলনা' },
  { bn: 'শালিখা', en: ['shalikha'], district: 'মাগুরা', division: 'খুলনা' },

  // ==================== BARISHAL DIVISION ====================
  // Barishal District
  { bn: 'বরিশাল সদর', en: ['barishal sadar', 'barisal sadar', 'কোতোয়ালী', 'kotwali barishal'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'বাকেরগঞ্জ', en: ['bakerganj'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'বাবুগঞ্জ', en: ['babuganj'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'উজিরপুর', en: ['wazirpur'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'বানারীপাড়া', en: ['banaripara'], district: 'বরিশাল', division: 'বরিশাল', altBn: ['বানারীপাড়া'] },
  { bn: 'গৌরনদী', en: ['gournadi'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'আগৈলঝাড়া', en: ['agailjhara'], district: 'বরিশাল', division: 'বরিশাল', altBn: ['আগৈলঝাড়া'] },
  { bn: 'মেহেন্দিগঞ্জ', en: ['mehendiganj'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'মুলাদী', en: ['muladi'], district: 'বরিশাল', division: 'বরিশাল' },
  { bn: 'হিজলা', en: ['hizla'], district: 'বরিশাল', division: 'বরিশাল' },

  // Patuakhali District
  { bn: 'পটুয়াখালী সদর', en: ['patuakhali sadar'], district: 'পটুয়াখালী', division: 'বরিশাল', altBn: ['পটুয়াখালী সদর'] },
  { bn: 'বাউফল', en: ['bauphal'], district: 'পটুয়াখালী', division: 'বরিশাল' },
  { bn: 'গলাচিপা', en: ['galachipa'], district: 'পটুয়াখালী', division: 'বরিশাল' },
  { bn: 'কলাপাড়া', en: ['kalapara', 'কুয়াকাটা', 'kuakata'], district: 'পটুয়াখালী', division: 'বরিশাল', altBn: ['কলাপাড়া'] },
  { bn: 'মির্জাগঞ্জ', en: ['mirzaganj'], district: 'পটুয়াখালী', division: 'বরিশাল' },
  { bn: 'দুমকি', en: ['dumki'], district: 'পটুয়াখালী', division: 'বরিশাল' },
  { bn: 'দশমিনা', en: ['dashmina'], district: 'পটুয়াখালী', division: 'বরিশাল' },
  { bn: 'রাঙ্গাবালী', en: ['rangabali'], district: 'পটুয়াখালী', division: 'বরিশাল' },

  // Bhola District
  { bn: 'ভোলা সদর', en: ['bhola sadar'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'বোরহানউদ্দিন', en: ['borhanuddin'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'দৌলতখান', en: ['daulatkhan'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'তজুমদ্দিন', en: ['tazumuddin'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'লালমোহন', en: ['lalmohan'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'চরফ্যাশন', en: ['char fasson', 'charfasson'], district: 'ভোলা', division: 'বরিশাল' },
  { bn: 'মনপুরা', en: ['manpura'], district: 'ভোলা', division: 'বরিশাল' },

  // Pirojpur District
  { bn: 'পিরোজপুর সদর', en: ['pirojpur sadar'], district: 'পিরোজপুর', division: 'বরিশাল' },
  { bn: 'নাজিরপুর', en: ['nazirpur'], district: 'পিরোজপুর', division: 'বরিশাল' },
  { bn: 'নেছারাবাদ', en: ['nesarabad', 'স্বরূপকাঠি', 'swarupkathi'], district: 'পিরোজপুর', division: 'বরিশাল' },
  { bn: 'কাউখালী', en: ['kaukhali pirojpur'], district: 'পিরোজপুর', division: 'বরিশাল' },
  { bn: 'ইন্দুরকানী', en: ['indurkani', 'জিয়ানগর', 'jianagar'], district: 'পিরোজপুর', division: 'বরিশাল' },
  { bn: 'ভাণ্ডারিয়া', en: ['bhandaria'], district: 'পিরোজপুর', division: 'বরিশাল', altBn: ['ভান্ডারিয়া', 'ভাণ্ডারিয়া'] },
  { bn: 'মঠবাড়িয়া', en: ['mathbaria'], district: 'পিরোজপুর', division: 'বরিশাল', altBn: ['মঠবাড়িয়া'] },

  // Barguna District
  { bn: 'বরগুনা সদর', en: ['barguna sadar'], district: 'বরগুনা', division: 'বরিশাল' },
  { bn: 'আমতলী', en: ['amtali'], district: 'বরগুনা', division: 'বরিশাল' },
  { bn: 'পাথরঘাটা', en: ['patharghata'], district: 'বরগুনা', division: 'বরিশাল' },
  { bn: 'বেতাগী', en: ['betagi'], district: 'বরগুনা', division: 'বরিশাল' },
  { bn: 'বামনা', en: ['bamna'], district: 'বরগুনা', division: 'বরিশাল' },
  { bn: 'তালতলী', en: ['taltali'], district: 'বরগুনা', division: 'বরিশাল' },

  // Jhalokati District
  { bn: 'ঝালকাঠি সদর', en: ['jhalokati sadar'], district: 'ঝালকাঠি', division: 'বরিশাল' },
  { bn: 'নলছিটি', en: ['nalchhiti'], district: 'ঝালকাঠি', division: 'বরিশাল' },
  { bn: 'রাজাপুর', en: ['rajapur'], district: 'ঝালকাঠি', division: 'বরিশাল' },
  { bn: 'কাঁঠালিয়া', en: ['kathalia'], district: 'ঝালকাঠি', division: 'বরিশাল', altBn: ['কাঠালিয়া'] },

  // ==================== RANGPUR DIVISION ====================
  // Rangpur District
  { bn: 'রংপুর সদর', en: ['rangpur sadar', 'কোতোয়ালী', 'মাহিগঞ্জ', 'হারাগাছ', 'tajhat'], district: 'রংপুর', division: 'রংপুর' },
  { bn: 'বদরগঞ্জ', en: ['badarganj'], district: 'রংপুর', division: 'রংপুর' },
  { bn: 'মিঠাপুকুর', en: ['mithapukur'], district: 'রংপুর', division: 'রংপুর' },
  { bn: 'পীরগঞ্জ', en: ['pirganj rangpur'], district: 'রংপুর', division: 'রংপুর' },
  { bn: 'পীরগাছা', en: ['pirgachha'], district: 'রংপুর', division: 'রংপুর' },
  { bn: 'কাউনিয়া', en: ['kaunia'], district: 'রংপুর', division: 'রংপুর', altBn: ['কাউনিয়া'] },
  { bn: 'গংগাচড়া', en: ['gangachhara'], district: 'রংপুর', division: 'রংপুর', altBn: ['গঙ্গাচড়া'] },
  { bn: 'তারাগঞ্জ', en: ['taraganj'], district: 'রংপুর', division: 'রংপুর' },

  // Dinajpur District
  { bn: 'দিনাজপুর সদর', en: ['dinajpur sadar'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'বিরল', en: ['birol'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'বোচাগঞ্জ', en: ['bochaganj'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'কাহারোল', en: ['kaharole'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'বীরগঞ্জ', en: ['birganj'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'খানসামা', en: ['khansama'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'চিরিরবন্দর', en: ['chirirbandar'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'পার্বতীপুর', en: ['parbatipur'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'ফুলবাড়ী', en: ['fulbari dinajpur'], district: 'দিনাজপুর', division: 'রংপুর', altBn: ['ফুলবাড়ী'] },
  { bn: 'নবাবগঞ্জ', en: ['nawabganj dinajpur'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'বিরামপুর', en: ['birampur'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'হাকিমপুর', en: ['hakimpur', 'হিলি', 'hili'], district: 'দিনাজপুর', division: 'রংপুর' },
  { bn: 'ঘোড়াঘাট', en: ['ghoraghat'], district: 'দিনাজপুর', division: 'রংপুর', altBn: ['ঘোড়াঘাট'] },

  // Gaibandha District
  { bn: 'গাইবান্ধা সদর', en: ['gaibandha sadar'], district: 'গাইবান্ধা', division: 'রংপুর' },
  { bn: 'সাদুল্লাপুর', en: ['sadullapur'], district: 'গাইবান্ধা', division: 'রংপুর' },
  { bn: 'সুন্দরগঞ্জ', en: ['sundarganj'], district: 'গাইবান্ধা', division: 'রংপুর' },
  { bn: 'গোবিন্দগঞ্জ', en: ['gobindaganj'], district: 'গাইবান্ধা', division: 'রংপুর' },
  { bn: 'পলাশবাড়ী', en: ['palashbari'], district: 'গাইবান্ধা', division: 'রংপুর', altBn: ['পলাশবাড়ী'] },
  { bn: 'সাঘাটা', en: ['saghata'], district: 'গাইবান্ধা', division: 'রংপুর' },
  { bn: 'ফুলছড়ি', en: ['fulchhari'], district: 'গাইবান্ধা', division: 'রংপুর', altBn: ['ফুলছড়ি'] },

  // Kurigram District
  { bn: 'কুড়িগ্রাম সদর', en: ['kurigram sadar'], district: 'কুড়িগ্রাম', division: 'রংপুর', altBn: ['কুড়িগ্রাম সদর'] },
  { bn: 'নাগেশ্বরী', en: ['nageshwari'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'ভূরুঙ্গামারী', en: ['bhurungamari'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'ফুলবাড়ী', en: ['fulbari kurigram'], district: 'কুড়িগ্রাম', division: 'রংপুর', altBn: ['ফুলবাড়ী'] },
  { bn: 'রাজারহাট', en: ['rajarhat'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'উলিপুর', en: ['ulipur'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'চিলমারী', en: ['chilmari'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'রৌমারী', en: ['rowmari'], district: 'কুড়িগ্রাম', division: 'রংপুর' },
  { bn: 'রাজিবপুর', en: ['char rajibpur', 'rajibpur'], district: 'কুড়িগ্রাম', division: 'রংপুর' },

  // Nilphamari District
  { bn: 'নীলফামারী সদর', en: ['nilphamari sadar'], district: 'নীলফামারী', division: 'রংপুর' },
  { bn: 'সৈয়দপুর', en: ['saidpur', 'syedpur'], district: 'নীলফামারী', division: 'রংপুর', altBn: ['সৈয়দপুর'] },
  { bn: 'ডোমার', en: ['domar'], district: 'নীলফামারী', division: 'রংপুর' },
  { bn: 'ডিমলা', en: ['dimla'], district: 'নীলফামারী', division: 'রংপুর' },
  { bn: 'জলঢাকা', en: ['jaldhaka'], district: 'নীলফামারী', division: 'রংপুর' },
  { bn: 'কিশোরগঞ্জ', en: ['kishoreganj nilphamari'], district: 'নীলফামারী', division: 'রংপুর' },

  // Lalmonirhat District
  { bn: 'লালমনিরহাট সদর', en: ['lalmonirhat sadar'], district: 'লালমনিরহাট', division: 'রংপুর' },
  { bn: 'আদিতমারী', en: ['aditmari'], district: 'লালমনিরহাট', division: 'রংপুর' },
  { bn: 'কালীগঞ্জ', en: ['kaliganj lalmonirhat'], district: 'লালমনিরহাট', division: 'রংপুর' },
  { bn: 'হাতীবান্ধা', en: ['hatibandha'], district: 'লালমনিরহাট', division: 'রংপুর' },
  { bn: 'পাটগ্রাম', en: ['patgram'], district: 'লালমনিরহাট', division: 'রংপুর' },

  // Thakurgaon District
  { bn: 'ঠাকুরগাঁও সদর', en: ['thakurgaon sadar'], district: 'ঠাকুরগাঁও', division: 'রংপুর' },
  { bn: 'পীরগঞ্জ', en: ['pirganj thakurgaon'], district: 'ঠাকুরগাঁও', division: 'রংপুর' },
  { bn: 'বালিয়াডাঙ্গী', en: ['baliadangi'], district: 'ঠাকুরগাঁও', division: 'রংপুর', altBn: ['বালিয়াডাঙ্গী'] },
  { bn: 'রাণীশংকৈল', en: ['ranisankail'], district: 'ঠাকুরগাঁও', division: 'রংপুর', altBn: ['রানীশংকৈল'] },
  { bn: 'হরিপুর', en: ['haripur'], district: 'ঠাকুরগাঁও', division: 'রংপুর' },

  // Panchagarh District
  { bn: 'পঞ্চগড় সদর', en: ['panchagarh sadar'], district: 'পঞ্চগড়', division: 'রংপুর', altBn: ['পঞ্চগড় সদর'] },
  { bn: 'তেঁতুলিয়া', en: ['tetulia'], district: 'পঞ্চগড়', division: 'রংপুর', altBn: ['তেতুলিয়া', 'তেঁতুলিয়া'] },
  { bn: 'বোদা', en: ['boda'], district: 'পঞ্চগড়', division: 'রংপুর' },
  { bn: 'দেবীগঞ্জ', en: ['debiganj'], district: 'পঞ্চগড়', division: 'রংপুর' },
  { bn: 'অটোয়ারী', en: ['atwari'], district: 'পঞ্চগড়', division: 'রংপুর', altBn: ['আটোয়ারী', 'আটোয়ারী'] },

  // ==================== MYMENSINGH DIVISION ====================
  // Mymensingh District
  { bn: 'ময়মনসিংহ সদর', en: ['mymensingh sadar'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ', altBn: ['ময়মনসিংহ সদর'] },
  { bn: 'মুক্তাগাছা', en: ['muktagachha'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'ত্রিশাল', en: ['trishal'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'ভালুকা', en: ['bhaluka'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'ফুলবাড়িয়া', en: ['fulbaria'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ', altBn: ['ফুলবাড়িয়া'] },
  { bn: 'গফরগাঁও', en: ['gafargaon'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'ঈশ্বরগঞ্জ', en: ['ishwarganj'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'নান্দাইল', en: ['nandail'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'গৌরীপুর', en: ['gouripur'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'ফুলপুর', en: ['phulpur'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },
  { bn: 'হালুয়াঘাট', en: ['haluaghat'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ', altBn: ['হালুয়াঘাট'] },
  { bn: 'ধোবাউড়া', en: ['dhobaura'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ', altBn: ['ধোবাউড়া'] },
  { bn: 'তারাকান্দা', en: ['tarakanda'], district: 'ময়মনসিংহ', division: 'ময়মনসিংহ' },

  // Jamalpur District
  { bn: 'জামালপুর সদর', en: ['jamalpur sadar'], district: 'জামালপুর', division: 'ময়মনসিংহ' },
  { bn: 'সরিষাবাড়ী', en: ['sarishabari'], district: 'জামালপুর', division: 'ময়মনসিংহ', altBn: ['সরিষাবাড়ী'] },
  { bn: 'মেলান্দহ', en: ['melandaha'], district: 'জামালপুর', division: 'ময়মনসিংহ' },
  { bn: 'ইসলামপুর', en: ['islampur'], district: 'জামালপুর', division: 'ময়মনসিংহ' },
  { bn: 'দেওয়ানগঞ্জ', en: ['dewanganj'], district: 'জামালপুর', division: 'ময়মনসিংহ', altBn: ['দেওয়ানগঞ্জ'] },
  { bn: 'মাদারগঞ্জ', en: ['madarganj'], district: 'জামালপুর', division: 'ময়মনসিংহ' },
  { bn: 'বকশীগঞ্জ', en: ['bakshiganj'], district: 'জামালপুর', division: 'ময়মনসিংহ', altBn: ['বকসিগঞ্জ'] },

  // Sherpur District
  { bn: 'শেরপুর সদর', en: ['sherpur sadar'], district: 'শেরপুর', division: 'ময়মনসিংহ' },
  { bn: 'নকলা', en: ['nakla'], district: 'শেরপুর', division: 'ময়মনসিংহ' },
  { bn: 'নালিতাবাড়ী', en: ['nalitabari'], district: 'শেরপুর', division: 'ময়মনসিংহ', altBn: ['নালিতাবাড়ী'] },
  { bn: 'শ্রীবরদী', en: ['sreebardi'], district: 'শেরপুর', division: 'ময়মনসিংহ' },
  { bn: 'ঝিনাইগাতী', en: ['jhenaigati'], district: 'শেরপুর', division: 'ময়মনসিংহ' },

  // Netrokona District
  { bn: 'নেত্রকোণা সদর', en: ['netrokona sadar'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ', altBn: ['নেত্রকোনা সদর'] },
  { bn: 'বারহাট্টা', en: ['barhatta'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'কলমাকান্দা', en: ['kalmakanda'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'দুর্গাপুর', en: ['durgapur netrokona'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'পূর্বধলা', en: ['purbadhala'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'কেন্দুয়া', en: ['kendua'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ', altBn: ['কেন্দুয়া'] },
  { bn: 'মদন', en: ['madan'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'মোহনগঞ্জ', en: ['mohanganj'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ' },
  { bn: 'খালিয়াজুড়ি', en: ['khaliajuri'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ', altBn: ['খালিয়াঝুড়ি'] },
  { bn: 'আটপাড়া', en: ['atpara'], district: 'নেত্রকোণা', division: 'ময়মনসিংহ', altBn: ['আটপাড়া'] },
];

/**
 * Standardize Bengali text for resilient matching:
 * Handles ড়/ড়, য়/য, ঢ়/ঢ, ি/ী, ু/ূ, ণ/ন, শ/ষ/স, চন্দ্রবিন্দু, punctuation, and collapsed spaces
 */
export function normalizeBn(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u09DC\u09A1\u09BC]/g, 'ড়')
    .replace(/[\u09DF\u09AF\u09BC]/g, 'য়')
    .replace(/[\u09DD\u09A2\u09BC]/g, 'ঢ়')
    .replace(/ী/g, 'ি')
    .replace(/ূ/g, 'ু')
    .replace(/ণ/g, 'ন')
    .replace(/[শষ]/g, 'স')
    .replace(/ঁ/g, '')
    .replace(/\u09BC/g, '')
    .replace(/[-–—,:;./#|()[\]{}_\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeEn(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[-–—,:;./#|()[\]{}_\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if the text matches a keyword in Bengali or English
 */
function matchesKeyword(text: string, lowerText: string, normText: string, bn: string, altBn?: string[], en?: string[]): boolean {
  if (!bn && (!altBn || altBn.length === 0) && (!en || en.length === 0)) return false;

  // 1. Direct Bengali check
  if (bn) {
    if (text.includes(bn)) return true;
    const normBn = normalizeBn(bn);
    if (normBn && normText.includes(normBn)) return true;
    const collapsedNormText = normText.replace(/\s/g, '');
    const collapsedNormBn = normBn.replace(/\s/g, '');
    if (collapsedNormBn && collapsedNormText.includes(collapsedNormBn)) return true;
  }

  // 2. Alt Bengali checks
  if (altBn && Array.isArray(altBn)) {
    const collapsedNormText = normText.replace(/\s/g, '');
    for (const a of altBn) {
      if (!a) continue;
      if (text.includes(a)) return true;
      const normA = normalizeBn(a);
      if (normA && normText.includes(normA)) return true;
      const collapsedNormA = normA.replace(/\s/g, '');
      if (collapsedNormA && collapsedNormText.includes(collapsedNormA)) return true;
    }
  }

  // 3. English transliterations
  if (en && Array.isArray(en)) {
    const cleanEnAddr = normalizeEn(lowerText);
    const collapsedEnAddr = cleanEnAddr.replace(/\s/g, '');
    for (const e of en) {
      if (!e) continue;
      const lowerE = e.toLowerCase();
      if (lowerText.includes(lowerE)) return true;
      const cleanE = normalizeEn(e);
      if (cleanE && cleanEnAddr.includes(cleanE)) return true;
      const collapsedE = cleanE.replace(/\s/g, '');
      if (collapsedE.length >= 3 && collapsedEnAddr.includes(collapsedE)) return true;
    }
  }

  return false;
}

export const DEFAULT_CUSTOM_LOCATIONS: {
  id: string;
  nameBn: string;
  nameEn?: string;
  type: 'district' | 'upazila' | 'sub_city' | 'area';
  division: string;
  district: string;
  deliveryFee?: number;
  isSubCity?: boolean;
  notes?: string;
}[] = [
  {
    id: 'preset-savar',
    nameBn: 'সাভার',
    nameEn: 'Savar',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'ঢাকা',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'ঢাকা শহরতলী (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-keraniganj',
    nameBn: 'কেরানীগঞ্জ',
    nameEn: 'Keraniganj',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'ঢাকা',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'ঢাকা শহরতলী (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-tongi',
    nameBn: 'টঙ্গী',
    nameEn: 'Tongi',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'গাজীপুর',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'গাজীপুর জেলা (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-gazipur-sadar',
    nameBn: 'গাজীপুর সদর',
    nameEn: 'Gazipur Sadar',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'গাজীপুর',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'গাজীপুর জেলা (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-kaliakair',
    nameBn: 'কালিয়াকৈর',
    nameEn: 'Kaliakair',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'গাজীপুর',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'গাজীপুর জেলা (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-dhamrai',
    nameBn: 'ধামরাই',
    nameEn: 'Dhamrai',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'ঢাকা',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'ঢাকা শহরতলী (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-ashulia',
    nameBn: 'আশুলিয়া',
    nameEn: 'Ashulia',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'ঢাকা',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'ঢাকা শহরতলী (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-sonargaon',
    nameBn: 'সোনারগাঁও',
    nameEn: 'Sonargaon',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'নারায়ণগঞ্জ',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'নারায়ণগঞ্জ জেলা (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
  {
    id: 'preset-rupganj',
    nameBn: 'রূপগঞ্জ',
    nameEn: 'Rupganj',
    type: 'sub_city',
    division: 'ঢাকা',
    district: 'নারায়ণগঞ্জ',
    deliveryFee: 130,
    isSubCity: true,
    notes: 'নারায়ণগঞ্জ জেলা (ঢাকার বাইরে ডেলিভারি চার্জ ১৩০ টাকা)',
  },
];

/**
 * Searches custom locations (sub-cities, thanas, areas, districts)
 * by Thana name, Full Address string, or District name, matching both
 * Bengali & English representations.
 *
 * CRITICAL RULE: When admin sets a custom delivery fee for any area, thana,
 * sub-city, or district (including Dhaka, Tangail, Gazipur, Narayanganj, etc.),
 * that customized fee must be strictly applied when customer enters or selects
 * that location, regardless of whether the location's type is 'sub_city', 'upazila',
 * or 'district'.
 */
export function findMatchingLocation(
  customLocations: any[] | undefined,
  criteria: {
    address?: string;
    thana?: string;
    district?: string;
    division?: string;
  },
  _skipParserFallback = false
): any | null {
  const locations = (customLocations && Array.isArray(customLocations) && customLocations.length > 0)
    ? customLocations
    : DEFAULT_CUSTOM_LOCATIONS;

  // Filter only locations that have an active deliveryFee defined
  const validLocations = locations.filter(
    (loc) => loc && loc.deliveryFee !== undefined && loc.deliveryFee !== null && !isNaN(Number(loc.deliveryFee))
  );

  if (validLocations.length === 0) return null;

  const rawAddr = (criteria.address || '').trim();
  const lowerAddr = rawAddr.toLowerCase();
  const normAddr = normalizeBn(rawAddr);

  const rawThana = (criteria.thana || '').trim();
  const lowerThana = rawThana.toLowerCase();
  const normThana = normalizeBn(rawThana);

  const rawDist = (criteria.district || '').trim();
  const lowerDist = rawDist.toLowerCase();
  const normDist = normalizeBn(rawDist);

  // 1. High priority: Exact or substring match on Thana / Upazila / Specific Area
  if (rawThana) {
    for (const loc of validLocations) {
      if (loc.nameBn) {
        const normLoc = normalizeBn(loc.nameBn);
        if (normThana === normLoc || normThana.includes(normLoc) || normLoc.includes(normThana)) {
          return loc;
        }
      }
      if (loc.nameEn && loc.nameEn.trim()) {
        const lowerLoc = loc.nameEn.trim().toLowerCase();
        if (lowerThana === lowerLoc || lowerThana.includes(lowerLoc) || lowerLoc.includes(lowerThana)) {
          return loc;
        }
      }
    }
  }

  // 2. High priority: Match location keyword in full address string
  // Sort locations by length descending (sub-cities and upazilas first) so specific areas match before broad names
  if (rawAddr) {
    const sortedForAddress = [...validLocations].sort((a, b) => {
      const aIsSpecific = a.isSubCity || a.type === 'sub_city' || a.type === 'upazila' || a.type === 'area';
      const bIsSpecific = b.isSubCity || b.type === 'sub_city' || b.type === 'upazila' || b.type === 'area';
      if (aIsSpecific !== bIsSpecific) return aIsSpecific ? -1 : 1;
      return (b.nameBn?.length || 0) - (a.nameBn?.length || 0);
    });

    for (const loc of sortedForAddress) {
      if (loc.nameBn) {
        const normLoc = normalizeBn(loc.nameBn);
        if (normLoc.length >= 2 && (rawAddr.includes(loc.nameBn) || normAddr.includes(normLoc))) {
          return loc;
        }
      }
      if (loc.nameEn && loc.nameEn.trim()) {
        const lowerLoc = loc.nameEn.trim().toLowerCase();
        if (lowerLoc.length >= 3 && lowerAddr.includes(lowerLoc)) {
          return loc;
        }
      }
    }
  }

  // 3. District-level exact custom fee matching (Matches regardless of loc.type!)
  // E.g., admin customized Dhaka, Tangail, Gazipur, Narayanganj, Kishoreganj, Narsingdi
  if (rawDist) {
    // 3a. First check if location name directly equals the district name (e.g., nameBn == 'ঢাকা' or 'টাঙ্গাইল')
    for (const loc of validLocations) {
      if (loc.nameBn) {
        const normLoc = normalizeBn(loc.nameBn);
        if (normDist === normLoc || normDist.includes(normLoc) || normLoc.includes(normDist)) {
          return loc;
        }
      }
      if (loc.nameEn && loc.nameEn.trim()) {
        const lowerLoc = loc.nameEn.trim().toLowerCase();
        if (lowerDist === lowerLoc || lowerDist.includes(lowerLoc) || lowerLoc.includes(lowerDist)) {
          return loc;
        }
      }
    }

    // 3b. Next check if location is explicitly typed as a district custom fee matching criteria district
    for (const loc of validLocations) {
      if (loc.type === 'district' && loc.district) {
        const normLocDist = normalizeBn(loc.district);
        const lowerLocDist = loc.district.trim().toLowerCase();
        if (normDist === normLocDist || lowerDist === lowerLocDist) {
          return loc;
        }
      }
    }
  }

  // 4. Fallback: If address was given without explicit district/thana, run address parser and re-match safely
  if (!_skipParserFallback && rawAddr && (!rawDist || !rawThana)) {
    const parsed = parseBangladeshAddress(rawAddr, validLocations, true);
    if (parsed.thana && parsed.thana !== rawThana) {
      const matchThana = findMatchingLocation(validLocations, { thana: parsed.thana }, true);
      if (matchThana) return matchThana;
    }
    if (parsed.district && parsed.district !== rawDist) {
      const matchDist = findMatchingLocation(validLocations, { district: parsed.district }, true);
      if (matchDist) return matchDist;
    }
  }

  return null;
}

/**
 * Parses freeform Bangladesh address text into Division, District, Thana, and Postcode
 */
export function parseBangladeshAddress(
  text: string,
  customLocations?: {
    nameBn: string;
    nameEn?: string;
    type: string;
    division: string;
    district: string;
    deliveryFee?: number;
    isSubCity?: boolean;
  }[],
  skipMatchingLocation = false
): ParsedAddress {
  if (!text || typeof text !== 'string') return {};

  const clean = text.trim();
  if (!clean) return {};

  const lower = clean.toLowerCase();
  const normalized = normalizeBn(clean);

  const locationsToSearch = (customLocations && Array.isArray(customLocations) && customLocations.length > 0)
    ? customLocations
    : DEFAULT_CUSTOM_LOCATIONS;

  let detectedDivision: string | undefined;
  let detectedDistrict: string | undefined;
  let detectedThana: string | undefined;
  let detectedPostCode: string | undefined;
  let detectedDeliveryFee: number | undefined;
  let detectedIsSubCity: boolean | undefined;

  // 0. Check Custom Locations First (Admin-configured sub-cities, custom areas or custom fees)
  // Sort so more specific sub-cities/thanas are evaluated before general district names
  const sortedLocations = [...locationsToSearch].sort((a, b) => {
    const aIsSpecific = a.isSubCity || a.type === 'sub_city' || a.type === 'upazila' || a.type === 'area';
    const bIsSpecific = b.isSubCity || b.type === 'sub_city' || b.type === 'upazila' || b.type === 'area';
    if (aIsSpecific !== bIsSpecific) return aIsSpecific ? -1 : 1;
    return (b.nameBn?.length || 0) - (a.nameBn?.length || 0);
  });

  for (const c of sortedLocations) {
    if (matchesKeyword(clean, lower, normalized, c.nameBn, undefined, c.nameEn ? [c.nameEn.toLowerCase()] : undefined)) {
      if (c.type === 'district' || (!c.district && c.division)) {
        detectedDistrict = c.nameBn;
        detectedDivision = c.division;
      } else {
        detectedThana = c.nameBn;
        detectedDistrict = c.district || c.nameBn;
        detectedDivision = c.division;
      }
      if (c.deliveryFee !== undefined && c.deliveryFee !== null && !isNaN(c.deliveryFee)) {
        detectedDeliveryFee = c.deliveryFee;
      }
      if (c.isSubCity || c.type === 'sub_city') {
        detectedIsSubCity = true;
      }
      break;
    }
  }

  // 1. Detect Postcode: 4 digits in English (e.g. 1216, 1205) or Bengali (e.g. ১২১৬)
  const postCodeMatch = clean.match(/(?:^|[^\d০-৯])([1-9][0-9]{3}|[১-৯][০-৯]{3})(?:$|[^\d০-৯])/);
  if (postCodeMatch) {
    detectedPostCode = postCodeMatch[1];
  }

  // 2. Check Thanas/Upazilas across ALL of Bangladesh (only if not already detected from custom location)
  // Sort longer names first so specific thanas match before prefixes
  if (!detectedThana) {
    const sortedThanas = [...BD_ALL_UPAZILAS_THANAS].sort((a, b) => (b.bn?.length || 0) - (a.bn?.length || 0));
    for (const t of sortedThanas) {
      if (matchesKeyword(clean, lower, normalized, t.bn, t.altBn, t.en)) {
        detectedThana = t.bn;
        detectedDistrict = t.district;
        detectedDivision = t.division;
        break;
      }
    }
  }

  // 3. Check 64 Districts
  if (!detectedDistrict) {
    const sortedDistricts = [...BD_DISTRICTS].sort((a, b) => (b.bn?.length || 0) - (a.bn?.length || 0));
    for (const d of sortedDistricts) {
      if (matchesKeyword(clean, lower, normalized, d.bn, d.altBn, d.en)) {
        detectedDistrict = d.bn;
        detectedDivision = d.division;
        break;
      }
    }
  }

  // 4. Check Divisions explicitly if division still missing
  if (!detectedDivision) {
    const divisionMap: Record<string, string> = {
      'ঢাকা': 'ঢাকা',
      'dhaka': 'ঢাকা',
      'চট্টগ্রাম': 'চট্টগ্রাম',
      'chattogram': 'চট্টগ্রাম',
      'chittagong': 'চট্টগ্রাম',
      'রাজশাহী': 'রাজশাহী',
      'rajshahi': 'রাজশাহী',
      'খুলনা': 'খুলনা',
      'khulna': 'খুলনা',
      'বরিশাল': 'বরিশাল',
      'barishal': 'বরিশাল',
      'barisal': 'বরিশাল',
      'সিলেট': 'সিলেট',
      'sylhet': 'সিলেট',
      'রংপুর': 'রংপুর',
      'rangpur': 'রংপুর',
      'ময়মনসিংহ': 'ময়মনসিংহ',
      'ময়মনসিংহ': 'ময়মনসিংহ',
      'mymensingh': 'ময়মনসিংহ',
    };

    for (const [key, val] of Object.entries(divisionMap)) {
      if (clean.includes(key) || lower.includes(key)) {
        detectedDivision = val;
        break;
      }
    }
  }

  // 5. If District was found and no thana, automatically assign the standard Sadar or matching thana
  if (detectedDistrict && !detectedThana) {
    if (detectedDistrict !== 'ঢাকা') {
      const sadarMatch = BD_ALL_UPAZILAS_THANAS.find(
        (t) => t.district === detectedDistrict && (t.bn.includes('সদর') || (t.altBn && t.altBn.some((a) => a.includes('সদর'))))
      );
      if (sadarMatch) {
        detectedThana = sadarMatch.bn;
      } else {
        const firstMatch = BD_ALL_UPAZILAS_THANAS.find((t) => t.district === detectedDistrict);
        if (firstMatch) {
          detectedThana = firstMatch.bn;
        }
      }
    }
  }

  // 5b. If thana was detected but no postcode in text, supply default standard post code
  if (!detectedPostCode && (detectedThana || detectedDistrict)) {
    const postCodeLookup: Record<string, string> = {
      'মিরপুর': '1216', 'মিরপুর মডেল': '1216', 'পল্লবী': '1216', 'কাফরুল': '1206',
      'উত্তরা': '1230', 'উত্তরা মডেল': '1230', 'উত্তরা পূর্ব': '1230', 'উত্তরা পশ্চিম': '1230',
      'ধানমন্ডি': '1205', 'নিউমার্কেট': '1205', 'কলাবাগান': '1205',
      'গুলশান': '1212', 'বনানী': '1213', 'বাড্ডা': '1212', 'ভাটারা': '1229',
      'মোহাম্মদপুর': '1207', 'আদাবর': '1207', 'শেরেবাংলা নগর': '1207',
      'মতিঝিল': '1000', 'পল্টন': '1000', 'পল্টন মডেল': '1000', 'শাহবাগ': '1000',
      'খিলগাঁও': '1219', 'রামপুরা': '1219', 'সবুজবাগ': '1214', 'মুগদা': '1214',
      'যাত্রাবাড়ী': '1204', 'কদমতলী': '1236', 'শ্যামপুর': '1204',
      'কোতোয়ালী': '1100', 'সূত্রাপুর': '1100', 'বংশাল': '1100', 'লালবাগ': '1211', 'চকবাজার': '1211',
      'তেজগাঁও': '1215', 'তেজগাঁও শিল্পাঞ্চল': '1208',
      'সাভার': '1340', 'ধামরাই': '1350', 'কেরানীগঞ্জ': '1310',
      'টঙ্গী': '1710', 'গাজীপুর সদর': '1700', 'কালিয়াকৈর': '1750', 'শ্রীপুর': '1740',
      'নারায়ণগঞ্জ সদর': '1400', 'ফতুল্লা': '1420', 'সিদ্ধিরগঞ্জ': '1430', 'সোনারগাঁও': '1440',
    };
    if (detectedThana && postCodeLookup[detectedThana]) {
      detectedPostCode = postCodeLookup[detectedThana];
    }
  }

  // 6. Final verification with findMatchingLocation to ensure any custom delivery fee is picked up:
  if (!skipMatchingLocation) {
    const matchResult = findMatchingLocation(
      locationsToSearch,
      {
        thana: detectedThana,
        district: detectedDistrict,
        division: detectedDivision,
      },
      true
    );

    if (matchResult && matchResult.deliveryFee !== undefined && matchResult.deliveryFee !== null && !isNaN(matchResult.deliveryFee)) {
      detectedDeliveryFee = matchResult.deliveryFee;
      if (matchResult.isSubCity || matchResult.type === 'sub_city') {
        detectedIsSubCity = true;
      }
      if (!detectedThana && matchResult.type !== 'district') {
        detectedThana = matchResult.nameBn;
      }
      if (!detectedDistrict) {
        detectedDistrict = matchResult.district;
      }
      if (!detectedDivision) {
        detectedDivision = matchResult.division;
      }
    }
  }

  const isInsideDhaka = isInsideDhakaMetro({
    address: clean,
    thana: detectedThana,
    district: detectedDistrict,
    division: detectedDivision,
  });

  if (isInsideDhaka) {
    if (!detectedDistrict) {
      detectedDistrict = 'ঢাকা';
    }
    if (!detectedDivision) {
      detectedDivision = 'ঢাকা';
    }
    detectedDeliveryFee = 70;
  } else if (!detectedDeliveryFee || detectedDeliveryFee < 130) {
    detectedDeliveryFee = 130;
  }

  return {
    division: detectedDivision,
    district: detectedDistrict,
    thana: detectedThana,
    postCode: detectedPostCode,
    deliveryFee: detectedDeliveryFee,
    isSubCity: detectedIsSubCity,
    isInsideDhaka,
  };
}

/**
 * Checks whether an address or criteria strictly falls inside the
 * 49 designated Dhaka Metropolitan City Thanas.
 * 
 * STRICT RULE (Customer instruction):
 * ONLY the 49 Dhaka Metro city thanas are Inside Dhaka.
 * ALL other thanas/areas/districts in Bangladesh are Outside Dhaka.
 * Suburban areas in Dhaka district (e.g. Savar, Ashulia, Keraniganj, Dhamrai, Dohar, Nawabganj)
 * are OUTSIDE Dhaka.
 */
function isThanaInDhakaMetro(thanaName: string): boolean {
  if (!thanaName) return false;
  const lower = thanaName.trim().toLowerCase();
  const norm = normalizeBn(thanaName);
  const collapsed = norm.replace(/\s+/g, '');

  if (
    norm === 'ঢাকা' ||
    norm === 'ঢাকা শহর' ||
    norm === 'ঢাকা সিটি' ||
    norm === 'ঢাকা মেট্রো' ||
    lower === 'dhaka' ||
    lower === 'dhaka city' ||
    lower === 'dhaka metro'
  ) {
    return true;
  }

  for (const item of DHAKA_METRO_CITY_THANAS) {
    const itemBn = item.bn;
    const normItemBn = normalizeBn(itemBn);
    const collapsedItemBn = normItemBn.replace(/\s+/g, '');

    // Direct match (both directions)
    if (norm === normItemBn || norm.includes(normItemBn) || normItemBn.includes(norm)) {
      return true;
    }
    if (collapsed === collapsedItemBn || collapsed.includes(collapsedItemBn) || collapsedItemBn.includes(collapsed)) {
      return true;
    }

    // Alt Bengali names
    if (item.altBn && Array.isArray(item.altBn)) {
      for (const alt of item.altBn) {
        if (!alt) continue;
        const normAlt = normalizeBn(alt);
        const collapsedAlt = normAlt.replace(/\s+/g, '');
        if (norm === normAlt || norm.includes(normAlt) || normAlt.includes(norm)) {
          return true;
        }
        if (collapsed === collapsedAlt || collapsed.includes(collapsedAlt) || collapsedAlt.includes(collapsed)) {
          return true;
        }
      }
    }

    // English names
    if (item.en && Array.isArray(item.en)) {
      const cleanLower = normalizeEn(lower);
      const collapsedLower = cleanLower.replace(/\s+/g, '');
      for (const en of item.en) {
        if (!en) continue;
        const lowerEn = en.toLowerCase();
        const cleanEn = normalizeEn(lowerEn);
        const collapsedEn = cleanEn.replace(/\s+/g, '');
        if (lower === lowerEn || cleanLower.includes(cleanEn) || cleanEn.includes(cleanLower)) {
          return true;
        }
        if (collapsedLower.length >= 3 && (collapsedLower.includes(collapsedEn) || collapsedEn.includes(collapsedLower))) {
          return true;
        }
      }
    }
  }

  return false;
}

function isThanaInDhakaSuburban(thanaName: string): boolean {
  if (!thanaName) return false;
  const lower = thanaName.trim().toLowerCase();
  const norm = normalizeBn(thanaName);
  const collapsed = norm.replace(/\s+/g, '');

  for (const item of DHAKA_DISTRICT_SUBURBAN_THANAS) {
    const itemBn = item.bn;
    const normItemBn = normalizeBn(itemBn);
    const collapsedItemBn = normItemBn.replace(/\s+/g, '');

    if (norm === normItemBn || norm.includes(normItemBn) || normItemBn.includes(norm)) return true;
    if (collapsed === collapsedItemBn || collapsed.includes(collapsedItemBn) || collapsedItemBn.includes(collapsed)) return true;

    if (item.altBn) {
      for (const alt of item.altBn) {
        const normAlt = normalizeBn(alt);
        if (norm === normAlt || norm.includes(normAlt) || normAlt.includes(norm)) return true;
      }
    }
    if (item.en) {
      for (const en of item.en) {
        if (lower.includes(en.toLowerCase())) return true;
      }
    }
  }

  return false;
}

export function isInsideDhakaMetro(criteria: {
  address?: string;
  thana?: string;
  district?: string;
  division?: string;
  deliveryArea?: string;
}): boolean {
  const rawThana = (criteria.thana || '').trim();
  const rawAddr = (criteria.address || '').trim();
  const rawDist = (criteria.district || '').trim();
  const rawDiv = (criteria.division || '').trim();
  const rawArea = (criteria.deliveryArea || '').trim().toLowerCase();

  // 1. If division is explicitly chosen as anything other than Dhaka -> strictly OUTSIDE (৳130)
  if (rawDiv && rawDiv !== 'ঢাকা' && rawDiv.toLowerCase() !== 'dhaka') {
    return false;
  }

  // 2. If district is explicitly chosen as anything other than Dhaka -> strictly OUTSIDE (৳130)
  if (rawDist && rawDist !== 'ঢাকা' && rawDist.toLowerCase() !== 'dhaka') {
    return false;
  }

  // 3. If Thana is suburban/outside Dhaka (Savar, Ashulia, Keraniganj, Dhamrai, Nawabganj, Dohar, Hemayetpur, Jinjira) -> strictly OUTSIDE (৳130)
  if (rawThana && isThanaInDhakaSuburban(rawThana)) {
    return false;
  }

  // 4. Check if Address string contains known suburban or outside keywords
  if (rawAddr) {
    const lowerAddr = rawAddr.toLowerCase();
    const normAddr = normalizeBn(rawAddr);

    // Suburban thanas in Dhaka district
    for (const item of DHAKA_DISTRICT_SUBURBAN_THANAS) {
      if (matchesKeyword(rawAddr, lowerAddr, normAddr, item.bn, item.altBn, item.en)) {
        return false;
      }
    }
    // Outside metro keywords (Gazipur, Tongi, Narayanganj, Savar, Tangail, etc.)
    for (const kw of DHAKA_OUTSIDE_METRO_KEYWORDS) {
      const lowerKw = kw.toLowerCase();
      const normKw = normalizeBn(kw);
      if (rawAddr.includes(kw) || lowerAddr.includes(lowerKw) || normAddr.includes(normKw)) {
        return false;
      }
    }
    // Check if other 63 districts appear in the address
    for (const dist of BD_DISTRICTS) {
      if (dist.bn !== 'ঢাকা') {
        if (rawAddr.includes(dist.bn) || normAddr.includes(normalizeBn(dist.bn))) {
          return false;
        }
        if (dist.en) {
          for (const e of dist.en) {
            if (e.length >= 4 && lowerAddr.includes(e.toLowerCase())) {
              return false;
            }
          }
        }
      }
    }
  }

  // 5. If Thana matches ANY of the 49 Dhaka Metro City thanas
  if (rawThana && isThanaInDhakaMetro(rawThana)) {
    return true;
  }

  // 6. Check if Address string matches ANY of the 49 Dhaka Metro City thanas (or their neighborhoods/aliases)
  if (rawAddr) {
    const lowerAddr = rawAddr.toLowerCase();
    const normAddr = normalizeBn(rawAddr);

    const cityMatch = DHAKA_METRO_CITY_THANAS.some((item) =>
      matchesKeyword(rawAddr, lowerAddr, normAddr, item.bn, item.altBn, item.en)
    );
    if (cityMatch) {
      return true;
    }

    // Since outside keywords/districts were already checked and ruled out above,
    // any mention of Dhaka in the address is Inside Dhaka!
    if (
      rawAddr.includes('ঢাকা') ||
      normAddr.includes('ঢাকা') ||
      lowerAddr.includes('dhaka') ||
      rawAddr.includes('ডিএমপি') ||
      rawAddr.includes('মেট্রোপলিটন')
    ) {
      return true;
    }
  }

  // 7. If district was identified or chosen as Dhaka (and no suburban/outside thana was found)
  if (rawDist === 'ঢাকা' || rawDist.toLowerCase() === 'dhaka') {
    return true;
  }

  // 8. If user selected Inside Dhaka toggle explicitly with no contradictory address/thana
  if (rawArea === 'dhaka' || rawArea.includes('inside') || rawArea.includes('ভেতরে') || rawArea.includes('সিটি')) {
    return true;
  }

  return false;
}

/**
 * Resolves delivery fee, delivery area ('dhaka' vs 'outside'), and matched custom location
 * based on admin settings and the 49 Dhaka Metro thanas rule.
 */
export function resolveDeliveryFee(
  criteria: {
    address?: string;
    thana?: string;
    district?: string;
    division?: string;
    deliveryArea?: string;
  },
  settings: {
    deliveryFeeDhaka?: number;
    deliveryFeeOutside?: number;
    customLocations?: any[];
  }
): {
  fee: number;
  isInsideDhaka: boolean;
  deliveryArea: 'dhaka' | 'outside';
  deliveryAreaLabel: string;
  matchedCustomLocation: any | null;
} {
  const isInside = isInsideDhakaMetro(criteria);
  const matchedCustom = findMatchingLocation(settings.customLocations, criteria);

  // 1. Strictly: ONLY the 49 Dhaka Metro city thanas get deliveryFeeDhaka (default ৳70).
  if (isInside) {
    return {
      fee: settings.deliveryFeeDhaka ?? 70,
      isInsideDhaka: true,
      deliveryArea: 'dhaka',
      deliveryAreaLabel: 'Inside Dhaka',
      matchedCustomLocation: null,
    };
  }

  // 2. Custom location fee if admin set a specific fee for an outside location:
  if (matchedCustom && matchedCustom.deliveryFee !== undefined && matchedCustom.deliveryFee !== null && !isNaN(Number(matchedCustom.deliveryFee))) {
    return {
      fee: Number(matchedCustom.deliveryFee),
      isInsideDhaka: false,
      deliveryArea: 'outside',
      deliveryAreaLabel: matchedCustom.nameBn,
      matchedCustomLocation: matchedCustom,
    };
  }

  // 3. ALL other areas across Bangladesh get deliveryFeeOutside (default ৳130).
  return {
    fee: settings.deliveryFeeOutside ?? 130,
    isInsideDhaka: false,
    deliveryArea: 'outside',
    deliveryAreaLabel: 'Outside Dhaka',
    matchedCustomLocation: null,
  };
}
