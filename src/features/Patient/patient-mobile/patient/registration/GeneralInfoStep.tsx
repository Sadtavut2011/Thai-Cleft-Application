import svgPaths from "../../../../../imports/svg-6s1sk0y4qk";
import clsx from "clsx";
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
type Wrapper1Props = {
  additionalClassNames?: string;
};

function FieldLabel({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("absolute flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] left-[21.63px] text-[#120d26] text-[16px] translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[34px]">{children}</p>
    </div>
  );
}

function HelperTextWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{children}</p>
      </div>
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function ChevronIcon({ additionalClassNames = "" }: Helper1Props) {
  return (
    <div className={clsx("absolute h-[9px] left-[332.94px] w-[4.5px]", additionalClassNames)}>
      <div className="absolute inset-[-11.11%_-31.43%_-11.11%_-22.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 11">
          <path d="M1 1L5.5 5.5L1 10" id="Vector 9" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function SelectPlaceholder({ text }: TextProps) {
  return <HelperTextWrapper>{text}</HelperTextWrapper>;
}
type CalendarProps = {
  additionalClassNames?: string;
};

function CalendarIcon({ additionalClassNames = "" }: CalendarProps) {
  return (
    <div className={clsx("absolute left-[40px] size-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Calendar">
          <g id="comment_duotone">
            <path d={svgPaths.p28f06400} fill="var(--fill-0, #5669FF)" fillOpacity="0.75" id="Union" />
            <path d="M8.5 9.5L15.5 9.5" id="Vector 7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 12.5L13.5 12.5" id="Vector 9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
};

function InputPlaceholder({ text, text1 }: HelperProps) {
  return (
    <HelperTextWrapper>
      {text}
      <span className="font-['Noto_Sans_Thai:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text1}
      </span>
    </HelperTextWrapper>
  );
}

export default function GeneralInfoStep() {
  return (
    <div className="bg-white relative size-full" data-name="ข้อมูลทั่วไป - 1">
      <div className="absolute contents inset-[0.13%_-0.27%_85.29%_0]">
        <div className="absolute contents inset-[0.13%_-0.27%_85.29%_0]">
          <div className="absolute flex inset-[7.42%_91.16%_92.49%_8.83%] items-center justify-center">
            <div className="flex-none h-[1.391px] scale-y-[-100%] w-[0.01px]">
              <div className="relative size-full" data-name="path534">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2">
                  <path d={svgPaths.p25b8d180} fill="var(--fill-0, #5A61FF)" id="path534" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute flex flex-col font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] font-medium inset-[3.18%_56.93%_94.43%_8.13%] justify-center leading-[0] text-[#120d26] text-[24px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Add Patient</p>
          </div>
          <div className="absolute contents inset-[0.13%_-0.27%_85.29%_0]">
            <div className="absolute inset-[0.13%_-0.27%_85.29%_0.27%]" data-name="Rectangle">
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
            <div className="absolute contents inset-[9.71%_0_86.48%_0]">
              <div className="absolute contents inset-[10.6%_0_86.48%_0]">
                <div className="absolute inset-[10.6%_0_86.48%_0]" data-name="Page Controls">
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
                <PaginationDot additionalClassNames="inset-[11.8%_68.04%_87.67%_29.83%]">
                  <circle cx="4" cy="4" fill="var(--fill-0, #E4E4E6)" id="Dot 8" r="4" />
                </PaginationDot>
                <PaginationDot additionalClassNames="inset-[11.8%_55.33%_87.67%_42.54%]">
                  <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Dot 02" r="4" />
                </PaginationDot>
              </div>
              <div className="absolute flex flex-col font-['Noto_Sans_Thai:SemiBold',sans-serif] font-semibold inset-[9.71%_38.8%_88.7%_39.07%] justify-center leading-[0] text-[#5669ff] text-[16px] text-center text-nowrap tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal]">ข้อมูลทั่วไป</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[880px] left-0 top-0 w-[375px]" />
      <div className="absolute contents left-0 top-[237px]">
        <div className="absolute h-[1329.158px] left-0 top-[237px] w-[375px]" />
        <div className="absolute contents left-[21.63px] top-[237px]">
          <div className="absolute contents left-[24.38px] top-[271.15px]">
            <div className="absolute h-[56px] left-[24.38px] top-[271.15px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <InputPlaceholder text="ระบุ" text1="ชื่อภาษาอังกฤษ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[284.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[237px]">
            <FieldLabel additionalClassNames="text-nowrap top-[254px]">ชื่อภาษาอังกฤษ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[347px]">
          <div className="absolute contents left-[24.38px] top-[381.15px]">
            <div className="absolute h-[56px] left-[24.38px] top-[381.15px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="ระบุนามสกุลภาษาอังกฤษ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[394.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[347px]">
            <FieldLabel additionalClassNames="h-[34px] top-[364px] w-[137px]">นามสกุลภาษาอังกฤษ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[457px]">
          <div className="absolute contents left-[24.38px] top-[491.15px]">
            <div className="absolute h-[56px] left-[24.38px] top-[491.15px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกเชื้อชาติ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[504.5px]" />
            <ChevronIcon additionalClassNames="top-[514.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[457px]">
            <FieldLabel additionalClassNames="text-nowrap top-[474px]">เชื้อชาติ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[567px]">
          <div className="absolute contents left-[24.38px] top-[601.15px]">
            <div className="absolute h-[56px] left-[24.38px] top-[601.15px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกสัญชาติ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[614.5px]" />
            <ChevronIcon additionalClassNames="top-[624.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[567px]">
            <FieldLabel additionalClassNames="text-nowrap top-[584px]">สัญชาติ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[676.85px]">
          <div className="absolute contents left-[24.38px] top-[711px]">
            <div className="absolute h-[56px] left-[24.38px] top-[711px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกศาสนา" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[724.35px]" />
            <ChevronIcon additionalClassNames="top-[734.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[676.85px]">
            <FieldLabel additionalClassNames="text-nowrap top-[693.85px]">ศาสนา</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[786.7px]">
          <div className="absolute contents left-[24.38px] top-[820.85px]">
            <div className="absolute h-[56px] left-[24.38px] top-[820.85px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกสถานภาพ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[834.2px]" />
            <ChevronIcon additionalClassNames="top-[844.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[786.7px]">
            <FieldLabel additionalClassNames="text-nowrap top-[803.7px]">สถานภาพ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[896.56px]">
          <div className="absolute contents left-[24.38px] top-[930.7px]">
            <div className="absolute h-[56px] left-[24.38px] top-[930.7px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกอาชีพ" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[944.06px]" />
            <ChevronIcon additionalClassNames="top-[954.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[896.56px]">
            <FieldLabel additionalClassNames="text-nowrap top-[913.56px]">อาชีพ</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[1006.41px]">
          <div className="absolute contents left-[24.38px] top-[1040.56px]">
            <div className="absolute h-[56px] left-[24.38px] top-[1040.56px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <InputPlaceholder text="ระบุ" text1="เบอร์โทรศัพท์บ้าน" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[1053.91px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[1006.41px]">
            <FieldLabel additionalClassNames="text-nowrap top-[1023.41px]">เบอร์โทรศัพท์บ้าน</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[1118.41px]">
          <div className="absolute contents left-[24.38px] top-[1152.56px]">
            <div className="absolute h-[56px] left-[24.38px] top-[1152.56px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="ระบุอีเมล" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[1165.91px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[1118.41px]">
            <FieldLabel additionalClassNames="text-nowrap top-[1135.41px]">อีเมล</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[1228.41px]">
          <div className="absolute contents left-[24.38px] top-[1262.56px]">
            <div className="absolute h-[56px] left-[24.38px] top-[1262.56px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <SelectPlaceholder text="เลือกหมู่เลือด" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[1275.91px]" />
            <ChevronIcon additionalClassNames="top-[1285.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[1228.41px]">
            <FieldLabel additionalClassNames="text-nowrap top-[1245.41px]">หมู่เลือด</FieldLabel>
          </div>
        </div>
        <div className="absolute contents left-[21.63px] top-[1338.41px]">
          <div className="absolute contents left-[24.38px] top-[1372.56px]">
            <div className="absolute h-[56px] left-[24.38px] top-[1372.56px] w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <InputPlaceholder text="เลือก" text1="ประวัติการแพ้อาหาร" />
              </div>
            </div>
            <CalendarIcon additionalClassNames="top-[1385.91px]" />
            <ChevronIcon additionalClassNames="top-[1395.5px]" />
          </div>
          <div className="absolute contents left-[21.63px] top-[1338.41px]">
            <FieldLabel additionalClassNames="text-nowrap top-[1355.41px]">ประวัติการแพ้อาหาร</FieldLabel>
          </div>
        </div>
      </div>
    </div>
  );
}
