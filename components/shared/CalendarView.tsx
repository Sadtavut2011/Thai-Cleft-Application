import React from 'react';

function Icon() {
  return (
    <div className="relative shrink-0 size-[27.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9922 27.9922">
        <g id="Icon">
          <path d="M5.83172 13.9961H22.1605" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33268" />
          <path d="M13.9961 5.83169V22.1605" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33268" />
        </g>
      </svg>
    </div>
  );
}

export default function CalendarView() {
  return (
    <div className="bg-[#5b4d9d] relative rounded-full shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-full" data-name="CalendarView">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center relative size-full">
          <Icon />
        </div>
      </div>
    </div>
  );
}
