import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MoreHorizontal, 
  Search, 
  Plus, 
  UserCog, 
  Mail, 
  Shield, 
  Trash2, 
  Pencil, 
  CheckCircle, 
  Ban, 
  RotateCcw,
  Clock,
  Building2,
  Upload,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/components/ui/utils";
import FigmaConfirmDialog from "../../../components/shared/FigmaConfirmDialog";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "SCFC" | "Case Manager" | "Hospital Staff" | "Ror Por Stor Staff" | "Patient";
  organization: string | string[];
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@scfc.com", role: "Admin", organization: "SCFC Center", status: "Active", lastLogin: "2023-10-27 08:30" },
  { id: 2, name: "พญ. มนดี มีสุข", email: "mondee.m@scfc.com", role: "SCFC", organization: "SCFC Center", status: "Active", lastLogin: "2023-10-26 14:15" },
  { id: 3, name: "นายสมชาย ใจดี", email: "somchai.j@cm.com", role: "Case Manager", organization: ["รพ.มหาราชนครเชียงใหม่", "รพ.นครพิงค์"], status: "Pending", lastLogin: "-" },
  { id: 4, name: "นางพยาบาล วิไล", email: "wilai.n@hosp.com", role: "Hospital Staff", organization: "รพ.ฝาง", status: "Active", lastLogin: "2023-10-27 07:00" },
  { id: 5, name: "เภสัชกร สมศักดิ์", email: "somsak.p@hosp.com", role: "Hospital Staff", organization: "รพ.นครพิงค์", status: "Inactive", lastLogin: "2023-10-20 16:45" },
  { id: 6, name: "ด.ช. รักดี มีสุข", email: "patient01@email.com", role: "Patient", organization: "รพ.สันป่าตอง", status: "Active", lastLogin: "2023-10-25 09:00" },
  { id: 7, name: "ด.ญ. สดใส ใจดี", email: "patient02@email.com", role: "Patient", organization: "รพ.สต.บ้านดง", status: "Inactive", lastLogin: "2022-01-15 10:00" },
  { id: 8, name: "จนท. สมศรี รพ.สต.", email: "somsri.r@pcu.com", role: "Ror Por Stor Staff", organization: "รพ.สต.แม่ริม", status: "Active", lastLogin: "2023-10-27 09:00" },
];

export function UserManagementSystem() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserForLog, setSelectedUserForLog] = useState<User | null>(null);
  const [deleteTargetUserId, setDeleteTargetUserId] = useState<number | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ id: number; newStatus: User["status"] } | null>(null);
  
  // Form state for new user
  const [newUser, setNewUser] = useState<Partial<User>>({
    status: "Pending",
    role: "Case Manager",
    organization: []
  });

  const filteredUsers = users.filter(user => {
    const orgString = Array.isArray(user.organization) ? user.organization.join(" ") : user.organization;
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          orgString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesOrg = filterOrg === "all" || 
                       (Array.isArray(user.organization) 
                          ? user.organization.includes(filterOrg) 
                          : user.organization === filterOrg);

    return matchesSearch && matchesRole && matchesOrg;
  });

  const uniqueOrgs = Array.from(new Set(mockUsers.flatMap(u => Array.isArray(u.organization) ? u.organization : [u.organization])));

  const handleAddUser = () => {
    const id = users.length + 1;
    const userToAdd: User = {
      id,
      name: newUser.name || "New User",
      email: newUser.email || "user@example.com",
      role: newUser.role as any || "Case Manager",
      organization: newUser.organization && newUser.organization.length > 0 ? newUser.organization : "รพ.มหาราชนครเชียงใหม่",
      status: "Pending",
      lastLogin: "-"
    };
    
    setUsers([...users, userToAdd]);
    setIsAddDialogOpen(false);
    setNewUser({ status: "Pending", role: "Case Manager", organization: [] });
  };

  const handleDeleteUser = (id: number) => {
    setDeleteTargetUserId(id);
  };

  const handleStatusChange = (id: number, newStatus: User["status"]) => {
    if (newStatus === "Inactive") {
      setStatusChangeTarget({ id, newStatus });
      return;
    }
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCog className="h-8 w-8 text-blue-600" />
            User & Access Management
          </h2>
          <p className="text-gray-500">จัดการสิทธิ์ผู้ใช้งาน อนุมัติบัญชี และตรวจสอบประวัติการเข้าใช้งาน</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="ค้นหาชื่อ, อีเมล, หน่วยงาน..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterOrg} onValueChange={setFilterOrg}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="ทุกหน่วยงาน (Organization)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหน่วยงาน (Organization)</SelectItem>
              {uniqueOrgs.map((org, index) => (
                <SelectItem key={index} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ทุกประเภทผู้ใช้" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภทผู้ใช้</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="SCFC">SCFC</SelectItem>
              <SelectItem value="Case Manager">Case Manager</SelectItem>
              <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
              <SelectItem value="Ror Por Stor Staff">Ror Por Stor Staff</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                สร้างบัญชีใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่สำหรับเจ้าหน้าที่หรือผู้เกี่ยวข้อง
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Profile: Upload Image */}
                <div className="flex flex-col items-center gap-4">
                   <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center text-gray-500">
                         <Upload className="h-6 w-6 mb-1" />
                         <span className="text-[10px]">Upload Image</span>
                      </div>
                   </div>
                </div>

                {/* Form: Name, Email, Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">ชื่อ (First Name)</Label>
                    <Input 
                      id="firstname" 
                      placeholder="เช่น สมชาย" 
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">นามสกุล (Last Name)</Label>
                    <Input id="lastname" placeholder="เช่น ใจดี" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล (Email)</Label>
                    <Input 
                      id="email" 
                      placeholder="example@email.com" 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="phone">เบอร์โทรศัพท์ (Phone)</Label>
                     <Input id="phone" placeholder="08x-xxx-xxxx" />
                  </div>
                </div>

                {/* Account: Username, Password */}
                <div className="space-y-4 border-t pt-4">
                   <h4 className="font-medium text-sm text-gray-900">ข้อมูลบัญชี (Account)</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Username" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                   </div>
                </div>

                {/* Permission: Role, Hospital */}
                <div className="space-y-4 border-t pt-4">
                   <h4 className="font-medium text-sm text-gray-900">สิทธิ์การใช้งาน (Permission)</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>บทบาท (Role)</Label>
                        <Select onValueChange={(val: any) => setNewUser({...newUser, role: val})}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกตำแหน่ง" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="SCFC">SCFC</SelectItem>
                            <SelectItem value="Case Manager">Case Manager</SelectItem>
                            <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
                            <SelectItem value="Ror Por Stor Staff">Ror Por Stor Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="org">หน่วยงาน/โรงพยาบาล</Label>
                        {newUser.role === "Case Manager" ? (
                           <Popover>
                             <PopoverTrigger asChild>
                               <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                  {Array.isArray(newUser.organization) && newUser.organization.length > 0 
                                    ? <span className="truncate">{newUser.organization.join(", ")}</span>
                                    : <span className="text-gray-500">เลือกหน่วยงาน (เลือกได้มากกว่า 1)</span>}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                               </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-[300px] p-0" align="start">
                               <Command>
                                 <CommandInput placeholder="Search organization..." />
                                 <CommandList>
                                   <CommandEmpty>No organization found.</CommandEmpty>
                                   <CommandGroup>
                                     {uniqueOrgs.map((org) => {
                                       const currentOrgs = Array.isArray(newUser.organization) ? newUser.organization : [];
                                       const isSelected = currentOrgs.includes(org);
                                       return (
                                         <CommandItem
                                           key={org}
                                           value={org}
                                           onSelect={() => {
                                             const next = isSelected
                                                ? currentOrgs.filter(x => x !== org)
                                                : [...currentOrgs, org];
                                             setNewUser({...newUser, organization: next});
                                           }}
                                         >
                                           <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}/>
                                           {org}
                                         </CommandItem>
                                       )
                                     })}
                                   </CommandGroup>
                                 </CommandList>
                               </Command>
                             </PopoverContent>
                           </Popover>
                        ) : (
                          <Select 
                            value={typeof newUser.organization === 'string' ? newUser.organization : ''} 
                            onValueChange={(val) => setNewUser({...newUser, organization: val})}
                          >
                            <SelectTrigger id="org">
                              <SelectValue placeholder="เลือกหน่วยงาน" />
                            </SelectTrigger>
                            <SelectContent>
                              {uniqueOrgs.map((org, index) => (
                                <SelectItem key={index} value={org}>{org}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                   </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
                <Button type="submit" onClick={handleAddUser}>บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead>ผู้ใช้งาน (User)</TableHead>
              <TableHead>ตำแหน่ง (Role)</TableHead>
              <TableHead>หน่วยงาน (Organization)</TableHead>
              <TableHead>สถานะ (Status)</TableHead>
              <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${user.role === 'Patient' ? 'text-pink-500' : 'text-blue-500'}`} />
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 flex items-center gap-1 w-fit max-w-[200px]">
                      <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="truncate">
                        {Array.isArray(user.organization) ? user.organization[0] : user.organization}
                      </span>
                      {Array.isArray(user.organization) && user.organization.length > 1 && (
                        <span className="ml-0.5">+{user.organization.length - 1}</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status)} variant="outline">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        
                        {user.status === "Pending" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Active")} className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> อนุมัติสิทธิ์ (Approve)
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === "Active" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Inactive")} className="text-amber-600">
                            <Ban className="mr-2 h-4 w-4" /> 
                            {user.role === "Patient" ? "ระงับ/ปิดใช้งาน (Inactive)" : "ระงับบัญชี (Suspend)"}
                          </DropdownMenuItem>
                        )}

                        {user.status === "Inactive" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Active")} className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> 
                            {user.role === "Patient" ? "เปิดใช้งาน (Active)" : "เปิดใช้งาน (Activate)"}
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> แก้ไขข้อมูล (Edit)
                        </DropdownMenuItem>
                        
                        {user.role !== "Patient" && (
                          <DropdownMenuItem onClick={() => alert("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว")}>
                            <RotateCcw className="mr-2 h-4 w-4" /> รีเซ็ตรหัสผ่าน (Reset Password)
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => setSelectedUserForLog(user)}>
                          <Clock className="mr-2 h-4 w-4" /> ประวัติการใช้งา (Logs)
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> ลบข้อมูล (Delete)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  ไม่พบข้อมูลผู้ใช้งาน
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Activity Log Dialog */}
      <Dialog open={!!selectedUserForLog} onOpenChange={(open) => !open && setSelectedUserForLog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Activity Log: {selectedUserForLog?.name}</DialogTitle>
            <DialogDescription>
              ประวัติการเข้าใช้งานและการทำรายการล่าสุด
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 text-sm border-b border-gray-100 pb-3 last:border-0">
                  <div className="w-[120px] text-gray-500 text-xs">2023-10-27 10:{30 - i}</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedUserForLog?.role === "Patient" ? "Data Updated" : "Login Success"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {selectedUserForLog?.role === "Patient" 
                        ? "Updated by: Staff Name" 
                        : `IP: 192.168.1.${100 + i} • Browser: Chrome`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <FigmaConfirmDialog
        isOpen={deleteTargetUserId !== null}
        onClose={() => setDeleteTargetUserId(null)}
        title="ยืนยันการลบผู้ใช้งาน"
        description="คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้"
        cancelLabel="ลบข้อมูล"
        confirmLabel="ยกเลิก"
        onCancel={() => {
          if (deleteTargetUserId !== null) {
            setUsers(users.filter(u => u.id !== deleteTargetUserId));
            setDeleteTargetUserId(null);
          }
        }}
        onConfirm={() => setDeleteTargetUserId(null)}
      />

      {/* Status Change Confirmation Dialog */}
      <FigmaConfirmDialog
        isOpen={statusChangeTarget !== null}
        onClose={() => setStatusChangeTarget(null)}
        title="ยืนยันการเปลี่ยนสถานะ"
        description="คุณต้องการระงับการใช้งาน/ปิดการใช้งานบัญชีนี้ใช่หรือไม่?"
        cancelLabel="ระงับ"
        confirmLabel="ยกเลิก"
        onCancel={() => {
          if (statusChangeTarget !== null) {
            setUsers(users.map(u => u.id === statusChangeTarget.id ? { ...u, status: statusChangeTarget.newStatus } : u));
            setStatusChangeTarget(null);
          }
        }}
        onConfirm={() => setStatusChangeTarget(null)}
      />
    </div>
  );
}
