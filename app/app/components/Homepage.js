"use client";
import Image from "next/image";
import Logo from "../public/assets/logo.png";
import Hero from "../public/assets/hero.png";
import project from "../public/assets/project.png";
import Carousel from "./Carousel.js";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Goal from "../public/assets/carousel/two.jpg";
import { useState, useEffect } from "react";

const goals = [
  "Provide Accurate Forecasts",
  "Enhance Industrial Efficiency",
  "Support Renewable Energy Usage",
  "Improve Decision Making",
];

export default function Homepage() {
  // Hooks should be inside the component
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5 z-20">
          <div className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Eco-Gen Forecasts Logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold text-white">Eco-Gen Forecasts</h1>
          </div>
          <button className="bg-teal-500 text-white text-2xl space-x-2 py-2 px-9 rounded-lg hover:bg-green-600">
            Contact Us
          </button>
        </header>
        <div className="relative">
          <Image
            src={Hero}
            alt="Renewable Energy"
            layout="responsive"
            className="object-cover"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white p-6 max-w-lg text-center">
            <h2 className="text-5xl font-bold mb-4">
              Predicting the Future of Energy Today!!!
            </h2>
            <p className="text-lg">
              Empower power generation with precise forecasts. Unlock renewable
              energy's potential with our innovative tech.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-green-300 to-green-100 py-10 px-4 lg:px-20">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row items-center lg:space-x-8 space-y-8 lg:space-y-0 transition-transform duration-300 transform hover:scale-105">
          {/* Left Column - Image */}
          <div className="flex justify-center items-center">
            <Image
              src={project}
              alt="Eco-Friendly Energy"
              width={900}
              height={900}
              className="rounded-lg border border-green-300 shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right Column - Project Idea Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-green-700 mb-6">
              Project Idea
            </h2>
            <ul className="space-y-4 text-lg leading-relaxed text-gray-700">
              <li className="transition-colors duration-300 hover:text-green-600">
                • Through Machine Learning, We Accurately Predict Wind And Solar
                Power Generation, Augmented By Forecasts Of Wind And Solar
                Radiation.
              </li>
              <li className="transition-colors duration-300 hover:text-green-600">
                • This Multi-Dimensional Approach Not Only Enhances Accuracy But
                Also Empowers Informed Decision-Making, Leading To Optimized
                Industrial Efficiency.
              </li>
              <li className="transition-colors duration-300 hover:text-green-600">
                • Our Comprehensive Visualizations Offer Valuable Insights,
                Facilitating The Seamless Integration Of Renewable Energy
                Sources Into The Grid.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200">
        <section className="py-12 px-4 md:px-16">
          <h1
            className={`text-center text-4xl font-bold mb-8 transition-all duration-500 ease-in-out ${
              isScrolled ? "text-blue-800 scale-110" : "text-gray-900"
            }`}
          >
            Features
          </h1>

          {/* Carousel Section */}
          <div className="relative group max-w-7xl mx-auto">
            <div className="w-full h-[500px] md:h-[700px] overflow-hidden">
              {" "}
              {/* Removed Scrollbars */}
              <Carousel />
            </div>

            {/* Optional: Add controls if your carousel doesn't have them */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-200"
              aria-label="Previous Slide"
            >
              ❮
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-200"
              aria-label="Next Slide"
            >
              ❯
            </button>
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            {/* Goals List */}
            <div>
              <ul className="space-y-6">
                {goals.map((goal, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-semibold text-gray-700">
                      {goal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <div className="bg-green-200 p-6 rounded-lg shadow-lg">
                <Image
                  src={Goal} // Replace this with your own image
                  alt="Renewable Energy"
                  width={1000}
                  height={1000}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
