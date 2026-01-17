import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-12">
      <div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Us */}
          <div className="animate-fade-in-up">
            <h3 className="font-semibold text-lg mb-4 text-[#00a63e]">About Us</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">JaGedo</span>
            </div>
            <p className="text-gray-400 mb-4">Connecting customers with trusted service professionals across Kenya.</p>
            <Link to="/helpdesk" className="text-gray-400 hover:text-[#00a63e] transition-colors duration-300 block">
              Helpdesk
            </Link>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold text-lg mb-4 text-[#00a63e]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-400 hover:text-[#00a63e] transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-[#00a63e] transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Privacy and Data Protection Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#how-it-works"
                  className="text-gray-400 hover:text-[#00a63e] transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="#signup"
                  className="text-gray-400 hover:text-[#00a63e] transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="font-semibold text-lg mb-4 text-[#00a63e]">Contacts</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Phone className="h-4 w-4 text-[#00a63e]" />
                <a href="tel:+254113273333" className="hover:text-[#00a63e]">
                  +254 113 273 333
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="h-4 w-4 text-[#00a63e]" />
                <a href="mailto:info@jagedo.co.ke" className="hover:text-[#00a63e]">
                  info@jagedo.co.ke
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="animate-fade-in-up animation-delay-600">
            <h3 className="font-semibold text-lg mb-4 text-[#00a63e]">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00a63e] transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00a63e] transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00a63e] transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00a63e] transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in">
          <p>© 2025 JaGedo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
