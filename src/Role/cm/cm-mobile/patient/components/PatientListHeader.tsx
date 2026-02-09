function Icon() {
  return (
    <div className="absolute left-0 size-[19.997px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M2.49962 4.16604H2.50796" id="Vector" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M2.49962 9.99849H2.50796" id="Vector_2" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M2.49962 15.8309H2.50796" id="Vector_3" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 4.16604H17.4974" id="Vector_4" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 9.99849H17.4974" id="Vector_5" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 15.8309H17.4974" id="Vector_6" stroke="var(--stroke-0, #37286A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[27.992px] relative shrink-0 w-[150.116px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[27.992px] relative w-[150.116px]">
        <Icon />
        <p className="absolute font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[28px] left-[27.99px] not-italic text-[#37286a] text-[18px] top-[-0.14px] w-[123px]">รายชื่อผู้ป่วย (4)</p>
      </div>
    </div>
  );
}

export default function PatientListHeader() {
  return (
    <div className="relative size-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Heading />
        </div>
      </div>
    </div>
  );
}
