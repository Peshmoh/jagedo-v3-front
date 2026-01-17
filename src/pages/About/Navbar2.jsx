import { useEffect, useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Story", subItems: null },
  // { name: "Core Values", subItems: null },
  { name: "OurTeam", subItems: null },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [setOpenSubMenu] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMobileMenu(false);
        setOpenSubMenu(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowMobileMenu(false);
        setOpenSubMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowMobileMenu(false);
    setOpenSubMenu(null);
  };

  return (
    <header
      className={`fixed w-full z-40 bg-white/90 backdrop-blur-sm transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-0.5 px-4 md:px-12 lg:px-16">


        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-4 ml-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() =>
                item.name === "Home"
                  ? navigate("/")
                  : handleScroll(item.name.replace(/\s+/g, ""))
              }
              className="px-4 py-2 text-sm font-medium text-blue-900 border-b-2 border-transparent hover:border-blue-900 hover:text-yellow-500 transition duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          ref={buttonRef}
          className="md:hidden p-2 bg-white rounded-lg shadow-sm"
          aria-label="Open menu"
          aria-expanded={showMobileMenu}
        >
          <img src={assets.menu_bar} alt="Menu icon" className="w-8" />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-50 md:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={menuRef}
            className="bg-white w-full shadow-lg transform transition-transform translate-x-0 p-4"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
                className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <img src={assets.cross_icon} alt="Close menu" className="w-6" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="mt-6">
              <ul className="flex flex-col gap-4 text-gray-800 font-medium">
                {NAV_ITEMS.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() =>
                        item.name === "Home"
                          ? navigate("/")
                          : handleScroll(item.name.replace(/\s+/g, ""))
                      }
                      className="w-full block text-center bg-[rgb(0,0,122)] text-white py-3 px-6 rounded-full shadow-md hover:scale-105 hover:bg-[#FFD700] hover:text-black transition duration-300 ease-in-out"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
