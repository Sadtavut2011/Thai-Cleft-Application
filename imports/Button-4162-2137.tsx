function Icon() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.998 15.998">
        <g id="Icon">
          <path d="M3.33293 7.99902H12.6651" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
          <path d="M7.99902 3.33293V12.6651" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
        </g>
      </svg>
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-[19300900px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
      <Icon />
    </div>
  );
}