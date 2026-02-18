import svgPaths from "../../features/shared/icons/svg-33c6748exo"; // Assuming this needs to be moved or path corrected
import imgImage from "figma:asset/bbbf046797e51a7b758177d9ed80ba440e116052.png";
import imgImage1 from "figma:asset/bcc7d4796b1918c63dfe93672706a89c7cf35586.png";
import imgImage2 from "figma:asset/66a4af6a00fb05488c9ce48aff64fe487b87e999.png";
import imgImage3 from "figma:asset/9e3371d1316d8628e293b6c06cc73e00d380840e.png";
import imgImage4 from "figma:asset/ccad3c8e4d346215fe550b9c982861424d34b65b.png";
import imgImage5 from "figma:asset/60e7294dfea18c421e91f502e0c0eeea64ea4756.png";

function Paragraph() {
  return (
    <div className="h-[23.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#37286a] text-[16px] text-nowrap top-[-0.14px] whitespace-pre">Tele-consult</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[39.985px] items-start left-[4px] pb-0 pt-[7.995px] px-[11.449px] rounded-[99px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.07)] top-[4px] w-[114.976px]" data-name="Frame3">
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[23.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7066a9] text-[16px] text-nowrap top-[-0.14px] whitespace-pre">เยี่ยมบ้าน</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.985px] items-start left-[118.97px] pb-0 pt-[7.995px] px-[26.359px] rounded-[99px] top-[4px] w-[114.976px]" data-name="Frame4">
      <Paragraph1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[23.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7066a9] text-[16px] text-nowrap top-[-0.14px] whitespace-pre">ส่งตัว</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.985px] items-start left-[233.95px] pb-0 pl-[38.566px] pr-[38.575px] pt-[7.995px] rounded-[99px] top-[4px] w-[114.976px]" data-name="Frame5">
      <Paragraph2 />
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="absolute bg-gray-100 h-[47.98px] left-[20px] rounded-[99px] top-[11.99px] w-[352.914px]" data-name="Frame7">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}
