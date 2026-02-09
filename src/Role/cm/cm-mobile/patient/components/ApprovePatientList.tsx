import svgPaths from "../../../../../imports/svg-uvyfghqn66";
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";
import imgFrame1171276584 from "figma:asset/bbbf046797e51a7b758177d9ed80ba440e116052.png";
import imgFrame1171276585 from "figma:asset/bcc7d4796b1918c63dfe93672706a89c7cf35586.png";
import imgFrame1171276586 from "figma:asset/66a4af6a00fb05488c9ce48aff64fe487b87e999.png";
import imgFrame1171276587 from "figma:asset/9e3371d1316d8628e293b6c06cc73e00d380840e.png";
import imgFrame1171276588 from "figma:asset/ccad3c8e4d346215fe550b9c982861424d34b65b.png";
import imgFrame1171276589 from "figma:asset/60e7294dfea18c421e91f502e0c0eeea64ea4756.png";

function BackIcon() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px opacity-0 relative shrink-0" data-name="Icon">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[40px] items-start justify-center p-[10px] relative w-full">
          <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[20px] text-nowrap whitespace-pre">chevron-left</p>
        </div>
      </div>
    </div>
  );
}

function NotificationBadge() {
  return (
    <div className="absolute bg-[#e02424] box-border content-stretch flex gap-[10px] items-center justify-center left-[16px] px-[2px] py-0 rounded-[99px] top-[-6px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] h-[16px] leading-[1.5] not-italic relative shrink-0 text-[12px] text-white w-[22px]">99+</p>
    </div>
  );
}

function NotificationIcon() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#faca15] text-[20px] text-nowrap whitespace-pre">bell</p>
      <NotificationBadge />
    </div>
  );
}

function ProfileIcon() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap whitespace-pre">user</p>
    </div>
  );
}

function HeaderIcons() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0">
      <NotificationIcon />
      <ProfileIcon />
    </div>
  );
}

function HeaderRight() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow h-[40px] items-center justify-end min-h-px min-w-px relative shrink-0">
      <HeaderIcons />
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[12px] relative w-full">
          <BackIcon />
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-black text-center text-nowrap whitespace-pre">ตรวจสอบ/อนุมัติ</p>
          <HeaderRight />
        </div>
      </div>
    </div>
  );
}

function TabNewPatient() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[99px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.07)] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#37286a] text-[16px] text-nowrap whitespace-pre">ผู้ป่วยใหม่</p>
        </div>
      </div>
    </div>
  );
}

function TabFundRequest() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[99px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">คำขอทุน</p>
        </div>
      </div>
    </div>
  );
}

function TabReferral() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[99px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[8px] relative w-full">
          <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap whitespace-pre">ส่งตัว</p>
        </div>
      </div>
    </div>
  );
}

function TabsContainer() {
  return (
    <div className="bg-gray-100 relative rounded-[99px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center p-[4px] relative w-full">
          <TabNewPatient />
          <TabFundRequest />
          <TabReferral />
        </div>
      </div>
    </div>
  );
}

function Avatar1() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276584} />
      </div>
    </div>
  );
}

function DetailsText1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 39 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นางรัตนา วิมารหนาม</p>
      <DetailsText1 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">9 ก.ย. 68, 12:56</p>
    </div>
  );
}

function PatientInfo1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar1 />
      <Details1 />
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[32px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">chevron-right</p>
    </div>
  );
}

function ActionIcon() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <ChevronRightIcon />
    </div>
  );
}

function PatientItem1() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo1 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

// ... Similar renaming for other items ...
// For brevity and to fit context limit, I'm just exporting the structure with the first item fully renamed
// and keeping the original logic for the list rendering if it was dynamic, but here it's static.
// I will replicate the other items using generic "PatientItemX" logic for now, as they are hardcoded.

function Avatar2() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276585} />
      </div>
    </div>
  );
}

function DetailsText2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 48 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นางธเนษฐ ยิ่งงาม</p>
      <DetailsText2 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">9 ก.ย. 68, 11:32</p>
    </div>
  );
}

function PatientInfo2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar2 />
      <Details2 />
    </div>
  );
}

function PatientItem2() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo2 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

function Avatar3() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276586} />
      </div>
    </div>
  );
}

function DetailsText3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 52 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">{`นายประพล เกียรติวิทยา `}</p>
      <DetailsText3 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">9 ก.ย. 68, 10:25</p>
    </div>
  );
}

function PatientInfo3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar3 />
      <Details3 />
    </div>
  );
}

function PatientItem3() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo3 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

function Avatar4() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276587} />
      </div>
    </div>
  );
}

function DetailsText4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 65 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นายธนาธิป อาทิตย์อาภรณ์ชัย</p>
      <DetailsText4 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">8 ก.ย. 68, 09:34</p>
    </div>
  );
}

function PatientInfo4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar4 />
      <Details4 />
    </div>
  );
}

function PatientItem4() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo4 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

function Avatar5() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276588} />
      </div>
    </div>
  );
}

function DetailsText5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 36 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นายเกียรติ สุขทิพย์</p>
      <DetailsText5 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">7 ก.ย. 68, 15:20</p>
    </div>
  );
}

function PatientInfo5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar5 />
      <Details5 />
    </div>
  );
}

function PatientItem5() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo5 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

function Avatar6() {
  return (
    <div className="relative rounded-[99px] shrink-0 size-[36px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[99px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276583} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[99px] size-full" src={imgFrame1171276589} />
      </div>
    </div>
  );
}

function DetailsText6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#787878] text-[14px] text-nowrap whitespace-pre">อายุ 24 ปี, ต.เวียง (เทศบาลฝาง)</p>
    </div>
  );
}

function Details6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">นางสาวสุชาดา เดชบุญ</p>
      <DetailsText6 />
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#ababab] text-[14px] text-nowrap whitespace-pre">7 ก.ย. 68, 15:20</p>
    </div>
  );
}

function PatientInfo6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Avatar6 />
      <Details6 />
    </div>
  );
}

function PatientItem6() {
  return (
    <div className="bg-[#f4f0ff] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#f4f0ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full">
          <PatientInfo6 />
          <ActionIcon />
        </div>
      </div>
    </div>
  );
}

function ListContainer() {
  return (
    <div className="bg-white relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[12px] px-[20px] relative w-full">
          <TabsContainer />
          <PatientItem1 />
          <PatientItem2 />
          <PatientItem3 />
          <PatientItem4 />
          <PatientItem5 />
          <PatientItem6 />
        </div>
      </div>
    </div>
  );
}

function PageContainer() {
  return (
    <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full">
      <Header />
      <ListContainer />
    </div>
  );
}

function Layout() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[402px]">
      <PageContainer />
    </div>
  );
}

export default function ApprovePatientList() {
  return (
    <div className="bg-[#edebfe] content-stretch flex flex-col gap-[10px] items-start relative size-full" data-name="ตรวจสอบ/อนุมัติ">
      <Layout />
    </div>
  );
}
