import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Users, 
  User
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { cn } from "../../../../components/ui/utils";
import StaffChatInterface from './StaffChatInterface';
import { PATIENTS_DATA } from '../../../../data/patientData';

// Types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string; // 'patient', 'scfc', 'doctor', 'nurse'
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface ChatRoom {
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

export default function StaffChatList({ onChatInterfaceOpen }: { onChatInterfaceOpen?: (isOpen: boolean) => void }) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');

  useEffect(() => {
    onChatInterfaceOpen?.(!!selectedChatId);
  }, [selectedChatId, onChatInterfaceOpen]);

  // Generate Chats from PATIENTS_DATA
  const chats: ChatRoom[] = useMemo(() => {
    // Select a few patients to have active chats
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

  // Mock Messages Generator
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

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const messages = useMemo(() => selectedChatId ? getMessages(selectedChatId) : [], [selectedChatId, chats]);

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'all') return true;
    return chat.type === activeTab;
  });

  return (
    <div className="h-full flex bg-white md:rounded-xl md:shadow-sm md:border overflow-hidden">
      {/* Left Panel: Chat List */}
      <div className={cn(
        "w-full md:w-[320px] flex flex-col border-r bg-gray-50/50",
        selectedChatId ? "hidden md:flex" : "flex"
      )}>
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
              <DialogContent className="sm:max-w-[425px] p-6" aria-describedby={undefined}>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-bold">เพิ่มทีมดูแล</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ชื่อทีมดูแล</label>
                    <Input placeholder="ระบุชื่อทีม..." className="bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">เพิ่มสมาชิก</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="ค้นหาบุคลากร..." className="pl-9 bg-gray-50 border-gray-200" />
                    </div>
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
            className="flex-1 text-xs text-[16px]"
            onClick={() => setActiveTab('direct')}
          >
            ผู้ป่วย (1:1)
          </Button>
          <Button 
            variant={activeTab === 'group' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1 text-xs text-[16px]"
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
                    <h3 className={cn("font-medium truncate text-[18px]", chat.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-700")}>
                      {chat.name}
                    </h3>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap ml-2">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className={cn("text-[14px] truncate", chat.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500")}>
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

      <StaffChatInterface 
        chat={selectedChat}
        messages={messages}
        onClose={() => setSelectedChatId(null)}
      />
    </div>
  );
}
