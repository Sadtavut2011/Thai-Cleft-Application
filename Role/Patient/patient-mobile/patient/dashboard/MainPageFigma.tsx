import svgPaths from "../../../../../imports/svg-hvj2ya57wc";
import imgImage2 from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";
import imgFrame36 from "figma:asset/d2e5b3611c651e5539da38843ee22972bf9fa81f.png";

function Component() {
  return (
    <div className="absolute h-[14px] left-0 top-0 w-[35px]" data-name="9:41">
      <div className="absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-center text-nowrap text-white tracking-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[14px] whitespace-pre">9:41</p>
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
        <p className="leading-[14px] whitespace-pre">32</p>
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
    <div className="content-stretch flex h-[60px] items-center justify-center relative shrink-0 w-full" data-name="Status bar/iPhone 16/Main">
      <Left />
      <DynamicIsland />
      <Right />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute bg-[#e02424] box-border content-stretch flex gap-[10px] items-center justify-center left-[16px] px-[2px] py-0 rounded-[99px] top-[-6px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] h-[16px] leading-[1.5] not-italic relative shrink-0 text-[12px] text-white w-[22px]">99+</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#faca15] text-[20px] text-nowrap whitespace-pre">bell</p>
      <Frame9 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap whitespace-pre">user</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0">
      <Icon />
      <Icon1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[12px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white whitespace-pre">Thai Cleft Primary Care</p>
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#f6f5ff] box-border content-stretch flex gap-[8px] items-center justify-center not-italic px-[12px] py-[4px] relative rounded-[99px] shrink-0 text-[16px] text-nowrap">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] relative shrink-0 text-[#49358e] whitespace-pre">โรงพยาบาลฝาง</p>
      <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-center text-gray-500 tracking-[0.0232px]">
        <p className="leading-[32px] text-nowrap whitespace-pre">chevron-down</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[40px]" data-name="image 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[117.82%] left-[-10.4%] max-w-none top-[-8.91%] w-[119.8%]" src={imgImage2} />
        </div>
      </div>
      <Frame20 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] items-end justify-center leading-[1.5] not-italic relative shrink-0 text-nowrap whitespace-pre">
      <p className="relative shrink-0 text-[16px] text-white">2 กันยายน 2568</p>
      <p className="relative shrink-0 text-[12px] text-gray-100">13:30 น.</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame90 />
      <Frame21 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px] whitespace-pre">19,256</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
      <Frame15 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame19 />
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">/คน</p>
    </div>
  );
}

function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49 50">
        <g id="Group" opacity="0.2">
          <path d={svgPaths.p1ad23d80} fill="var(--fill-0, #D5DCF8)" id="Vector" />
          <path d={svgPaths.p38658900} fill="var(--fill-0, #EAEFFE)" id="Vector_2" />
          <path d={svgPaths.p6cce800} fill="var(--fill-0, #F8F2F2)" id="Vector_3" />
          <path d={svgPaths.p3eb15600} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.pd0b7180} fill="var(--fill-0, #37286A)" id="Vector_5" />
          <path d={svgPaths.p331a6200} fill="var(--fill-0, #7066A9)" id="Vector_6" />
          <g id="Group_2">
            <path d={svgPaths.p1fab0880} fill="var(--fill-0, #49358E)" id="Vector_7" />
          </g>
          <g id="Group_3">
            <path d={svgPaths.p227bab80} fill="var(--fill-0, #49358E)" id="Vector_8" />
          </g>
          <g id="Group_4">
            <path d={svgPaths.pd120bb0} fill="var(--fill-0, #49358E)" id="Vector_9" />
          </g>
          <path d={svgPaths.p1f66f3f0} fill="var(--fill-0, #C0C8F3)" id="Vector_10" />
          <path d={svgPaths.p2520f200} fill="var(--fill-0, #E74694)" id="Vector_11" />
          <path d={svgPaths.p3312a600} fill="var(--fill-0, #824234)" id="Vector_12" />
          <path d={svgPaths.p40f5300} fill="var(--fill-0, #F6C9AF)" id="Vector_13" />
          <path d={svgPaths.p934c000} fill="var(--fill-0, #37286A)" id="Vector_14" />
          <path d={svgPaths.p3a5ab880} fill="var(--fill-0, #F6C9AF)" id="Vector_15" />
          <path d={svgPaths.p14b14f00} fill="var(--fill-0, #7066A9)" id="Vector_16" />
          <g id="Group_5">
            <path d={svgPaths.p53d5d00} fill="var(--fill-0, #7066A9)" id="Vector_17" />
          </g>
          <g id="Group_6">
            <path d={svgPaths.p2861c9c0} fill="var(--fill-0, #7066A9)" id="Vector_18" />
          </g>
          <g id="Group_7">
            <path d={svgPaths.p1cdae000} fill="var(--fill-0, #7066A9)" id="Vector_19" />
          </g>
          <g id="Group_8">
            <path d={svgPaths.p2c5a9800} fill="var(--fill-0, #7066A9)" id="Vector_20" />
          </g>
          <g id="Group_9">
            <path d={svgPaths.p33694620} fill="var(--fill-0, #7066A9)" id="Vector_21" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[18px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.13)] shrink-0">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">ผู้ป่วยทั้งหมด</p>
          <Frame18 />
          <div className="absolute flex inset-[35%_-0.07%_-9.77%_67.22%] items-center justify-center">
            <div className="flex-none h-[49.047px] rotate-[15deg] w-[48.072px]">
              <Group />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px] whitespace-pre">7,789</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
      <Frame25 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame27 />
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">/คน</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 66">
        <g id="Group" opacity="0.2">
          <path d={svgPaths.p2235ba00} fill="var(--fill-0, #EAEFFE)" id="Vector" />
          <path d={svgPaths.p2c0ed300} fill="var(--fill-0, #F3AE83)" id="Vector_2" />
          <path d={svgPaths.p1efc2e00} fill="var(--fill-0, #F6C9AF)" id="Vector_3" />
          <path d={svgPaths.p3856a600} fill="var(--fill-0, #D5DCF8)" id="Vector_4" />
          <path d={svgPaths.p3f81d400} fill="var(--fill-0, #49358E)" id="Vector_5" />
          <path d={svgPaths.p3db4c980} fill="var(--fill-0, #7066A9)" id="Vector_6" />
          <path d={svgPaths.pa7f6c00} fill="var(--fill-0, #37286A)" id="Vector_7" />
          <path d={svgPaths.p12bb82c0} fill="var(--fill-0, #37286A)" id="Vector_8" />
          <path d={svgPaths.p3cad8180} fill="var(--fill-0, #E74694)" id="Vector_9" />
          <path d={svgPaths.p1f60ad80} fill="var(--fill-0, #EAEFFE)" id="Vector_10" />
          <path d={svgPaths.p1ce6d900} fill="var(--fill-0, #49358E)" id="Vector_11" />
          <path d={svgPaths.pcc79900} fill="var(--fill-0, #6A88C8)" id="Vector_12" />
          <g id="Group_2">
            <path d={svgPaths.p1b8a1800} fill="var(--fill-0, #C0C8F3)" id="Vector_13" />
            <path d={svgPaths.p1b31f400} fill="var(--fill-0, #C0C8F3)" id="Vector_14" />
            <path d={svgPaths.p1d26e900} fill="var(--fill-0, #C0C8F3)" id="Vector_15" />
          </g>
          <g id="Group_3">
            <path d={svgPaths.p302c780} fill="var(--fill-0, #49358E)" id="Vector_16" />
          </g>
          <g id="Group_4">
            <path d={svgPaths.p36b1b00} fill="var(--fill-0, #49358E)" id="Vector_17" />
          </g>
          <g id="Group_5">
            <path d={svgPaths.peaa1700} fill="var(--fill-0, #49358E)" id="Vector_18" />
          </g>
          <g id="Group_6">
            <path d={svgPaths.p4de2480} fill="var(--fill-0, #49358E)" id="Vector_19" />
          </g>
          <g id="Group_7">
            <path d={svgPaths.p18589d80} fill="var(--fill-0, #49358E)" id="Vector_20" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[18px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.13)] shrink-0">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">ผู้ป่วยต้องติดตาม</p>
          <Frame28 />
          <div className="absolute bottom-[-17.1%] flex items-center justify-center left-[65%] right-[0.15%] top-1/4">
            <div className="flex-none h-[65.371px] rotate-[10.463deg] w-[51.71px]">
              <Group1 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px] whitespace-pre">356</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
      <Frame30 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame31 />
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">/คน</p>
    </div>
  );
}

function Group22() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57 56">
        <g id="Group 1171275649" opacity="0.2">
          <path d={svgPaths.p208b0f80} fill="var(--fill-0, #7066A9)" id="Vector" />
          <path d={svgPaths.p12dada10} fill="var(--fill-0, #EAEFFE)" id="Vector_2" />
          <path d={svgPaths.p8e8ca00} fill="var(--fill-0, #A1B2F7)" id="Vector_3" />
          <path d={svgPaths.p3a510700} fill="var(--fill-0, #7066A9)" id="Vector_4" />
          <path d={svgPaths.p3eead080} fill="var(--fill-0, #D2CEE7)" id="Vector_5" />
          <path d={svgPaths.p33dc1cf0} fill="var(--fill-0, #7066A9)" id="Vector_6" />
          <path d={svgPaths.p1567aa80} fill="var(--fill-0, #D2CEE7)" id="Vector_7" />
          <path d={svgPaths.p1daefa00} fill="var(--fill-0, #7066A9)" id="Vector_8" />
          <path d={svgPaths.p7122380} fill="var(--fill-0, #D2CEE7)" id="Vector_9" />
          <path d={svgPaths.p3dee2880} fill="var(--fill-0, #7066A9)" id="Vector_10" />
          <path d={svgPaths.p28dc9c00} fill="var(--fill-0, #D2CEE7)" id="Vector_11" />
          <path d={svgPaths.pb23d900} fill="var(--fill-0, #7066A9)" id="Vector_12" />
          <path d={svgPaths.p1d6cd700} fill="var(--fill-0, #D2CEE7)" id="Vector_13" />
          <g id="Group">
            <g id="Group_2">
              <path d={svgPaths.p3f6d6180} fill="var(--fill-0, #D61F69)" id="Vector_14" />
              <path d={svgPaths.pe14bdc0} fill="var(--fill-0, #D61F69)" id="Vector_15" />
              <path d={svgPaths.p2cb8f200} fill="var(--fill-0, #D61F69)" id="Vector_16" />
              <path d={svgPaths.p2f303980} fill="var(--fill-0, #D61F69)" id="Vector_17" />
              <path d={svgPaths.p3b790000} fill="var(--fill-0, #D61F69)" id="Vector_18" />
              <path d={svgPaths.p4eaa770} fill="var(--fill-0, #D61F69)" id="Vector_19" />
            </g>
            <path d={svgPaths.pa894a80} fill="var(--fill-0, #37286A)" id="Vector_20" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[18px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.13)] shrink-0">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">ขาดนัด</p>
          <Frame32 />
          <div className="absolute flex inset-[21.25%_-0.23%_-7.1%_61.67%] items-center justify-center">
            <div className="flex-none h-[55.86px] rotate-[15deg] w-[56.886px]">
              <Group22 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px] whitespace-pre">12</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame34 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
      <Frame35 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame36 />
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">/งาน</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="opacity-20 relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 54">
        <g id="Group">
          <path d={svgPaths.p3a58d700} fill="var(--fill-0, #CBCFF7)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[37.38%_6.12%_-15.42%_64.44%]" data-name="Group">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[53.806px] rotate-[15deg] w-[40.432px]">
          <Group2 />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="opacity-20 relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 54">
        <g id="Group">
          <path d={svgPaths.p3601a700} fill="var(--fill-0, #E6EFFF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[32.18%_1.64%_-10.22%_68.94%]" data-name="Group">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[53.806px] rotate-[15deg] w-[40.415px]">
          <Group4 />
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="opacity-20 relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Group">
          <path d={svgPaths.p1157a700} fill="var(--fill-0, #CBCFF7)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[41.7%_1.64%_41.47%_90.88%]" data-name="Group">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none rotate-[15deg] size-[10.996px]">
          <Group6 />
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="opacity-20 relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Group">
          <path d={svgPaths.pcd5ac00} fill="var(--fill-0, #D61F69)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[39.88%_15.37%_44.64%_77.75%]" data-name="Group">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[10.116px] rotate-[15deg] w-[10.1px]">
          <Group8 />
        </div>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="opacity-20 relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 2">
        <g id="Group">
          <path d={svgPaths.p1e6af300} fill="var(--fill-0, #466F91)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function MainPageFigma() {
  return (
    <div className="bg-slate-50 relative size-full" data-name="Main page">
      {/* Figma content implementation here if needed, but for now just wrapping the structure */}
      <div className="flex flex-col w-full h-full p-4">
         <Frame7 />
         <Frame12 />
         <div className="flex gap-4 mt-6">
            <Frame16 />
            <Frame17 />
         </div>
         <div className="flex gap-4 mt-4">
            <Frame33 />
            {/* Add more frames as per Figma if required */}
         </div>
      </div>
    </div>
  );
}
