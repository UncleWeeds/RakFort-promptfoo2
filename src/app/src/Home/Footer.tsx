import React from 'react';
import Logo from '../assets/logo-3.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-100 dark:bg-[#271243] text-indigo-900 dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start gap-4">
          {/* Logo */}
          <div className="w-40 h-auto flex justify-center md:justify-start">
            <img src={Logo} alt="Rakfort Logo" className="object-contain w-full" />
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-indigo-500 dark:text-indigo-300 hover:text-purple-700 dark:hover:text-yellow-400 transition" aria-label="LinkedIn">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="#" className="text-indigo-500 dark:text-indigo-300 hover:text-purple-700 dark:hover:text-yellow-400 transition" aria-label="GitHub">
              <GitHubIcon fontSize="large" />
            </a>
          </div>
        </div>

        {/* Middle Section - Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
          {/* Company */}
          <div>
            <h6 className="flex items-center font-bold text-purple-700 dark:text-yellow-400 mb-3 tracking-wide uppercase">
              <svg className="w-5 h-5 mr-2 text-purple-400 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m0 0V5a1 1 0 011-1h3a1 1 0 011 1v4m-5 0V5a1 1 0 00-1-1H7a1 1 0 00-1 1v4m5 0v10"></path>
              </svg>
              Company
            </h6>
            <ul className="text-indigo-800 dark:text-gray-300 space-y-1">
              <li><a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">About</a></li>
              <li><a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Blog</a></li>
              <li><a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Press</a></li>
              <li><a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Contact</a></li>
              <li><a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Careers</a></li>
              <li>
                <a href="#" className="hover:text-yellow-500 dark:hover:text-yellow-300 text-sm font-semibold transition-all border-b border-transparent hover:border-yellow-400">
                  Log in
                  <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-purple-600 dark:bg-yellow-500 text-white rounded">New</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Product */}
          <div>
            <h6 className="flex items-center font-bold text-indigo-700 dark:text-yellow-400 mb-3 tracking-wide uppercase">
              <svg className="w-5 h-5 mr-2 text-indigo-400 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m-7 6v-6a4 4 0 014-4h3"></path>
              </svg>
              Product
            </h6>
            <ul className="text-indigo-800 dark:text-gray-300 space-y-1">
              <li><a href="#" className="hover:text-indigo-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Red Teaming</a></li>
              <li><a href="#" className="hover:text-indigo-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Evaluations</a></li>
              <li><a href="#" className="hover:text-indigo-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Guard Rails</a></li>
              <li><a href="#" className="hover:text-indigo-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Model Security</a></li>
              <li><a href="#" className="hover:text-indigo-700 dark:hover:text-yellow-400 text-sm transition-all border-b border-transparent hover:border-indigo-400">Enterprise</a></li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-yellow-300 text-sm font-semibold transition-all border-b border-transparent hover:border-green-400">
                  Status
                  <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-green-600 dark:bg-yellow-500 text-white rounded">Live</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between items-center md:items-start border-t md:border-t-0 md:border-l border-indigo-200 dark:border-indigo-800 pt-8 md:pt-0 md:pl-8">
          <div>
            <p className="text-indigo-700 dark:text-gray-300 text-sm mb-4 text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-purple-700 dark:text-yellow-400">RAKFORT</span>
              <br />
              All rights reserved.
            </p>
            <ul className="text-indigo-700 dark:text-gray-300 space-y-1">
              <li>
                <a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm flex items-center transition-all">
                  <svg className="w-4 h-4 mr-2 text-indigo-400 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm flex items-center transition-all">
                  <svg className="w-4 h-4 mr-2 text-indigo-400 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0"></path>
                  </svg>
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-700 dark:hover:text-yellow-400 text-sm flex items-center transition-all">
                  <svg className="w-4 h-4 mr-2 text-indigo-400 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
