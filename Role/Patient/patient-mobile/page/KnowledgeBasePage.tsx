import React, { useState } from 'react';
import {
  ChevronLeft,
  Play,
  FileText,
  Clock,
  BookOpen,
  Search,
} from 'lucide-react';
import { StatusBarIPhone16Main } from '../../../../components/shared/layout/TopHeader';

// ─── Types ───
type ContentType = 'video' | 'article';

interface KnowledgeItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  content: string;
  duration: string; // e.g. "15:30" for video, "5 นาที" for article
  thumbnailColor: string; // bg color for the icon area
  iconColor: string; // icon color
  category: string;
}

// ─── Mock Data (สื่อความรู้เกี่ยวกับปากแหว่งเพดานโหว่) ───
const KNOWLEDGE_DATA: KnowledgeItem[] = [
  {
    id: 'k1',
    type: 'video',
    title: 'เทคนิคการให้นมทารกปากแหว่งเพดานโหว่',
    description:
      'เรียนรู้วิธีการจัดท่าอุ้มให้นมที่ถูกต้อง การเลือกใช้จุกนมพิเศษ และการสังเกตการกลืนของทารกเพื่อป้องกันการสำลัก',
    content: '',
    duration: '15:30',
    thumbnailColor: 'bg-indigo-50',
    iconColor: 'text-[#7367f0]',
    category: 'การดูแลทารก',
  },
  {
    id: 'k2',
    type: 'article',
    title: 'การดูแลแผลหลังผ่าตัดริมฝีปาก (Cheiloplasty)',
    description:
      'ข้อควรปฏิบัติและข้อห้ามหลังผ่าตัด การทำความสะอาดแผล และการใช้อุปกรณ์กันแผล',
    content:
      '**1. การทำความสะอาดแผล** - ใช้ไม้พันสำลีชุบน้ำเกลือ (Normal Saline) เช็ดคราบเลือดหรือคราบน้ำเหลืองเบาๆ วันละ 2-3 ครั้ง - ทายาขี้ผึ้งฆ่าเชื้อบางๆ ตามแพทย์สั่ง\n\n**2. การป้องกันแผล** - ใส่ปลอกแขนกันงอข้อศอก (Arm restraint) ตลอดเวลา เพื่อป้องกันเด็กเอามือไปแคะเกาแผล - ระวังการกระทบกระแทกบริเวณริมฝีปาก\n\n**3. การให้อาหาร** - ใช้ช้อนป้อนหรือถ้วยดื่ม ห้ามดูดขวดนมหรือใช้หลอดดูดในช่วง 2-3 สัปดาห์แรก - รับประทานอาหารเหลวหรืออาหารอ่อน\n\n**4. สังเกตอาการผิดปกติ** - หากมีเลือดออกมาก แผลบวมแดงร้อน หรือมีหนอง ให้รีบมาพบแพทย์ทันที',
    duration: '5 นาที',
    thumbnailColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    category: 'หลังผ่าตัด',
  },
  {
    id: 'k3',
    type: 'video',
    title: 'สอนการใส่และทำความสะอาดเพดานเทียม (Obturator)',
    description:
      'วิธีการใส่เพดานเทียมอย่างถูกวิธี การทำความสะอาด และการดูแลรักษาเพดานเทียมให้คงทน',
    content: '',
    duration: '15:30',
    thumbnailColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    category: 'อุปกรณ์ช่วย',
  },
  {
    id: 'k4',
    type: 'article',
    title: 'เตรียมความพร้อมก่อนผ่าตัดเพดานโหว่',
    description:
      'สิ่งที่ผู้ปกครองควรทราบก่อนนำบุตรเข้ารับการผ่าตัด ตั้งแต่การเตรียมตัว เอกสาร และข้อปฏิบัติก่อน-หลังผ่าตัด',
    content:
      '**1. การเตรียมตัวก่อนผ่าตัด** - งดอาหารและน้ำอย่างน้อย 6-8 ชั่วโมงก่อนผ่าตัด - อาบน้ำทำความสะอาดร่างกาย ตัดเล็บให้สั้น\n\n**2. เอกสารที่ต้องเตรียม** - บัตรประชาชนผู้ปกครอง - สูติบัตรเด็ก - บัตรประกันสุขภาพ / บัตรทอง - ใบส่งตัว (ถ้ามี)\n\n**3. สิ่งของที่ควรนำมา** - เสื้อผ้าเด็กแบบกระดุมหน้า - ผ้าอ้อม ผ้าเช็ดตัว - ของเล่นที่เด็กชอบ\n\n**4. หลังผ่าตัด** - เด็กจะต้องนอนพักในโรงพยาบาล 3-5 วัน - ใส่ Arm restraint ตลอดเวลา - ให้อาหารเหลวทางช้อนหรือกระบอกฉีด',
    duration: '5 นาที',
    thumbnailColor: 'bg-red-50',
    iconColor: 'text-red-400',
    category: 'ก่อนผ่าตัด',
  },
  {
    id: 'k5',
    type: 'video',
    title: 'การฝึกพูดสำหรับเด็กปากแหว่งเพดานโหว่',
    description:
      'แนวทางการฝึกพูดเบื้องต้นที่ผู้ปกครองสามารถทำได้ที่บ้าน เพื่อพัฒนาทักษะการสื่อสารของเด็ก',
    content: '',
    duration: '20:15',
    thumbnailColor: 'bg-sky-50',
    iconColor: 'text-sky-500',
    category: 'การฝึกพูด',
  },
  {
    id: 'k6',
    type: 'article',
    title: 'ขั้นตอนการรักษาปากแหว่งเพดานโหว่ตั้งแต่แรกเกิด',
    description:
      'ไทม์ไลน์การรักษาตั้งแต่แรกเกิดจนถึงวัยรุ่น การผ่าตัดแต่ละช่วงวัย และการดูแลอย่างต่อเนื่อง',
    content:
      '**แรกเกิด - 3 เดือน** - ใส่เพดานเทียม (Obturator) - ฝึกการดูดนม\n\n**3 - 6 เดือน** - ผ่าตัดซ่อมริมฝีปาก (Cheiloplasty)\n\n**9 - 18 เดือน** - ผ่าตัดซ่อมเพดาน (Palatoplasty)\n\n**4 - 6 ปี** - ฝึกพูด - ตรวจการได้ยิน\n\n**8 - 12 ปี** - ผ่าตัดปลูกถ่ายกระดูกสันเหงือก (Alveolar Bone Graft)\n\n**15 - 18 ปี** - จัดฟัน - ผ่าตัดตกแต่ง (ถ้าจำเป็น)',
    duration: '8 นาที',
    thumbnailColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    category: 'ข้อมูลทั่วไป',
  },
];

// ─── Detail View Component ───
function KnowledgeDetailView({
  item,
  onBack,
}: {
  item: KnowledgeItem;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[50000] bg-white flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 z-20 bg-[#7066a9] shadow-sm">
        <StatusBarIPhone16Main />
        <nav className="h-[64px] px-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-bold leading-none truncate">
            สื่อความรู้
          </h1>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Thumbnail / Media Area */}
        {item.type === 'video' ? (
          <div className="w-full aspect-video bg-[#2c2c2c] flex items-center justify-center relative">
            <button className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play size={28} className="text-white ml-1" fill="white" />
            </button>
          </div>
        ) : (
          <div
            className={`w-full aspect-[16/10] ${item.thumbnailColor} flex items-center justify-center`}
          >
            <FileText size={56} className={item.iconColor} strokeWidth={1.2} />
          </div>
        )}

        {/* Info Area */}
        <div className="p-5 pb-24 space-y-4">
          {/* Badge */}
          {item.type === 'video' ? (
            <span className="inline-block text-xs font-bold text-[#f5a623] bg-[#fef9ec] border border-[#f5a623]/30 px-3 py-1 rounded-full">
              วิดีโอ
            </span>
          ) : (
            <span className="inline-block text-xs font-bold text-[#ff6d00] bg-[#fff3e6] border border-[#ff6d00]/30 px-3 py-1 rounded-full">
              บทความ
            </span>
          )}

          {/* Title */}
          <h2 className="text-xl text-[#5e5873] font-bold leading-snug">
            {item.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            {item.description}
          </p>

          {/* Duration info */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {item.type === 'video' ? (
              <>
                <Play size={14} /> <span>ความยาว {item.duration} นาที</span>
              </>
            ) : (
              <>
                <Clock size={14} /> <span>อ่าน {item.duration}</span>
              </>
            )}
          </div>

          {/* Article Content */}
          {item.type === 'article' && item.content && (
            <div className="mt-4 bg-[#fafafa] rounded-2xl p-5 border border-gray-100">
              {item.content.split('\n\n').map((paragraph, idx) => {
                // Bold headers with **text**
                const formatted = paragraph.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-[#5e5873]">$1</strong>'
                );
                return (
                  <p
                    key={idx}
                    className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }}
                  />
                );
              })}
            </div>
          )}

          {/* Video placeholder message */}
          {item.type === 'video' && (
            <div className="mt-4 bg-[#fafafa] rounded-2xl p-5 border border-gray-100 text-center">
              <Play size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                กดปุ่มเล่นด้านบนเพื่อรับชมวิดีโอ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── List Card Component ───
function KnowledgeCard({
  item,
  onClick,
}: {
  item: KnowledgeItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
    >
      {/* Icon Area */}
      <div
        className={`w-14 h-14 ${item.thumbnailColor} rounded-xl flex items-center justify-center shrink-0`}
      >
        {item.type === 'video' ? (
          <Play size={24} className={item.iconColor} fill="currentColor" />
        ) : (
          <FileText size={24} className={item.iconColor} strokeWidth={1.5} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-[#5e5873] font-bold leading-snug line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
          {item.type === 'video' ? (
            <>
              <Play size={12} className="shrink-0" />
              <span>{item.duration}</span>
            </>
          ) : (
            <>
              <FileText size={12} className="shrink-0" />
              <span>อ่าน {item.duration}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Main Page Component ───
interface KnowledgeBasePageProps {
  onBack: () => void;
}

export default function KnowledgeBasePage({ onBack }: KnowledgeBasePageProps) {
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');

  // Filter logic
  const filteredItems = KNOWLEDGE_DATA.filter((item) => {
    const matchType = activeFilter === 'all' || item.type === activeFilter;
    const matchSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Detail view (early return pattern)
  if (selectedItem) {
    return (
      <KnowledgeDetailView
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  const filterTabs: { key: 'all' | ContentType; label: string }[] = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'video', label: 'วิดีโอ' },
    { key: 'article', label: 'บทความ' },
  ];

  return (
    <div className="fixed inset-0 z-[50000] bg-[#f8f9fa] flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 z-20 bg-[#7066a9] shadow-sm">
        <StatusBarIPhone16Main />
        <nav className="h-[64px] px-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-bold leading-none">
            สื่อความรู้
          </h1>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="p-4 space-y-4 pb-24">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ค้นหาสื่อความรู้..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm text-[#5e5873] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7367f0]/30 focus:border-[#7367f0] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-[#7367f0] text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <KnowledgeCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">ไม่พบสื่อความรู้ที่ค้นหา</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
