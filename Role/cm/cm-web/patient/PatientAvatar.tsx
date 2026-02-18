import React from 'react';

interface PatientAvatarProps {
  image?: string;
  name: string;
  size?: string;
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({ image, name, size = "h-10 w-10" }) => {
  if (image) {
    return (
      <img 
        src={image} 
        alt={name} 
        className={`${size} rounded-full object-cover border-2 border-[#7367f0]/20 bg-slate-100`} 
      />
    );
  }
  return (
    <div className={`${size} bg-[#7367f0]/10 rounded-full flex items-center justify-center text-[#7367f0] font-bold text-lg`}>
      {name.charAt(0)}
    </div>
  );
};
