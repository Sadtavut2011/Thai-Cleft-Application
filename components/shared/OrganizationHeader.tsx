import svgPaths from "../../_internal/svgs/svg-0o3a3ou0tw";
import imgImage from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";

function Image() {
  return (
    <div className="h-[31.999px] relative shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 overflow-clip pb-0 pt-[3.998px] px-[3.998px] rounded-[19162500px] size-[39.994px] top-0" data-name="Container">
      <Image />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[23.995px] left-[11.99px] top-[4px] w-[37.835px]" data-name="Paragraph">
      <p className="absolute font-['IBM_Plex_Sans_Thai:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#49358e] text-[16px] top-[-0.14px] whitespace-pre">SCFC</p>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[11.993px]" data-name="ChevronDownIcon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9928 11.9928">
        <g id="ChevronDownIcon">
          <path d={svgPaths.p278966c0} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999403" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-[57.82px] size-[11.993px] top-[9.99px]" data-name="Container">
      <ChevronDownIcon />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#f6f5ff] h-[31.99px] left-[43.99px] rounded-[99px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[4px] w-[81.808px]" data-name="Container">
      <Paragraph />
      <Container1 />
    </div>
  );
}

export default function OrganizationHeader() {
  return (
    <div className="relative size-full" data-name="Container">
      <Container />
      <Container2 />
    </div>
  );
}