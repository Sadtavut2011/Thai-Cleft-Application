import React, { useMemo, useState } from 'react';
import { Users, Building2, Eye } from 'lucide-react';
import { buildServiceUnits, ServiceUnit } from '../../../../data/themeConfig';

interface ServiceUnitsCardProps {
  /** Max units to show before "+X เพิ่มเติม" */
  maxVisible?: number;
  /** Callback when "ดูรายละเอียด" is clicked */
  onViewDetail?: () => void;
  /** Callback when a unit card is clicked */
  onUnitClick?: (unitName: string) => void;
}

export default function ServiceUnitsCard({
  maxVisible = 2,
  onViewDetail,
  onUnitClick,
}: ServiceUnitsCardProps) {
  const units = useMemo(() => buildServiceUnits(), []);
  const totalCases = useMemo(() => units.reduce((s, u) => s + u.caseCount, 0), [units]);
  const visibleUnits = units.slice(0, maxVisible);
  const remainingCount = Math.max(units.length - maxVisible, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users size={20} className="text-[#37286A]" />
          <h3 className="font-bold text-[#37286A] text-[18px] leading-tight">
            ทีมงาน/หน่วยบริการ
          </h3>
        </div>
        <span className="bg-[#37286A] text-white text-[14px] font-bold px-3.5 py-1 rounded-full leading-none">
          {units.length} แห่ง
        </span>
      </div>

      <div className="mx-4 h-[1px] bg-[#E3E0F0]" />

      {/* ── Unit Cards ── */}
      <div className="px-4 pt-3 pb-1 space-y-3">
        {visibleUnits.map((unit) => (
          <div
            key={unit.name}
            onClick={() => onUnitClick?.(unit.name)}
            className="bg-[#FAFAFE] rounded-xl border border-[#E3E0F0] p-4 cursor-pointer hover:shadow-md hover:border-[#C4BFFA] transition-all active:scale-[0.98]"
          >
            {/* Unit name row */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#F4F0FF] flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-[#7066A9]" />
              </div>
              <span className="font-bold text-[#37286A] text-[16px] truncate">
                {unit.name}
              </span>
            </div>

            {/* Badges + parent hospital */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#EDE9FF] text-[#5B4FCC] text-[13px] font-bold px-3 py-1 rounded-full leading-none">
                  {unit.caseCount} เคส
                </span>
                <span className="bg-[#E0FBFC] text-[#00B8D4] text-[13px] font-bold px-3 py-1 rounded-full leading-none">
                  {unit.patientCount} ผู้ป่วย
                </span>
              </div>
              <span className="text-[#9E9E9E] text-[14px] font-medium shrink-0">
                {unit.parentHospital}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── "+X หน่วยเพิ่มเติม" ── */}
      {remainingCount > 0 && (
        <button
          onClick={onViewDetail}
          className="py-3 text-center text-[#7066A9] text-[15px] font-medium hover:bg-[#F4F0FF]/50 transition-colors"
        >
          +{remainingCount} หน่วยเพิ่มเติม
        </button>
      )}

      {/* ── Footer: เคสรวม ── */}
      <div className="mx-4 h-[1px] bg-[#E3E0F0]" />
      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-[#7066A9] font-bold text-[16px]">เคสรวม</span>
        <span className="font-bold text-[#37286A] text-[20px]">{totalCases} เคส</span>
      </div>

      {/* ── spacer grows so button sticks bottom ── */}
      <div className="flex-1" />

      {/* ── ดูรายละเอียด Button ── */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={onViewDetail}
          className="w-full h-12 rounded-xl bg-[#F4F0FF] text-[#5B4FCC] font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-[#EDE9FF] active:scale-[0.98] transition-all border border-[#E3E0F0]"
        >
          <Eye size={18} />
          ดูรายละเอียด
        </button>
      </div>
    </div>
  );
}