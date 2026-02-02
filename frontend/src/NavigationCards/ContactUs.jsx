import React from "react";
import { CiMail } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa6";
import Logo1 from "/src/assets/Logo1.png";
// your cinema doodles image
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLinkClick = (path, id) => {
    if (path) {
      navigate(path);
    } else if (id) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: id } });
      } else {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    window.scrollTo(0, 0);
  };

  return (
    <footer
      className="relative overflow-hidden bg-[#190108] text-gray-100 border-t border-[#190108]"
      id="about"
    >
      {/* Low-opacity cinema doodles background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-3 bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(${"/doodles.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Main content wrapper to sit above background */}
      <div className="relative">
        {/* Top section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-12 space-y-8 lg:space-y-0">
            {/* About */}
            <div className="lg:w-1/3">
              <h3 className="text-2xl font-bold mb-4">About BSFDFC</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                The Bihar State Film Development & Finance Corporation Ltd.
                (BSFDFC) promotes film culture and incentivizes regional cinema.
                Through landmark initiatives, it provides a dynamic platform for
                national and international filmmakers, redefining Bihar’s
                cinematic identity.
              </p>
            </div>

            {/* Links */}
            <div className="lg:w-1/3 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: "Home", path: "/" },
                    { label: "About Us", path: "/about-us" },
                    { label: "VR Experience", path: "/vrpage" },
                    { label: "Film Policy", path: "/document/film-policy" },
                    { label: "Shooting Location", path: "/ShootingLocation" },
                  ].map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="hover:text-red-300 transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Documents</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: "Notification", path: "/notification" },
                    { label: "Tender", path: "/tender" },
                    {
                      label: "Bihar Bioscope",
                      path: "/document/bihar-baiscop",
                    },
                    {
                      label: "Promotion Policy",
                      path: "/document/promotion-policy",
                    },
                    // { label: "Privacy Policy", path: "/privacy-policy" }
                  ].map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="hover:text-red-300 transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="lg:w-1/3">
              <h3 className="text-xl font-bold mb-2">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a className="">
                    The Bihar State Film Development & Finance Corporation Ltd.
                  </a>
                  <br />
                  <span>
                    Morisson Building, Near Golghar <br />
                    Patna-800001, Bihar, India
                  </span>
                </li>
                <li className="flex items-center gap-2"></li>
                <li className="flex items-center gap-2">
                  <CiMail className="text-lg" />
                  <span>biharfilmnigam@gmail.com</span>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="https://maps.app.goo.gl/fyEtuxLv422Kz8s2A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
                  >
                    <FaLocationArrow />
                    <span>Get Location</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Bottom row */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
            <div className="w-full md:w-1/3 flex flex-col items-start">
              <img
                src={Logo1}
                alt="Logo"
                className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              />
            </div>

            <div className="w-full md:w-2/3">
              <h4 className="text-lg font-semibold mb-3">Follow us</h4>
              <div className="flex space-x-4 text-2xl">
                <a
                  href="https://www.facebook.com/BSFDFCL/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/artcultureyouth?igsh=YWI1aG9rNGOyaTZy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://x.com/bfilmnigam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.youtube.com/@ArtCultureYouth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-400 transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
