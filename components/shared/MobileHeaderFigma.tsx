import React from 'react';
import { Bell, User, ChevronLeft } from 'lucide-react';
import svgPaths from "../../imports/svg-qvj6hgoict"; // Adjusted path

function Component() {
  return (
    <div className="absolute h-[14px] left-0 top-0 w-[35px]" data-name="9:41">
      <div className="absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-center text-nowrap text-white tracking-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="font-['IBM_Plex_Sans_Thai'] leading-[14px] whitespace-pre">9:41</p>
      </div>
    </div>
  );
}

function Time() {
  return (
    <div className="h-[14px] relative shrink-0 w-[35px]" data-name="Time">
      <Component />
    </div>
  );
}

function Location() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Location">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Location">
          <path d={svgPaths.p3d5bc280} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Left() {
  return (
    <div className="basis-0 grow h-[60px] min-h-px min-w-px relative shrink-0" data-name="Left">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] h-[60px] items-center justify-center px-[42px] py-[12px] relative w-full">
          <Time />
          <Location />
        </div>
      </div>
    </div>
  );
}

function Lens() {
  return (
    <div className="absolute left-[98px] size-[12px] top-[12px]" data-name="Lens">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Lens">
          <circle cx="6" cy="6" fill="var(--fill-0, #0E101F)" id="Ellipse 1" r="6" />
          <circle cx="6" cy="6" fill="var(--fill-0, #01031A)" id="Ellipse 2" r="4.90909" />
          <g filter="url(#filter0_f_9_3721)" id="Ellipse 3">
            <ellipse cx="6" cy="3.27273" fill="var(--fill-0, white)" fillOpacity="0.1" rx="2.72727" ry="1.09091" />
          </g>
          <g filter="url(#filter1_f_9_3721)" id="Ellipse 4">
            <ellipse cx="6" cy="8.18182" fill="var(--fill-0, white)" fillOpacity="0.1" rx="2.72727" ry="1.63636" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="4.18182" id="filter0_f_9_3721" width="7.45455" x="2.27273" y="1.18182">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_9_3721" stdDeviation="0.5" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.27273" id="filter1_f_9_3721" width="7.45455" x="2.27273" y="5.54545">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_9_3721" stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="bg-black h-[36px] overflow-clip relative rounded-[32px] shrink-0 w-[122px]" data-name="Dynamic Island">
      <Lens />
    </div>
  );
}

function Signal() {
  return (
    <div className="absolute bottom-[3.57%] left-0 right-[-2.78%] top-[7.14%]" data-name="Signal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 13">
        <g id="Signal">
          <path d={svgPaths.p32b81f0} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa041880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p29615c00} fill="var(--fill-0, white)" id="Vector_3" opacity="0.2" />
          <path d={svgPaths.pdcf4a00} fill="var(--fill-0, white)" id="Vector_4" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

function Network() {
  return (
    <div className="h-[14px] relative shrink-0 w-[18px]" data-name="Network">
      <Signal />
    </div>
  );
}

function Data() {
  return (
    <div className="h-[14px] relative shrink-0 w-[18px]" data-name="Data">
      <div className="absolute bottom-0 left-[-3.5%] right-[-3.5%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 14">
          <g id="Data">
            <path d={svgPaths.pc543300} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="h-[14px] relative shrink-0 w-[27px]" data-name="Battery">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 14">
          <g id="Vector" opacity="0.3">
            <path d={svgPaths.p33066e00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p241a6080} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-[63.41%] top-0" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 14">
          <path d={svgPaths.p14c441c0} fill="var(--fill-0, #F7CE45)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center leading-[0] left-[13px] text-[11px] text-center text-nowrap text-white top-[7px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="font-['IBM_Plex_Sans_Thai'] leading-[14px] whitespace-pre">32</p>
      </div>
    </div>
  );
}

function Right() {
  return (
    <div className="basis-0 grow h-[60px] min-h-px min-w-px relative shrink-0" data-name="Right">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[60px] items-center justify-center px-[28px] py-[12px] relative w-full">
          <Network />
          <Data />
          <Battery />
        </div>
      </div>
    </div>
  );
}

function StatusBarIPhone16Main() {
  return (
    <div className="absolute content-stretch flex h-[60px] items-center justify-center left-0 top-0 w-[402px]" data-name="Status bar/iPhone 16/Main">
      <Left />
      <DynamicIsland />
      <Right />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#e02424] box-border content-stretch flex gap-[10px] items-center justify-center left-[16px] px-[2px] py-0 rounded-[99px] top-[-6px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] h-[16px] leading-[1.5] not-italic relative shrink-0 text-[12px] text-white w-[22px]">99+</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <Bell size={20} className="text-[#faca15] fill-[#faca15]" />
      <Frame2 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <User size={20} className="text-[#49358e] fill-[#49358e]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0">
      <Icon />
      <Icon1 />
    </div>
  );
}

function Frame({ onBack, title }: { onBack?: () => void, title?: string }) {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 px-[16px] py-[12px] top-[60px] w-full">
      {onBack ? (
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-white hover:text-white/80 transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[18px] font-medium">{title || "ย้อนกลับ"}</span>
          </button>
      ) : (
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white whitespace-pre">{title || "Thai Cleft Primary Care"}</p>
      )}
      <Frame1 />
    </div>
  );
}

export default function MobileHeaderFigma({ onBack, title }: { onBack?: () => void, title?: string }) {
  return (
    <div className="relative size-full">
      <StatusBarIPhone16Main />
      <Frame onBack={onBack} title={title} />
    </div>
  );
}
