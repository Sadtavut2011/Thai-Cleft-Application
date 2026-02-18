function Icon() {
  return (
    <div className="bg-[#7066a9] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[24px]" data-name="Icon">
      <p className="font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">plus</p>
    </div>
  );
}

function ButtonContent() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 size-[24px]">
      <Icon />
    </div>
  );
}

function ButtonLabel() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3c3c3c] text-[16px] text-nowrap whitespace-pre">เพิ่มข้อมูล ผู้ป่วยใหม่</p>
    </div>
  );
}

function ButtonWrapper() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ButtonLabel />
    </div>
  );
}

function AddPatientButtonContent() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-[320px]">
      <ButtonContent />
      <ButtonWrapper />
    </div>
  );
}

export default function AddPatientButton() {
  return (
    <div className="bg-[#dcd7fe] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.05)] size-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <AddPatientButtonContent />
        </div>
      </div>
    </div>
  );
}
