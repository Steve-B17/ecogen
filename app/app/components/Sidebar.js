"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link"; // Import for navigation
import Home from "../public/assets/icons/home.png";
import Solar from "../public/assets/icons/solarpanel.png";
import Wind from "../public/assets/icons/wind.png";
import Sun from "../public/assets/icons/sun.png";
import Windmill from "../public/assets/icons/windmill.png";
import Blog from "../public/assets/icons/blog.png";

export default function FloatingSidebar() {
  const [active, setActive] = useState(null); // To manage active states of the icons

  const icons = [
    { id: 1, src: Home, alt: "Home", href: "/" },
    { id: 2, src: Solar, alt: "Solar", href: "/solar" },
    { id: 3, src: Wind, alt: "Wind", href: "/wind" },
    { id: 4, src: Sun, alt: "Sun", href: "/sun" },
    { id: 5, src: Windmill, alt: "Windmill", href: "/windmill" },
    { id: 6, src: Blog, alt: "Blog", href: "/forecast" }, // Use actual route for Forecast page
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2">
      {icons.map((icon) => (
        <Link key={icon.id} href={icon.href} passHref>
          <div
            className={`flex items-center justify-center mb-4 p-4 bg-white rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-110 hover:bg-gray-300 cursor-pointer ${
              active === icon.id ? "bg-gray-500 text-white" : ""
            }`}
            onMouseEnter={() => setActive(icon.id)}
            onMouseLeave={() => setActive(null)}
          >
            <Image src={icon.src} alt={icon.alt} width={40} height={40} />
          </div>
        </Link>
      ))}
    </div>
  );
}
