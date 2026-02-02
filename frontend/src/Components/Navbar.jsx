import React, { useState, useEffect } from "react";
import Logo1 from "/src/assets/Logo1.png";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDocumentsDropdownOpen, setIsDocumentsDropdownOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isPolicyDropdownOpen, setIsPolicyDropdownOpen] = useState(false);
  const [isImpactDropdownOpen, setIsImpactDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToElementSmoothly = (element, duration = 1200) => {
    const start = window.pageYOffset;
    const end = element.getBoundingClientRect().top + start;
    const distance = end - start;
    let startTime = null;

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = easeInOutQuad(progress);

      window.scrollTo(0, start + distance * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleLocationClick = (id) => {
    if (id === "notice" || id === "documents" || id === "home") return;

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const section = document.getElementById(id);
      if (section) {
        scrollToElementSmoothly(section, 2200);
      }
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleApplyClick = () => {
    if (location.pathname !== "/apply-noc") {
      navigate("/login");
    } else {
      const formSection = document.getElementById("FilmPolicy");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setShowNavbar(true), 1000);

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      if (currentScrollPos === 0) {
        setNavbarVisible(true);
        setHasScrolled(false);
      } else {
        setNavbarVisible(isScrollingUp);
        setHasScrolled(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // 🔒 Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [{ id: "Vr", label: "VR" }];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-500 ${
        showNavbar ? "opacity-100" : "opacity-0"
      } ${navbarVisible ? "transform-none" : "-translate-y-full"} group`}
    >
      <div
        className={`px-4 sm:px-6 lg:px-16 py-2 md:py-3 relative transition-colors duration-300 ${
          navbarVisible && hasScrolled ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-100 z-0 pointer-events-none transition-opacity duration-300"></div>

        <div className="flex justify-between items-center relative z-10">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleHomeClick}
          >
            <img src={Logo1} alt="logo" className="h-14 w-20 md:h-16 md:w-24" />
          </div>

          {/* Desktop Menu */}
          <ul
            className={`hidden md:flex items-center gap-10 text-lg relative z-10 transition-colors duration-300 ${
              navbarVisible && hasScrolled ? "text-black" : "text-white"
            } group-hover:text-black`}
          >
            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onClick={handleHomeClick}
            >
              Home
            </li>

            {/* Home Dropdown */}
            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onMouseEnter={() => setIsHomeDropdownOpen(true)}
              onMouseLeave={() => setIsHomeDropdownOpen(false)}
            >
              About Us <ChevronDown size={16} className="ml-1" />
              {isHomeDropdownOpen && (
                <ul className="absolute top-full left-0 w-40 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  <li
                    onClick={() => {
                      navigate("/about-us");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    BSFDFC Profile
                  </li>
                  <li
                    onClick={() => handleLocationClick("GoverningBody")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Board of Directors
                  </li>
                  <li
                    onClick={() => handleLocationClick("GoverningBody")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Organization structure
                  </li>

                  <li
                    onClick={() => {
                      navigate("/contact-bsfdfc");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Contact Us
                  </li>
                  <li
                    onClick={() => {
                      navigate("/gallery");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Gallery
                  </li>
                </ul>
              )}
            </li>

            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleLocationClick(item.id)}
                className="cursor-pointer hover:text-red-600 font-semibold transition"
              >
                {item.label}
              </li>
            ))}

            {/* Policy Dropdown */}
            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onMouseEnter={() => setIsPolicyDropdownOpen(true)}
              onMouseLeave={() => setIsPolicyDropdownOpen(false)}
            >
              Policy & Forms
              <ChevronDown size={16} className="ml-1" />
              {isPolicyDropdownOpen && (
                <ul className="absolute top-full left-0 w-56 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  <li
                    onClick={() => {
                      navigate("/document/film-policy");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Film Policy
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-600">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSddl9uk7rqu-_fl6N4U_vgYXlrL_pwUTQaY5Mm8AqjB4NRSYQ/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full h-full"
                    >
                      Producer Registration Form
                    </a>
                  </li>
                  <li
                    onClick={() => {
                      navigate("/document/op-guidelines");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Operational Guidelines
                  </li>
                  <li
                    onClick={() => {
                      navigate("/howToShootingPermission");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    How to Apply for Shooting Permission
                  </li>
                  <li
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = "/moa.pdf";
                      link.download = "moa.pdf";
                      link.click();
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    MOA
                  </li>
                </ul>
              )}
            </li>

            {/* Impact Dropdown */}
            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onMouseEnter={() => setIsImpactDropdownOpen(true)}
              onMouseLeave={() => setIsImpactDropdownOpen(false)}
            >
              Impact <ChevronDown size={16} className="ml-1" />
              {isImpactDropdownOpen && (
                <ul className="absolute top-full left-0 w-56 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  <li
                    onClick={() => {
                      navigate("/shooting-in-bihar");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Shooting in Bihar
                  </li>
                  <li
                    onClick={() => {
                      navigate("/scholarship");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Scholarship
                  </li>
                </ul>
              )}
            </li>

            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onClick={() => {
                navigate("/ShootingLocation");
                setIsMobileMenuOpen(false);
              }}
            >
              Shooting Location
            </li>

            {/* Documents Dropdown */}
            <li
              className="relative cursor-pointer hover:text-red-600 font-semibold transition flex items-center"
              onMouseEnter={() => setIsDocumentsDropdownOpen(true)}
              onMouseLeave={() => setIsDocumentsDropdownOpen(false)}
            >
              Documents <ChevronDown size={16} className="ml-1" />
              {isDocumentsDropdownOpen && (
                <ul className="absolute top-full left-0 w-56 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  <li
                    onClick={() => {
                      navigate("/notification");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Notification
                  </li>
                  <li
                    onClick={() => {
                      navigate("/tender");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Tender
                  </li>
                  <li
                    onClick={() => {
                      navigate("/document/bihar-baiscope");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Bihar Bioscope
                  </li>
                  <li
                    onClick={() => {
                      navigate("/document/goa-film-brochure");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Goa Film Brochure
                  </li>
                  <li
                    onClick={() => {
                      navigate("/document/promotion-policy");
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-red-600"
                  >
                    Promotion Policy
                  </li>
                </ul>
              )}
            </li>

            <li
              onClick={handleApplyClick}
              className="flex items-center gap-1 cursor-pointer hover:text-red-600 font-semibold transition"
            >
              Register
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </li>
          </ul>

          {/* Mobile Toggle */}
          <div className="md:hidden relative z-[60]">
            {!isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                  navbarVisible && hasScrolled ? "text-black" : "text-white"
                }`}
              >
                <Menu size={28} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen bg-black text-white p-6 z-[40] shadow-xl overflow-y-auto overscroll-contain transform transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-5 right-5 text-white hover:text-red-500"
          >
            <X size={32} />
          </button>

          <ul className="flex flex-col gap-6 mt-16 text-lg font-semibold">
            {/* Home Section */}
            <li className="text-gray-300 border-b border-gray-700 pb-1">
              Home
            </li>
            <ul className="ml-4 flex flex-col gap-3">
              <li
                onClick={handleHomeClick}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Main
              </li>
              <li
                onClick={() => {
                  navigate("/about-us");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                About Us
              </li>
              <li
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Vision
              </li>
              <li
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Mission
              </li>
              <li
                onClick={() => {
                  handleLocationClick("GoverningBody");
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Team
              </li>
            </ul>

            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleLocationClick(item.id)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                {item.label}
              </li>
            ))}

            {/* Policy Section (mobile, now matches desktop) */}
            <li className="mt-2 text-gray-300 border-b border-gray-700 pb-1">
              Policy &amp; Forms
            </li>
            <ul className="ml-4 flex flex-col gap-3">
              <li
                onClick={() => {
                  navigate("/document/film-policy");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Film Policy
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSddl9uk7rqu-_fl6N4U_vgYXlrL_pwUTQaY5Mm8AqjB4NRSYQ/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="cursor-pointer hover:text-red-500 transition-colors block"
                >
                  Producer Registration Form
                </a>
              </li>
              <li
                onClick={() => {
                  navigate("/document/op-guidelines");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Operational Guidelines
              </li>
              <li
                onClick={() => {
                  navigate("/howToShootingPermission");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                How to Apply for Shooting Permission
              </li>

              <li
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/moa.pdf";
                  link.download = "moa.pdf";
                  link.click();
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                MOA
              </li>
            </ul>

            {/* Impact Section */}
            <li className="mt-2 text-gray-300 border-b border-gray-700 pb-1">
              Impact
            </li>
            <ul className="ml-4 flex flex-col gap-3">
              <li
                onClick={() => {
                  navigate("/shooting-in-bihar");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Shooting in Bihar
              </li>
              <li
                onClick={() => {
                  navigate("/scholarship");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Scholarship
              </li>
            </ul>

            <li
              onClick={() => {
                navigate("/ShootingLocation");
                setIsMobileMenuOpen(false);
              }}
              className="cursor-pointer hover:text-red-500 transition-colors"
            >
              Shooting Location
            </li>

            {/* Documents Section (mobile, now matches desktop) */}
            <li className="mt-2 text-gray-300 border-b border-gray-700 pb-1">
              Documents
            </li>
            <ul className="ml-4 flex flex-col gap-3">
              <li
                onClick={() => {
                  navigate("/notification");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Notification
              </li>
              <li
                onClick={() => {
                  navigate("/tender");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Tender
              </li>
              <li
                onClick={() => {
                  navigate("/document/bihar-baiscope");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Bihar Bioscope
              </li>
              <li
                onClick={() => {
                  navigate("/document/goa-film-brochure");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Goa Film Brochure
              </li>
              <li
                onClick={() => {
                  navigate("/document/promotion-policy");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                Promotion Policy
              </li>
            </ul>

            <li
              onClick={handleApplyClick}
              className="cursor-pointer hover:text-red-500 transition-colors mt-4"
            >
              Login
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
