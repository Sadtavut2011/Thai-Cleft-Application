function Icon() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap whitespace-pre">home</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon />
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[16px] text-nowrap whitespace-pre">หน้าหลัก</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">users-medical</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon1 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">ผู้ป่วย</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">hospital-user</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon2 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">งานของฉัน</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">clipboard-medical</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon3 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">นัดหมาย</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0 size-[20px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8aeea] text-[20px] text-nowrap whitespace-pre">comment</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center pb-[20px] pt-[12px] px-[12px] relative shrink-0 w-[81px]">
      <Icon4 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#b8aeea] text-[16px] text-nowrap whitespace-pre">สนทนา</p>
    </div>
  );
}

export default function BottomNavigationBar() {
  return (
    <div className="relative rounded-tl-[24px] rounded-tr-[24px] size-full">
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <Frame />
        <Frame1 />
        <Frame2 />
        <Frame3 />
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border-[#d2cee7] border-[2px_0px_0px] border-solid bottom-0 left-0 pointer-events-none right-0 rounded-tl-[24px] rounded-tr-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] top-[-2px]" />
    </div>
  );
}