import React, { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Phone, 
  Video, 
  Users, 
  User,
  ChevronLeft,
  UserPlus,
  Trash2
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import StaffChatInput from "./StaffChatInput";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { cn } from "../../../../components/ui/utils";

// Types (duplicated from parent for independence)
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string;
  patientId: string;
  patientName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  members?: { id: string; name: string; role: string; avatar?: string }[];
  status?: 'online' | 'offline';
}

interface StaffChatInterfaceProps {
  chat?: ChatRoom;
  messages: ChatMessage[];
  onClose: () => void;
}

export default function StaffChatInterface({ chat, messages, onClose }: StaffChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // Mock send message logic
    setInputText('');
  };

  return (
    <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white",
        chat ? "flex" : "hidden md:flex"
      )}>
        {chat ? (
          <>
            {/* Header */}
            <header className="h-[64px] md:h-[72px] border-b flex items-center justify-between px-4 md:px-6 bg-white shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2 shrink-0" 
                  onClick={onClose}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </Button>
                
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border shrink-0">
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
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 truncate text-sm md:text-base text-[16px] text-[15px]">
                    {chat.name}
                    {chat.type === 'group' && (
                      <Badge variant="outline" className="text-[10px] text-gray-500 font-normal border-gray-300 hidden sm:inline-flex">
                        Group
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                    <span className="font-medium text-[#49358E] truncate text-[14px] text-[13px]">ผู้ป่วย: {chat.patientName}</span>
                    {chat.status === 'online' && (
                       <span className="hidden sm:flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-green-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Online
                        </span>
                       </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                {chat.type === 'group' && (
                  <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-[#49358E] border-[#49358E]/20 hover:bg-[#49358E]/5">
                        <Users className="w-4 h-4" />
                        จัดการสมาชิก
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
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
                          {chat.members?.map(member => (
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
                <div className="h-8 w-px bg-gray-200 mx-1 md:mx-2 hidden md:block"></div>
                <Button variant="ghost" size="icon" className="text-gray-500 md:hidden" onClick={() => setIsManageMembersOpen(true)}>
                    <Users className="w-5 h-5" />
                </Button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 bg-[#F8F9FA] p-4 md:p-6 overflow-y-auto flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {/* History Button Removed */}
               
               {/* Date Separator */}
               <div className="flex items-center gap-4 my-2">
                 <Separator className="flex-1" />
                 <span className="text-xs text-gray-400 font-medium">วันนี้</span>
                 <Separator className="flex-1" />
               </div>

               {messages.map((msg) => {
                 const isMe = msg.senderRole === 'scfc';
                 return (
                   <div key={msg.id} className={cn("flex gap-2 md:gap-3 max-w-[85%] md:max-w-[80%]", isMe ? "self-end flex-row-reverse" : "self-start")}>
                      {!isMe && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className={cn("text-[10px]", msg.senderRole === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100')}>
                            {msg.senderName[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        {!isMe && chat.type === 'group' && (
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
            <StaffChatInput 
              inputText={inputText}
              setInputText={setInputText}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-4 text-center">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-400">เลือกแชทเพื่อเริ่มการสนทนา</p>
            <p className="text-sm text-gray-300 mt-2">คุณสามารถพูดคุยกับผู้ป่วยหรือทีมแพทย์ได้ที่นี่</p>
          </div>
        )}
    </div>
  );
}