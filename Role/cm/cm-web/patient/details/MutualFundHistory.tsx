import React, { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Search
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../../components/ui/table';
import { Input } from '../../../../../components/ui/input';
import { cn } from '../../../../../components/ui/utils';
import { FundRequestDetailPage } from './FundRequestDetailPage';
import { formatThaiDate } from '../../utils/formatThaiDate';

interface MutualFundHistoryProps {
  patient: any;
  onBack: () => void;
}

export const MutualFundHistory: React.FC<MutualFundHistoryProps> = ({ patient, onBack }) => {
  const [selectedFund, setSelectedFund] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const funds: any[] = patient.funds || [];

  // Filter funds
  const filteredFunds = funds.filter((fund: any) => {
    const matchesSearch = !searchTerm ||
      (fund.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fund.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (fund.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Status helpers
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved' || s === 'อนุมัติ') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#E5F8ED] text-[#28C76F]">
          <CheckCircle2 size={12} />
          อนุมัติ
        </span>
      );
    }
    if (s === 'rejected' || s === 'ปฎิเสธ') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#FCEAEA] text-[#EA5455]">
          <XCircle size={12} />
          ปฏิเสธ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#fff0e1] text-[#ff9f43]">
        <Clock size={12} />
        รอพิจารณา
      </span>
    );
  };

  // Summary stats
  const totalAmount = funds.reduce((sum: number, f: any) => sum + (typeof f.amount === 'number' ? f.amount : parseFloat(f.amount) || 0), 0);
  const approvedCount = funds.filter((f: any) => (f.status || '').toLowerCase() === 'approved').length;
  const pendingCount = funds.filter((f: any) => (f.status || '').toLowerCase() === 'pending').length;

  // If viewing fund detail
  if (selectedFund) {
    return (
      <FundRequestDetailPage
        data={{
          id: selectedFund.id || 'fund-detail',
          name: selectedFund.name,
          amount: selectedFund.amount,
          date: selectedFund.date,
          status: selectedFund.status,
          reason: selectedFund.reason,
          requester: selectedFund.requester,
          description: selectedFund.reason
        }}
        patient={{ name: patient.name, hn: patient.hn, image: patient.image }}
        onBack={() => setSelectedFund(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl text-[#5e5873]">ประวัติการขอกองทุน</h1>
            <p className="text-sm text-gray-500">{patient.name} | HN: {patient.hn}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#7367f0]/10 p-2.5 rounded-lg text-[#7367f0]">
              <Banknote size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">ยอดรวมทั้งหมด</p>
              <p className="text-xl text-[#7367f0]">{totalAmount.toLocaleString()} บาท</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#28C76F]/10 p-2.5 rounded-lg text-[#28C76F]">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">อนุมัติแล้ว</p>
              <p className="text-xl text-[#28C76F]">{approvedCount} รายการ</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#ff9f43]/10 p-2.5 rounded-lg text-[#ff9f43]">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">รอพิจารณา</p>
              <p className="text-xl text-[#ff9f43]">{pendingCount} รายการ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                <FileText size={20} />
              </div>
              <CardTitle className="text-lg text-[#5e5873]">รายการทั้งหมด ({filteredFunds.length})</CardTitle>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="ค้นหาชื่อกองทุน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm border-gray-200"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 text-sm border border-gray-200 rounded-md bg-white text-[#5e5873] focus:outline-none focus:ring-2 focus:ring-[#7367f0]/20"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="approved">อนุมัติ</option>
                <option value="pending">รอพิจารณา</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredFunds.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>ไม่พบประวัติการขอทุน</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-center w-[60px] text-[#5e5873]">#</TableHead>
                    <TableHead className="text-[#5e5873] min-w-[200px]">ชื่อกองทุน</TableHead>
                    <TableHead className="text-[#5e5873] min-w-[180px]">เหตุผล / รายละเอียด</TableHead>
                    <TableHead className="text-right text-[#5e5873] min-w-[120px]">จำนวนเงิน</TableHead>
                    <TableHead className="text-center text-[#5e5873] min-w-[110px]">วันที่</TableHead>
                    <TableHead className="text-center text-[#5e5873] min-w-[110px]">สถานะ</TableHead>
                    <TableHead className="text-center text-[#5e5873] w-[80px]">ดูเพิ่ม</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFunds.map((fund: any, index: number) => (
                    <TableRow
                      key={fund.id || index}
                      className="hover:bg-[#7367f0]/[0.03] cursor-pointer transition-colors"
                      onClick={() => setSelectedFund(fund)}
                    >
                      <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#7367f0]/10 p-1.5 rounded-lg text-[#7367f0] shrink-0">
                            <Banknote size={16} />
                          </div>
                          <span className="text-[#5e5873] truncate max-w-[220px]">{fund.name || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 truncate max-w-[200px]">
                        {fund.reason || 'ไม่ระบุรายละเอียด'}
                      </TableCell>
                      <TableCell className="text-right text-[#7367f0]">
                        {typeof fund.amount === 'number' ? fund.amount.toLocaleString() : fund.amount} บาท
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500">
                          <Calendar size={13} className="text-gray-400" />
                          <span className="text-sm">{formatThaiDate(fund.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(fund.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFund(fund);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};