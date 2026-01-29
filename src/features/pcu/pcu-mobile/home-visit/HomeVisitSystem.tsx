import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import svgPaths from '../../../../imports/svg-wzshi4ntni';
import { HomeVisitListView } from './HomeVisitListView';
import { HomeVisitDetailPage } from './HomeVisitDetailPage';

// --- Icons & Graphics ---

const MapIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="relative size-full">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9982 17.9982">
      <g id="Icon">
        <path d="M10.5784 4.16432C10.7866 4.26835 11.0161 4.32251 11.2489 4.32251C11.4816 4.32251 11.7111 4.26835 11.9193 4.16432L14.6633 2.79196C14.7777 2.73479 14.9048 2.70783 15.0326 2.71365C15.1604 2.71947 15.2845 2.75787 15.3933 2.82521C15.502 2.89255 15.5917 2.98658 15.6539 3.09837C15.7161 3.21016 15.7486 3.33599 15.7484 3.46389V13.0359C15.7483 13.1752 15.7095 13.3116 15.6362 13.43C15.563 13.5484 15.4582 13.6441 15.3337 13.7064L11.9193 15.4139C11.7111 15.518 11.4816 15.5721 11.2489 15.5721C11.0161 15.5721 10.7866 15.518 10.5784 15.4139L7.41975 13.8346C7.21157 13.7306 6.98204 13.6764 6.74932 13.6764C6.51659 13.6764 6.28706 13.7306 6.07888 13.8346L3.33491 15.2069C3.22044 15.2642 3.09323 15.2911 2.96539 15.2853C2.83756 15.2794 2.71334 15.2409 2.60457 15.1735C2.49581 15.1061 2.4061 15.0119 2.344 14.9001C2.2819 14.7882 2.24946 14.6622 2.24977 14.5343V4.96299C2.24985 4.82376 2.28868 4.6873 2.36193 4.56889C2.43517 4.45048 2.53993 4.3548 2.66448 4.29256L6.07888 2.58498C6.28706 2.48096 6.51659 2.4268 6.74932 2.4268C6.98204 2.4268 7.21157 2.48096 7.41975 2.58498L10.5784 4.16432Z" id="Vector" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M11.2489 4.32256V15.5714" id="Vector_2" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M6.74931 2.42675V13.6756" id="Vector_3" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
      </g>
    </svg>
  </div>
);

const ListIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="relative size-full">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9982 17.9982">
      <g clipPath="url(#clip0_2005_2321)">
        <path d="M4.49954 16.4983C4.10176 16.4983 3.72027 16.3403 3.43899 16.059C3.15771 15.7778 2.99969 15.3963 2.99969 14.9985V2.9997C2.99969 2.60191 3.15771 2.22042 3.43899 1.93914C3.72027 1.65787 4.10176 1.49985 4.49954 1.49985H10.4989C10.7363 1.49947 10.9714 1.54605 11.1908 1.63691C11.4101 1.72778 11.6092 1.86113 11.7768 2.0293L14.4675 4.72002C14.6361 4.88764 14.7699 5.08699 14.861 5.30658C14.9521 5.52617 14.9989 5.76164 14.9985 5.99939V14.9985C14.9985 15.3963 14.8405 15.7778 14.5592 16.059C14.2779 16.3403 13.8964 16.4983 13.4986 16.4983H4.49954Z" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M10.4989 1.49985V5.24985C10.4989 5.44876 10.5779 5.63953 10.7186 5.78018C10.8593 5.92083 11.05 5.99985 11.2489 5.99985H14.9989" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M7.49939 6.74931H5.99939" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M11.9994 9.74901H5.99939" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
        <path d="M11.9994 12.7487H5.99939" stroke={isActive ? "#7e22ce" : "#90A1B9"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49985" />
      </g>
      <defs>
        <clipPath id="clip0_2005_2321">
          <rect fill="white" height="17.9982" width="17.9982" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

const CheckIcon = () => (
  <div className="relative shrink-0 size-[13.992px]">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <path d={svgPaths.p673f00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16597" />
    </svg>
  </div>
);

const LocationPinIcon = ({ colorClass = "bg-[#2b7fff]" }: { colorClass?: string }) => (
  <div className={`${colorClass} content-stretch flex items-center justify-center left-0 p-[3.998px] rounded-[1.91625e+07px] size-[47.998px] top-0 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]`}>
    <div className="absolute border-[3.998px] border-solid border-white inset-0 pointer-events-none rounded-[1.91625e+07px]" />
    <div className="relative shrink-0 size-[23.995px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p208fd880} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99955" />
        <path d={svgPaths.p32bffcc0} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99955" />
      </svg>
    </div>
  </div>
);

const FABIcon = () => (
  <div className="relative shrink-0 size-[23.995px]">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d="M2.99932 10.9975L21.995 1.99955L12.9971 20.9953L10.9975 12.9971L2.99932 10.9975Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99955" />
    </svg>
  </div>
);

const SmallPinIcon = () => (
  <div className="bg-[#2b7fff] relative rounded-full shrink-0 size-[15.999px]">
    <div className="absolute border-[1.713px] border-solid border-white inset-0 pointer-events-none rounded-full shadow-sm" />
  </div>
);

// --- Components ---

const GridBackground = () => {
  // Generates the 40x40 grid pattern efficiently
  const cols = 40;
  const rows = 40;
  const colWidth = 19.67;
  const rowHeight = 32.43;
  
  // Flatten the grid generation to avoid React.Fragment issues with injected props
  const gridItems = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridItems.push({ r, c });
    }
  }
  
  return (
    <div className="absolute left-[-196.45px] top-[-324.04px] w-[785.816px] h-[1296.172px]">
      {gridItems.map(({ r, c }) => (
        <div 
          key={`${r}-${c}`}
          className="absolute bg-[rgba(226,232,240,0.5)] w-[18.667px] h-[31.428px]"
          style={{
            left: `${c * colWidth}px`,
            top: `${r * rowHeight}px`
          }}
        />
      ))}
    </div>
  );
};

const PatientMarker = ({ 
  name, 
  left, 
  top, 
  colorClass, 
  onClick 
}: { 
  name: string, 
  left: string, 
  top: string, 
  colorClass?: string,
  onClick?: () => void
}) => {
  return (
    <button 
      onClick={onClick}
      className="absolute size-[47.998px]"
      style={{ left, top }}
    >
      <LocationPinIcon colorClass={colorClass} />
      <div className="absolute bg-white flex flex-col h-[29.134px] items-start left-[-50%] ml-[24px] opacity-0 group-hover:opacity-100 hover:opacity-100 pb-[0.571px] pt-[6.568px] px-[12.564px] rounded-[14px] top-[55.99px] min-w-[96px] transition-opacity pointer-events-none">
        <div className="absolute border-[#f1f5f9] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[14px] shadow-sm bg-white -z-10" />
        <div className="h-[15.999px] relative shrink-0 w-full text-center">
          <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[16px] not-italic text-[#314158] text-[12px] whitespace-nowrap">
            {name}
          </p>
        </div>
      </div>
      
      {/* Permanent Label below marker matching design */}
      <div className="absolute top-[56px] left-1/2 -translate-x-1/2 bg-white rounded-[14px] px-3 py-1.5 shadow-md border border-slate-100 whitespace-nowrap">
         <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#314158] text-[12px] leading-[16px]">
            {name}
         </p>
      </div>
    </button>
  );
};

const FilterCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <div className="flex gap-[12px] h-[20px] items-center cursor-pointer" onClick={onChange}>
    <div className={`relative flex items-center justify-center size-[20px] rounded-[8px] transition-colors ${checked ? 'bg-[#2b7fff]' : 'bg-slate-200'}`}>
      {checked && (
        <div className="relative size-[13.992px]" data-name="Icon">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9916 13.9916">
            <g id="Icon">
              <path d="M11.6597 3.49791L5.24686 9.91074L2.33194 6.99582" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16597" />
            </g>
          </svg>
        </div>
      )}
    </div>
    <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#314158] text-[14px] leading-[20px] select-none">
      {label}
    </p>
  </div>
);

export const HomeVisitSystem = ({ onBack, initialViewMode = 'map' }: { onBack?: () => void, initialViewMode?: 'map' | 'list' }) => {
  const [filterBedridden, setFilterBedridden] = useState(true);
  const [filterChronic, setFilterChronic] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>(initialViewMode);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (isDetailOpen) {
    return (
       <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden">
          <HomeVisitDetailPage onBack={() => setIsDetailOpen(false)} />
       </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#f8fafc]">
      {/* Persistent Header */}
      <div className="shrink-0 h-[60px] bg-white border-b border-slate-100 flex items-center px-4 gap-3 z-50">
        <button 
            onClick={onBack} 
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#37286a] hover:bg-slate-50 transition-colors"
        >
            <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-bold text-[#37286a] font-['IBM_Plex_Sans_Thai:Bold',sans-serif]">
            {viewMode === 'map' ? 'ระบบเยี่ยมบ้าน' : 'รายการเยี่ยมบ้าน'}
        </h1>
      </div>

      <div className="relative flex-1 w-full overflow-hidden">
      {/* Background Grid Layer (Map Mode Only) */}
      {viewMode === 'map' && <GridBackground />}

      {/* Decorative Pulse Circle (Map Mode Only) */}
      {viewMode === 'map' && (
        <div className="absolute left-[164.46px] top-[292.04px] bg-[rgba(43,127,255,0.1)] flex items-center justify-center rounded-full size-[63.997px] animate-pulse">
          <SmallPinIcon />
        </div>
      )}

      {/* Markers (Map Mode Only) */}
      {viewMode === 'map' && (
        <div className="relative w-full h-full">
          <PatientMarker 
            name="ด.ช. รักดี มีสุข" 
            left="66.6px" 
            top="92.68px" 
            colorClass="bg-[#fb2c36]" 
          />
          
          <PatientMarker 
            name="ด.ญ. พอใจ ยิ้มสวย" 
            left="153.7px" 
            top="321.33px" 
            colorClass="bg-[#2b7fff]" 
          />
          
          <PatientMarker 
            name="นาย สมชาย แข็งแรง" 
            left="198.84px" 
            top="413.91px" 
            colorClass="bg-[#90a1b9]" 
          />
          
          <PatientMarker 
            name="นางสาว มุ่งมั่น ทำดี" 
            left="233.51px" 
            top="495.06px" 
            colorClass="bg-[#2b7fff]" 
          />
        </div>
      )}

      {/* List View Content (List Mode Only) */}
      {viewMode === 'list' && (
        <div className="absolute inset-0">
          <HomeVisitListView 
             onShowDetail={() => setIsDetailOpen(true)} 
             onBack={onBack}
             showHeader={false}
             onToggleView={() => setViewMode('map')}
          />
        </div>
      )}

      {/* Floating UI Container - Toggle (Centered) */}
      <div className="absolute top-[16px] left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto bg-white border border-[#f1f5f9] rounded-[14px] h-[45px] w-[300px] shadow-sm flex items-center px-1">
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 h-[36px] rounded-[10px] transition-colors ${viewMode === 'map' ? 'bg-[#faf5ff] text-[#7e22ce]' : 'text-[#90a1b9] hover:bg-slate-50'}`}
            >
              <div className="relative w-[18px] h-[18px]">
                 <MapIcon isActive={viewMode === 'map'} />
              </div>
              <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px]">แผนที่</span>
            </button>
            
            <div className="w-[1px] h-[28px] bg-[#f1f5f9] mx-1" />
            
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 h-[36px] rounded-[10px] transition-colors ${viewMode === 'list' ? 'bg-[#faf5ff] text-[#7e22ce]' : 'text-[#90a1b9] hover:bg-slate-50'}`}
            >
              <div className="relative w-[18px] h-[18px]">
                 <ListIcon isActive={viewMode === 'list'} />
              </div>
              <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px]">รายการ</span>
            </button>
          </div>
      </div>

      {/* Floating UI Container - Filter (Left, below menu) */}
      {viewMode === 'map' && (
        <div className="absolute top-[77px] left-[16px] z-50 pointer-events-none">
            <div className="bg-white rounded-[16px] p-[16px] shadow-sm border border-[#f1f5f9] w-[143.71px] pointer-events-auto">
              <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#90a1b9] text-[12px] tracking-[0.6px] uppercase mb-3">
                FILTERS
              </p>
              <div className="flex flex-col gap-3">
                <FilterCheckbox 
                  label="ผู้ป่วยติดเตียง" 
                  checked={filterBedridden} 
                  onChange={() => setFilterBedridden(!filterBedridden)} 
                />
                <FilterCheckbox 
                  label="โรคเรื้อรัง" 
                  checked={filterChronic} 
                  onChange={() => setFilterChronic(!filterChronic)} 
                />
              </div>
            </div>
        </div>
      )}

      {/* FAB (Bottom Right) - Map Mode Only */}
      {viewMode === 'map' && (
        <button className="absolute right-[24px] bottom-[24px] bg-[#37286a] size-[56px] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 z-40">
          <FABIcon />
        </button>
      )}
      </div>
    </div>
  );
};
