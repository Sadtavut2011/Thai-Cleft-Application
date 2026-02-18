import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";
import imgFrame1171276584 from "figma:asset/bbbf046797e51a7b758177d9ed80ba440e116052.png";
import imgFrame1171276585 from "figma:asset/2f0e3863e1fea30e430fd275480d80a3e973638c.png";
import imgFrame1171276586 from "figma:asset/38f5bd4531c814db74a5a556bbbc302c3c1da5c1.png";
import imgFrame1171276587 from "figma:asset/01376a01f8898b4d066033af55f17b0f52d39b46.png";

function Content() {
  return (
    <div className="content-stretch flex gap-[16px] items-center not-italic relative shrink-0 w-full" data-name="Content">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">search</p>
      <div className="basis-0 flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[18px] text-black">
        <p className="leading-[1.5]">รัตน</p>
      </div>
    </div>
  );
}

function AutocompleteInput() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Autocomplete Input">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center px-[16px] py-[12px] relative w-full">
          <Content />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[24px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">plus</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 size-[24px]">
      <Icon />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">เพิ่มข้อมูล ผู้ป่วยใหม่</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame11 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-[320px]">
      <Frame13 />
      <Frame12 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#dcd7fe] h-[47px] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.05)] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[47px] items-center justify-between px-[12px] py-[8px] relative w-full">
          <Frame38 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative rounded-[16px] shrink-0 w-[368px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[18px] text-nowrap whitespace-pre">ค้นหาข้อมูลผู้ป่วย</p>
      <AutocompleteInput />
      <Frame9 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[20px] pt-[12px] px-[20px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276584} />
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">HN: HN66001</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 34 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นางรัตนา วิมารหนาม</p>
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <Frame15 />
      <Frame14 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[32px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">chevron-right</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Icon1 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f4f0ff] box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[16px] shrink-0 w-[368px]">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276585} />
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">HN: HN66002</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 30 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นางรัตนกานต์ ศิริวัฒนา</p>
      <Frame32 />
      <Frame33 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[32px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">chevron-right</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Icon2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#f4f0ff] box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[16px] shrink-0 w-[368px]">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame20 />
      <Frame21 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276586} />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">HN: HN66003</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 42 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นายรัตนโชติ ภัทรเดชา</p>
      <Frame34 />
      <Frame35 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[32px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">chevron-right</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Icon3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#f4f0ff] box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[16px] shrink-0 w-[368px]">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276587} />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">HN: HN66004</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 44 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นายรัตนศักดิ์ พงษ์อนันต์</p>
      <Frame36 />
      <Frame37 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[32px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">chevron-right</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Icon4 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#f4f0ff] box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[16px] shrink-0 w-[368px]">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame28 />
      <Frame29 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[12px] items-start pb-[12px] pt-0 px-0 relative rounded-[16px] shrink-0 w-[368px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[18px] text-nowrap whitespace-pre">พบข้อมูลคนไข้ ‘รัตน’ 4 รายการ</p>
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame10 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[20px] py-[12px] relative size-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px overflow-clip relative shrink-0 w-full">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-[402px]">
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