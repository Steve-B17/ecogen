"use client";
import Image from 'next/image'; // Ensure this import is included at the top
import { useState } from 'react';

export default function FloatingSidebar() {
  const [active, setActive] = useState(null); // To manage active states of the icons

  const icons = [
    { id: 'home', src: '/assets/icons/home.png', alt: 'Home Icon' },
    { id: 'solar', src: '/assets/icons/solar.png', alt: 'Solar Icon' },
    { id: 'wind', src: '/assets/icons/wind.png', alt: 'Wind Icon' },
    { id: 'forecast', src: '/assets/icons/forecast.png', alt: 'Forecast Icon' },
    { id: 'analytics', src: '/assets/icons/analytics.png', alt: 'Analytics Icon' },
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 space-y-4">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`p-3 bg-white rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-110 hover:bg-gray-300 cursor-pointer ${
            active === icon.id ? 'bg-gray-500 text-white' : ''
          }`}
          onMouseEnter={() => setActive(icon.id)}
          onMouseLeave={() => setActive(null)}
        >
          <Image src={icon.src} alt={icon.alt} width={20} height={20} />
        </div>
      ))}
    </div>
  );
}