import React from 'react';
import {
  IoPhonePortraitOutline,
  IoLaptopOutline,
  IoHeadsetOutline,
  IoWatchOutline,
  IoCameraOutline,
  IoGiftOutline
} from 'react-icons/io5';
import {
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaClock,
  FaCamera,
  FaGift
} from 'react-icons/fa';

interface IconRendererProps {
  iconName: string;
  size?: number;
  className?: string;
  color?: string;
  withBackground?: boolean; 
}

const IconRenderer: React.FC<IconRendererProps> = ({ 
  iconName, 
  size = 24, 
  className = "",
  color, 
  withBackground = false 
}) => {
  // Ánh xạ tên icon từ database thành component icon thực tế
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'phone-portrait': IoPhonePortraitOutline,
    'laptop': IoLaptopOutline,
    'headset': IoHeadsetOutline,
    'watch': IoWatchOutline,
    'camera': IoCameraOutline,
    'gift': IoGiftOutline,
    // Fallbacks
    'mobile': FaMobileAlt,
    'computer': FaLaptop,
    'headphones': FaHeadphones,
    'clock': FaClock,
    'camera-alt': FaCamera,
    'gift-alt': FaGift
  };

  const IconComponent = iconMap[iconName];
  const iconStyle = {
    color: color || 'currentColor', 
    fontSize: size
  };

  if (!IconComponent) {
    // Trả về icon mặc định nếu không tìm thấy
    return <div className={`text-2xl ${className}`}>📦</div>;
  }
  
  if (withBackground && color) {
    return (
      <div 
        className={`rounded-lg p-2 flex items-center justify-center ${className}`}
        style={{ 
          backgroundColor: color + '20', // Thêm opacity 20% (32 trong hex)
        }}
      >
        <IconComponent style={iconStyle} />
      </div>
    );
  }

  return <IconComponent size={size} className={className} />;
};

export default IconRenderer;