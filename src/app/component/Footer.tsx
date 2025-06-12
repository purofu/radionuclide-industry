import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#000000] text-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-8">
          {/* London Address */}
          <div className="col-span-4 md:col-span-2 lg:col-span-3">
            <h3 className="text-h5 font-medium mb-4">London</h3>
            <address className="text-body-small not-italic">
              402 Botanical Court<br />
              E1 3FU<br /><br />
              United Kingdom
            </address>
          </div>

          {/* New Jersey Address */}
          <div className="col-span-4 md:col-span-2 lg:col-span-3">
            <h3 className="text-h5 font-medium mb-4">New Jersey</h3>
            <address className="text-body-small not-italic">
              111 Town Square Pl Ste<br />
              Jersey City, NJ<br /><br />
              USA
            </address>
          </div>

          {/* Logo and Company Info */}
          <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col items-start md:items-end">
            <div className="mb-4">
 

<Image
  src="/logo.svg"
  alt="Brand logo"
  width={120}          // pick whatever width you want
  height={40}          // correct height for the SVG
  style={{ height: "auto" }}   // <‑‑ key line
/>
            </div>
            <p className="text-body-small mb-4">Firm Design LLC</p>
            <p className="text-body-small mb-6">A New Jersey Limited Liability Company</p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://www.linkedin.com/company/firm-inc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-grey transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 