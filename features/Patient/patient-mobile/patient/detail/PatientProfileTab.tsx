import React from 'react';
import { 
    User, 
    ShieldCheck, 
    Stethoscope, 
    Route, 
    MapPin, 
    Calendar, 
    CheckCircle, 
    Pencil, 
    Save, 
    Users, 
    MessageCircle, 
    Settings, 
    Bookmark,
    Plus,
    Clock
} from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { cn } from '../../../../../components/ui/utils';
import { toast } from 'sonner';

interface PatientProfileTabProps {
    patient: any;
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
    isEditingInfo: boolean;
    setIsEditingInfo: (isEditing: boolean) => void;
    editData: any;
    setEditData: (data: any) => void;
    setInfoData: (data: any) => void;
    setIsEditCarePathwayOpen: (isOpen: boolean) => void;
    setSelectedMilestone: (milestone: any) => void;
}

export const PatientProfileTab: React.FC<PatientProfileTabProps> = ({
    patient,
    activeSubTab,
    setActiveSubTab,
    isEditingInfo,
    setIsEditingInfo,
    editData,
    setEditData,
    setInfoData,
    setIsEditCarePathwayOpen,
    setSelectedMilestone
}) => {
    const subTabs = [
        { id: 'info', label: 'ข้อมูลส่วนตัว' },
        { id: 'diagnosis', label: 'วินิจฉัย' },
        { id: 'rights', label: 'ทุน' },
        { id: 'map', label: 'แผนที่' },
        { id: 'care_pathway', label: 'แผนการรักษา' }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6 max-w-4xl mx-auto">
            
            {/* Patient Profile Card */}
            <div className="bg-white rounded-[32px] p-4 md:p-6 shadow-sm border border-slate-100 flex flex-row gap-4 md:gap-6 relative overflow-hidden">
                 {/* Decorative Background Blur */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>

                 {/* Image */}
                 <div className="shrink-0">
                     <img 
                        src={patient.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={patient.name} 
                        className="w-24 h-32 md:w-32 md:h-40 rounded-2xl object-cover shadow-md border-4 border-white bg-slate-100"
                     />
                 </div>

                 {/* Info */}
                 <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg md:text-3xl font-bold text-blue-600 tracking-tight truncate pr-2">{patient.name}</h2>
                        <Bookmark className="text-amber-400 fill-amber-400 w-6 h-6 shrink-0 drop-shadow-sm" />
                    </div>
                    
                    <div className="space-y-0.5 mt-1">
                        <div className="text-slate-500 text-xs md:text-sm font-medium">เลขประจำตัว : <span className="text-slate-700">{patient.cid || patient.hn}</span></div>
                        <div className="text-slate-500 text-xs md:text-sm">อายุ {patient.age}</div>
                        <div className="text-slate-700 font-medium text-sm md:text-base mt-1 truncate">{patient.diagnosis || 'Cleft Lip - left - microform'}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-cyan-400 hover:bg-cyan-500 text-white border-none gap-1 px-2 py-0.5 text-[10px] md:text-xs rounded-full shadow-sm shadow-cyan-200">
                            <CheckCircle className="w-3 h-3" strokeWidth={3} /> Consent
                        </Badge>
                        <Badge className="bg-emerald-400 hover:bg-emerald-500 text-white border-none gap-1 px-2 py-0.5 text-[10px] md:text-xs rounded-full shadow-sm shadow-emerald-200">
                            ใช้งานอยู่
                        </Badge>
                    </div>

                    <div className="h-10 md:h-12" aria-hidden="true" />
                    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 px-4 md:px-6 flex gap-2 z-10">
                        <Button variant="outline" className="flex-1 rounded-md h-8 md:h-10 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 bg-white shadow-sm">
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-md h-8 md:h-10 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 bg-white shadow-sm">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>

                    </div>
                 </div>
            </div>

            {/* Sub-Menu Pills */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pb-2">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={cn(
                            "w-full px-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap flex justify-center items-center",
                            activeSubTab === tab.id 
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 min-h-[400px] relative">
                {activeSubTab === 'info' && (
                    <div className="animate-in fade-in duration-300 relative">
                        <div className="absolute top-0 right-0 z-10">
                            {!isEditingInfo ? (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                        setEditData(patient);
                                        setIsEditingInfo(true);
                                    }}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                >
                                    <Pencil size={20} />
                                </Button>
                            ) : null}
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <User className="text-blue-500" /> ข้อมูลทั่วไป
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">เลขบัตรประชาชน</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.cid || ""} 
                                            onChange={(e) => setEditData({...editData, cid: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.cid || "1509900000001"}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">วันเกิด</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.dob || ""} 
                                            onChange={(e) => setEditData({...editData, dob: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.dob}</span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">วันที่เข้ารับการรักษา</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.admissionDate || ""} 
                                            onChange={(e) => setEditData({...editData, admissionDate: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.admissionDate}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">สถานพยาบาลต้นสังกัด</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.originHospital || ""} 
                                            onChange={(e) => setEditData({...editData, originHospital: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.originHospital}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">รพ.สต. ที่รับผิดชอบ</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.responsibleHealthCenter || ""} 
                                            onChange={(e) => setEditData({...editData, responsibleHealthCenter: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.responsibleHealthCenter}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 mb-6">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <User className="text-blue-500" /> ข้อมูลผู้ปกครอง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">ชื่อ-นามสกุล</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.contact?.name || ""} 
                                            onChange={(e) => setEditData({...editData, contact: {...editData.contact, name: e.target.value}})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.contact?.name}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">ความสัมพันธ์</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.contact?.relationship || "มารดา"} 
                                            onChange={(e) => setEditData({...editData, contact: {...editData.contact, relationship: e.target.value}})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.contact?.relationship || "มารดา"}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">เบอร์โทรศัพท์</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.contact?.phone || ""} 
                                            onChange={(e) => setEditData({...editData, contact: {...editData.contact, phone: e.target.value}})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.contact?.phone}</span>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">ที่อยู่</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.contact?.address || ""} 
                                            onChange={(e) => setEditData({...editData, contact: {...editData.contact, address: e.target.value}})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.contact?.address}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 mb-6">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-blue-500" /> สิทธิการรักษา
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">สิทธิการรักษาปัจจุบัน</span> 
                                    {isEditingInfo ? (
                                        <Input 
                                            value={editData?.rights || ""} 
                                            onChange={(e) => setEditData({...editData, rights: e.target.value})}
                                            className="h-9 bg-white border-slate-200 mt-1" 
                                        />
                                    ) : (
                                        <span className="text-base font-medium text-slate-800">{patient.rights}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditingInfo && (
                            <div className="flex justify-center pt-4 pb-2 animate-in slide-in-from-bottom-2 fade-in gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditingInfo(false);
                                        setEditData(null);
                                    }}
                                    className="px-8 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    ยกเลิก
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setInfoData(editData);
                                        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                                        setIsEditingInfo(false);
                                    }}
                                    className="bg-[#7066a9] hover:bg-[#5f5690] text-white px-8 rounded-full shadow-lg shadow-purple-200 transition-all active:scale-95"
                                >
                                    <Save size={18} className="mr-2" /> บันทึกข้อมูล
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeSubTab === 'diagnosis' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <Stethoscope className="text-blue-500" /> การวินิจฉัยโรค
                        </h3>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl mb-6">
                            <h4 className="font-bold text-blue-900 mb-2">Diagnosis List</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                                    Cleft Lip (ปากแหว่ง)
                                </span>
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                                    Cleft Palate (เพดานโหว่)
                                </span>
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                                    Microform
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
                            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase">แพทย์เจ้าของไข้</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Stethoscope size={20} />
                                </div>
                                <p className="text-lg font-bold text-slate-800">{patient.attendingPhysician}</p>
                            </div>
                        </div>
                        
                    </div>
                )}

                {activeSubTab === 'care_pathway' && (
                    <div className="h-full">
                        <>
                            <div className="mb-6">
                                <h4 className="font-bold text-slate-800 flex items-center mb-4">
                                    <Route className="text-blue-500 mr-2 w-5 h-5" /> แผนการรักษา
                                </h4>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => setIsEditCarePathwayOpen(true)}
                                        className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white text-[14px] font-['IBM_Plex_Sans_Thai'] px-4 py-2 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95"
                                    >
                                        แก้ไขแผนการรักษา
                                    </button>
                                </div>
                            </div>
                            <div className="relative pl-2 ml-2">
                                {patient.timeline?.map((item: any, index: number) => {
                                    // Override logic: 'ฝึกพูด' (Speaking practice) should be treated as overdue if pending, matching the design requirement
                                    const isOverdue = item.status === 'overdue' || (item.status === 'pending' && item.stage.includes('ฝึกพูด'));
                                    const isCompleted = item.status === 'completed';
                                    
                                    return (
                                        <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                            {/* Timeline Line */}
                                            {index !== patient.timeline.length - 1 && (
                                                <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>
                                            )}

                                            {/* Timeline Node */}
                                            <div className={cn(
                                                "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white z-10 flex items-center justify-center",
                                                isOverdue ? "bg-red-500 ring-2 ring-red-100" :
                                                isCompleted ? "bg-green-500 ring-2 ring-green-100" :
                                                "bg-blue-500 ring-2 ring-blue-100"
                                            )}>
                                                {isOverdue && <span className="text-white text-[9px] font-bold leading-none">!</span>}
                                            </div>
                                            
                                            {/* Card */}
                                            <div 
                                                className={cn(
                                                    "bg-white p-4 rounded-2xl border cursor-pointer transition-all",
                                                    isOverdue ? "border-red-200 bg-red-50/10 shadow-sm shadow-red-100/50 hover:border-red-300" :
                                                    "border-slate-200 hover:border-blue-300 shadow-sm"
                                                )}
                                                onClick={() => {
                                                    setSelectedMilestone(item);
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={cn(
                                                        "text-xs font-bold px-2.5 py-1 rounded-lg",
                                                        isOverdue ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {item.age}
                                                    </span>
                                                    {isOverdue && (
                                                        <Badge variant="destructive" className="h-6 px-2 text-[10px] font-medium border-none bg-red-100 text-red-600 hover:bg-red-200 shadow-none">
                                                            ล่าช้า (Overdue)
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h5 className={cn(
                                                    "font-bold text-base mb-2",
                                                    isOverdue ? "text-red-700" : "text-slate-800"
                                                )}>{item.stage}</h5>
                                                <div className="text-xs text-slate-500 flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Calendar size={12} className="text-slate-400" /> 
                                                        <span>{item.date === '-' ? '-' : `Auto-calc: ${item.date}`}</span>
                                                    </div>
                                                    {isCompleted && (
                                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                                            <CheckCircle size={14} /> เสร็จสิ้น
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    </div>
                )}

                {activeSubTab === 'rights' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-blue-500" /> รายชื่อทุนที่ได้รับ
                            </h4>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <span className="text-slate-800 font-medium text-base">Operation Smile</span>
                            </div>
                        </div>

                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-blue-500" /> ประวัติทุนสงเคราะห์
                                </h4>
                                <button 
                                    className="bg-[#5B4D9D] hover:bg-[#4a3e85] text-white text-sm font-['IBM_Plex_Sans_Thai'] px-4 py-2 rounded-[10px] shadow-sm transition-all active:scale-95 flex items-center gap-2"
                                    style={{ backgroundColor: '#5B4D9D', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Plus className="w-4 h-4" strokeWidth={3} />
                                    <span className="font-bold">ขอเบิก</span>
                                </button>
                            </div>
                            {/* Removed redundant h5 */}
                            <div className="space-y-3">
                                {(patient.funding && patient.funding.length > 0 ? patient.funding : [
                                    { type: 'ค่าพาหนะ (Refer)', status: 'approved', date: '15 พ.ย. 67', amount: 2500 },
                                    { type: 'ค่าครองชีพรายวัน', status: 'pending', date: '10 ธ.ค. 67', amount: 3000 }
                                ]).map((f: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                        <div>
                                            <p className="font-medium text-slate-800">{f.type}</p>
                                            <p className="text-xs text-slate-400">{f.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">{f.amount?.toLocaleString()} บ.</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${f.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {f.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    </div>
                )}

                {activeSubTab === 'map' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <MapPin className="text-blue-500" /> แผนที่บ้านผู้ป่วย
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative h-64 bg-slate-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1551729513-02ac4976572c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBtYXAlMjBzdHJlZXQlMjB2aWV3JTIwbG9jYXRpb258ZW58MXx8fHwxNzY1Mzc3Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                    alt="Map Location" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="relative">
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 blur-sm rounded-full"></div>
                                        <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg -mt-4 animate-bounce" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-center md:text-left space-y-1">
                                        <h4 className="font-bold text-slate-800 text-lg">บ้านพักผู้ป่วย</h4>
                                        <p className="text-slate-500 text-sm max-w-md">{patient.contact.address}</p>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                                        <Route size={20} /> ขอเส้นทาง (Google Maps)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
