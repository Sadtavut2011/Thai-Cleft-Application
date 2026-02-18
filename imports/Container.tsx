import svgPaths from "./svg-qxd1cin1mq";

function Icon() {
  return (
    <div className="absolute left-[126px] size-[48px] top-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Icon">
          <path d={svgPaths.p6e59500} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M24 18V26" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M24 34H24.02" id="Vector_3" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[56px] left-[24px] top-[88px] w-[252px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[28px] left-[126.2px] not-italic text-[#1e2939] text-[20px] text-center top-[-0.5px] w-[221px] whitespace-pre-wrap">เลือกการพิจารณาทุน</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[152px] w-[252px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['IBM_Plex_Sans_Thai:Regular',sans-serif] leading-[20px] left-[126.25px] not-italic text-[#6a7282] text-[14px] text-center top-[0.5px] w-[244px] whitespace-pre-wrap">กรุณาเลือกการดำเนินการสำหรับคำขอทุนนี้</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#fb2c36] h-[40px] relative rounded-[14px] shrink-0 w-[72.602px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white">ปฎิเสธ</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#28c76f] h-[40px] relative rounded-[14px] shadow-[0px_10px_15px_0px_#b9f8cf,0px_4px_6px_0px_#b9f8cf] shrink-0 w-[66.109px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
        <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white">อนุมัติ</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[40px] items-center justify-center left-[24px] pr-[0.008px] top-[216px] w-[252px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[260.5px] size-[23.996px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9957 23.9957">
        <g id="Icon">
          <path d={svgPaths.p198f4560} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99964" />
          <path d={svgPaths.p32ecb60} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99964" />
        </g>
      </svg>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-full" data-name="Container">
      <Icon />
      <Heading />
      <Paragraph />
      <Container1 />
      <Icon1 />
    </div>
  );
}