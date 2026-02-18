import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  MoreVertical, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  Send, 
  Users, 
  Settings,
  User,
  ChevronLeft,
  UserPlus,
  Trash2,
  Check,
  ChevronsUpDown,
  History,
  Filter,
  X,
  LayoutGrid,
  Home,
  CalendarPlus,
  Navigation,
  Stethoscope,
  FileText,
  Camera,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { cn } from "../../../../components/ui/utils";
import { PATIENTS_DATA } from '../../../../data/patientData';
import { toast } from "sonner@2.0.3";

// Rich menu card items (same as mobile)
const RICH_MENU_CARDS = [
  {
    id: 'home-visit',
    label: 'เยี่ยมบ้าน',
    subtitle: 'ส่งคำขอเยี่ยมบ้าน',
    icon: Home,
    gradient: 'from-[#28c76f] to-[#48da89]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'appointment',
    label: 'นัดหมาย',
    subtitle: 'เพิ่มนัดหมายใหม่',
    icon: CalendarPlus,
    gradient: 'from-[#4285f4] to-[#6ea8fe]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'referral',
    label: 'ส่งตัว',
    subtitle: 'ส่งคำขอส่งตัว',
    icon: Navigation,
    gradient: 'from-[#ff6d00] to-[#ff9e45]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'treatment',
    label: 'บันทึกการรักษา',
    subtitle: 'เพิ่มบันทึกใหม่',
    icon: Stethoscope,
    gradient: 'from-[#e91e63] to-[#f06292]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'funding',
    label: 'ขอทุน',
    subtitle: 'ส่งคำขอทุน',
    icon: FileText,
    gradient: 'from-[#f5a623] to-[#ffc558]',
    iconBg: 'bg-white/20',
  },
];

// Types
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string; // 'patient', 'scfc', 'doctor', 'nurse'
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string;
  patientId: string;
  patientName: string; // Context for SCFC
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  members?: { id: string; name: string; role: string; avatar?: string }[];
  status?: 'online' | 'offline';
  image?: string;
}

export default function ChatSystem() {
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  const [inputText, setInputText] = useState('');
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  // State for Add Team Dialog
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  // Rich Menu state
  const [isPlusPopupOpen, setIsPlusPopupOpen] = useState(false);
  const [isRichMenuOpen, setIsRichMenuOpen] = useState(false);

  // Drag to scroll for rich menu cards
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDragged = useRef(false);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startXRef.current = pageX - (cardScrollRef.current?.offsetLeft || 0);
    scrollLeftRef.current = cardScrollRef.current?.scrollLeft || 0;
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !cardScrollRef.current) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (cardScrollRef.current.offsetLeft || 0);
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) hasDragged.current = true;
    cardScrollRef.current.scrollLeft = scrollLeftRef.current - walk * 1.5;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleCardAction = (actionId: string, label: string) => {
    if (hasDragged.current) return;
    toast.success(`เปิด: ${label}`, {
      description: 'ฟีเจอร์นี้จะพาไปหน้าที่เกี่ยวข้อง',
    });
  };

  const handlePlusOption = (option: 'rich-menu' | 'image' | 'attach') => {
    setIsPlusPopupOpen(false);
    switch (option) {
      case 'rich-menu':
        setIsRichMenuOpen(!isRichMenuOpen);
        break;
      case 'image':
        toast.info('เลือกรูปภาพ', { description: 'ฟีเจอร์รูปภาพจะพร้อมใช้งานเร็วๆ นี้' });
        break;
      case 'attach':
        toast.info('แนบไฟล์', { description: 'ฟีเจอร์แนบไฟล์จะพร้อมใช้งานเร็วๆ นี้' });
        break;
    }
  };

  // Generate Chats from PATIENTS_DATA (same pattern as mobile)
  const chats: ChatRoom[] = useMemo(() => {
    const chatPatients = PATIENTS_DATA.slice(0, 5);
    
    const directChats = chatPatients.map((patient, index) => ({
      id: `p-${patient.id}`,
      type: 'direct' as const,
      name: patient.name,
      patientId: patient.id,
      patientName: patient.name,
      lastMessage: index === 0 ? 'ขอบคุณครับคุณหมอ อาการดีขึ้นแล้วครับ' : 
                   index === 1 ? 'ยาที่ได้รับทานแล้วมีอาการเวียนหัวค่ะ' : 
                   'สอบถามเรื่องนัดครั้งถัดไปครับ',
      lastMessageTime: index === 0 ? '10:30' : index === 1 ? 'เมื่อวาน' : '2 วันที่แล้ว',
      unreadCount: index === 0 ? 2 : 0,
      status: (index % 2 === 0 ? 'online' : 'offline') as 'online' | 'offline',
      image: patient.image
    }));

    const groupChats: ChatRoom[] = [];
    
    if (PATIENTS_DATA[0]) {
      groupChats.push({
        id: 'g-1',
        type: 'group' as const,
        name: `ทีมดูแล - ${PATIENTS_DATA[0].name}`,
        patientId: PATIENTS_DATA[0].id,
        patientName: PATIENTS_DATA[0].name,
        lastMessage: 'พยาบาล: วัดความดันล่าสุด 130/80 ครับ',
        lastMessageTime: '09:15',
        unreadCount: 5,
        members: [
          { id: 'scfc1', name: 'SCFC Admin', role: 'SCFC' },
          { id: 'doc1', name: 'นพ.ใจดี', role: 'Doctor' },
          { id: 'nurse1', name: 'พยาบาลวิชาชีพ', role: 'Nurse' }
        ]
      });
    }

    if (PATIENTS_DATA[2]) {
      groupChats.push({
        id: 'g-2',
        type: 'group' as const,
        name: `ทีมกายภาพ - ${PATIENTS_DATA[2].name}`,
        patientId: PATIENTS_DATA[2].id,
        patientName: PATIENTS_DATA[2].name,
        lastMessage: 'นัดทำกายภาพครั้งถัดไปวันอังคารหน้าครับ',
        lastMessageTime: '3 วันที่แล้ว',
        unreadCount: 0
      });
    }

    return [...directChats, ...groupChats];
  }, []);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Auto-select first chat after chats are generated
  React.useEffect(() => {
    if (chats.length > 0 && selectedChatId === null) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats]);

  // Mock Messages Generator (dynamic from chat data)
  const getMessages = (chatId: string): ChatMessage[] => {
    if (!chatId) return [];
    
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return [];

    if (chat.type === 'direct') {
      return [
        { id: 'm1', senderId: chat.patientId, senderName: chat.patientName, senderRole: 'patient', content: 'สวัสดีครับ ผมมีอาการปวดแผลเล็กน้อยครับ', timestamp: '10:00', type: 'text' },
        { id: 'm2', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: `สวัสดีครับ คุณ${chat.patientName.split(' ')[1] || 'ผู้ป่วย'} ปวดบริเวณไหนครับ? มีเลือดซึมไหมครับ?`, timestamp: '10:05', type: 'text' },
        { id: 'm3', senderId: chat.patientId, senderName: chat.patientName, senderRole: 'patient', content: 'ปวดรอบๆ แผลครับ ไม่มีเลือดซึมครับ', timestamp: '10:10', type: 'text' },
        { id: 'm4', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: 'ถ้าไม่มีเลือดซึมและปวดไม่มาก แนะนำให้ทานยาแก้ปวดที่ได้รับไปนะครับ และสังเกตอาการต่อครับ', timestamp: '10:15', type: 'text' },
        { id: 'm5', senderId: chat.patientId, senderName: chat.patientName, senderRole: 'patient', content: 'ขอบคุณครับคุณหมอ อาการดีขึ้นแล้วครับ', timestamp: '10:30', type: 'text' },
      ];
    } else {
      return [
        { id: 'gm1', senderId: 'nurse1', senderName: 'พยาบาลวิชาชีพ', senderRole: 'nurse', content: 'คนไข้มีไข้ต่ำๆ เมื่อคืนค่ะ', timestamp: '08:00', type: 'text' },
        { id: 'gm2', senderId: 'doc1', senderName: 'นพ.ใจดี', senderRole: 'doctor', content: 'ให้ทานพาราเซตามอล แล้ววัดไข้ซ้ำอีกทีนะครับ', timestamp: '08:30', type: 'text' },
        { id: 'gm3', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: 'รับทราบครับ เดี๋ยวประสานงานญาติให้ดูแลเรื่องทานยาครับ', timestamp: '08:45', type: 'text' },
        { id: 'gm4', senderId: 'nurse1', senderName: 'พยาบาลวิชาชีพ', senderRole: 'nurse', content: 'วัดความดันล่าสุด 130/80 ครับ', timestamp: '09:15', type: 'text' },
      ];
    }
  };

  // Patient list for Add Team dialog (dynamic from PATIENTS_DATA)
  const patients = useMemo(() => 
    PATIENTS_DATA.map(p => ({ value: p.name, label: p.name })),
  []);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const messages = useMemo(() => selectedChatId ? getMessages(selectedChatId) : [], [selectedChatId, chats]);

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'all') return true;
    return chat.type === activeTab;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // Mock send message logic would go here
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-xl shadow-sm border overflow-hidden font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Left Panel: Chat List */}
      <div className="w-[320px] flex flex-col border-r bg-gray-50/50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#49358E] flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              ข้อความ
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Plus className="w-5 h-5 text-gray-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className={cn("transition-all duration-300", showFilter ? "sm:max-w-[700px]" : "sm:max-w-[425px]", "p-6")} aria-describedby={undefined}>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-bold">เพิ่มทีมดูแล</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ชื่อทีมดูแล</label>
                    <Input placeholder="ระบุชื่อทีม..." className="bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ผู้ป่วยที่อยู่ในการดูแล</label>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between bg-gray-50 border-gray-200 font-normal"
                        >
                          {selectedPatient
                            ? patients.find((patient) => patient.value === selectedPatient)?.label
                            : "ค้นหาผู้ป่วย..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[350px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="พิมพ์ชื่อผู้ป่วย..." />
                          <CommandList>
                            <CommandEmpty>ไม่พบข้อมูลผู้ป่วย</CommandEmpty>
                            <CommandGroup>
                              {patients.map((patient) => (
                                <CommandItem
                                  key={patient.value}
                                  value={patient.value}
                                  onSelect={(currentValue) => {
                                    setSelectedPatient(currentValue === selectedPatient ? "" : currentValue);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPatient === patient.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {patient.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-gray-700">เพิ่มสมาชิก</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="ค้นหาบุคลากร..." className="pl-9 bg-gray-50 border-gray-200" />
                            </div>
                            <Button 
                                variant="outline" 
                                size="icon"
                                className={cn("shrink-0 transition-colors", showFilter && "bg-[#7367f0]/10 border-[#7367f0] text-[#7367f0]")}
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {showFilter && (
                        <div className="w-[250px] space-y-2 pt-0 animate-in slide-in-from-left-4 duration-300">
                             <label className="text-sm font-medium text-gray-700">กรองตามโรงพยาบาล</label>
                             <Select>
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="เลือกโรงพยาบาล" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">ทั้งหมด</SelectItem>
                                    <SelectItem value="h1">โรงพยาบาลฝาง</SelectItem>
                                    <SelectItem value="h2">โรงพยาบาลมหาราชนครเชียงใหม่</SelectItem>
                                    <SelectItem value="h3">โรงพยาบาลแม่สอด</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase">แนะนำ</h4>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-blue-50 text-blue-600">
                                <AvatarFallback>ด</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-gray-900">นพ.ใจดี มีสุข</p>
                                <p className="text-xs text-gray-500">ศัลยแพทย์</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#49358E] hover:bg-[#49358E]/10">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-green-50 text-green-600">
                                <AvatarFallback>พ</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-gray-900">พยาบาลวิชาชีพ</p>
                                <p className="text-xs text-gray-500">พยาบาลประสานงาน</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#49358E] hover:bg-[#49358E]/10">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                  </div>

                  <Button className="w-full bg-[#49358E] hover:bg-[#3b2a73] text-white h-11 text-base font-medium rounded-lg shadow-sm mt-2">
                      สร้างทีม
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="ค้นหาแชท..." 
              className="pl-9 bg-gray-100 border-transparent focus:bg-white transition-all" 
            />
          </div>
        </div>

        {/* Chat Type Tabs */}
        <div className="flex p-2 gap-1 border-b bg-white">
          <Button 
            variant={activeTab === 'direct' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setActiveTab('direct')}
          >
            ผู้ป่วย (1:1)
          </Button>
          <Button 
            variant={activeTab === 'group' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setActiveTab('group')}
          >
            ทีมดูแล
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-gray-100 transition-colors flex gap-3 items-start",
                  selectedChatId === chat.id ? "bg-[#F3F2F7]" : ""
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    {chat.type === 'group' ? (
                      <AvatarFallback className="bg-[#E0F2F1] text-[#009688]">
                        <Users className="w-5 h-5" />
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={chat.image} alt={chat.name} />
                        <AvatarFallback className="bg-[#E8EAF6] text-[#3F51B5]">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  {chat.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-medium truncate text-sm", chat.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-700")}>
                      {chat.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className={cn("text-xs truncate", chat.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500")}>
                    {chat.type === 'group' && chat.unreadCount > 0 && <span className="text-[#49358E]">ข้อความใหม่: </span>}
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <div className="self-center">
                    <Badge className="bg-red-500 hover:bg-red-600 h-5 min-w-[20px] flex items-center justify-center text-[10px] px-1">
                      {chat.unreadCount}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedChat ? (
          <>
            {/* Header */}
            <header className="h-[72px] border-b flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border">
                  {selectedChat.type === 'group' ? (
                      <AvatarFallback className="bg-[#E0F2F1] text-[#009688]">
                        <Users className="w-5 h-5" />
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={selectedChat.image} alt={selectedChat.name} />
                        <AvatarFallback className="bg-[#E8EAF6] text-[#3F51B5]">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </>
                    )}
                </Avatar>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {selectedChat.name}
                    {selectedChat.type === 'group' && (
                      <Badge variant="outline" className="text-[10px] text-gray-500 font-normal border-gray-300">
                        Group
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-[#49358E]">ผู้ป่วย: {selectedChat.patientName}</span>
                    {selectedChat.status === 'online' && (
                       <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-green-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Online
                        </span>
                       </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedChat.type === 'group' && (
                  <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>

                    <DialogContent aria-describedby={undefined}>
                      <DialogHeader>
                        <DialogTitle>จัดการสมาชิกกลุ่ม</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                          <Input placeholder="ค้นหาบุคลากร..." className="flex-1" />
                          <Button size="icon"><Search className="w-4 h-4" /></Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-500">สมาชิกปัจจุบัน</h4>
                          {selectedChat.members?.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{member.name}</div>
                                  <div className="text-xs text-gray-500">{member.role}</div>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full gap-2">
                          <UserPlus className="w-4 h-4" /> เพิ่มสมาชิก
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {selectedChat?.type === 'group' ? (
                      <DropdownMenuItem onClick={() => setIsManageMembersOpen(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>จัดการสมาชิก</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>กลุ่มแชท</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      <span>ประวัติผู้ป่วย</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 bg-[#F8F9FA] p-6 overflow-y-auto flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               <div className="flex justify-center my-4">
                  <Button variant="link" size="sm" className="text-xs text-gray-400">
                     ดูประวัติการสนทนาทั้งหมด (Load History)
                  </Button>
               </div>
               
               {/* Date Separator */}
               <div className="flex items-center gap-4 my-2">
                 <Separator className="flex-1" />
                 <span className="text-xs text-gray-400 font-medium">วันนี้</span>
                 <Separator className="flex-1" />
               </div>

               {messages.map((msg) => {
                 const isMe = msg.senderRole === 'scfc';
                 return (
                   <div key={msg.id} className={cn("flex gap-3 max-w-[80%]", isMe ? "self-end flex-row-reverse" : "self-start")}>
                      {!isMe && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className={cn("text-[10px]", msg.senderRole === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100')}>
                            {msg.senderName[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        {!isMe && selectedChat.type === 'group' && (
                          <div className="text-xs text-gray-500 mb-1 ml-1">{msg.senderName} <span className="text-gray-300">•</span> {msg.senderRole}</div>
                        )}
                        <div className={cn(
                          "p-3 rounded-2xl text-sm shadow-sm",
                          isMe 
                            ? "bg-[#7367f0] text-white rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none border"
                        )}>
                          {msg.content}
                        </div>
                        <div className={cn("text-[10px] text-gray-400 mt-1", isMe ? "text-right mr-1" : "ml-1")}>
                          {msg.timestamp}
                        </div>
                      </div>
                   </div>
                 );
               })}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t">
              {/* Rich Menu Card Strip */}
              {isRichMenuOpen && (
                <div className="border-b border-gray-100 bg-[#f8f9fa] animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[13px] font-semibold text-gray-500">เมนูลัด</span>
                    <button
                      onClick={() => setIsRichMenuOpen(false)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div
                    ref={cardScrollRef}
                    className="flex gap-3 overflow-x-auto px-4 pb-3 pt-1 cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    {RICH_MENU_CARDS.map((card) => {
                      const Icon = card.icon;
                      return (
                        <button
                          key={card.id}
                          onClick={() => handleCardAction(card.id, card.label)}
                          className={cn(
                            "shrink-0 w-[130px] h-[105px] rounded-2xl p-3.5 flex flex-col justify-between",
                            "bg-gradient-to-br shadow-md hover:shadow-lg active:scale-95 transition-all duration-200",
                            card.gradient
                          )}
                        >
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", card.iconBg)}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-[13px] font-bold text-white leading-tight truncate">{card.label}</p>
                            <p className="text-[10px] text-white/70 truncate leading-tight mt-0.5">{card.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Plus Popup Overlay */}
              {isPlusPopupOpen && (
                <div
                  className="fixed inset-0 z-[95]"
                  onClick={() => setIsPlusPopupOpen(false)}
                />
              )}

              <div className="p-4">
                <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* Plus Button with Popup */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsPlusPopupOpen(!isPlusPopupOpen)}
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200",
                          isPlusPopupOpen
                            ? "bg-[#7367f0] text-white shadow-md shadow-indigo-200"
                            : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {isPlusPopupOpen ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </button>

                      {/* Plus Popup (3 options) */}
                      {isPlusPopupOpen && (
                        <div className="absolute bottom-full left-0 mb-2 z-[100] animate-in slide-in-from-bottom-2 fade-in duration-150">
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 min-w-[200px]">
                            {/* ริชเมนู */}
                            <button
                              onClick={() => handlePlusOption('rich-menu')}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                                isRichMenuOpen
                                  ? "bg-[#7367f0]/10 text-[#7367f0]"
                                  : "hover:bg-gray-50 text-gray-700"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                isRichMenuOpen ? "bg-[#7367f0] text-white" : "bg-[#f0eeff] text-[#7367f0]"
                              )}>
                                <LayoutGrid className="w-[18px] h-[18px]" />
                              </div>
                              <div className="text-left">
                                <p className="text-[14px] font-semibold">ริชเมนู</p>
                                <p className="text-[11px] text-gray-400">เมนูลัดคำสั่ง</p>
                              </div>
                            </button>

                            {/* รูปภาพ */}
                            <button
                              onClick={() => handlePlusOption('image')}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#e8faf0] text-[#28c76f] flex items-center justify-center">
                                <ImageIcon className="w-[18px] h-[18px]" />
                              </div>
                              <div className="text-left">
                                <p className="text-[14px] font-semibold">รูปภาพ</p>
                                <p className="text-[11px] text-gray-400">ส่งรูปภาพ</p>
                              </div>
                            </button>

                            {/* แนบไฟล์ */}
                            <button
                              onClick={() => handlePlusOption('attach')}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#fff3e8] text-[#ff9f43] flex items-center justify-center">
                                <Paperclip className="w-[18px] h-[18px]" />
                              </div>
                              <div className="text-left">
                                <p className="text-[14px] font-semibold">แนบไฟล์</p>
                                <p className="text-[11px] text-gray-400">แนบไฟล์หรือเอกสาร</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick action icons */}
                    
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-[#49358E] shrink-0" onClick={() => handlePlusOption('attach')}>
                       <Paperclip className="w-5 h-5" />
                    </Button>

                    {/* Text Input */}
                    <div className="relative flex-1">
                       <Input 
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         onFocus={() => { if (isPlusPopupOpen) setIsPlusPopupOpen(false); }}
                         placeholder="พิมพ์ข้อความ... (ให้คำปรึกษา หรือตอบกลับ)" 
                         className="pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#49358E]"
                       />
                       <Button 
                         type="button" 
                         variant="ghost" 
                         size="icon" 
                         className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400"
                       >
                         <Smile className="w-5 h-5" />
                       </Button>
                    </div>

                    {/* Send */}
                    <Button type="submit" className="bg-[#7367f0] hover:bg-[#685dd8] shadow-md px-6 shrink-0">
                       <Send className="w-4 h-4 mr-2" /> ส่ง
                    </Button>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-400 px-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                     <span className="cursor-pointer hover:text-[#7367f0] whitespace-nowrap shrink-0">ข้อความอัตโนมัติ:</span>
                     <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50 whitespace-nowrap">ทานยาตรงเวลาไหมครับ?</span>
                     <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50 whitespace-nowrap">นัดหมายครั้งถัดไป</span>
                     <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50 whitespace-nowrap">อาการดีขึ้นแล้วครับ</span>
                     <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50 whitespace-nowrap">ดูแลสุขภาพด้วยนะครับ</span>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">เลือกแชทเพื่อเริ่มการสนทนา</p>
          </div>
        )}
      </div>
    </div>
  );
}