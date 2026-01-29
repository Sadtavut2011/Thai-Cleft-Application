import svgPaths from "../../../../../imports/svg-ncc7f3r3an";
import clsx from "clsx";
import imgEllipse71 from "figma:asset/ac577bffa4d0304acbeb419e82e8606396148391.png";
import imgEllipse72 from "figma:asset/91f274d6413093118ef3ae549561d97071bc9da2.png";
import imgEllipse66 from "figma:asset/1969ce3fb109d173f0ac01fa4aa0db3c540dd34a.png";
import imgEllipse69 from "figma:asset/5cee84f7e6ce39537bee9e5e0f3778e0c426fde1.png";
import { imgEllipse70 } from "../../../../../imports/svg-udt0r";
type Group33775DotProps = {
  additionalClassNames?: string;
};

function PaginationDot({ children, additionalClassNames = "" }: React.PropsWithChildren<Group33775DotProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        {children}
      </svg>
    </div>
  );
}

function IconWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2">
        {children}
      </svg>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function FieldLabel({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-medium justify-center leading-[0] left-[22.37px] text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[34px]">{children}</p>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function PlaceholderText({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]", additionalClassNames)}>
      <p className="leading-[23px]">{children}</p>
    </div>
  );
}

function PlaceholderWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <PlaceholderText additionalClassNames="font-['Noto_Sans_Thai:Regular',sans-serif]">{children}</PlaceholderText>
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function ChevronIcon({ additionalClassNames = "" }: Helper1Props) {
  return (
    <div className={clsx("absolute h-[9px] left-[333.68px] w-[4.5px]", additionalClassNames)}>
      <div className="absolute inset-[-11.11%_-31.43%_-11.11%_-22.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 11">
          <path d="M1 1L5.5 5.5L1 10" id="Vector 9" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
};

function InputPlaceholder({ text, text1 }: HelperProps) {
  return (
    <PlaceholderWrapper>
      {text}
      <span className="font-['Noto_Sans_Thai:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text1}
      </span>
    </PlaceholderWrapper>
  );
}
type CommentDuotoneProps = {
  additionalClassNames?: string;
};

function CalendarIcon({ additionalClassNames = "" }: CommentDuotoneProps) {
  return (
    <div className={clsx("absolute size-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="comment_duotone">
          <path d={svgPaths.p28f06400} fill="var(--fill-0, #5669FF)" fillOpacity="0.75" id="Union" />
          <path d="M8.5 9.5L15.5 9.5" id="Vector 7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 12.5L13.5 12.5" id="Vector 9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
type TextProps = {
  text: string;
};

function SelectPlaceholder({ text }: TextProps) {
  return <PlaceholderWrapper>{text}</PlaceholderWrapper>;
}

export default function PatientHistoryStep() {
  return (
    <div className="bg-white relative size-full" data-name="ประวัติผู้ป่วย - 2">
      <div className="absolute contents inset-[0.2%_-0.27%_77.51%_0]">
        <div className="absolute contents inset-[0.2%_-0.27%_77.51%_0.27%]">
          <div className="absolute flex inset-[11.35%_91.16%_88.51%_8.83%] items-center justify-center">
            <div className="flex-none h-[1.391px] scale-y-[-100%] w-[0.01px]">
              <IconWrapper>
                <path d={svgPaths.p25b8d180} fill="var(--fill-0, #5A61FF)" id="path534" />
              </IconWrapper>
            </div>
          </div>
          <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] font-medium inset-[4.86%_56.93%_91.49%_8.13%] justify-center leading-[0] text-[#120d26] text-[24px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Add Patient</p>
          </div>
          <div className="absolute contents inset-[0.2%_-0.27%_77.51%_0.27%]">
            <div className="absolute inset-[0.2%_-0.27%_77.51%_0.27%]" data-name="Rectangle">
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
            <div className="absolute contents inset-[16.06%_85.94%_82.73%_12.37%]">
              <div className="absolute inset-[16.06%_85.94%_82.73%_12.37%]">
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
        <div className="absolute flex inset-[11.35%_91.16%_88.51%_8.83%] items-center justify-center">
          <div className="flex-none h-[1.391px] scale-y-[-100%] w-[0.01px]">
            <IconWrapper>
              <g id="g430">
                <path d={svgPaths.pf86df80} fill="var(--fill-0, #5A61FF)" id="path432" />
              </g>
            </IconWrapper>
          </div>
        </div>
        <div className="absolute contents inset-[14.84%_0_79.33%_0]">
          <div className="absolute contents inset-[16.21%_0_79.33%_0]">
            <div className="absolute inset-[16.21%_0_79.33%_0]" data-name="Page Controls">
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
            <PaginationDot additionalClassNames="inset-[18.03%_68.04%_81.16%_29.83%]">
              <circle cx="4" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 8" r="4" />
            </PaginationDot>
            <PaginationDot additionalClassNames="inset-[18.03%_61.68%_81.16%_36.18%]">
              <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Dot 02" r="4" />
            </PaginationDot>
          </div>
          <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold',sans-serif] font-semibold inset-[14.84%_37.47%_82.73%_37.47%] justify-center leading-[0] text-[#5669ff] text-[16px] text-center text-nowrap tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">ประวัติผู้ป่วย</p>
          </div>
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
      <div className="absolute contents left-[22.37px] top-[237px]">
        <div className="absolute contents left-[22.37px] top-[237px]">
          <div className="absolute contents left-[25.12px] top-[271.15px]">
            <div className="absolute h-[56px] left-[25.12px] top-[271.15px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="ระบุชื่อภาษาไทย" />
              </div>
            </div>
            <div className="absolute contents left-[40.74px] top-[286.67px]">
              <div className="absolute contents left-[40.74px] top-[286.67px]" data-name="Calendar">
                <CalendarIcon additionalClassNames="left-[40.74px] top-[286.67px]" />
              </div>
            </div>
          </div>
          <div className="absolute contents left-[22.37px] top-[237px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] top-[254px]">ชื่อภาษาไทย *</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[22.37px] top-[347.15px]">
          <div className="absolute contents left-[25.12px] top-[381.3px]">
            <div className="absolute h-[56px] left-[25.12px] top-[381.3px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <InputPlaceholder text="ระบุ" text1="นามสกุลภาษาไทย" />
              </div>
            </div>
            <div className="absolute contents left-[40.74px] top-[394.65px]" data-name="Calendar">
              <CalendarIcon additionalClassNames="left-[40.74px] top-[394.65px]" />
            </div>
          </div>
          <div className="absolute contents left-[22.37px] top-[347.15px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] top-[364.15px]">{`นามสกุลภาษาไทย * `}</FieldLabel>
          </div>
        </div>
        {[...Array(2).keys()].map((_, i) => (
          <div className="absolute contents left-[22.37px] top-[456px]">
            <div className="absolute contents left-[25.12px] top-[490.15px]">
              <div className="absolute h-[56px] left-[25.12px] top-[490.15px] w-[329px]" data-name="Textbox">
                <div className="absolute contents inset-0">
                  <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                  <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
                    <PlaceholderText additionalClassNames="font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif]">{`Choose from calender `}</PlaceholderText>
                  </div>
                </div>
              </div>
              <ChevronIcon additionalClassNames="top-[513.5px]" />
              <div className="absolute contents left-[40.75px] top-[503.65px]" data-name="Calendar">
                <CalendarIcon additionalClassNames="left-[40.75px] top-[503.65px]" />
              </div>
            </div>
            <div className="absolute contents left-[22.37px] top-[456px]">
              <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] top-[473px]">วันเดือนปีเกิด *</FieldLabel>
            </div>
          </div>
        ))}
        <div className="absolute contents left-[22.37px] top-[553.3px]">
          <div className="absolute contents left-[25.12px] top-[587.45px]">
            <div className="absolute h-[56px] left-[25.12px] top-[587.45px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="คำนวณอายุอัตโนมัติ" />
              </div>
            </div>
            <div className="absolute contents left-[40.75px] top-[600.8px]" data-name="Calendar">
              <CalendarIcon additionalClassNames="left-[40.75px] top-[600.8px]" />
            </div>
          </div>
          <div className="absolute contents left-[22.37px] top-[553.3px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] top-[570.3px]">อายุ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[22.37px] top-[759.93px]">
          <div className="absolute contents left-[25.12px] top-[794.07px]">
            <div className="absolute h-[56px] left-[25.12px] top-[794.07px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกเพศ" />
              </div>
            </div>
            <div className="absolute contents left-[40.75px] top-[807.43px]" data-name="Calendar">
              <CalendarIcon additionalClassNames="left-[40.75px] top-[807.43px]" />
            </div>
            <ChevronIcon additionalClassNames="top-[817.72px]" />
          </div>
          <div className="absolute contents left-[22.37px] top-[759.93px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] top-[776.93px]">เพศ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[22.37px] top-[658.93px]">
          <div className="absolute contents left-[25.12px] top-[693.07px]">
            <div className="absolute h-[56px] left-[25.12px] top-[693.07px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกสถานะของผู้ป่วย" />
              </div>
            </div>
            <div className="absolute contents left-[40.75px] top-[706.43px]" data-name="Calendar">
              <CalendarIcon additionalClassNames="left-[40.75px] top-[706.43px]" />
            </div>
            <ChevronIcon additionalClassNames="top-[716.72px]" />
          </div>
          <div className="absolute contents left-[22.37px] top-[658.93px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] top-[675.93px]">สถานะของผู้ป่วย</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[22.37px] top-[872.05px]">
          <div className="absolute contents left-[25.12px] top-[906.2px]">
            <div className="absolute h-[56px] left-[25.12px] top-[906.2px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <InputPlaceholder text="ระบุ" text1="เบอร์โทรศัพท์มือถือ" />
              </div>
            </div>
            <div className="absolute contents left-[40.75px] top-[919.55px]" data-name="Calendar">
              <CalendarIcon additionalClassNames="left-[40.75px] top-[919.55px]" />
            </div>
          </div>
          <div className="absolute contents left-[22.37px] top-[872.05px]">
            <FieldLabel additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] top-[889.05px]">เบอร์โทรศัพท์มือถือ</FieldLabel>
          </div>
        </div>
      </div>
    </div>
  );
}
