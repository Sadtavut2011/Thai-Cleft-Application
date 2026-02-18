import React, { useState } from 'react';
import svgPaths from "./svg-iifevawvw4";

const clsx = (...args: any[]) => args.filter(Boolean).join(' ');

type Wrapper4Props = {
  additionalClassNames?: string;
};

function Wrapper4({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Thin','Noto_Sans:Light',sans-serif] font-thin h-[25.323px] justify-center mt-[28.36px] relative text-[#807a7a] text-[12px] text-center translate-x-[-50%] translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[25px]">{children}</p>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("[grid-area:1_/_1] h-[24.31px] relative w-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
        {children}
      </svg>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 100" }} className={clsx("[grid-area:1_/_1] flex flex-col font-medium justify-center ml-0 mt-[17px] relative text-[#120d26] text-[16px] text-nowrap translate-y-[-50%]", additionalClassNames)}>
      <p className="leading-[34px]">{children}</p>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{children}</p>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute contents inset-[37.04%_14.79%_38.74%_16.09%]">
      <div className="absolute flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal inset-[37.04%_14.79%_38.74%_16.09%] justify-center leading-[0] text-[#747688] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[23px]">{children}</p>
      </div>
    </div>
  );
}

function UserBoxFill() {
  return (
    <div className="[grid-area:1_/_1] ml-[20.06px] mt-[49.17px] relative size-[25px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="User_box_fill">
          <path d={svgPaths.p39727600} fill="var(--fill-0, #5669FF)" id="Subtract" />
          <rect height="19.8333" id="Rectangle 26" rx="3.5" stroke="var(--stroke-0, white)" width="19.8333" x="2.58333" y="2.58333" />
        </g>
      </svg>
    </div>
  );
}
type Text2Props = {
  text: string;
  additionalClassNames?: string;
};

function Text2({ text, additionalClassNames = "" }: Text2Props) {
  return (
    <div className={clsx("[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] mt-0 place-items-start relative", additionalClassNames)}>
      <Wrapper2 additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif]">{text}</Wrapper2>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Wrapper2 additionalClassNames="font-['Noto_Sans_Thai:Medium',sans-serif] leading-[0]">{text}</Wrapper2>
    </div>
  );
}

function TumerFill() {
  return (
    <Wrapper3 additionalClassNames="ml-[13.13px] mt-[14.41px]">
      <g id="Tumer_fill">
        <path d={svgPaths.pf547e80} fill="var(--fill-0, #5669FF)" id="Subtract" />
        <path d="M17.5 7.59691L19 6.07753" id="Vector 65" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
        <path d={svgPaths.p1d5f63c0} id="Ellipse 45" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper3>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return <Wrapper>{text}</Wrapper>;
}

export default function Group() {
  const [date, setDate] = useState("2025-08-15");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [hospital, setHospital] = useState("โรงพยาบาลมหาราชนครเชียงใหม่");
  const [room, setRoom] = useState("ห้องตรวจ 1");
  const [treatment, setTreatment] = useState("Hearing Screening (OAE)");
  const [doctor, setDoctor] = useState("ปนัดดา");
  const [note, setNote] = useState("ใบนัดหมาย");
  const [recorder, setRecorder] = useState("สภัคศิริ สุวิวัฒนา");

  return (
    <div className="relative size-full">
      <div className="absolute content-stretch flex flex-col gap-[5px] items-center leading-[0] left-0 top-0 w-[336.25px]">
        
        {/* Date Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
            <div className="[grid-area:1_/_1] h-[23.334px] ml-[5.13%] mt-[24.48%] relative w-[21px] pointer-events-none" data-name="Calendar">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 24">
                <g id="Calendar">
                  <path clipRule="evenodd" d={svgPaths.p30878e00} fill="var(--fill-0, #5669FF)" fillRule="evenodd" id="Fill 1" opacity="0.4" />
                  <path d={svgPaths.p193da00} fill="var(--fill-0, #5669FF)" id="Fill 4" />
                  <path d={svgPaths.p2317ad80} fill="var(--fill-0, #5669FF)" id="Fill 6" />
                  <path clipRule="evenodd" d={svgPaths.p34d99d00} fill="var(--fill-0, #5669FF)" fillRule="evenodd" id="Fill 8" />
                </g>
              </svg>
            </div>
          </div>
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
            <Wrapper2 additionalClassNames="font-['Noto_Sans_Thai:Medium','Noto_Sans:Medium',sans-serif] leading-[0]">{`วันที่นัดหมาย * `}</Wrapper2>
          </div>
        </div>

        {/* Time Fields */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[4.76px] mt-0 place-items-start relative">
            <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Medium',sans-serif] font-medium h-[34.439px] justify-center ml-0 mt-[17.22px] relative text-[#120d26] text-[16px] translate-y-[-50%] w-[29px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[34px]">เวลา</p>
            </div>
          </div>
          <Wrapper3 additionalClassNames="ml-[150.36px] mt-[45.91px]">
            <g id="Remove">
              <ellipse cx="12" cy="12.1551" id="Ellipse 47" rx="9" ry="9.11629" stroke="var(--stroke-0, #CCD2E3)" strokeWidth="2" />
              <path d="M7.5 12.1551H16.5" id="Vector 8" stroke="var(--stroke-0, #CCD2E3)" strokeWidth="2" />
            </g>
          </Wrapper3>
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[30.21px] place-items-start relative">
            <div className="[grid-area:1_/_1] bg-white border border-[#e6e6e6] border-solid h-[56.724px] ml-0 mt-0 rounded-[10px] w-[133.114px]">
                <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-center px-8 text-[#807a7a] text-[12px] font-thin"
                />
            </div>
            {/* <Wrapper4 additionalClassNames="ml-[72.33px] w-[56px] pointer-events-none">08:00</Wrapper4> */}
            <div className="pointer-events-none absolute left-0 top-0">
                <TumerFill />
            </div>
          </div>
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[195.12px] mt-[28.41px] place-items-start relative">
            <div className="[grid-area:1_/_1] bg-white border border-[#e6e6e6] border-solid h-[56.724px] ml-0 mt-0 rounded-[10px] w-[133.114px]">
                <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-center px-8 text-[#807a7a] text-[12px] font-thin"
                />
            </div>
            {/* <Wrapper4 additionalClassNames="ml-[72.83px] w-[51px] pointer-events-none">12:00</Wrapper4> */}
            <div className="pointer-events-none absolute left-0 top-0">
                <TumerFill />
            </div>
          </div>
        </div>

        {/* Hospital Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="text" 
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
            <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[20.06px] mt-[16.31px] place-items-start relative">
              <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[20px]" data-name="map-pin">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g clipPath="url(#clip0_161_510)" id="map-pin">
                    <path d={svgPaths.p2c0a5f00} id="Vector" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69811" />
                    <path d={svgPaths.p27874b80} id="Vector_2" stroke="var(--stroke-0, #5669FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69811" />
                  </g>
                  <defs>
                    <clipPath id="clip0_161_510">
                      <rect fill="white" height="20" width="20" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <Text1 text="โรงพยาบาล" />
        </div>

        {/* Room Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="text" 
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
            <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[12.31px] mt-[11px] place-items-start relative" data-name="Calendar">
              <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="Home_fill">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                  <g id="Home_fill">
                    <path d={svgPaths.p337fa980} fill="var(--fill-0, #5669FF)" id="Subtract" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <Text1 text="ห้องตรวจ" />
        </div>

        {/* Treatment Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="text" 
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
            <div className="[grid-area:1_/_1] ml-[15.31px] mt-[15px] overflow-clip relative size-[24px]" data-name="stethoscope-line">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="Group">
                  <g id="Vector"></g>
                  <path d={svgPaths.p13555180} fill="var(--fill-0, #5669FF)" id="Vector_2" />
                </g>
              </svg>
            </div>
          </div>
          <Text1 text="การรักษา" />
        </div>

        {/* Doctor Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="text" 
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
          </div>
          <Text2 text="ชื่อผู้ที่รักษา" additionalClassNames="ml-0" />
          <UserBoxFill />
        </div>

        {/* Note Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] bg-white border border-[#e4dfdf] border-solid h-[110.089px] ml-0 mt-[34px] rounded-[12px] w-[329px] overflow-hidden">
             <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none p-4 resize-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
             />
          </div>
          <Text2 text="รายละเอียดการนัดหมาย" additionalClassNames="ml-px" />
          {/* <div className="[grid-area:1_/_1] flex flex-col font-['Noto_Sans_Thai:Regular',sans-serif] font-normal h-[26.666px] justify-center leading-[0] ml-[22.55px] mt-[64.78px] relative text-[#747688] text-[14px] translate-y-[-50%] w-[227.413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[23px]">ใบนัดหมาย</p>
          </div> */}
        </div>

        {/* Recorder Field */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[2.75px] mt-[34.15px] place-items-start relative">
            <div className="[grid-area:1_/_1] h-[56px] ml-0 mt-0 relative w-[329px]" data-name="Textbox">
              <div className="absolute contents inset-0">
                <div className="absolute bg-white border border-[#e4dfdf] border-solid inset-0 rounded-[12px]" />
                <div className="absolute inset-[0%_5%_0%_15%] flex items-center">
                    <input 
                        type="text" 
                        value={recorder}
                        onChange={(e) => setRecorder(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#747688] font-['Noto_Sans_Thai:Regular',sans-serif] text-[14px]"
                    />
                </div>
              </div>
            </div>
          </div>
          <Text2 text="ผู้บันทึกข้อมูล" additionalClassNames="ml-0" />
          <UserBoxFill />
        </div>

        <div className="flex flex-col font-['Noto_Sans_Thai:Regular','Noto_Sans:Regular',sans-serif] font-normal h-[26.499px] justify-center relative shrink-0 text-[10px] text-black w-[249.994px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[23px]">วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</p>
        </div>
      </div>
    </div>
  );
}