import Image from "next/image";
import facebook from "../public/assets/facebook.png";
import twitter from "../public/assets/twitter.png";
import phone from "../public/assets/phone.png";
import email from "../public/assets/mail.png";

export default function Footer() {
    return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-start">
        {/* Left Section - Links */}
        <div className="flex flex-col space-y-4">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About us
          </a>
          <a href="#" className="hover:underline">
            FAQ
          </a>
          <a href="#" className="hover:underline">
            Terms and conditions
          </a>
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
        </div>

        {/* Right Section - Social Links */}
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-xl font-semibold">Get In Touch</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:opacity-80">
              <Image
                src={email}
                alt="Email"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src={phone}
                alt="Phone"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src={facebook}
                alt="Facebook"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src={twitter}
                alt="X (Twitter)"
                width={40}
                height={40}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-gray-400">
        <p>&copy; 2024 ecogen-forecasts Inc.</p>
      </div>
    </footer>
  );
}
