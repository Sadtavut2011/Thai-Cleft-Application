import svgPaths from "../../../../../imports/svg-av6gm74s9c";
import clsx from "clsx";
import imgEllipse71 from "figma:asset/ac577bffa4d0304acbeb419e82e8606396148391.png";
import imgEllipse72 from "figma:asset/91f274d6413093118ef3ae549561d97071bc9da2.png";
import imgEllipse66 from "figma:asset/1969ce3fb109d173f0ac01fa4aa0db3c540dd34a.png";
import imgEllipse69 from "figma:asset/5cee84f7e6ce39537bee9e5e0f3778e0c426fde1.png";
import { imgEllipse70 } from "../../../../../imports/svg-jvvmb";
import React from 'react';

type Group33775DotProps = {
  additionalClassNames?: string;
};

function Group33775Dot({ children, additionalClassNames = "" }: React.PropsWithChildren<Group33775DotProps>) {
  return (
    <div className={clsx("absolute size-[8px] top-[185.05px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        {children}
      </svg>
    </div>
  );
}

function Path({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[1.391px] relative w-[0.01px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2">
        {children}
      </svg>
    </div>
  );
}
type Wrapper4Props = {
  additionalClassNames?: string;
};

function Wrapper4({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-medium justify-center leading-[0] text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[34px]">{children}</p>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] text-center text-nowrap text-white", additionalClassNames)}>
      <p className="leading-[25px]">{children}</p>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]", additionalClassNames)}>
      <p className="leading-[23px]">{children}</p>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <Wrapper1 additionalClassNames="font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif]">{children}</Wrapper1>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text, children }: React.PropsWithChildren<TextProps>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <Wrapper1 additionalClassNames="font-['Noto_Sans_Thai:Regular',sans-serif]">
        {text}
        <span className="font-['Noto_Sans_Thai:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
          {children}
        </span>
      </Wrapper1>
    </div>
  );
}
type HelperProps = {
  additionalClassNames?: string;
};

function Helper({ additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("absolute h-[9px] w-[4.5px]", additionalClassNames)}>
      <div className="absolute inset-[-11.11%_-31.43%_-11.11%_-22.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 11">
          <path d="M1 1L5.5 5.5L1 10" id="Vector 9" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
type CommentDuotoneProps = {
  additionalClassNames?: string;
};

function CommentDuotone({ additionalClassNames = "" }: CommentDuotoneProps) {
  return (
    <Wrapper2 additionalClassNames={additionalClassNames}>
      <g id="comment_duotone">
        <path d={svgPaths.p28f06400} fill="var(--fill-0, #5669FF)" fillOpacity="0.75" id="Union" />
        <path d="M8.5 9.5L15.5 9.5" id="Vector 7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 12.5L13.5 12.5" id="Vector 9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Wrapper2>
  );
}
type AddSquareFillProps = {
  additionalClassNames?: string;
};

function AddSquareFill({ additionalClassNames = "" }: AddSquareFillProps) {
  return (
    <Wrapper2 additionalClassNames={additionalClassNames}>
      <g id="Add_square_fill">
        <path d={svgPaths.p1110c200} fill="var(--fill-0, white)" id="Subtract" />
      </g>
    </Wrapper2>
  );
}

function Rectangle() {
  return (
    <div className="absolute bg-[#5669ff] inset-0 rounded-[10px]">
      <div aria-hidden="true" className="absolute border-[#5669ff] border-[1.5px] border-solid inset-[-0.75px] pointer-events-none rounded-[10.75px]" />
    </div>
  );
}
type FollowButtonProps = {
  additionalClassNames?: string;
};

function FollowButton({ additionalClassNames = "" }: FollowButtonProps) {
  return (
    <div className={clsx("absolute h-[50px] w-[154px]", additionalClassNames)}>
      <Rectangle />
      <div className="absolute contents inset-[26%_5.84%_24%_28.57%]">
        <Wrapper3 additionalClassNames="inset-[26%_5.84%_24%_28.57%] text-[16px]">{"เพิ่มโรงพยาบาล"}</Wrapper3>
      </div>
    </div>
  );
}

export default function SignUpFigma() {
  return (
    <div className="bg-white relative size-full" data-name="Sign up">
      <div className="absolute contents left-[0.5px] top-[2px]">
        <div className="absolute bg-white h-[326.169px] left-[0.5px] top-[2px] w-[375.94px]" />
        <div className="absolute contents left-[0.5px] top-[4px]">
          <div className="absolute contents left-[1.44px] top-[4px]">
            <div className="absolute flex h-[1.391px] items-center justify-center left-[33.57px] top-[114px] w-[0.01px]">
              <div className="flex-none scale-y-[-100%]">
                <Path>
                  <path d={svgPaths.p25b8d180} fill="var(--fill-0, #5A61FF)" id="path534" />
                </Path>
              </div>
            </div>
            <div className="absolute contents left-[1.44px] top-[4px]">
              <div className="absolute h-[220px] left-[1.44px] top-[4px] w-[375px]" data-name="Rectangle">
                <div className="absolute inset-[-9.09%_-8%_-18.18%_-8%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 435 280">
                    <g filter="url(#filter0_d_161_2147)" id="Rectangle">
                      <path clipRule="evenodd" d="M30 20H405V240H30V20Z" fill="var(--fill-0, white)" fillRule="evenodd" />
                    </g>
                    <defs>
                      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="280" id="filter0_d_161_2147" width="435" x="0" y="0">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="10" />
                        <feGaussianBlur stdDeviation="15" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.378817 0 0 0 0 0.451896 0 0 0 0 0.996094 0 0 0 0.08 0" />
                        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_161_2147" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_161_2147" mode="normal" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute contents left-[33.57px] top-[114px]" data-name="g430">
            <div className="absolute flex h-[1.391px] items-center justify-center left-[33.57px] top-[114px] w-[0.01px]">
              <div className="flex-none scale-y-[-100%]">
                <Path>
                  <path d={svgPaths.pf86df80} fill="var(--fill-0, #5A61FF)" id="path432" />
                </Path>
              </div>
            </div>
          </div>
          <div className="absolute contents left-[124px] top-[153.55px]">
            <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[188.5px] text-[#5669ff] text-[16px] text-center text-nowrap top-[165.55px] tracking-[1px] translate-x-[-50%] translate-y-[-50%] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal]">ข้อมูลโรงพยาบาล</p>
            </div>
          </div>
          <div className="absolute contents left-[0.5px] top-[167.05px]">
            <div className="absolute h-[44px] left-[0.5px] top-[167.05px] w-[375px]" data-name="Page Controls">
              <div className="absolute inset-[40.91%_29.73%_40.91%_36.13%]" data-name="Page Control">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 128 8">
                  <g id="Page Control">
                    <g id="Unselected">
                      <circle cx="52" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 04" r="4" />
                      <circle cx="76" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 5" r="4" />
                      <circle cx="100" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 6" r="4" />
                      <circle cx="124" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 7" r="4" />
                      <circle cx="28" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 03" r="4" />
                      <circle cx="4" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 02" r="4" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <Group33775Dot additionalClassNames="left-[112.36px]">
              <circle cx="4" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 8" r="4" />
            </Group33775Dot>
            <Group33775Dot additionalClassNames="left-[255.84px]">
              <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Dot 02" r="4" />
            </Group33775Dot>
          </div>
        </div>
        <div className="absolute contents left-[111.51px] top-[256.33px]">
          <FollowButton additionalClassNames="left-[111.51px] top-[256.33px]" />
          <AddSquareFill additionalClassNames="left-[124.01px] top-[269.33px]" />
        </div>
      </div>
      <div className="absolute contents left-0 top-[2px]" data-name="Mask">
        <div className="absolute flex h-[362px] items-center justify-center left-[309px] top-[497px] w-[393px]">
          <div className="flex-none rotate-[180deg] scale-y-[-100%]">
            <div className="h-[362px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-309px_-495px] mask-size-[375px_812px] opacity-50 relative w-[393px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
              <div className="absolute inset-[-27.62%_-25.45%]">
                <img alt="" className="block max-w-none size-full" height="562" src={imgEllipse71} width="593" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[173.943px] left-[-107px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[107px_-744px] mask-size-[375px_812px] opacity-40 top-[746px] w-[189px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
          <div className="absolute inset-[-57.49%_-52.91%]">
            <img alt="" className="block max-w-none size-full" height="373.943" src={imgEllipse72} width="389" />
          </div>
        </div>
        <div className="absolute h-[173.943px] left-[-54px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[54px_0px] mask-size-[375px_812px] opacity-50 top-[2px] w-[189px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
          <div className="absolute inset-[-57.49%_-52.91%]">
            <img alt="" className="block max-w-none size-full" height="373.943" src={imgEllipse66} width="389" />
          </div>
        </div>
        <div className="absolute h-[209px] left-[198px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-198px_75px] mask-size-[375px_812px] opacity-70 top-[-73px] w-[227px]" style={{ maskImage: `url('${imgEllipse70}')` }}>
          <div className="absolute inset-[-47.85%_-44.05%]">
            <img alt="" className="block max-w-none size-full" height="409" src={imgEllipse69} width="427" />
          </div>
        </div>
      </div>
      <div className="absolute contents left-[128.55px] top-[241px]">
        <div className="absolute h-[36px] left-[128.55px] top-[241px] w-[130px]" data-name="Follow Button">
          <Rectangle />
          <div className="absolute contents inset-[17.67%_4.36%_12.89%_27.18%]">
            <Wrapper3 additionalClassNames="inset-[17.67%_4.36%_12.89%_27.18%] text-[14px]">เพิ่มโรงพยาบาล</Wrapper3>
          </div>
        </div>
        <div className="absolute h-[17.28px] left-[137.43px] top-[250.72px] w-[20.26px]" data-name="Add_square_fill">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 18">
            <g id="Add_square_fill">
              <path d={svgPaths.pfed2e00} fill="var(--fill-0, white)" id="Subtract" />
            </g>
          </svg>
        </div>
      </div>
      <div className="absolute contents left-[-214.97px] top-[-281.57px]">
        <FollowButton additionalClassNames="left-[-214.97px] top-[-281.57px]" />
        <AddSquareFill additionalClassNames="left-[-202.47px] top-[-268.57px]" />
      </div>
      <div className="absolute contents left-0 top-[164.1px]">
        <div className="absolute inset-[16.12%_0_46.79%_0]" data-name="Rectangle">
          <div className="absolute inset-[-5.3%_-8%_-10.59%_-8%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 435 438">
              <g filter="url(#filter0_d_161_5900)" id="Rectangle">
                <path clipRule="evenodd" d={svgPaths.p32140400} fill="var(--fill-0, white)" fillRule="evenodd" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="437.6" id="filter0_d_161_5900" width="435" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="10" />
                  <feGaussianBlur stdDeviation="15" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.378817 0 0 0 0 0.451896 0 0 0 0 0.996094 0 0 0 0.08 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_161_5900" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_161_5900" mode="normal" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute contents left-[23.31px] top-[602.59px]">
          <div className="absolute contents left-[26.06px] top-[636.73px]">
            <div className="absolute h-[56px] left-[26.06px] top-[636.73px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <Wrapper>{`Choose from calender `}</Wrapper>
              </div>
            </div>
            <Helper additionalClassNames="left-[334.62px] top-[660.09px]" />
            <div className="absolute contents left-[41.68px] top-[650.23px]" data-name="Calendar">
              <CommentDuotone additionalClassNames="left-[41.68px] top-[650.23px]" />
            </div>
          </div>
          <div className="absolute contents left-[23.31px] top-[602.59px]">
            <Wrapper4 additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] left-[23.31px] top-[619.59px]">เข้ารับการรักษาครั้งแรกเมื่อไหร่</Wrapper4>
          </div>
        </div>
        <div className="absolute contents left-[27.5px] top-[940.28px]" data-name="LINE">
          <div className="absolute contents left-[27.5px] top-[940.28px]">
            <div className="absolute h-0 left-[27.5px] top-[940.28px] w-[320px]">
              <div className="absolute inset-[-1.5px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 2">
                  <line id="Line 1" stroke="var(--stroke-0, #DDDDDD)" strokeDasharray="3 3" strokeWidth="1.5" x2="320" y1="0.75" y2="0.75" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[21.46px] top-[249.98px]">
          <div className="absolute contents left-[21.46px] top-[713.69px]">
            <div className="absolute contents left-[24.21px] top-[747.84px]">
              <div className="absolute h-[56px] left-[24.21px] top-[747.84px] w-[329px]" data-name="Textbox">
                <div className="absolute contents inset-0">
                  <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                  <Text text="ระบุ">{`ระยะทางที่เดินทางมารักษา ไป-กลับ `}</Text>
                </div>
              </div>
              <div className="absolute contents left-[39.83px] top-[761.19px]" data-name="Calendar">
                <CommentDuotone additionalClassNames="left-[39.83px] top-[761.19px]" />
              </div>
            </div>
            <div className="absolute contents left-[21.46px] top-[713.69px]">
              <Wrapper4 additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] left-[21.46px] top-[730.69px]">{`ระยะทางที่เดินทางมารักษา ไป-กลับ  (กิโลเมตร)`}</Wrapper4>
            </div>
          </div>
          <div className="absolute contents left-[21.46px] top-[329.24px]">
            <div className="absolute contents left-[24.21px] top-[363.39px]">
              <div className="absolute h-[56px] left-[24.21px] top-[363.39px] w-[329px]" data-name="Textbox">
                <div className="absolute contents inset-0">
                  <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                  <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
                    <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal]">โรงพยาบาลมหาราชนครเชียงใหม่</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute contents left-[39.83px] top-[378.92px]">
                <div className="absolute contents left-[39.83px] top-[378.92px]" data-name="Calendar">
                  <CommentDuotone additionalClassNames="left-[39.83px] top-[378.92px]" />
                </div>
              </div>
              <Helper additionalClassNames="left-[319.62px] top-[387.09px]" />
            </div>
            <div className="absolute contents left-[21.46px] top-[329.24px]">
              <Wrapper4 additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] left-[21.46px] top-[346.24px]">โรงพยาบาล *</Wrapper4>
            </div>
          </div>
          <div className="absolute contents left-[21.46px] top-[493.39px]">
            <div className="absolute contents left-[24.21px] top-[527.54px]">
              <div className="absolute h-[56px] left-[24.21px] top-[527.54px] w-[329px]" data-name="Textbox">
                <div className="absolute contents inset-0">
                  <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                  <Wrapper>ระบ HN</Wrapper>
                </div>
              </div>
              <div className="absolute contents left-[39.83px] top-[540.89px]" data-name="Calendar">
                <CommentDuotone additionalClassNames="left-[39.83px] top-[540.89px]" />
              </div>
            </div>
            <div className="absolute contents left-[21.46px] top-[493.39px]">
              <Wrapper4 additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] left-[21.46px] top-[510.39px]">{`HN `}</Wrapper4>
            </div>
          </div>
          <div className="absolute contents left-[21.46px] top-[824.09px]">
            <div className="absolute contents left-[24.21px] top-[858.24px]">
              <div className="absolute h-[56px] left-[24.21px] top-[858.24px] w-[329px]" data-name="Textbox">
                <div className="absolute contents inset-0">
                  <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                  <Text text="ระบุ">{`ระยะเวลาที่เดินทางมารักษา ไป-กลับ `}</Text>
                </div>
              </div>
              <Helper additionalClassNames="left-[332.76px] top-[881.59px]" />
              <div className="absolute contents left-[39.83px] top-[871.59px]" data-name="Calendar">
                <CommentDuotone additionalClassNames="left-[39.83px] top-[871.59px]" />
              </div>
            </div>
            <div className="absolute contents left-[21.46px] top-[824.09px]">
              <Wrapper4 additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] left-[21.46px] top-[841.09px]">ระยะเวลาที่เดินทางมารักษา ไป-กลับ (ชั่วโมง:นาที)</Wrapper4>
            </div>
          </div>
          <div className="absolute contents left-[24.21px] top-[249.98px]">
            <div className="absolute contents left-[24.21px] top-[249.98px]">
              <div className="absolute border border-[#e5e5e5] border-solid h-[56px] left-[24.21px] rounded-[12px] top-[433.76px] w-[329px]" />
              <div className="absolute inset-[24.56%_81.38%_73.44%_9.02%]" data-name="Fav icon">
                <div className="absolute backdrop-blur-[8.155px] backdrop-filter bg-[rgba(253,196,0,0.1)] inset-0 rounded-[10px]" />
                <div className="absolute contents inset-[29.31%_29.02%_29.31%_29.31%]">
                  <div className="absolute inset-[29.31%_29.02%_29.31%_29.31%]" data-name="icon/bookmark">
                    <div className="absolute inset-[6.25%_12.5%]" data-name="Bookmark">
                      <div className="absolute inset-[-7.01%_-4.6%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 9">
                          <g id="Bookmark">
                            <path clipRule="evenodd" d={svgPaths.p6c0c580} fill="var(--fill-0, #FDC400)" fillRule="evenodd" id="Path_33968" stroke="var(--stroke-0, #FDC400)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.03448" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-[28px] left-[44.33px] top-[449.76px] w-[28.171px]" data-name="apple 1" />
              <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] left-[76.76px] text-[16px] text-black top-[462.26px] translate-y-[-50%] w-[138.844px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[25px]">โรงพยาบาลต้นสังกัด</p>
              </div>
              <div className="absolute contents left-[309.94px] top-[451.76px]">
                <div className="absolute h-[23px] left-[309.94px] top-[451.76px] w-[23.141px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
                    <path d={svgPaths.p11a6f100} id="Ellipse 157" stroke="var(--stroke-0, #DDDDDD)" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bg-[#f0635a] content-stretch flex items-start left-[300.4px] pl-[9px] pr-[8px] py-[4px] rounded-[100px] top-[304.3px]">
          <p className="font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.382] relative shrink-0 text-[10px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
            DELETE
          </p>
        </div>
      </div>
      <div className="absolute inset-[94.22%_16.01%_2.56%_11.72%]" data-name="Button- Color">
        <div className="absolute inset-[-76.17%_-12.92%_-137.11%_-12.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 341 103">
            <g id="Group 18177">
              <g filter="url(#filter0_d_161_5896)" id="Rectangle">
                <path clipRule="evenodd" d={svgPaths.p37d54100} fill="var(--fill-0, #5669FF)" fillRule="evenodd" />
              </g>
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="102.82" id="filter0_d_161_5896" width="341" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="10" />
                <feGaussianBlur stdDeviation="17.5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.436821 0 0 0 0 0.493977 0 0 0 0 0.786636 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_161_5896" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_161_5896" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
        <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold','Noto_Sans:SemiBold',sans-serif] font-semibold inset-[11.43%_35.79%_15.44%_34.32%] justify-center leading-[0] text-[16px] text-center text-nowrap text-white tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Confirm</p>
        </div>
      </div>
    </div>
  );
}
