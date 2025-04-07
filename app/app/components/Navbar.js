"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import Home from "../public/assets/icons/home.png";
import Wind from "../public/assets/icons/wind.png";
import Windmill from "../public/assets/icons/windmill.png";
import Blog from "../public/assets/icons/blog.png";
import Logo from "../public/assets/logo.png";
import WindSpeed from "../public/assets/icons/wind.png";

export default function NavigationBar() {
  const [active, setActive] = useState(null);

  // Use string paths instead of component references
  const icons = [
    { id: 1, src: Home, alt: "Home", href: "/" },
    { id: 2, src: Wind, alt: "Wind Power", href: "/windpower" },
    { id: 3, src: Windmill, alt: "Wind Direction", href: "/winddirection" },
    { id: 4, src: WindSpeed, alt: "Wind Speed", href: "/windspeed" },
    { id: 5, alt: "Dashboard", href: "/dashboard", isSvg: true },
    { id: 6, src: Blog, alt: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-5 left-1/2 w-[80%] h-fit rounded-lg bg-gradient-to-r from-white to-green-100 shadow-md z-20 transform -translate-x-1/2">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Eco-Gen Forecasts Logo"
              width={70}
              height={70}
            />
            <h1 className="text-3xl font-bold text-black">Eco-Gen Forecasts</h1>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-6">
            {icons.map((icon) => (
              <Link key={icon.id} href={icon.href} passHref>
                <div
                  className="relative"
                  onMouseEnter={() => setActive(icon.id)}
                  onMouseLeave={() => setActive(null)}
                >
                  <div
                    className={`flex items-center justify-center p-3 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out hover:scale-110 hover:bg-gray-100 ${
                      active === icon.id ? "bg-green-500" : ""
                    }`}
                  >
                    {icon.isSvg ? (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        width="28"
                        height="28"
                        className="text-gray-700"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    ) : (
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={28}
                        height={28}
                      />
                    )}
                  </div>

                  {/* Tooltip */}
                  {active === icon.id && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-800 text-white px-3 py-1 rounded whitespace-nowrap">
                      {icon.alt}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
