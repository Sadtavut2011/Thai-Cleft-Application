import svgPaths from "../../../../../imports/svg-zlq26czodq";
import clsx from "clsx";
import imgApple2 from "figma:asset/b887d4e28eed90ca1783e2efea53ff41d7d1260a.png";
import imgApple1 from "figma:asset/6dfcf5e47c34ce9afb0ec4133925f271bf201bed.png";
import imgRectangle4273 from "figma:asset/b59bbb2fd8ad222b13b3f030a4bd9075916e406a.png";
import imgEllipse71 from "figma:asset/ac577bffa4d0304acbeb419e82e8606396148391.png";
import imgEllipse72 from "figma:asset/91f274d6413093118ef3ae549561d97071bc9da2.png";
import imgEllipse66 from "figma:asset/1969ce3fb109d173f0ac01fa4aa0db3c540dd34a.png";
import imgEllipse69 from "figma:asset/5cee84f7e6ce39537bee9e5e0f3778e0c426fde1.png";
import { imgEllipse70 } from "../../../../../imports/svg-flobi";

function IconWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2">
        {children}
      </svg>
    </div>
  );
}
type LabelTextProps = {
  additionalClassNames?: string;
};

function LabelText({ children, additionalClassNames = "" }: React.PropsWithChildren<LabelTextProps>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-medium justify-center leading-[0] text-[16px] text-black text-nowrap translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[25px]">{children}</p>
    </div>
  );
}
type IconBoxProps = {
  additionalClassNames?: string;
};

function IconBox({ children, additionalClassNames = "" }: React.PropsWithChildren<IconBoxProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type CircleIconProps = {
  additionalClassNames?: string;
};

function CircleIcon({ additionalClassNames = "" }: CircleIconProps) {
  return (
    <div className={clsx("absolute size-[23px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <circle cx="11.5" cy="11.5" id="Ellipse 157" r="10.5" stroke="var(--stroke-0, #DDDDDD)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function NationalIdCardStep() {
  return (
    <div className="bg-white relative size-full" data-name="เลขประจำตัวประชาชน - 4">
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
      <div className="absolute contents inset-[0.25%_-0.13%_72.66%_0]">
        <div className="absolute flex inset-[13.79%_91.3%_86.04%_8.7%] items-center justify-center">
          <div className="flex-none h-[1.391px] scale-y-[-100%] w-[0.01px]">
            <IconWrapper>
              <path d={svgPaths.p25b8d180} fill="var(--fill-0, #5A61FF)" id="path534" />
            </IconWrapper>
          </div>
        </div>
        <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] font-medium inset-[5.91%_56.27%_89.66%_8%] justify-center leading-[0] text-[#120d26] text-[24px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Add Patient</p>
        </div>
        <div className="absolute contents inset-[0.25%_-0.13%_72.66%_0]">
          <div className="absolute inset-[0.25%_-0.13%_72.66%_0.13%]" data-name="Rectangle">
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
          <div className="absolute contents inset-[19.52%_11.41%_79%_86.91%]">
            <div className="absolute flex inset-[19.52%_11.41%_79%_86.91%] items-center justify-center">
              <div className="flex-none h-[12px] rotate-[180deg] w-[6.316px]">
                <div className="relative size-full">
                  <div className="absolute inset-[-7.89%_-15%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 14">
                      <g id="Group 18512">
                        <path d={svgPaths.p1cf1c880} id="Path 3391" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.89474" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute contents inset-[18.04%_0_74.88%_0]">
            <div className="absolute inset-[19.7%_0_74.88%_0]" data-name="Page Controls">
              <div className="absolute inset-[40.91%_29.73%]" data-name="Page Control">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 152 8">
                  <g id="Page Control">
                    <g id="Unselected">
                      <circle cx="76" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 04" r="4" />
                      <circle cx="100" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 5" r="4" />
                      <circle cx="124" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 6" r="4" />
                      <circle cx="148" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 7" r="4" />
                      <circle cx="52" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 03" r="4" />
                      <circle cx="28" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 02" r="4" />
                    </g>
                    <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Dot 01" r="4" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold',sans-serif] font-semibold inset-[18.04%_36.67%_79%_36.93%] justify-center leading-[0] text-[#5669ff] text-[16px] text-center text-nowrap tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal]">การระบุตัวตน</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[13.79%_91.3%_86.04%_8.7%] items-center justify-center">
        <div className="flex-none h-[1.391px] scale-y-[-100%] w-[0.01px]">
          <IconWrapper>
            <g id="g430">
              <path d={svgPaths.pf86df80} fill="var(--fill-0, #5A61FF)" id="path432" />
            </g>
          </IconWrapper>
        </div>
      </div>
      <div className="absolute contents left-[24px] top-[312.85px]">
        <div className="absolute contents left-[24px] top-[312.85px]">
          <div className="absolute h-[56px] left-[24px] top-[312.85px] w-[329px]" data-name="Textbox">
            <div className="absolute contents inset-0">
              <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
              <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
                <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[23px]">ระบุเลขประจำตัวประชาชน *</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute contents left-[39.62px] top-[326.2px]" data-name="Calendar">
            <IconBox additionalClassNames="left-[39.62px] size-[24px] top-[326.2px]">
              <g id="comment_duotone">
                <path d={svgPaths.p28f06400} fill="var(--fill-0, #5669FF)" fillOpacity="0.75" id="Union" />
                <path d="M8.5 9.5L15.5 9.5" id="Vector 7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12.5L13.5 12.5" id="Vector 9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </IconBox>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[111px] top-[404.85px]">
        <div className="absolute h-[50px] left-[111px] top-[404.85px] w-[154px]" data-name="Follow Button">
          <div className="absolute bg-[#5669ff] inset-0 rounded-[10px]" data-name="Rectangle">
            <div aria-hidden="true" className="absolute border-[#5669ff] border-[1.5px] border-solid inset-[-0.75px] pointer-events-none rounded-[10.75px]" />
          </div>
          <div className="absolute contents inset-[26%_18.18%_24%_40.26%]">
            <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium inset-[26%_18.18%_24%_40.26%] justify-center leading-[0] text-[16px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[25px]">ตรวจสอบ</p>
            </div>
          </div>
        </div>
        <IconBox additionalClassNames="inset-[51.46%_56.84%_45.58%_36.76%]">
          <g id="Done_all_alt_round_fill_line">
            <path d={svgPaths.p1fafa000} id="Line 2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
            <path d={svgPaths.p3ad96200} fill="var(--fill-0, white)" fillOpacity="0.25" id="Subtract" />
          </g>
        </IconBox>
      </div>
      <div className="absolute contents left-[24px] top-[237px]">
        <div className="absolute bg-white border border-[#e5e5e5] border-solid h-[60px] left-[24px] rounded-[15px] shadow-[0px_20px_25px_0px_rgba(218,218,218,0.3)] top-[237px] w-[327px]" />
        <LabelText additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] left-[95.01px] top-[267.07px]">{`เลขประจำตัวประชาชน `}</LabelText>
        <div className="absolute left-[44px] size-[28px] top-[253px]" data-name="apple 1" />
        <div className="absolute contents left-[308px] top-[255px]">
          <div className="absolute left-[308px] size-[23px] top-[255px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
              <circle cx="11.5" cy="11.5" id="Ellipse 157" r="10.5" stroke="var(--stroke-0, #5669FF)" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute left-[313px] size-[12.545px] top-[260px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
              <circle cx="6.27273" cy="6.27273" fill="var(--fill-0, #5669FF)" id="Ellipse 156" r="6.27273" />
            </svg>
          </div>
        </div>
        <div className="absolute left-[44.01px] overflow-clip size-[28px] top-[252.57px]" data-name="apple 2">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgApple2} />
        </div>
      </div>
      <div className="absolute contents left-[24px] top-[493px]">
        <div className="absolute contents left-[24px] top-[493px]">
          <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] left-[95px] text-[#120d26] text-[16px] text-nowrap top-[523px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[34px]">หมายเลขหนังสือเดินทาง</p>
          </div>
          <div className="absolute border border-[#e5e5e5] border-solid h-[60px] left-[24px] rounded-[15px] top-[493px] w-[327px]" />
          <div className="absolute contents left-[308px] top-[511px]">
            <CircleIcon additionalClassNames="left-[308px] top-[511px]" />
          </div>
          <div className="absolute left-[44px] overflow-clip size-[28px] top-[509px]" data-name="apple 1">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgApple1} />
          </div>
        </div>
      </div>
      <div className="absolute contents left-[23.5px] top-[568.11px]">
        <div className="absolute contents left-[23.5px] top-[568.11px]">
          <div className="absolute border border-[#e5e5e5] border-solid h-[60px] left-[23.5px] rounded-[15px] top-[568.11px] w-[327px]" />
          <div className="absolute bg-white left-[43.5px] size-[28px] top-[584.11px]" data-name="apple 1" />
          <LabelText additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] left-[94.5px] top-[598.61px]">{`ไม่มี ID ระบุตัวตน `}</LabelText>
          <div className="absolute contents left-[307.5px] top-[586.11px]">
            <CircleIcon additionalClassNames="left-[307.5px] top-[586.11px]" />
          </div>
          <div className="absolute h-[28.242px] left-[43.5px] top-[585.49px] w-[28.837px]">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRectangle4273} />
          </div>
        </div>
      </div>
    </div>
  );
}
