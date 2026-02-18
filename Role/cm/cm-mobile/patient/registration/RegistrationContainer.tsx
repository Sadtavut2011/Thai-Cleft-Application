import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Check, Calendar, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import svgPaths from "../../../../../imports/svg-zlq26czodq";

// Images from Step 1
import imgApple2 from "figma:asset/b887d4e28eed90ca1783e2efea53ff41d7d1260a.png";
import imgApple1 from "figma:asset/6dfcf5e47c34ce9afb0ec4133925f271bf201bed.png";
import imgRectangle4273 from "figma:asset/b59bbb2fd8ad222b13b3f030a4bd9075916e406a.png";

// --- Helper Components ---

function CommentDuotone({ additionalClassNames = "" }: { additionalClassNames?: string }) {
  return (
    <div className={clsx("w-[24px] h-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="comment_duotone">
          <path d={svgPaths.p28f06400} fill="#49358E" fillOpacity="0.75" id="Union" />
          <path d="M8.5 9.5L15.5 9.5" id="Vector 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 12.5L13.5 12.5" id="Vector 9" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Helper({ additionalClassNames = "" }: { additionalClassNames?: string }) {
  return (
    <div className={clsx("relative size-[23px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <circle cx="11.5" cy="11.5" id="Ellipse 157" r="10.5" stroke="#DDDDDD" strokeWidth="2" />
      </svg>
    </div>
  );
}

function ProgressDots({ step }: { step: number }) {
    return (
        <div className="flex gap-2 mb-4 justify-center">
            {[1, 2, 3, 4, 5, 6].map((s) => (
                <div 
                    key={s} 
                    className={clsx(
                        "w-2 h-2 rounded-full", 
                        step === s ? "bg-[#49358E]" : "bg-[#E4E4E6]"
                    )}
                ></div>
            ))}
        </div>
    );
}

function BackgroundDecor() {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
         <div className="absolute -right-[100px] top-[100px] w-[400px] h-[400px] bg-[#ac577b] rounded-full blur-[100px] opacity-20"></div>
         <div className="absolute -left-[100px] bottom-[100px] w-[300px] h-[300px] bg-[#49358E] rounded-full blur-[80px] opacity-20"></div>
      </div>
    );
}

function FooterButton({ onClick, text, isCheck = false, isConfirm = false }: { onClick: () => void, text: string, isCheck?: boolean, isConfirm?: boolean }) {
    return (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-[#E4E4E6] z-[50] pb-safe shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button 
                onClick={onClick}
                className="w-full h-[56px] bg-[#49358E] text-white rounded-[16px] font-semibold text-[16px] shadow-[0px_10px_35px_rgba(73,53,142,0.25)] hover:bg-[#3d2c76] transition-all active:scale-[0.98] uppercase tracking-wide flex items-center justify-center gap-3"
            >
                {isCheck && <Check size={20} className="text-white" />}
                {text}
                {!isCheck && !isConfirm && (
                    <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
                        <ChevronRight size={16} className="text-[#49358E]" />
                    </div>
                )}
            </button>
        </div>
    );
}

// --- Types ---
interface RegistrationContainerProps {
    onBack: () => void;
    onSubmit: (data: any) => void;
}

export default function RegistrationContainer({ onBack, onSubmit }: RegistrationContainerProps) {
    const [step, setStep] = useState(1);

    // CSS Hack to hide sidebar when this component is mounted
    React.useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .fixed.bottom-0.left-0.w-full.bg-white.z-50 {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [formData, setFormData] = useState({
        // Step 1
        idType: 'idcard' as 'idcard' | 'passport' | 'no_id',
        idNumber: '',
        // Step 2
        firstName: '',
        lastName: '',
        birthDate: '',
        age: '',
        status: '',
        gender: '',
        phone: '',
        // Step 3
        englishName: '',
        englishSurname: '',
        race: '',
        nationality: '',
        religion: '',
        maritalStatus: '',
        occupation: '',
        homePhone: '',
        email: '',
        bloodGroup: '',
        foodAllergy: '',
        // Step 4
        mainRight: 'universal_coverage',
        rightsHospital: 'นครพิงค์', // Renamed to avoid collision
        subRight: '',
        // Step 5
        guardian: {
            thaiName: '',
            thaiSurname: '',
            idCard: '1234567891011',
            relationship: '',
            dob: '30 มีนาคม 2512',
            age: '55 ปี',
            phone: '080-23456789',
            occupation: '',
            status: ''
        },
        // Step 6
        hospitalInfo: {
            hospital: 'โรงพยาบาลมหาราชนครเชียงใหม่',
            isAffiliated: false,
            hn: '',
            firstTreatmentDate: '',
            distance: '',
            travelTime: ''
        }
    });

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        } else {
            onBack();
        }
    };

    const handleConfirm = () => {
        onSubmit(formData);
    };

    // --- Steps Renderers ---

    const renderStep1 = () => (
        <div className="bg-white relative w-full h-full flex flex-col items-center overflow-hidden">
            {/* Header */}
            <div className="w-full pt-6 pb-2 px-4 flex items-center justify-between relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer z-10" onClick={onBack}>
                    <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6] translate-y-1 relative mt-4">
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-[18px] font-semibold text-[#49358E]">การระบุตัวตน</h1>
                </div>
            </div>

            <ProgressDots step={1} />

            <div className="w-full px-6 flex flex-col gap-4 max-w-md mx-auto flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* Option 1: Thai ID Card */}
                <div 
                    className={clsx(
                        "relative bg-white border border-solid h-[60px] rounded-[15px] cursor-pointer transition-all",
                        formData.idType === 'idcard' ? "border-[#49358E] shadow-[0px_4px_15px_rgba(73,53,142,0.15)]" : "border-[#e5e5e5]"
                    )}
                    onClick={() => updateFormData({ idType: 'idcard' })}
                >
                    <div className="absolute left-[44px] overflow-hidden size-[28px] top-[16px]">
                        <img alt="" className="w-full h-full object-cover" src={imgApple2} />
                    </div>
                    <div className="absolute left-[95px] top-[50%] -translate-y-1/2 font-['Noto_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">
                        เลขประจำตัวประชาชน
                    </div>
                    <div className="absolute right-[20px] top-[50%] -translate-y-1/2">
                        {formData.idType === 'idcard' ? (
                            <div className="relative w-[23px] h-[23px]">
                                <svg className="block size-full" fill="none" viewBox="0 0 23 23">
                                    <circle cx="11.5" cy="11.5" r="10.5" stroke="#49358E" strokeWidth="2" />
                                    <circle cx="11.5" cy="11.5" r="6.5" fill="#49358E" />
                                </svg>
                            </div>
                        ) : <Helper />}
                    </div>
                </div>

                {/* Input Field for ID Card */}
                {formData.idType === 'idcard' && (
                    <div className="w-full animate-in slide-in-from-top-2 duration-200">
                        <div className="relative h-[56px] w-full">
                            <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center px-4">
                                <div className="mr-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d={svgPaths.p28f06400} fill="#49358E" fillOpacity="0.75" />
                                        <path d="M8.5 9.5L15.5 9.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.5 12.5L13.5 12.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <input 
                                    type="text"
                                    placeholder="ระบุเลขประจำตัวประชาชน *"
                                    className="w-full h-full outline-none text-[16px] text-[#3c3c3c] placeholder-[#747688]"
                                    value={formData.idNumber}
                                    onChange={(e) => updateFormData({ idNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Option 2: Passport */}
                <div 
                    className={clsx(
                        "relative bg-white border border-solid h-[60px] rounded-[15px] cursor-pointer transition-all mt-2",
                        formData.idType === 'passport' ? "border-[#49358E] shadow-[0px_4px_15px_rgba(73,53,142,0.15)]" : "border-[#e5e5e5]"
                    )}
                    onClick={() => updateFormData({ idType: 'passport' })}
                >
                    <div className="absolute left-[44px] overflow-hidden size-[28px] top-[16px]">
                        <img alt="" className="w-full h-full object-cover" src={imgApple1} />
                    </div>
                    <div className="absolute left-[95px] top-[50%] -translate-y-1/2 font-['Noto_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">
                        หมายเลขหนังสือเดินทาง
                    </div>
                    <div className="absolute right-[20px] top-[50%] -translate-y-1/2">
                        {formData.idType === 'passport' ? (
                            <div className="relative w-[23px] h-[23px]">
                                <svg className="block size-full" fill="none" viewBox="0 0 23 23">
                                    <circle cx="11.5" cy="11.5" r="10.5" stroke="#49358E" strokeWidth="2" />
                                    <circle cx="11.5" cy="11.5" r="6.5" fill="#49358E" />
                                </svg>
                            </div>
                        ) : <Helper />}
                    </div>
                </div>

                {/* Option 3: No ID */}
                <div 
                    className={clsx(
                        "relative bg-white border border-solid h-[60px] rounded-[15px] cursor-pointer transition-all",
                        formData.idType === 'no_id' ? "border-[#49358E] shadow-[0px_4px_15px_rgba(73,53,142,0.15)]" : "border-[#e5e5e5]"
                    )}
                    onClick={() => updateFormData({ idType: 'no_id' })}
                >
                    <div className="absolute left-[44px] overflow-hidden size-[28px] top-[16px]">
                        <img alt="" className="w-full h-full object-cover" src={imgRectangle4273} />
                    </div>
                    <div className="absolute left-[95px] top-[50%] -translate-y-1/2 font-['Noto_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">
                        ไม่มี ID ระบุตัวตน
                    </div>
                    <div className="absolute right-[20px] top-[50%] -translate-y-1/2">
                        {formData.idType === 'no_id' ? (
                            <div className="relative w-[23px] h-[23px]">
                                <svg className="block size-full" fill="none" viewBox="0 0 23 23">
                                    <circle cx="11.5" cy="11.5" r="10.5" stroke="#49358E" strokeWidth="2" />
                                    <circle cx="11.5" cy="11.5" r="6.5" fill="#49358E" />
                                </svg>
                            </div>
                        ) : <Helper />}
                    </div>
                </div>
            </div>

            {/* Footer Step 1 */}
            <FooterButton 
                onClick={handleNext}
                text={formData.idType === 'idcard' ? "ตรวจสอบ" : "ถัดไป"}
                isCheck={formData.idType === 'idcard'}
            />
        </div>
    );

    const renderStep2 = () => (
        <div className="bg-white relative w-full h-full flex flex-col font-['Noto_Sans_Thai',sans-serif] overflow-hidden">
            <BackgroundDecor />
            {/* Header */}
            <div className="relative z-10 flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-full flex items-center justify-between mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-20" onClick={handleBack}>
                        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6]">
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-[18px] font-semibold text-[#49358E] uppercase tracking-wider">ประวัติผู้ป่วย</h1>
                    </div>
                </div>
                <ProgressDots step={2} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                 {/* Thai Name */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">ชื่อภาษาไทย *</label>
                    <div className="relative h-[56px]">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                            <input 
                                type="text"
                                className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                placeholder="ระบุชื่อภาษาไทย"
                                value={formData.firstName}
                                onChange={(e) => updateFormData({ firstName: e.target.value })}
                            />
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                    </div>
                </div>
                 {/* Thai Surname */}
                 <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">นามสกุลภาษาไทย *</label>
                    <div className="relative h-[56px]">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                            <input 
                                type="text"
                                className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                placeholder="ระบุนามสกุลภาษาไทย"
                                value={formData.lastName}
                                onChange={(e) => updateFormData({ lastName: e.target.value })}
                            />
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                    </div>
                </div>
                {/* Birth Date */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">วันเดือนปีเกิด *</label>
                    <div className="relative h-[56px] cursor-pointer">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                            <input 
                                type="date"
                                className="w-full h-full outline-none text-[16px] text-[#747688] bg-transparent"
                                value={formData.birthDate}
                                onChange={(e) => updateFormData({ birthDate: e.target.value })}
                            />
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>
                    </div>
                </div>
                {/* Age */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">อายุ</label>
                    <div className="relative h-[56px]">
                        <div className="absolute inset-0 bg-[#F4F5F7] border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                            <input 
                                type="text"
                                className="w-full h-full outline-none text-[16px] text-[#747688] bg-transparent"
                                placeholder="คำนวณอายุอัตโนมัติ"
                                readOnly
                                value={formData.age}
                            />
                        </div>
                        <div className="absolute left-[14px] top-[16px] opacity-50"><CommentDuotone /></div>
                    </div>
                </div>
                {/* Status */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">สถานะของผู้ป่วย</label>
                    <div className="relative h-[56px] cursor-pointer">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-10 shadow-sm">
                            <select 
                                className="w-full h-full outline-none text-[16px] text-[#120d26] bg-transparent appearance-none"
                                value={formData.status}
                                onChange={(e) => updateFormData({ status: e.target.value })}
                            >
                                <option value="" disabled>เลือกสถานะของผู้ป่วย</option>
                                <option value="active">ใช้งานอยู่</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>
                    </div>
                </div>
                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">เพศ</label>
                    <div className="relative h-[56px] cursor-pointer">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-10 shadow-sm">
                            <select 
                                className="w-full h-full outline-none text-[16px] text-[#120d26] bg-transparent appearance-none"
                                value={formData.gender}
                                onChange={(e) => updateFormData({ gender: e.target.value })}
                            >
                                <option value="" disabled>เลือกเพศ</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>
                    </div>
                </div>
                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">เบอร์โทรศัพท์มือถือ</label>
                    <div className="relative h-[56px]">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                            <input 
                                type="tel"
                                className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                placeholder="ระบุเบอร์โทรศัพท์มือถือ"
                                value={formData.phone}
                                onChange={(e) => updateFormData({ phone: e.target.value })}
                            />
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                    </div>
                </div>
            </div>
            <FooterButton onClick={handleNext} text="ถัดไป" />
        </div>
    );

    const renderStep3 = () => (
        <div className="bg-white relative w-full h-full flex flex-col font-['Noto_Sans_Thai',sans-serif] overflow-hidden">
            <BackgroundDecor />
            {/* Header */}
            <div className="relative z-10 flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-full flex items-center justify-between mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-20" onClick={handleBack}>
                        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6]">
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-[18px] font-semibold text-[#49358E] uppercase tracking-wider">ข้อมูลทั่วไป</h1>
                    </div>
                </div>
                <ProgressDots step={3} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* Form fields for step 3... simplifying for brevity but including all logic */}
                {['englishName', 'englishSurname', 'race', 'nationality', 'religion', 'maritalStatus', 'occupation', 'homePhone', 'email', 'bloodGroup', 'foodAllergy'].map(field => {
                    const labelMap: Record<string, string> = {
                        englishName: 'ชื่อภาษาอังกฤษ', englishSurname: 'นามสกุลภาษาอังกฤษ', race: 'เชื้อชาติ', nationality: 'สัญชาติ',
                        religion: 'ศาสนา', maritalStatus: 'สถานภาพ', occupation: 'อาชีพ', homePhone: 'เบอร์โทรศัพท์บ้าน', email: 'อีเมล',
                        bloodGroup: 'หมู่เลือด', foodAllergy: 'ประวัติการแพ้อาหาร'
                    };
                    return (
                        <div key={field} className="space-y-2">
                            <label className="text-[16px] font-medium text-[#120d26]">{labelMap[field]}</label>
                            <div className="relative h-[56px]">
                                <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                                    <input 
                                        type="text"
                                        className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                        placeholder={`ระบุ${labelMap[field]}`}
                                        value={(formData as any)[field]}
                                        onChange={(e) => updateFormData({ [field]: e.target.value })}
                                    />
                                </div>
                                <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <FooterButton onClick={handleNext} text="ถัดไป" />
        </div>
    );

    const renderStep4 = () => (
        <div className="bg-white relative w-full h-full flex flex-col font-['Noto_Sans_Thai',sans-serif] overflow-hidden">
             <BackgroundDecor />
             <div className="relative z-10 flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-full flex items-center justify-between mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-20" onClick={handleBack}>
                        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6]">
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-[18px] font-semibold text-[#49358E] uppercase tracking-wider">สิทธิการรักษา</h1>
                    </div>
                </div>
                <ProgressDots step={4} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="space-y-3">
                    <label className="text-[16px] font-medium text-[#120d26]">สิทธิหลักในการรับบริการ</label>
                    <div className="border border-[#e4dfdf] rounded-[12px] bg-white shadow-sm overflow-hidden">
                        <div className="relative min-h-[56px] flex items-center px-4 py-3 border-b border-[#f0f0f0] cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="mr-3"><CommentDuotone /></div>
                            <select 
                                className="flex-1 bg-transparent outline-none text-[16px] text-[#120d26] appearance-none w-full cursor-pointer z-10"
                                value={formData.mainRight}
                                onChange={(e) => updateFormData({ mainRight: e.target.value })}
                            >
                                <option value="universal_coverage">ประกันสุขภาพถ้วนหน้า</option>
                                <option value="social_security">ประกันสังคม</option>
                                <option value="civil_servant">ข้าราชการ</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                            <ChevronRight size={20} className="text-[#49358E]" />
                        </div>
                        <div className="relative min-h-[56px] flex items-center px-4 py-3 bg-white">
                            <div className="w-[24px] mr-3"></div>
                            <div className="flex-1 flex items-center justify-between">
                                <span className="text-[16px] text-[#120d26]">ระบุโรงพยาบาล</span>
                                <input 
                                    type="text"
                                    className="text-right outline-none text-[16px] text-[#747688] placeholder-[#747688] bg-transparent w-[150px]"
                                    value={formData.rightsHospital}
                                    onChange={(e) => updateFormData({ rightsHospital: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[16px] font-medium text-[#120d26]">ประเภทสิทธิย่อย</label>
                    <div className="relative h-[56px] cursor-pointer">
                        <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-10 shadow-sm hover:border-[#49358E] transition-colors">
                            <select 
                                className="w-full h-full outline-none text-[16px] text-[#120d26] bg-transparent appearance-none cursor-pointer"
                                value={formData.subRight}
                                onChange={(e) => updateFormData({ subRight: e.target.value })}
                            >
                                <option value="" disabled>เลือกประเภทสิทธิย่อย</option>
                                <option value="sub1">สิทธิย่อย 1</option>
                                <option value="sub2">สิทธิย่อย 2</option>
                            </select>
                        </div>
                        <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>
                    </div>
                </div>
            </div>
            <FooterButton onClick={handleNext} text="ถัดไป" />
        </div>
    );

    const renderStep5 = () => (
         <div className="bg-white relative w-full h-full flex flex-col font-['Noto_Sans_Thai',sans-serif] overflow-hidden">
             <BackgroundDecor />
             <div className="relative z-10 flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-full flex items-center justify-between mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-20" onClick={handleBack}>
                        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6]">
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-[18px] font-semibold text-[#49358E] uppercase tracking-wider">ข้อมูลผู้ปกครอง</h1>
                    </div>
                </div>
                <ProgressDots step={5} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <button className="w-full bg-[#49358E] text-white py-3 rounded-[12px] font-medium mb-6 flex items-center justify-center gap-2 shadow-md hover:bg-[#3d2c76] transition-colors">
                    <Plus size={20} /> เพิ่มผู้ปกครอง
                </button>

                <div className="relative">
                    <button className="absolute -top-3 right-0 bg-[#F0635A] text-white text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-20 hover:bg-[#d9534f] transition-colors uppercase font-medium tracking-wide">
                        DELETE
                    </button>

                    <div className="space-y-5 pt-2">
                        {/* Recursive field generation for Guardian info */}
                        {[
                            { key: 'thaiName', label: 'ชื่อภาษาไทย *' },
                            { key: 'thaiSurname', label: 'นามสกุลภาษาไทย *' },
                            { key: 'idCard', label: 'เลขประจำตัวประชาชน' },
                            { key: 'relationship', label: 'ความสัมพันธ์', type: 'select', options: ['father', 'mother', 'relative', 'other'] },
                            { key: 'dob', label: 'วัน/เดือน/ปีเกิด' },
                            { key: 'age', label: 'อายุ' },
                            { key: 'phone', label: 'เบอร์โทรศัพท์' },
                            { key: 'occupation', label: 'อาชีพ', type: 'select', options: ['employee', 'merchant', 'government', 'agriculture', 'other'] },
                            { key: 'status', label: 'สถานะ', type: 'select', options: ['living', 'deceased'] }
                        ].map((field: any) => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-[16px] font-medium text-[#120d26]">{field.label}</label>
                                <div className="relative h-[56px]">
                                    <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                                        {field.type === 'select' ? (
                                             <select 
                                                className="w-full h-full outline-none text-[16px] text-[#120d26] bg-transparent appearance-none cursor-pointer"
                                                value={(formData.guardian as any)[field.key]}
                                                onChange={(e) => updateFormData({ guardian: { ...formData.guardian, [field.key]: e.target.value } })}
                                            >
                                                <option value="" disabled>เลือก{field.label}</option>
                                                {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                type="text"
                                                className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                                placeholder={field.label}
                                                value={(formData.guardian as any)[field.key]}
                                                onChange={(e) => updateFormData({ guardian: { ...formData.guardian, [field.key]: e.target.value } })}
                                            />
                                        )}
                                    </div>
                                    <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                                    {field.type === 'select' && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <FooterButton onClick={handleNext} text="ถัดไป" />
         </div>
    );

    const renderStep6 = () => (
        <div className="bg-white relative w-full h-full flex flex-col font-['Noto_Sans_Thai',sans-serif] overflow-hidden">
             <BackgroundDecor />
             <div className="relative z-10 flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-full flex items-center justify-between mb-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-20" onClick={handleBack}>
                        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#FFFFFF]/20 backdrop-blur-md flex items-center justify-center border border-[#E4E4E6]">
                            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.26316 0.947372L0.947369 6.86391L7.03083 12.9474" stroke="#49358E" strokeWidth="1.89474" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-[18px] font-semibold text-[#49358E] uppercase tracking-wider">ข้อมูลโรงพยาบาล</h1>
                    </div>
                </div>
                <ProgressDots step={6} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                 <button className="w-full bg-[#49358E] text-white py-3 rounded-[12px] font-medium mb-6 flex items-center justify-center gap-2 shadow-md hover:bg-[#3d2c76] transition-colors">
                    <Plus size={20} /> เพิ่มโรงพยาบาล
                </button>

                <div className="relative">
                     <button className="absolute -top-3 right-0 bg-[#F0635A] text-white text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-20 hover:bg-[#d9534f] transition-colors uppercase font-medium tracking-wide">
                        DELETE
                    </button>
                    <div className="space-y-5 pt-2">
                        <div className="space-y-2">
                            <label className="text-[16px] font-medium text-[#120d26]">โรงพยาบาล *</label>
                            <div className="relative h-[56px]">
                                <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm cursor-pointer hover:border-[#49358E] transition-colors">
                                    <select 
                                        className="w-full h-full outline-none text-[16px] text-[#120d26] bg-transparent appearance-none cursor-pointer placeholder-[#747688]"
                                        value={formData.hospitalInfo.hospital}
                                        onChange={(e) => updateFormData({ hospitalInfo: { ...formData.hospitalInfo, hospital: e.target.value } })}
                                    >
                                        <option value="" disabled>เลือกโรงพยาบาล</option>
                                        <option value="โรงพยาบาลมหาราชนครเชียงใหม่">โรงพยาบาลมหาราชนครเชียงใหม่</option>
                                        <option value="โรงพยาบาลลำปาง">โรงพยาบาลลำปาง</option>
                                        <option value="other">อื่นๆ</option>
                                    </select>
                                </div>
                                <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#49358E]"><ChevronRight size={20} /></div>
                            </div>
                        </div>

                         <div className="relative h-[56px] cursor-pointer" onClick={() => updateFormData({ hospitalInfo: { ...formData.hospitalInfo, isAffiliated: !formData.hospitalInfo.isAffiliated } })}>
                            <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center px-4 justify-between shadow-sm hover:border-[#49358E] transition-colors">
                                <span className="text-[16px] font-medium text-[#120d26]">โรงพยาบาลต้นสังกัด</span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.hospitalInfo.isAffiliated ? 'border-[#49358E] bg-[#49358E]' : 'border-[#E4E4E6] bg-transparent'}`}>
                                    {formData.hospitalInfo.isAffiliated && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-[16px] font-medium text-[#120d26]">HN</label>
                            <div className="relative h-[56px]">
                                <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                                    <input 
                                        type="text"
                                        className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688]"
                                        placeholder="ระบุ HN"
                                        value={formData.hospitalInfo.hn}
                                        onChange={(e) => updateFormData({ hospitalInfo: { ...formData.hospitalInfo, hn: e.target.value } })}
                                    />
                                </div>
                                <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                            </div>
                        </div>

                        {/* Add remaining fields for Step 6: FirstTreatmentDate, Distance, TravelTime */}
                        {[
                            { key: 'firstTreatmentDate', label: 'เข้ารับการรักษาครั้งแรกเมื่อไหร่', type: 'date' },
                            { key: 'distance', label: 'ระยะทางที่เดินทางมารักษา ไป-กลับ (กิโลเมตร)' },
                            { key: 'travelTime', label: 'ระยะเวลาที่เดินทางมารักษา ไป-กลับ (ชั่วโมง:นาที)' }
                        ].map(field => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-[16px] font-medium text-[#120d26]">{field.label}</label>
                                <div className="relative h-[56px]">
                                    <div className="absolute inset-0 bg-white border border-[#e4dfdf] rounded-[12px] flex items-center pl-[50px] pr-4 shadow-sm">
                                        <input 
                                            type={field.type || 'text'}
                                            className="w-full h-full outline-none text-[16px] text-[#120d26] placeholder-[#747688] bg-transparent"
                                            value={(formData.hospitalInfo as any)[field.key]}
                                            onChange={(e) => updateFormData({ hospitalInfo: { ...formData.hospitalInfo, [field.key]: e.target.value } })}
                                        />
                                    </div>
                                    <div className="absolute left-[14px] top-[16px]"><CommentDuotone /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <FooterButton onClick={handleConfirm} text="CONFIRM" isConfirm />
        </div>
    );

    return (
        <div className="bg-white h-full flex flex-col font-['IBM_Plex_Sans_Thai']">
            <div className="flex-1 overflow-hidden relative">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
            </div>
        </div>
    );
}