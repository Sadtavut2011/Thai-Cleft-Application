import React, { useState } from 'react';
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
  Filter
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
}

// Mock Data
const MOCK_CHATS: ChatRoom[] = [
  {
    id: '1',
    type: 'direct',
    name: 'นายสมชาย ใจดี',
    patientId: 'P001',
    patientName: 'นายสมชาย ใจดี',
    lastMessage: 'ขอบคุณครับคุณหมอ อาการดีขึ้นแล้วครับ',
    lastMessageTime: '10:30',
    unreadCount: 2,
    status: 'online'
  },
  {
    id: '2',
    type: 'direct',
    name: 'นางสมหญิง รักดี',
    patientId: 'P002',
    patientName: 'นางสมหญิง รักดี',
    lastMessage: 'ยาที่ได้รับทานแล้วมีอาการเวียนหัวค่ะ',
    lastMessageTime: 'เมื่อวาน',
    unreadCount: 0,
    status: 'offline'
  },
  {
    id: '3',
    type: 'group',
    name: 'ทีมดูแล - นายสมศักดิ์',
    patientId: 'P003',
    patientName: 'นายสมศักดิ์ ป่วยดี',
    lastMessage: 'พยาบาล: วัดความดันล่าสุด 130/80 ครับ',
    lastMessageTime: '09:15',
    unreadCount: 5,
    members: [
      { id: 'scfc1', name: 'SCFC Admin', role: 'SCFC' },
      { id: 'doc1', name: 'นพ.ใจดี', role: 'Doctor' },
      { id: 'nurse1', name: 'พยาบาลวิชาชีพ', role: 'Nurse' }
    ]
  },
  {
    id: '4',
    type: 'group',
    name: 'ทีมกายภาพ - ด.ช.มีชัย',
    patientId: 'P004',
    patientName: 'ด.ช.มีชัย ชนะศึก',
    lastMessage: 'นัดทำกายภาพครั้งถัดไปวันอังคารหน้าครับ',
    lastMessageTime: '2 วันที่แล้ว',
    unreadCount: 0
  }
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', senderId: 'p1', senderName: 'นายสมชาย ใจดี', senderRole: 'patient', content: 'สวัสดีครับ ผมมีอาการปวดแผลเล็กน้อยครับ', timestamp: '10:00', type: 'text' },
    { id: 'm2', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: 'สวัสดีครับ คุณสมชาย ปวดบริเวณไหนครับ? มีเลือดซึมไหมครับ?', timestamp: '10:05', type: 'text' },
    { id: 'm3', senderId: 'p1', senderName: 'นายสมชาย ใจดี', senderRole: 'patient', content: 'ปวดรอบๆ แผลครับ ไม่มีเลือดซึมครับ', timestamp: '10:10', type: 'text' },
    { id: 'm4', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: 'ถ้าไม่มีเลือดซึมและปวดไม่มาก แนะนำให้ทานยาแก้ปวดที่ได้รับไปนะครับ และสังเกตอาการต่อครับ', timestamp: '10:15', type: 'text' },
    { id: 'm5', senderId: 'p1', senderName: 'นายสมชาย ใจดี', senderRole: 'patient', content: 'ขอบคุณครับคุณหมอ อาการดีขึ้นแล้วครับ', timestamp: '10:30', type: 'text' },
  ],
  '3': [
    { id: 'gm1', senderId: 'nurse1', senderName: 'พยาบาลวิชาชีพ', senderRole: 'nurse', content: 'คนไข้มีไข้ต่ำๆ เมื่อคืนค่ะ', timestamp: '08:00', type: 'text' },
    { id: 'gm2', senderId: 'doc1', senderName: 'นพ.ใจดี', senderRole: 'doctor', content: 'ให้ทานพาราเซตามอล แล้ววัดไข้ซ้ำอีกทีนะครับ', timestamp: '08:30', type: 'text' },
    { id: 'gm3', senderId: 'scfc', senderName: 'SCFC เจ้าหน้าที่', senderRole: 'scfc', content: 'รับทราบครับ เดี๋ยวประสานงานญาติให้ดูแลเรื่องทานยาครับ', timestamp: '08:45', type: 'text' },
    { id: 'gm4', senderId: 'nurse1', senderName: 'พยาบาลวิชาชีพ', senderRole: 'nurse', content: 'วัดความดันล่าสุด 130/80 ครับ', timestamp: '09:15', type: 'text' },
  ]
};

export default function ChatSystem() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(MOCK_CHATS[0].id);
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  const [inputText, setInputText] = useState('');
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  // State for Add Team Dialog
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  const patients = [
    { value: "นายสมชาย ใจดี", label: "นายสมชาย ใจดี" },
    { value: "นางสมหญิง รักดี", label: "นางสมหญิง รักดี" },
    { value: "นายสมศักดิ์ ป่วยดี", label: "นายสมศักดิ์ ป่วยดี" },
    { value: "ด.ช.มีชัย ชนะศึก", label: "ด.ช.มีชัย ชนะศึก" },
  ];

  const selectedChat = MOCK_CHATS.find(c => c.id === selectedChatId);
  const messages = selectedChatId ? (MOCK_MESSAGES[selectedChatId] || []) : [];

  const filteredChats = MOCK_CHATS.filter(chat => {
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
                      <AvatarFallback className="bg-[#E8EAF6] text-[#3F51B5]">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
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
                      <AvatarFallback className="bg-[#E8EAF6] text-[#3F51B5]">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
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
            <div className="flex-1 bg-[#F8F9FA] p-6 overflow-y-auto flex flex-col gap-4">
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
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                {/* Quick Advice / Templates could go here */}
                <div className="flex gap-2">
                   <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-[#49358E]">
                      <ImageIcon className="w-5 h-5" />
                   </Button>
                   <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-[#49358E]">
                      <Paperclip className="w-5 h-5" />
                   </Button>
                   <div className="relative flex-1">
                      <Input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
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
                   <Button type="submit" className="bg-[#7367f0] hover:bg-[#685dd8] shadow-md px-6">
                      <Send className="w-4 h-4 mr-2" /> ส่ง
                   </Button>
                </div>
                <div className="flex gap-2 text-xs text-gray-400 px-2">
                   <span className="cursor-pointer hover:text-[#7367f0]">ข้อความอัตโนมัติ:</span>
                   <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50">ทานยาตรงเวลาไหมครับ?</span>
                   <span className="cursor-pointer hover:text-[#7367f0] border rounded-full px-2 py-0.5 bg-gray-50">นัดหมายครั้งถัดไป</span>
                </div>
              </form>
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
