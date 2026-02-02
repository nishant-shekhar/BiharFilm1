import React from "react";
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";

// Components
import VideoSection from "./Components/VideoSection";
import Vr from "./NavigationCards/Vr";
import Cinemaecosystem from "./NavigationCards/Cinemaecosystem";
import FilmClubUI from "./NavigationCards/FilmClub";
import ContactUs from "./NavigationCards/ContactUs";
import GoverningComponent from "./NavigationCards/GoverningBody";
import FilemPolicyPage from "./NavigationCards/FilmPolicy";
import Actors from "./NavigationCards/Actors";
// import ButtonNOC from "./NavigationCards/NOCbutton";
import LoginPage from "./Components/Login";
import SignupPage from "./Components/Signup";
import ShootingPermissionForm from "./NavigationCards/ShootingPermissionFoam";
import DashboardMM from "./Dashboard/DashboardMM";
import LocationDetail from "./NavigationCards/LocationDetail";
import DasboardUser from "./Dashboard/DashboardUser";

// import DistrictList from "./Dashboard/DistrictList"
import CineSamvad from "./NavigationCards/pages/CineSamvad";
import Chatarpatar from "./NavigationCards/pages/Chatarpatar";
import CoffeeWithFilm from "./NavigationCards/pages/CoffeeWithFilm";
// import Notice from "./NavigationCards/Notice";
import ShootingLocationPage from "./NavigationCards/ShootingLocationPage";
import ArtistForm from "../src/Dashboard/AddArtistForm";
import VendorForm from "../src/Dashboard/VendorForm";

import Notification from "./NavigationCards/Notification";
import Tender from "./NavigationCards/Tender";
import Vrpage from "./NavigationCards/pages/Vrpage";
import ProtectedRoute from './Components/ProtectedRoute';;
import MainDash from "./DistrictDahboard/MainDash";
import VendorRegistrationForm from "./Components/VendorRegistrationForm";

import Artist from "./Dashboard/Artist";
import PrivacyPolicy from "./NavigationCards/PrivacyPolicy";
import AboutUs from "./NavigationCards/AboutUs";
import PDFViewerPage from "./NavigationCards/PDFViewerPage";
import NOCGuideProcess from "./Components/NOCGuideProcess";
import ShootingInBihar from "./NavigationCards/ShootingInBihar";
import ScholarshipAndExpenses from "./NavigationCards/ScholarshipAndExpenses";
import ContactBSFDFC from "./NavigationCards/ContactBSFDFC";
import Gallery from "./NavigationCards/Gallery";
import HowToApplyShootingPermission from "./NavigationCards/HowToApplyShootingPermission";
// Home Page
function Home() {
  const location = useLocation();

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <VideoSection />
      <Vr />
      <FilmClubUI />
      <Actors />
      <Cinemaecosystem />
      <GoverningComponent />
      <FilemPolicyPage />
      <ContactUs />

    </>
  );
}




export default function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* <Route path="/FilmClubUI" element={<FilmClubUI />} /> */}
      <Route path="/location/:category/:id" element={<LocationDetail />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/apply-noc" element={<ShootingPermissionForm />} />

      {/* Protected Route for main Admin for their dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/dashboard" element={<DashboardMM />} />
      </Route>
      <Route path="/ShootingLocation" element={<ShootingLocationPage />} />

      {/* Protected Routes for Filmmaker, Artist, Vendor */}
       <Route
        element={
          <ProtectedRoute allowedRoles={["filmmaker", "artist", "vendor"]} />
        }
      >
        <Route path="/dashboard-user" element={<DasboardUser />} />
      </Route>

      <Route path="/register-artist" element={<ArtistForm />} />
      <Route path="/register-vendor" element={<VendorForm />} />


      <Route path="/filmclub/cine-samvad" element={<CineSamvad />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/tender" element={<Tender />} />

<Route path="/filmclub/cineactivities" element={<Chatarpatar />} />
      <Route path="/filmclub/coffee-with-film" element={<CoffeeWithFilm />} />

      <Route path="/vrpage" element={<Vrpage />} />

      <Route path="artist" element={<Artist />} />

      {/* Protected Route for District Admin for their dashboard */}
      <Route
        path="/MainDash"
        element={
          <ProtectedRoute allowedRoles={['district_admin']}>
            <MainDash />
          </ProtectedRoute>
        }
      />

      <Route path="vendor-registration" element={<VendorRegistrationForm />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/document/:docId" element={<PDFViewerPage />} />
      <Route path="/NOCguide" element={<NOCGuideProcess />} />
      <Route path="/shooting-in-bihar" element={<ShootingInBihar />} />
      <Route path="/scholarship" element={<ScholarshipAndExpenses />} />
      <Route path="/contact-bsfdfc" element={<ContactBSFDFC />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/howToShootingPermission" element={<HowToApplyShootingPermission />} />

      <Route path="*" element={<navigate to="/" replace />} />

    </Routes>
  );
}
