function Icon() {
  return (
    <div className="absolute left-[11.99px] size-[15.993px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g id="Icon">
          <path d="M3.33188 7.99648H12.6611" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33275" />
          <path d="M7.99648 3.33188V12.6611" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33275" />
        </g>
      </svg>
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#6a5acd] relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-full" data-name="Button">
      <Icon />
      <p className="absolute css-ew64yg font-['IBM_Plex_Sans_Thai:Regular',sans-serif] leading-[20px] left-[71.49px] not-italic text-[14px] text-center text-white top-[6.28px] translate-x-[-50%]">เพิ่มผู้ป่วยใหม่</p>
    </div>
  );
}