import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 font-grotesk">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        {/* Brand Name */}
       <a href="#"> <h2 className="text-white text-2xl font-semibold">TOV Fashion</h2></a>

        {/* Description */}
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Discover premium fashion crafted with quality, style, and comfort.
          Designed to elevate your everyday wardrobe.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 text-xl mt-2">
          <a href="#" className="hover:text-white transition">
            <img
              src="/assets/facebook.png"
              alt="Facebook"
              className="w-6 h-6 p-1 bg-white rounded-full"
            />
          </a>
          <a href="#" className="hover:text-white transition">
            <img
              src="/assets/instagram (1).png"
              alt="Instagram"
              className="w-6 h-6 p-1 bg-white rounded-full"
            />
          </a>
          <a href="#" className="hover:text-white transition">
            <img
              src="/assets/twitter.png"
              alt="Twitter"
              className="w-6 h-6 p-1 bg-white rounded-full"
            />
          </a>
          <a href="#" className="hover:text-white transition">
            <img
              src="/assets/youtube (1).png"
              alt="YouTube"
              className="w-6 h-6 p-1 bg-white rounded-full"
            />
          </a>
        </div>

        {/* Bottom Text */}
        <p className="text-gray-500 text-xs mt-4">© 2025 TOV Fashion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
