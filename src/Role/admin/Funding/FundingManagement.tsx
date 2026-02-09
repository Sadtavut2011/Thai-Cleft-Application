import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  MoreHorizontal, 
  CreditCard, 
  Trash2, 
  Pencil,
  Search,
  Phone,
  AlertTriangle,
  Landmark
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Fund {
  id: number;
  name: string;
  category: "Government" | "Foundation" | "Other";
  status: boolean;
  contact: string;
}

export function FundingManagement() {
  const [funds, setFunds] = useState<Fund[]>([
    { id: 1, name: "กองทุนรัฐสวัสดิการ", category: "Government", status: true, contact: "กรมบัญชีกลาง 02-123-4567" },
    { id: 2, name: "มูลนิธิสร้างรอยยิ้ม", category: "Foundation", status: true, contact: "คุณสมหญิง 081-234-5678" },
    { id: 3, name: "ทุนสงเคราะห์ฉุกเฉิน สปสช.", category: "Government", status: true, contact: "สายด่วน 1330" },
    { id: 4, name: "กองทุนพยาบาลอาสา", category: "Other", status: false, contact: "ฝ่ายการพยาบาล" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFund, setNewFund] = useState<Partial<Fund>>({ category: "Government", status: true });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || fund.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleStatus = (id: number) => {
    setFunds(funds.map(f => f.id === id ? { ...f, status: !f.status } : f));
  };

  const handleAddFund = () => {
    const id = funds.length > 0 ? Math.max(...funds.map(f => f.id)) + 1 : 1;
    setFunds([...funds, {
      id,
      name: newFund.name || "New Fund",
      category: newFund.category as any || "Other",
      contact: newFund.contact || "-",
      status: true
    }]);
    setIsAddDialogOpen(false);
    setNewFund({ category: "Government", status: true });
  };

  const handleDeleteFund = () => {
    if (deleteConfirmationId) {
      setFunds(funds.filter(f => f.id !== deleteConfirmationId));
      setDeleteConfirmationId(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case "Government": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">ภาครัฐ</Badge>;
      case "Foundation": return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">มูลนิธิ</Badge>;
      default: return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">อื่นๆ</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Landmark className="h-8 w-8 text-blue-600" />
          จัดการกองทุน (Funding Management)
        </h2>
        <p className="text-gray-500">
          จัดการข้อมูลกองทุน แหล่งเงินทุน และผู้สนับสนุนสำหรับการรักษา
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="ค้นหาชื่อกองทุน..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภท</SelectItem>
              <SelectItem value="Government">ภาครัฐ</SelectItem>
              <SelectItem value="Foundation">มูลนิธิ</SelectItem>
              <SelectItem value="Other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> เพิ่มกองทุนใหม่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มกองทุนใหม่ (Add New Fund)</DialogTitle>
              <DialogDescription>
                กรุณากรอกข้อมูลกองทุนให้ครบถ้วนเพื่อใช้ในระบบขอทุน
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fundName">ชื่อกองทุน</Label>
                <Input 
                  id="fundName" 
                  placeholder="ระบุชื่อกองทุน..." 
                  onChange={(e) => setNewFund({...newFund, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">ประเภทกองทุน</Label>
                <Select onValueChange={(val: any) => setNewFund({...newFund, category: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทกองทุน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government">ภาครัฐ (Government)</SelectItem>
                    <SelectItem value="Foundation">มูลนิธิ (Foundation)</SelectItem>
                    <SelectItem value="Other">อื่นๆ (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">ผู้รับผิดชอบ / ติดต่อ</Label>
                <Input 
                  id="contact" 
                  placeholder="ชื่อเจ้าหน้าที่ หรือเบอร์โทร..." 
                  onChange={(e) => setNewFund({...newFund, contact: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
              <Button type="submit" onClick={handleAddFund}>บันทึกข้อมูล</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[30%]">ชื่อกองทุน (Fund Name)</TableHead>
              <TableHead className="w-[15%]">ประเภท (Category)</TableHead>
              <TableHead className="w-[25%]">ผู้รับผิดชอบ/ติดต่อ</TableHead>
              <TableHead className="w-[15%]">สถานะ (Status)</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFunds.map((fund) => (
              <TableRow key={fund.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    {fund.name}
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(fund.category)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    {fund.contact !== "-" && <Phone className="h-3 w-3" />}
                    {fund.contact}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${fund.status 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${fund.status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {fund.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> แก้ไขข้อมูล (Edit)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(fund.id)}>
                         {fund.status ? (
                           <>
                             <CreditCard className="mr-2 h-4 w-4" /> ปิดใช้งาน (Deactivate)
                           </>
                         ) : (
                            <>
                             <CreditCard className="mr-2 h-4 w-4" /> เปิดใช้งาน (Activate)
                           </>
                         )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setDeleteConfirmationId(fund.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> ลบข้อมูล (Delete)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmationId} onOpenChange={(open) => !open && setDeleteConfirmationId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">ยืนยันการลบข้อมูล</DialogTitle>
            <DialogDescription className="text-center pt-2">
              คุณต้องการลบข้อมูลกองทุนนี้ใช่หรือไม่? <br/>
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmationId(null)} className="w-full sm:w-auto">ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDeleteFund} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">ยืนยันลบข้อมูล</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
