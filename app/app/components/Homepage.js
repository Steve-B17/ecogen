import Image from "next/image";
import Logo from "../public/assets/logo.png";
import Hero from "../public/assets/hero.png";

export default function Homepage() {
  return (
    <>
    <div className="relative">
      <header className="flex justify-between items-center ">
        <div className="flex items-center space-x-2 p-5 ">
          <Image
            src={Logo}
            alt="Eco-Gen Forecasts Logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-bold">Eco-Gen Forecasts</h1>
        </div>
        <button className="bg-teal-500 text-white text-2xl space-x-2 py-2 px-4 rounded-lg hover:bg-green-600">
          Contact Us
        </button>
      </header>
      </div>

      <div className="flex flex-row">
        <Image
          src={Hero}
          alt="Renewable Energy"
          objectFit="object-cover"
          layout="fill"
          className="h-full w-full xl:rounded-lg"
        />
        <div className="relative z-10 text-white p-6 max-w-lg">
          <h2 className="text-4xl font-bold mb-4">
            Predicting the Future of Energy Today!!!
          </h2>
          <p className="text-lg">
            Empower power generation with precise forecasts. Unlock renewable
            energy's potential with our innovative tech.
          </p>
        </div>
      </div>
      </>
  );
}
