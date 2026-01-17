// Footer.js
import { motion } from "framer-motion";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <motion.footer
      className="mt-10 bg-[rgb(0,0,122)] text-white py-8 px-4 sm:px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left text-sm">
        {/* JBIS */}
        {/* <div className="space-y-2">
        <h3 className="font-bold text-lg mb-2">Upcoming Event</h3>
        <p className="text-3xl hover:text-[#FFD700] font-bold cursor-pointer transition duration-300">JBIS</p>
         </div> */}


        {/* About Us Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2">About Us</h3>
          <Link to="/">
          <p className="hover:text-[#FFD700] cursor-pointer transition duration-300">JaGedo</p>
          </Link>
          <p className="hover:text-[#FFD700] cursor-pointer transition duration-300">Helpdesk</p>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <p className="hover:text-[#FFD700] cursor-pointer transition duration-300">Terms Of Service</p>
          <p className="hover:text-[#FFD700] cursor-pointer transition duration-300">
            Privacy and Data Protection Policy
          </p>
        </div>

        {/* Contacts Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2">Contacts</h3>
          <p className="text-gray-300 text-sm">+254 113 273 333</p>
          <p>
            <a href="mailto:info@jagedo.co.ke" className="text-[#FFD700] hover:underline transition duration-300 text-sm">
              info@jagedo.co.ke
            </a>
          </p>
        </div>

        {/* Social Media Links */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-3 mt-2">
            {[
              { icon: FaFacebookF, color: "blue-900" },
              { icon: FaXTwitter, color: "blue-900" },
              { icon: FaLinkedinIn, color: "blue-900" },
              { icon: FaInstagram, color: "pink-900" },
              { icon: FaTiktok, color: "gray-900" },
            ].map(({ icon: Icon, color }, index) => (
              <a
                key={index}
                href="#"
                className={`text-base p-2 bg-[rgb(0,0,122)] text-white rounded-full hover:bg-[#FFD700] hover:text-${color} transition duration-300 transform hover:scale-110 shadow`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-500 mt-8 pt-4 text-center text-xs text-gray-300">
        <p>&copy; 2025 JaGedo. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
