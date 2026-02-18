import svgPaths from "./svg-6v58jc1c15";
import imgEllipse71 from "figma:asset/ac577bffa4d0304acbeb419e82e8606396148391.png";
import imgEllipse72 from "figma:asset/91f274d6413093118ef3ae549561d97071bc9da2.png";
import imgEllipse66 from "figma:asset/1969ce3fb109d173f0ac01fa4aa0db3c540dd34a.png";
import imgEllipse69 from "figma:asset/5cee84f7e6ce39537bee9e5e0f3778e0c426fde1.png";
import { imgEllipse70 } from "./svg-6nevb";

function ButtonColor() {
  return (
    <div className="absolute h-[58px] left-[49.51px] top-[870.12px] w-[271px]" data-name="Button- Color">
      <div className="absolute inset-[-43.1%_-12.92%_-77.59%_-12.92%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 341 128">
          <g id="Group 18177">
            <g filter="url(#filter0_d_273_2774)" id="Rectangle">
              <path clipRule="evenodd" d={svgPaths.p246c0200} fill="var(--fill-0, #5669FF)" fillRule="evenodd" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="128" id="filter0_d_273_2774" width="341" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="10" />
              <feGaussianBlur stdDeviation="17.5" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.436821 0 0 0 0 0.493977 0 0 0 0 0.786636 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_273_2774" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_273_2774" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold',sans-serif] font-semibold inset-[29.31%_36.16%_29.31%_34.32%] justify-center leading-[0] text-[16px] text-center text-nowrap text-white tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">ใบนัดหมาย</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">15 สิงหาคม 2565</p>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group11 />
    </div>
  );
}

function Textbox() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group12 />
    </div>
  );
}

function Calendar() {
  return (
    <div className="[grid-area:1_/_1] h-[23.334px] ml-[5.13%] mt-[24.48%] relative w-[21px]" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 24">
        <g id="Calendar">
          <path clipRule="evenodd" d={svgPaths.p30878e00} fill="var(--fill-0, #5669FF)" fillRule="evenodd" id="Fill 1" opacity="0.4" />
          <path d={svgPaths.p193da00} fill="var(--fill-0, #5669FF)" id="Fill 4" />
          <path d={svgPaths.p2317ad80} fill="var(--fill-0, #5669FF)" id="Fill 6" />
          <path clipRule="evenodd" d={svgPaths.p34d99d00} fill="var(--fill-0, #5669FF)" fillRule="evenodd" id="Fill 8" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox />
      <Calendar />
    </div>
  );
}

function Group1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] font-medium justify-center leading-[0] ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">{`วันที่นัดหมาย * `}</p>
      </div>
    </div>
  );
}

function Group35() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group23 />
      <Group1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[4.76px] mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium h-[34.439px] justify-center ml-0 mt-[17.22px] relative text-[#120d26] text-[16px] translate-y-[-50%] w-[29px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">เวลา</p>
      </div>
    </div>
  );
}

function Remove() {
  return (
    <div className="[grid-area:1_/_1] h-[24.31px] ml-[150.36px] mt-[45.91px] relative w-[24px]" data-name="Remove">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="Remove">
          <ellipse cx="12" cy="12.1551" id="Ellipse 47" rx="9" ry="9.11629" stroke="var(--stroke-0, #CCD2E3)" strokeWidth="2" />
          <path d="M7.5 12.1551H16.5" id="Vector 8" stroke="var(--stroke-0, #CCD2E3)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TumerFill() {
  return (
    <div className="[grid-area:1_/_1] h-[24.31px] ml-[13.13px] mt-[14.41px] relative w-[24px]" data-name="Tumer_fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="Tumer_fill">
          <path d={svgPaths.pf547e80} fill="var(--fill-0, #5669FF)" id="Subtract" />
          <path d="M17.5 7.59691L19 6.07753" id="Vector 65" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
          <path d={svgPaths.p1d5f63c0} id="Ellipse 45" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[30.21px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-white border border-[#e6e6e6] border-solid h-[56.724px] ml-0 mt-0 rounded-[10px] w-[133.114px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Thin','Noto_Sans:Light',sans-serif] font-thin h-[25.323px] justify-center ml-[72.33px] mt-[28.36px] relative text-[#807a7a] text-[12px] text-center translate-x-[-50%] translate-y-[-50%] w-[56px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[25px]">08ซ00</p>
      </div>
      <TumerFill />
    </div>
  );
}

function TumerFill1() {
  return (
    <div className="[grid-area:1_/_1] h-[24.31px] ml-[13.13px] mt-[14.41px] relative w-[24px]" data-name="Tumer_fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        <g id="Tumer_fill">
          <path d={svgPaths.pf547e80} fill="var(--fill-0, #5669FF)" id="Subtract" />
          <path d="M17.5 7.59691L19 6.07753" id="Vector 65" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
          <path d={svgPaths.p1d5f63c0} id="Ellipse 45" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[195.12px] mt-[28.41px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-white border border-[#e6e6e6] border-solid h-[56.724px] ml-0 mt-0 rounded-[10px] w-[133.114px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Thin','Noto_Sans:Light',sans-serif] font-thin h-[25.323px] justify-center ml-[72.83px] mt-[28.36px] relative text-[#807a7a] text-[12px] text-center translate-x-[-50%] translate-y-[-50%] w-[51px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[25px]">12ซ00</p>
      </div>
      <TumerFill1 />
    </div>
  );
}

function Group29() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group2 />
      <Remove />
      <Group9 />
      <Group10 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">โรงพยาบาลมหาราชนครเชียงใหม่</p>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group13 />
    </div>
  );
}

function Textbox1() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group14 />
    </div>
  );
}

function MapPin() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[20px]" data-name="map-pin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_273_2770)" id="map-pin">
          <path d={svgPaths.p2c0a5f00} id="Vector" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69811" />
          <path d={svgPaths.p27874b80} id="Vector_2" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69811" />
        </g>
        <defs>
          <clipPath id="clip0_273_2770">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[20.06px] mt-[16.31px] place-items-start relative">
      <MapPin />
    </div>
  );
}

function Group24() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox1 />
      <Group />
    </div>
  );
}

function Group3() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">โรงพยาบาล</p>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group24 />
      <Group3 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{`ห้องตรวจ 1 `}</p>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group15 />
    </div>
  );
}

function Textbox2() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group16 />
    </div>
  );
}

function HomeFill() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="Home_fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Home_fill">
          <path d={svgPaths.p337fa980} fill="var(--fill-0, #5669FF)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Calendar1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[12.31px] mt-[11px] place-items-start relative" data-name="Calendar">
      <HomeFill />
    </div>
  );
}

function Group25() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox2 />
      <Calendar1 />
    </div>
  );
}

function Group4() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">ห้องตรวจ</p>
      </div>
    </div>
  );
}

function Group31() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group25 />
      <Group4 />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">Hearing Screening (OAE)</p>
      </div>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group17 />
    </div>
  );
}

function Textbox3() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group18 />
    </div>
  );
}

function StethoscopeLine() {
  return (
    <div className="[grid-area:1_/_1] ml-[15.31px] mt-[15px] overflow-clip relative size-[24px]" data-name="stethoscope-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <g id="Vector"></g>
          <path d={svgPaths.p13555180} fill="var(--fill-0, #5669FF)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox3 />
      <StethoscopeLine />
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">การรักษา</p>
      </div>
    </div>
  );
}

function Group32() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group26 />
      <Group5 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{`ปนัดดา `}</p>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group19 />
    </div>
  );
}

function Textbox4() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group20 />
    </div>
  );
}

function Group27() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox4 />
    </div>
  );
}

function Group6() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">ชื่อผู้ที่รักษา</p>
      </div>
    </div>
  );
}

function UserBoxFill() {
  return (
    <div className="[grid-area:1_/_1] ml-[20.06px] mt-[49.17px] relative size-[25px]" data-name="User_box_fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="User_box_fill">
          <path d={svgPaths.p39727600} fill="var(--fill-0, #5669FF)" id="Subtract" />
          <rect height="19.8333" id="Rectangle 26" rx="3.5" stroke="var(--stroke-0, white)" width="19.8333" x="2.58333" y="2.58333" />
        </g>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group27 />
      <Group6 />
      <UserBoxFill />
    </div>
  );
}

function Group7() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-px mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">รายละเอียดการนัดหมาย</p>
      </div>
    </div>
  );
}

function Group34() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white border border-[#e4dfdf] border-solid h-[110.089px] ml-0 mt-[34px] rounded-[12px] w-[329px]" />
      <Group7 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal h-[26.666px] justify-center leading-[0] ml-[22.55px] mt-[64.78px] relative text-[#747688] text-[14px] translate-y-[-50%] w-[227.413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">ใบนัดหมาย</p>
      </div>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{`สภัคศิริ  สุวิวัฒนา `}</p>
      </div>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
      <Group21 />
    </div>
  );
}

function Textbox5() {
  return (
    <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
      <Group22 />
    </div>
  );
}

function Group28() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[2.75px] mt-[34.15px] place-items-start relative">
      <Textbox5 />
    </div>
  );
}

function Group8() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[34px]">ผู้บันทึกข้อมูล</p>
      </div>
    </div>
  );
}

function UserBoxFill1() {
  return (
    <div className="[grid-area:1_/_1] ml-[20.06px] mt-[49.17px] relative size-[25px]" data-name="User_box_fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="User_box_fill">
          <path d={svgPaths.p39727600} fill="var(--fill-0, #5669FF)" id="Subtract" />
          <rect height="19.8333" id="Rectangle 26" rx="3.5" stroke="var(--stroke-0, white)" width="19.8333" x="2.58333" y="2.58333" />
        </g>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group28 />
      <Group8 />
      <UserBoxFill1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] items-center leading-[0] left-[19.33px] top-[14.12px] w-[336.25px]">
      <Group35 />
      <Group29 />
      <Group30 />
      <Group31 />
      <Group32 />
      <Group33 />
      <Group34 />
      <Group36 />
      <div className="flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal h-[26.499px] justify-center relative shrink-0 text-[10px] text-black w-[249.994px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">วันที่ 20 กรกฎาคม 2565 เวลา 09.55 น.</p>
      </div>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents left-[19.33px] top-[14.12px]">
      <Frame />
    </div>
  );
}

function Mask() {
  return (
    <div className="absolute contents left-[0.15px] top-[0.22px]" data-name="Mask">
      <div className="absolute flex h-[362px] items-center justify-center left-[309.15px] top-[495.22px] w-[393px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[362px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-309px_-495px] mask-size-[375px_812px] opacity-50 relative w-[393px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
            <div className="absolute inset-[-27.62%_-25.45%]">
              <img alt="" className="block max-w-none size-full" height="562" src={imgEllipse71} width="593" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[173.943px] left-[-106.85px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[107px_-744px] mask-size-[375px_812px] opacity-40 top-[744.22px] w-[189px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
        <div className="absolute inset-[-57.49%_-52.91%]">
          <img alt="" className="block max-w-none size-full" height="373.943" src={imgEllipse72} width="389" />
        </div>
      </div>
      <div className="absolute h-[173.943px] left-[-53.85px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[54px_0px] mask-size-[375px_812px] opacity-50 top-[0.22px] w-[189px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
        <div className="absolute inset-[-57.49%_-52.91%]">
          <img alt="" className="block max-w-none size-full" height="373.943" src={imgEllipse66} width="389" />
        </div>
      </div>
      <div className="absolute h-[209px] left-[198.15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-198px_75px] mask-size-[375px_812px] opacity-70 top-[-74.78px] w-[227px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
        <div className="absolute inset-[-47.85%_-44.05%]">
          <img alt="" className="block max-w-none size-full" height="409" src={imgEllipse69} width="427" />
        </div>
      </div>
    </div>
  );
}

export default function FilterForUserLevelAdmin() {
  return (
    <div className="bg-white relative size-full" data-name="Filter  for user level : admin">
      <Group37 />
      <Mask />
      <ButtonColor />
    </div>
  );
}