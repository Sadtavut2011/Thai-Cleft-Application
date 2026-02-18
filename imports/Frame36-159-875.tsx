import svgPaths from "./svg-bdnktn60hj";
import clsx from "clsx";
import imgImage2 from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";
import imgFrame36 from "figma:asset/d2e5b3611c651e5539da38843ee22972bf9fa81f.png";
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
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[18px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.13)] shrink-0">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[8px] relative w-full">{children}</div>
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
      <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#49358e] text-[24px] text-nowrap tracking-[-0.24px]">{text}</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgFrame36} />
        <div className="absolute bg-[rgba(112,102,169,0.4)] inset-0" />
      </div>
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[20px] relative size-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[40px]" data-name="image 2">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[117.82%] left-[-10.4%] max-w-none top-[-8.91%] w-[119.8%]" src={imgImage2} />
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0">
                <div className="bg-[#f6f5ff] content-stretch flex gap-[8px] items-center justify-center not-italic px-[12px] py-[4px] relative rounded-[99px] shrink-0 text-[16px] text-nowrap">
                  <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[1.5] relative shrink-0 text-[#49358e]">โรงพยาบาลฝาง</p>
                  <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#6b7280] text-center tracking-[0.0232px]">
                    <p className="leading-[32px] text-nowrap">chevron-down</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] items-end justify-center leading-[1.5] not-italic relative shrink-0 text-nowrap">
              <p className="relative shrink-0 text-[16px] text-white">2 กันยายน 2568</p>
              <p className="relative shrink-0 text-[#f3f4f6] text-[12px]">13:30 น.</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap">ผู้ป่วยทั้งหมด</p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="content-stretch flex items-start relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <Text text="19,256" />
                    </div>
                  </div>
                  <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap">/คน</p>
                </div>
                <div className="absolute flex inset-[35%_-0.07%_-9.77%_67.22%] items-center justify-center">
                  <div className="flex-none h-[49.047px] rotate-[15deg] w-[48.072px]">
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
                  </div>
                </div>
              </Wrapper>
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap">ผู้ป่วยต้องติดตาม</p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="content-stretch flex items-start relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <Text text="7,789" />
                    </div>
                  </div>
                  <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap">/คน</p>
                </div>
                <div className="absolute bottom-[-17.1%] flex items-center justify-center left-[65%] right-[0.16%] top-1/4">
                  <div className="flex-none h-[65.372px] rotate-[10.463deg] w-[51.71px]">
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
                          <path d={svgPaths.p1c5b4300} fill="var(--fill-0, #EAEFFE)" id="Vector_10" />
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
                  </div>
                </div>
              </Wrapper>
            </div>
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap">ขาดนัด</p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="content-stretch flex items-start relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <Text text="356" />
                    </div>
                  </div>
                  <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap">/คน</p>
                </div>
                <div className="absolute flex inset-[21.25%_-0.23%_-7.1%_61.67%] items-center justify-center">
                  <div className="flex-none h-[55.86px] rotate-[15deg] w-[56.886px]">
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
                              <path d={svgPaths.p1b360580} fill="var(--fill-0, #D61F69)" id="Vector_14" />
                              <path d={svgPaths.p26f3f700} fill="var(--fill-0, #D61F69)" id="Vector_15" />
                              <path d={svgPaths.p1de33880} fill="var(--fill-0, #D61F69)" id="Vector_16" />
                              <path d={svgPaths.p70a6e00} fill="var(--fill-0, #D61F69)" id="Vector_17" />
                              <path d={svgPaths.p37824500} fill="var(--fill-0, #D61F69)" id="Vector_18" />
                              <path d={svgPaths.p2cdf9a00} fill="var(--fill-0, #D61F69)" id="Vector_19" />
                            </g>
                            <path d={svgPaths.p1cd92c00} fill="var(--fill-0, #37286A)" id="Vector_20" />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </Wrapper>
              <Wrapper>
                <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap">งานมอบหมาย</p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="content-stretch flex items-start relative shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <Text text="12" />
                    </div>
                  </div>
                  <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#7066a9] text-[16px] text-nowrap">/งาน</p>
                </div>
                <div className="absolute contents inset-[30%_1.64%_-17.6%_64.44%]" data-name="Group">
                  <div className="absolute contents inset-[37.38%_6.12%_-15.42%_64.44%]" data-name="Group">
                    <div className="absolute flex inset-0 items-center justify-center">
                      <div className="flex-none h-[53.806px] rotate-[15deg] w-[40.432px]">
                        <Group>
                          <path d={svgPaths.p3a58d700} fill="var(--fill-0, #CBCFF7)" id="Vector" />
                        </Group>
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[32.18%_1.64%_-10.22%_68.94%]" data-name="Group">
                    <div className="absolute flex inset-0 items-center justify-center">
                      <div className="flex-none h-[53.806px] rotate-[15deg] w-[40.415px]">
                        <Group>
                          <path d={svgPaths.p3601a700} fill="var(--fill-0, #E6EFFF)" id="Vector" />
                        </Group>
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[41.7%_1.64%_41.47%_90.88%]" data-name="Group">
                    <div className="absolute flex inset-0 items-center justify-center">
                      <div className="flex-none rotate-[15deg] size-[10.996px]">
                        <Group1>
                          <path d={svgPaths.p1157a700} fill="var(--fill-0, #CBCFF7)" id="Vector" />
                        </Group1>
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[39.88%_15.37%_44.64%_77.75%]" data-name="Group">
                    <div className="absolute flex inset-0 items-center justify-center">
                      <div className="flex-none h-[10.116px] rotate-[15deg] w-[10.1px]">
                        <Group1>
                          <path d={svgPaths.pcd5ac00} fill="var(--fill-0, #D61F69)" id="Vector" />
                        </Group1>
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[55.57%_6.71%_-2.08%_72.48%]" data-name="Group">
                    <Group3 additionalClassNames="inset-[25.96%_0.01%_68.18%_0.03%]">
                      <Group2>
                        <path d={svgPaths.p1e6af300} fill="var(--fill-0, #466F91)" id="Vector" />
                      </Group2>
                    </Group3>
                    <div className="absolute contents inset-[0_0_94.14%_0]" data-name="Group">
                      <div className="absolute flex inset-0 items-center justify-center">
                        <div className="flex-none h-[1.776px] rotate-[15deg] w-[30.658px]">
                          <Group2>
                            <path d={svgPaths.p2f967c80} fill="var(--fill-0, #466F91)" id="Vector" />
                          </Group2>
                        </div>
                      </div>
                    </div>
                    <Group3 additionalClassNames="inset-[48.71%_0_45.43%_0.04%]">
                      <Group2>
                        <path d={svgPaths.p230309f0} fill="var(--fill-0, #466F91)" id="Vector" />
                      </Group2>
                    </Group3>
                    <Group3 additionalClassNames="inset-[71.39%_0_22.75%_0.04%]">
                      <Group2>
                        <path d={svgPaths.p3c501e80} fill="var(--fill-0, #466F91)" id="Vector" />
                      </Group2>
                    </Group3>
                    <Group3 additionalClassNames="inset-[94.14%_0.02%_0_0.03%]">
                      <Group2>
                        <path d={svgPaths.p865f980} fill="var(--fill-0, #466F91)" id="Vector" />
                      </Group2>
                    </Group3>
                  </div>
                </div>
              </Wrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}