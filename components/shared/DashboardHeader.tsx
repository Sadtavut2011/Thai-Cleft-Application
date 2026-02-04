import React from 'react';
import svgPaths from "../../imports/svg-bdnktn60hj";
import imgImage2 from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";
import imgFrame36 from "figma:asset/d2e5b3611c651e5539da38843ee22972bf9fa81f.png";
import imgTotalPatients from "figma:asset/6bae25ea6c15f0f26e6cf653a0b892b2961bf13d.png";
import imgFollowUp from "figma:asset/1d2940d83837c7cc1f92f2915b0009760ea099f8.png";
import imgMissed from "figma:asset/95a6fedab73655f4bfe88c9a765ffcce95025422.png";
import imgAssigned from "figma:asset/750f08fafed43accc58df32305f12d29557300fb.png";

const clsx = (...args: (string | undefined | null | false)[]) => args.filter(Boolean).join(' ');

type Group3Props = {
  additionalClassNames?: string;
};

function Group3({ children, additionalClassNames = "" }: React.PropsWithChildren<Group3Props>) {
  return (
    <div className={clsx("absolute contents", additionalClassNames)}>
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[1.776px] rotate-[15deg] w-[30.646px]">{children}</div>
      </div>
    </div>
  );
}

function Group2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="opacity-20 relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 2">
        <g id="Group">{children}</g>
      </svg>
    </div>
  );
}

function Group1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="opacity-20 relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Group">{children}</g>
      </svg>
    </div>
  );
}

function Group({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="opacity-20 relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 54">
        <g id="Group">{children}</g>
      </svg>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[18px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.13)] shrink-0 h-[80px] md:h-auto overflow-hidden">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[8px] relative w-full h-full justify-center">{children}</div>
      </div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai'] font-bold leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px]">{text}</p>
    </div>
  );
}

interface DashboardHeaderProps {
    stats?: {
        total: number | string;
        followUp: number | string;
        missed: number | string;
        assigned: number | string;
    };
    hospitalName?: string;
}

export default function DashboardHeader({ stats, hospitalName = "โรงพยาบาลฝาง" }: DashboardHeaderProps) {
  const displayStats = {
      total: stats?.total || "19,256",
      followUp: stats?.followUp || "7,789",
      missed: stats?.missed || "356",
      assigned: stats?.assigned || "12"
  };

  return (
    <div className="relative w-full h-full min-h-[250px] overflow-hidden rounded-b-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover w-full h-full" src={imgFrame36} />
        <div className="absolute bg-[rgba(112,102,169,0.4)] inset-0 mix-blend-multiply" />
      </div>
      <div className="size-full relative z-10">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[20px] relative size-full h-full justify-between">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[40px] rounded-full overflow-hidden bg-white p-1" data-name="image 2">
                <img alt="" className="w-full h-full object-contain" src={imgImage2} />
              </div>
              <div className="content-stretch flex items-center relative shrink-0">
                <div className="bg-[#f6f5ff] content-stretch flex gap-[8px] items-center justify-center not-italic px-[12px] py-[4px] relative rounded-[99px] shrink-0 text-[16px] text-nowrap shadow-sm">
                  <p className="font-['IBM_Plex_Sans_Thai'] font-medium leading-[1.5] relative shrink-0 text-[#49358e]">{hospitalName}</p>
                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#6b7280] text-center tracking-[0.0232px]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col font-['IBM_Plex_Sans_Thai'] font-semibold items-end justify-center leading-[1.5] not-italic relative shrink-0 text-nowrap">
              <p className="relative shrink-0 text-[16px] text-white">2 กันยายน 2568</p>
              <p className="relative shrink-0 text-[#f3f4f6] text-[12px]">13:30 น.</p>
            </div>
          </div>
          
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full mt-auto">
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[14px] md:text-[16px] text-nowrap">ผู้ป่วยทั้งหมด</p>
                <div className="content-stretch flex gap-[4px] items-end relative shrink-0 z-10">
                   <Text text={String(displayStats.total)} />
                   <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[14px] md:text-[16px] text-nowrap mb-1">/คน</p>
                </div>
                {/* Decoration 1 */}
                <div className="absolute right-2 bottom-2 w-12 h-12">
                   <img src={imgTotalPatients} className="w-full h-full object-contain" alt="" />
                </div>
              </Wrapper>
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[14px] md:text-[16px] text-nowrap">ผู้ป่วยต้องติดตาม</p>
                <div className="content-stretch flex gap-[4px] items-end relative shrink-0 z-10">
                   <Text text={String(displayStats.followUp)} />
                   <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[14px] md:text-[16px] text-nowrap mb-1">/คน</p>
                </div>
                 {/* Decoration 2 */}
                <div className="absolute right-2 bottom-2 w-12 h-12">
                   <img src={imgFollowUp} className="w-full h-full object-contain" alt="" />
                </div>
              </Wrapper>
            </div>
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[14px] md:text-[16px] text-nowrap">ขาดนัด</p>
                <div className="content-stretch flex gap-[4px] items-end relative shrink-0 z-10">
                   <Text text={String(displayStats.missed)} />
                   <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[14px] md:text-[16px] text-nowrap mb-1">/คน</p>
                </div>
                 {/* Decoration 3 */}
                <div className="absolute right-2 bottom-2 w-12 h-12">
                   <img src={imgMissed} className="w-full h-full object-contain" alt="" />
                </div>
              </Wrapper>
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[14px] md:text-[16px] text-nowrap">งานมอบหมาย</p>
                <div className="content-stretch flex gap-[4px] items-end relative shrink-0 z-10">
                   <Text text={String(displayStats.assigned)} />
                   <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[14px] md:text-[16px] text-nowrap mb-1">/งาน</p>
                </div>
                 {/* Decoration 4 */}
                <div className="absolute right-2 bottom-2 w-12 h-12">
                   <img src={imgAssigned} className="w-full h-full object-contain" alt="" />
                </div>
              </Wrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6"/>
    </svg>
)
