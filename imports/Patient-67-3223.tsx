import svgPaths from "./svg-f1a2zdrqjn";

function Component() {
  return (
    <div className="absolute h-[14px] left-0 top-0 w-[35px]" data-name="9:41">
      <div className="absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-black text-center text-nowrap tracking-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
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
          <path d={svgPaths.p3d5bc280} fill="var(--fill-0, black)" id="Vector" />
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
          <path d={svgPaths.p32b81f0} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.pa041880} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p29615c00} fill="var(--fill-0, black)" id="Vector_3" opacity="0.2" />
          <path d={svgPaths.pdcf4a00} fill="var(--fill-0, black)" id="Vector_4" opacity="0.2" />
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
            <path d={svgPaths.pc543300} fill="var(--fill-0, black)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="h-[14px] relative shrink-0 w-[27px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 14">
        <g id="Vector" opacity="0.3">
          <path d={svgPaths.p33066e00} fill="var(--fill-0, black)" />
          <path d={svgPaths.p241a6080} fill="var(--fill-0, black)" />
        </g>
      </svg>
      <div className="absolute bottom-0 left-0 right-[63.41%] top-0" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 14">
          <path d={svgPaths.p14c441c0} fill="var(--fill-0, #F7CE45)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center leading-[0] left-[13px] text-[11px] text-black text-center text-nowrap top-[7px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
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

function Icon() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center p-[10px] relative shrink-0" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[20px] text-nowrap whitespace-pre">chevron-left</p>
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

function Icon1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#faca15] text-[20px] text-nowrap whitespace-pre">bell</p>
      <Frame9 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap whitespace-pre">user</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0">
      <Icon1 />
      <Icon2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow h-[40px] items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0">
      <Icon />
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-black text-center text-nowrap whitespace-pre">ลงทะเบียนผู้ป่วยใหม่</p>
      <Frame10 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center pb-[12px] pt-0 px-[20px] relative w-full">
          <div className="basis-0 bg-[#49358e] grow h-[10px] min-h-px min-w-px rounded-[32px] shrink-0" />
          <div className="basis-0 bg-[#49358e] grow h-[10px] min-h-px min-w-px rounded-[32px] shrink-0" />
          <div className="basis-0 bg-[#49358e] grow h-[10px] min-h-px min-w-px rounded-[32px] shrink-0" />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[24px]">
      <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-gray-500 text-nowrap tracking-[0.0232px]">
        <p className="leading-[32px] whitespace-pre">chevron-down</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <div className="basis-0 flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-black">
        <p className="leading-[1.5]">เลือกการวินิจฉัย</p>
      </div>
      <Frame11 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute border border-gray-300 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative w-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#111928] text-[16px] w-full">การวินิจฉัย</p>
      <Input />
    </div>
  );
}

function Frame12() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center opacity-0 p-[10px] relative shrink-0 size-[24px]">
      <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-gray-500 text-nowrap tracking-[0.0232px]">
        <p className="leading-[32px] whitespace-pre">xmark</p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <div className="basis-0 flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-gray-300">
        <p className="leading-[1.5]">กรอกประวัติการรักษา / อาการ</p>
      </div>
      <Frame12 />
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute border border-gray-300 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative w-full">
          <Content1 />
        </div>
      </div>
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#111928] text-[16px] w-full">ประวัติการรักษา / อาการ</p>
      <Input1 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[12px] relative rounded-[16px] shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[18px] text-nowrap whitespace-pre">ข้อมูลสุขภาพ</p>
      <InputField />
      <InputField1 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#49358e] h-[47px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[47px] items-center justify-center not-italic px-[12px] py-[8px] relative text-[16px] text-nowrap text-white w-full whitespace-pre">
          <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] opacity-0 relative shrink-0">search</p>
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] relative shrink-0">บันทึกข้อมูล</p>
          <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] opacity-0 relative shrink-0">search</p>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[12px] px-[20px] relative size-full">
          <Frame15 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">home</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon3 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">หน้าหลัก</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap whitespace-pre">users-medical</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon4 />
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[16px] text-nowrap whitespace-pre">ผู้ป่วย</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">hospital-user</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon5 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">งานของฉัน</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">clipboard-medical</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon6 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">นัดหมาย</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">comment</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon7 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">สนทนา</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] w-full">
        <Frame2 />
        <Frame3 />
        <Frame4 />
        <Frame5 />
        <Frame6 />
      </div>
      <div aria-hidden="true" className="absolute border-[#d2cee7] border-[2px_0px_0px] border-solid bottom-0 left-0 pointer-events-none right-0 rounded-tl-[24px] rounded-tr-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] top-[-2px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px overflow-clip relative shrink-0 w-full">
      <Frame7 />
      <Frame17 />
      <Frame14 />
      <Frame13 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-[402px]">
      <StatusBarIPhone16Main />
      <Frame />
    </div>
  );
}

export default function Patient() {
  return (
    <div className="bg-[#edebfe] content-stretch flex flex-col gap-[10px] items-start relative size-full" data-name="Patient">
      <Frame1 />
    </div>
  );
}