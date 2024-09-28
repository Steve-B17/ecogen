import Image from "next/image";
import Windturbine from "../public/assets/windturbine.png";
import Hero from "../public/assets/hero.png";
import facebook from "../public/assets/facebook.png";
import twitter from "../public/assets/twitter.png";
import phone from "../public/assets/phone.png";
import email from "../public/assets/mail.png";

export default function Home() {
  return (
    <>
      <section className="relative h-lvh">
        {/* The image */}
        <div className="absolute ">
          <Image
            src={Hero}
            alt="Sustainable energy"
            width={1920}
            height={1080}
            quality={100}
          />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Sustainable Future</h1>
            <p className="mt-4 text-lg">
              Embrace clean energy solutions with wind and solar power
            </p>
          </div>
        </div>
      </section>
      <div className="min-h-screen bg-green-100">
        {/* Header Section */}
        <section className="bg-green-200 py-10">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">Project Idea</h1>
            <p className="mt-4">
              • Through Machine Learning, We Accurately Predict Wind And Solar
              Power Generation, Augmented by Forecasts of Wind And Solar
              Radiation.
            </p>
            <p className="mt-2">
              • The Multi-Dimensional Approach Not Only Enhances Accuracy But
              Also Empowers Informed Decision-Making, Leading to Optimized
              Industrial Efficiency.
            </p>
            <p className="mt-2">
              • Our Comprehensive Visualizations Offer Valuable Insights,
              Facilitating The Seamless Integration of Renewable Energy Sources
              Into The Grid.
            </p>
          </div>
        </section>

        {/* Power Section */}
        <section>
          <div className=" w-full h-full justify-center">
            <Image src={Windturbine} alt="Wind Turbine" />
            <div className="absolute inset-0 flex items-center p-5">
              {/* <h2 className="text-white text-4xl font-semibold">
                Power that Doesn't Cost the Earth
              </h2> */}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="bg-green-200 py-10">
          <div className="container mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Our Goals</h3>
            <div className="flex flex-col items-center space-y-4">
              <p className="bg-white p-4 rounded-lg shadow-md w-2/3">
                ✔️ Provide Accurate Forecasts
              </p>
              <p className="bg-white p-4 rounded-lg shadow-md w-2/3">
                ✔️ Enhance Industrial Efficiency
              </p>
              <p className="bg-white p-4 rounded-lg shadow-md w-2/3">
                ✔️ Support Renewable Energy Usage
              </p>
              <p className="bg-white p-4 rounded-lg shadow-md w-2/3">
                ✔️ Improve Decision Making
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-green-100 py-10">
          <div className="container mx-auto text-center">
            <h4 className="text-3xl font-semibold mb-6">Features</h4>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <p className="mt-4 text-xl font-semibold">
                  Comprehensive Graph Prediction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-6">
          <div className="container mx-auto text-center">
            <p className="mb-4">© 2024 Ecogen. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                About Us
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <a href="#">
                <Image src={facebook} alt="Facebook" className="h-6 w-6" />
              </a>
              <a href="#">
                <Image src={twitter} alt="Twitter" className="h-6 w-6" />
              </a>
              <a href="#">
                <Image src={phone} alt="Phone" className="h-6 w-6" />
              </a>
              <a href="#">
                <Image src={email} alt="Email" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
