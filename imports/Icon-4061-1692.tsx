import svgPaths from "./svg-3nwv79r58n";
import { imgGroup } from "./svg-ghf9s";

function Group() {
  return (
    <div className="absolute inset-[8.33%_16.67%_8.34%_16.66%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.332px_-1.167px] mask-size-[13.998px_13.998px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-5.01%_-6.27%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5014 12.8337">
          <g id="Group">
            <path d={svgPaths.p11ea80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16986" />
            <path d={svgPaths.pb1575c0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16986" />
            <path d="M4.08423 4.66728H2.91771" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16986" />
            <path d="M7.58381 7.00002H2.91771" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16986" />
            <path d="M7.58381 9.3328H2.91771" id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16986" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

export default function Icon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}