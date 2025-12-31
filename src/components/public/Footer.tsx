import React from "react";

export default function Footer() {
  return (
    <section className="bg-[#021034] text-white py-8 px-24">
      <div className="w-full text-white py-16">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">[Your Brand Name]</h2>
            <p className="text-sm text-gray-400">
              Smart Institute Management Platform
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm cursor-pointer">
                f
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm cursor-pointer">
                📸
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm cursor-pointer">
                🐦
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm cursor-pointer">
                in
              </div>
            </div>
          </div>
          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-medium">Support</h3>
            <p className="text-sm text-gray-400 cursor-pointer">Help Center</p>
            <p className="text-sm text-gray-400 cursor-pointer">
              Documentation
            </p>
            <p className="text-sm text-gray-400 cursor-pointer">
              Onboarding & Training
            </p>
            <p className="text-sm text-gray-400 cursor-pointer">
              System Status
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-medium">Product</h3>
            <p className="text-sm text-gray-400 cursor-pointer">Features</p>
            <p className="text-sm text-gray-400 cursor-pointer">Solutions</p>
            <p className="text-sm text-gray-400 cursor-pointer">Pricing</p>

            <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <span>Demo</span>
              <span className="px-2 py-0.5 text-xs border border-gray-500 rounded-full">
                New
              </span>
            </div>

            <p className="text-sm text-gray-400 cursor-pointer">FAQs</p>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-medium">Company</h3>
            <p className="text-sm text-gray-400 cursor-pointer">About Us</p>
            <p className="text-sm text-gray-400 cursor-pointer">Careers</p>
            <p className="text-sm text-gray-400 cursor-pointer">Contact Us</p>
            <p className="text-sm text-gray-400 cursor-pointer">
              Privacy Policy
            </p>
            <p className="text-sm text-gray-400 cursor-pointer">
              Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
