import svgPaths from "../../_internal/svgs/svg-h4lofpb5mn";

function Icon() {
  return (
    <div className="relative shrink-0 size-[13.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_110_2746)" id="Icon">
          <path d={svgPaths.p10524a80} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16597" />
        </g>
        <defs>
          <clipPath id="clip0_110_2746">
            <rect fill="white" height="13.9916" width="13.9916" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[61.017px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[15.999px] relative w-[61.017px]">
        <p className="absolute font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[16px] left-[31px] not-italic text-[#45556c] text-[12px] text-center text-nowrap top-[0.29px] translate-x-[-50%] whitespace-pre">กรองสถานะ</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[13.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p35afe3c0} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16597" />
        </g>
      </svg>
    </div>
  );
}

export default function StatusFilterButton() {
  return (
    <div className="relative rounded-[1.91625e+07px] size-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.571px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[1.91625e+07px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[7.995px] items-center pl-[12.564px] pr-[0.571px] py-[0.571px] relative size-full">
          <Icon />
          <Text />
          <Icon1 />
        </div>
      </div>
    </div>
  );
}