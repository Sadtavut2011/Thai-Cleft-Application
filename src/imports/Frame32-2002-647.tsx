function Frame2() {
  return (
    <div className="absolute bg-[#e02424] content-stretch flex items-center justify-center left-[16px] px-[2px] py-0 rounded-[99px] top-[-6px]">
      <p className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] h-[16px] leading-[1.5] not-italic relative shrink-0 text-[12px] text-white w-[22px]">99+</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#faca15] text-[20px] text-nowrap">bell</p>
      <Frame2 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#49358e] text-[20px] text-nowrap">user</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0">
      <Icon />
      <Icon1 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative size-full" style={{ backgroundImage: "linear-gradient(-84.3617deg, rgb(87, 67, 136) 1.4597%, rgb(123, 100, 169) 49.85%, rgb(138, 116, 187) 99.915%)" }}>
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white">Thai Cleft Primary Care</p>
      <Frame1 />
    </div>
  );
}