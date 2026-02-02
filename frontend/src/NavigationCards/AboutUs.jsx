import React from "react";
import {
  Film,
  Clapperboard,
  Users,
  Globe,
  CheckCircle,
  Star,
  Award,
  Camera,
} from "lucide-react";

import {
  Video,
  User,
  Pen,
  UsersRound,
  Music,
  Mic,
  Zap,
  Lightbulb,
  Palette,
  Shirt,
  Truck,
  MapPin,
  Plane,
  Building,
  Scissors,
  UserCircle,
  Sparkles,
  GraduationCap,
  FileText,
  CreditCard,
} from "lucide-react";

import { motion } from "framer-motion";
import Logo1 from "/src/assets/Logo1.png";
import Navbar from "../Components/Navbar";
import ContactUs from "./ContactUs";

export default function AboutUs() {
  const legends = [
    {
      id: 1,
      name: "Manoj Bajpayee",
      occupation: "Actor",
      dob: "23 April 1969",
      district: "West Champaran",
      img: "https://th-i.thgim.com/public/incoming/n3k61b/article68075789.ece/alternates/FREE_1200/MANOJ-SHHHH.jpg",
      description:
        "Renowned for powerful roles in independent and commercial films.",
      bestWork: "The Family Man",
      imdb: "https://www.imdb.com/name/nm0048075/?ref_=ext_shr_lnk",
    },
    {
      id: 2,
      name: "Pankaj Tripathi",
      occupation: "Actor",
      dob: "5 September 1976",
      district: "Gopalganj",
      img: "https://media.assettype.com/freepressjournal/2022-01/bdc02614-b127-4db2-a440-2f44b9f5f284/Screenshot_2022_01_25_at_5_43_01_AM.png?width=1200",
      description: "Famous for his versatility and natural acting style.",
      bestWork: "Mirzapur",
      imdb: "https://www.imdb.com/name/nm2690647/?ref_=ext_shr_lnk",
    },
    {
      id: 3,
      name: "Prakash Jha",
      occupation: "Producer & Actor",
      dob: "27 February 1952",
      district: "Bettiah, West Champaran",
      img: "https://m.media-amazon.com/images/M/MV5BMTc1NjMwNDE4Ml5BMl5BanBnXkFtZTgwODA1ODA0OTE@._V1_.jpg",
      description:
        "Renowned filmmaker known for his political and socio-political films.",
      bestWork: "Crook",
      imdb: "https://www.imdb.com/name/nm2777281/?ref_=ext_shr_lnk",
    },
    {
      id: 4,
      name: "Shatrughan Sinha",
      occupation: "Actor",
      dob: "15 July 1946",
      district: "Patna",
      img: "https://sm.mashable.com/mashable_in/seo/8/88864/88864_trrd.png",
      description: "Veteran actor and politician, iconic in 70s-80s cinema.",
      bestWork: "Kalicharan",
      imdb: "https://www.imdb.com/name/nm0802374/?ref_=ext_shr_lnk",
    },
    {
      id: 5,
      name: "Sushant Singh Rajput",
      occupation: "Actor",
      dob: "21 January 1986",
      district: "Patna",
      img: "https://i.pinimg.com/736x/40/60/63/406063a5d7bf517313bf00ee5d6ab840.jpg",
      description: "Talented actor known for heartfelt performances.",
      bestWork: "MS Dhoni: The Untold Story",
      imdb: "https://www.imdb.com/name/nm3818286/?ref_=ext_shr_lnk",
    },
    {
      id: 6,
      name: "Neha Sharma",
      occupation: "Actress",
      dob: "21 November 1987",
      district: "Bhagalpur",
      img: "https://akm-img-a-in.tosshub.com/aajtak/images/video/202403/6600096b7e220-will-neha-sharma-contest-elections-from-bihar-240722280-16x9.png",
      description: "Actress and model with presence in films and web series.",
      bestWork: "Crook",
      imdb: "https://www.imdb.com/name/nm2777281/?ref_=ext_shr_lnk",
    },
    {
      id: 7,
      name: "Neetu Chandra",
      occupation: "Actress",
      dob: "20 June 1984",
      district: "Patna",
      img: "https://www.filmibeat.com/wimg/desktop/2019/08/neetu-chandra_10.jpg",
      description:
        "Indian actress known for her roles in Hindi, Tamil, and Telugu cinema. ",
      bestWork: "Garam Masala (2005)",
      imdb: "https://www.imdb.com/name/nm1911617/?ref_=ext_shr_lnk",
    },
    {
      id: 8,
      name: "Vinay Pathak",
      occupation: "Actor",
      dob: "27 July 1968",
      district: "Bhojpur, Bihar ",
      img: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201808/Vinay_Pathak-BAN-08052018.jpeg",
      description:
        "Actor known for comedy roles in Bheja Fry and Khosla Ka Ghosla. ",
      bestWork: "Bheja Fry (2007)",
      imdb: "https://www.imdb.com/name/nm0665555/?ref_=ext_shr_lnk",
    },
    {
      id: 9,
      name: "Imtiaz Ali",
      occupation: "Film Director & Writer",
      dob: "16 June 1971",
      district: "Jamshedpur (then Bihar)",
      img: "https://m.media-amazon.com/images/M/MV5BMTYwOTUwMTk3MF5BMl5BanBnXkFtZTgwMjA1NDEzMTE@._V1_.jpg",
      description:
        "Renowned Indian film director, producer, and writer known for his brilliant work",
      bestWork: "Jab We Met",
      imdb: "https://www.imdb.com/name/nm2777281/?ref_=ext_shr_lnk",
    },
    {
      id: 10,
      name: "Sanjay Mishra",
      occupation: "Actor",
      dob: "6 October 1963",
      district: "Darbhangha",
      img: "https://i.pinimg.com/564x/33/cf/5a/33cf5a9baf45e25e6b8ce5adc89f8b54.jpg",
      description: "Celebrated for comic timing and strong character roles.",
      bestWork: "Ankhon Dekhi",
      imdb: "https://www.imdb.com/name/nm0592799/?ref_=ext_shr_lnk",
    },
    {
      id: 11,
      name: "Arunabh Kumar",
      occupation: "Entrepreneur, Producer, Director, Actor",
      dob: "26 November 1982",
      district: "Muzaffarpur",
      img: "https://www.iwmbuzz.com/wp-content/uploads/2025/06/arunabh-kumar-shares-a-heartfelt-note-on-his-wedding-anniversary-15.jpg",
      description:
        "Founder of TVF, known for web series like 'Permanent Roommates' and 'Pitchers'.",
      bestWork: "TVF Pitchers",
      imdb: "https://www.imdb.com/name/nm2837311/?ref_=ext_shr_lnk",
    },
    {
      id: 12,
      name: "Gurmeet Choudhary",
      occupation: "Actor",
      dob: "22 February 1984",
      district: "Bhagalpur",
      img: "https://www.gethucinema.com/tmdb/eCeElyYgPm1ZvV1NWlBeQbUCp8c.jpg",
      description:
        "TV and film actor popular for mythological and action roles.",
      bestWork: "Khamoshiyan",
      imdb: "https://www.imdb.com/name/nm3073211/?ref_=ext_shr_lnk",
    },
    {
      id: 13,
      name: "Chandan Roy",
      occupation: "Actor",
      dob: "20 December 1995",
      district: "Mahnar (Vaishali district)",
      img: "https://images.filmibeat.com/img/popcorn/profile_photos/chandanroy-20240530112240-60861.jpg",
      description:
        "Known for his warm, authentic portrayal of Vikas Shukla in 'Panchayat'..",
      bestWork: "Panchayat (web series)",
      imdb: "https://www.imdb.com/name/nm0788686/?ref_=ext_shr_lnk",
    },
    {
      id: 14,
      name: "Ashok Yadav",
      occupation: "Actor",
      dob: "3 January 1985",
      district: "Darveshpur, near Siwan",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbBuxF26RW4NAbH3bAhnym5oFJpbXEu4bfpw&s",
      description:
        "Bihari-born actor known for winning hearts as 'Binod' in Panchayat.",
      bestWork: "Panchayat (web series)",
      imdb: "https://www.imdb.com/name/nm9859083/?ref_=ext_shr_lnk",
    },
    {
      id: 15,
      name: "Pankaj Jha",
      occupation: "Actor, Painter, Writer, Director",
      dob: "2 February 1970",
      district: "Saharsa",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh1qXBXYNfRXOj44qO6zQ5A_S8XqZ9tuWDQw&s",
      description:
        "Actor, acclaimed for his grounded portrayal of MLA Chandu Singh in Panchayat",
      bestWork: "Panchayat (web series)",
      imdb: "https://www.imdb.com/name/nm13792834/?ref_=ext_shr_lnk",
    },
    {
      id: 16,
      name: "Durgesh Kumar",
      occupation: "Actor",
      dob: "21 October 1984",
      district: "Darbhanga, Bihar",
      img: "https://static.toiimg.com/thumb/msid-110440378,width-400,resizemode-4/110440378.jpg",
      description: "Actor known for playing Bhushan in Panchayat .",
      bestWork: "Panchayat (web series)",
      imdb: "https://www.imdb.com/name/nm6294201/?ref_=ext_shr_lnk",
    },
    {
      id: 17,
      name: "Bulloo Kumar",
      occupation: "Actor",
      dob: "5 February 1986",
      district: "Nawada",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAtnRcu4PHPQgiqJxR60fwzozDEYf76VJm3w&s",
      description:
        "Actor from Bihar, known for his comical role as Madhav in  Panchayat.",
      bestWork: "Panchayat (web series)",
      imdb: "https://www.imdb.com/name/nm12872303/?ref_=ext_shr_lnk",
    },
    {
      id: 18,
      name: "Ustad Bismillah Khan",
      occupation: "Shehnai Maestro",
      dob: "21 March 1916",
      district: "Dumraon (Buxar)",
      img: "https://akm-img-a-in.tosshub.com/indiatoday/bismillah-khan-647_032116095003.jpg",
      description: "Legendary Shehnai player, Bharat Ratna awardee.",
      bestWork: "Goonj Uthi Shehnai (music)",
      imdb: "https://www.imdb.com/name/nm0451190/?ref_=ext_shr_lnk",
    },
    {
      id: 19,
      name: "Sharda Sinha",
      occupation: "Folk Singer",
      dob: "1 October 1952",
      district: "Samastipur",
      img: "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/11/India-Today_Sharda-Sinha-YIM6937-1-1-scaled.jpg?size=*:900",
      description: "Voice of Bihar's folk heritage, especially during Chhath.",
      bestWork: "Maine Pyar Kiya (singer)",
      imdb: "https://www.imdb.com/name/nm0788686/?ref_=ext_shr_lnk",
    },
    {
      id: 20,
      name: "Maithili Thakur",
      occupation: "Folk/Classic Singer",
      dob: "25 July 2000",
      district: "Madhubani",
      img: "https://c.saavncdn.com/artists/Maithili_Thakur_002_20230227072619_500x500.jpg",
      description: "Young prodigy promoting Indian classical and folk music.",
      bestWork: "Primarily Music Albums",
      imdb: "https://www.imdb.com/name/nm9859083/?ref_=ext_shr_lnk",
    },
    {
      id: 21,
      name: "Chandan Tiwari",
      occupation: "Folk Singer",
      dob: "15 August 1985",
      district: "Patna",
      img: "https://chandantiwari.in/wp-content/uploads/2024/11/PHOTO-2024-03-27-16-07-40-1.jpg",
      description: "Folk singer reviving Bhojpuri and regional traditions.",
      bestWork: "Live Performances & Albums",
      imdb: "https://www.imdb.com/name/nm13792834/?ref_=ext_shr_lnk",
    },
  ];

  const objectives = [
    "Promote Bihar as a vibrant filmmaking hub",
    "Strengthen regional cinema (Bhojpuri, Maithili, Magahi, Angika, Bajjika)",
    "Streamline film permissions through a single-window clearance system",
    "Encourage investment in film infrastructure and skill development",
    "Facilitate a transparent and efficient subsidy framework",
    "Promote Bihar's culture, heritage, traditions and Tourist places",
  ];

  const subsidies = [
    {
      title: "Feature Films",
      desc: "Subsidy ranging from ₹2 crore to ₹4 crore based on shooting days (50% - 75%) and film category (1st, 2nd, or 3rd film).",
      icon: <Film className="w-8 h-8 text-white" />,
    },
    {
      title: "Television Serials / Shows",
      desc: "Subsidy up to ₹50 Lakhs for 45 days of shooting, or up to ₹1 crore for 90 days of shooting in Bihar.",
      icon: <Video className="w-8 h-8 text-white" />,
    },
    {
      title: "Web Series / OTT Content",
      desc: "Subsidy up to ₹2 crore (min 30 days/50%) or ₹3 crore (min 60 days/70%) of shooting in Bihar.",
      icon: <Globe className="w-8 h-8 text-white" />,
    },
    {
      title: "Infrastructure Development",
      desc: "Subsidy up to ₹1.5 crore for Film Cities/Studios, and up to ₹1 crore for equipment/tech setups (25% of investment).",
      icon: <MapPin className="w-8 h-8 text-white" />,
    },
  ];

  const successStories = [
    "Songhatiya (Ugratara Films)",
    "The Long Journey Home (AVARTS Ltd., Mauritius)",
    "Bihar Ka Jalwa (Prabuddh Entertainment)",
    "Life Leela (Aim Apex International – Web Series)",
    "Chatth (Champaran Talkies Pvt. Ltd.)",
    "Pain Brush (Daivarya Media & Entertainment Pvt. Ltd.)",
    "Bihaan (Insight India)",
    "Magadh Putra (Gunjan Singh Entertainment)",
    "Echos of the Absent and Akhri Lesson (Kartina Entertainment & Sports Pvt. Ltd.)",
  ];

  // const eligibleExpenses = [
  //   { id: 1, name: "Lead Actors", icon: <Star className="w-4 h-4" /> },
  //   { id: 2, name: "Producer", icon: <UserCircle className="w-4 h-4" /> },
  //   { id: 3, name: "Director", icon: <Clapperboard className="w-4 h-4" /> },
  //   { id: 4, name: "Supporting Cast", icon: <Users className="w-4 h-4" /> },
  //   { id: 5, name: "Writer", icon: <Pen className="w-4 h-4" /> },
  //   { id: 6, name: "Entourage", icon: <UsersRound className="w-4 h-4" /> },
  //   { id: 7, name: "Extras & Features", icon: <Users className="w-4 h-4" /> },
  //   { id: 8, name: "Direction Dept.", icon: <Video className="w-4 h-4" /> },
  //   { id: 9, name: "Line Producer", icon: <User className="w-4 h-4" /> },
  //   { id: 10, name: "Sync Sound", icon: <Mic className="w-4 h-4" /> },
  //   { id: 11, name: "Art Dept.", icon: <Palette className="w-4 h-4" /> },
  //   { id: 12, name: "Costume Dept.", icon: <Shirt className="w-4 h-4" /> },
  //   { id: 13, name: "Make-up", icon: <Sparkles className="w-4 h-4" /> },
  //   { id: 14, name: "Choreographer", icon: <Music className="w-4 h-4" /> },
  //   { id: 15, name: "Photographer", icon: <Camera className="w-4 h-4" /> },
  //   { id: 16, name: "Camera Hire", icon: <Camera className="w-4 h-4" /> },
  //   { id: 17, name: "Sound Equip.", icon: <Mic className="w-4 h-4" /> },
  //   { id: 18, name: "Light & Grip", icon: <Lightbulb className="w-4 h-4" /> },
  //   { id: 19, name: "Generator", icon: <Zap className="w-4 h-4" /> },
  //   { id: 20, name: "Vehicles", icon: <Truck className="w-4 h-4" /> },
  //   { id: 21, name: "Costume Hire", icon: <Shirt className="w-4 h-4" /> },
  //   { id: 22, name: "Art/Props Hire", icon: <Palette className="w-4 h-4" /> },
  //   { id: 23, name: "Transport", icon: <Truck className="w-4 h-4" /> },
  //   { id: 24, name: "Location", icon: <MapPin className="w-4 h-4" /> },
  //   { id: 25, name: "Travel/Stay", icon: <Plane className="w-4 h-4" /> },
  //   {
  //     id: 26,
  //     name: "Production Office",
  //     icon: <Building className="w-4 h-4" />,
  //   },
  //   { id: 27, name: "Post Production", icon: <Scissors className="w-4 h-4" /> },
  // ];

  const locations = [
    { title: "Barabar Hills", dist: "Jehanabad", img: "/BarabarHills.jpeg" },
    { title: "Gridhakut Hills", dist: "Rajgir", img: "/GridhakutHills.jpg" },
    {
      title: "Valmiki Tiger Reserve",
      dist: "West Champaran",
      img: "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2024/03/09/2681300-valmiki-tiger-reserve.jpg?im=Resize=(1200,900)",
    },
    {
      title: "Sher Shah Suri Tomb",
      dist: "Sasaram",
      img: "/SherShahSuriTomb.jpg",
    },
    {
      title: "Ruins of Vikramshila",
      dist: "Bhagalpur",
      img: "/Ruins of Vikramshila.jpg",
    },
    {
      title: "Tutla Bhawani",
      dist: "Rohtas",
      img: "/TutlaBhawaniWaterfall.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-[#a92b4e] py-24 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative w-full h-[400px]">
            <img
              src="/aboutBanner.png"
              alt="Bihar Banner"
              className="w-full h-full object-cover object-[center_20%] z-50 grayscale"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#a92b4e]/90" />

            <div className="relative z-10">{/* content */}</div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="py-10">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-6 tracking-tight leading-tight">
              Bihar: The Emerging Powerhouse of Indian Cinema
            </h1>
            <p className="text-md md:text-xl font-light text-yellow-100 max-w-4xl mx-auto">
              A land of rich heritage, iconic legends, and untold stories
              waiting to be captured.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Legends Section */}
        <div className="text-center space-y-8 px-4 md:px-10 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-[#891737]">
            Legends from Bihar
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Bihar has been home to some of the most iconic personalities who
            have shaped Indian film history.
          </p>

          <div className="relative w-full py-6">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10  pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10  pointer-events-none"></div>

            <motion.div
              className="flex space-x-8 md:space-x-12 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 60,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...legends, ...legends].map((legend, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center space-y-3 w-32 md:w-40 flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group-hover:border-[#a92b4e] group-hover:scale-105 transition-all duration-300">
                    <img
                      src={legend.img}
                      alt={legend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 group-hover:text-[#a92b4e] transition-colors">
                      {legend.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {legend.occupation}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* BSFDFC Section - Professional & Distinct */}
        <div className="bg-gradient-to-br px-10 from-gray-50 to-white rounded-3xl p-10 md:p-16 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a92b4e]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              BSFDFC: Nurturing Bihar’s Cinematic Legacy
            </h2>
            <p className="text-gray-600 leading-relaxed text-xl mb-6">
              The Bihar State Film Development & Finance Corporation Ltd.
              (BSFDFC) continues to strengthen this legacy by promoting film
              culture and incentivizing regional cinema. Through landmark
              initiatives such as the Bihar Film Conclave, the Corporation
              provides a dynamic platform for national and international
              filmmakers.
            </p>
            <p className="text-gray-600 leading-relaxed text-xl">
              By fostering a creative and supportive ecosystem, BSFDFC is
              redefining Bihar’s cinematic identity — encouraging filmmakers to
              discover the state’s untold narratives, while simultaneously
              empowering local talent and technicians.
            </p>
          </div>
        </div>

        {/* Mission & Vision - Side by side, no icons */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="bg-white p-5 rounded-2xl shadow-md flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#a92b4e] mb-2">
                Our Vision
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                To transform Bihar into a prominent film destination, utilizing
                the power of cinema for cultural preservation and public
                awareness.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white p-5 rounded-2xl shadow-md flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#a92b4e] mb-2">
                Our Mission
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                To foster excellence in cinema, promote the diversity of Indian
                culture, and facilitate a hassle-free filmmaking experience in
                Bihar.
              </p>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Key Objectives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="p-2 bg-[#a92b4e]/10 rounded-full shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#a92b4e]" />
                </div>
                <p className="text-gray-700 font-medium">{obj}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subsidy Structure */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Subsidy Structure & Incentives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsidies.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className="w-14 h-14 bg-[#a92b4e] rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories & Regional Cinema */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Left big card */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(169,43,78,0.28),_transparent_60%)]" />
            <div className="relative flex h-full flex-col p-7 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-[#190108]">
                    <Star className="h-5 w-5 text-[#190108]" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      Implementation Success
                    </h2>
                  </div>
                </div>
              </div>

              <p className="mb-5 text-xs leading-relaxed text-gray-300">
                Since the introduction of the Bihar Film Policy, several
                national and international filmmakers have chosen Bihar for its
                authentic landscapes.
              </p>

              <div className="space-y-3 text-sm text-gray-300 overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
                {successStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/0 px-3 py-2.5 transition-all duration-200 hover:border-[#a92b4e]/40 hover:bg-white/5"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#a92b4e]/80 group-hover:bg-[#a92b4e]" />
                    <p className="leading-snug">{story}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(169,43,78,0.28),_transparent_60%)]" />
            <div className="relative flex h-full flex-col p-7 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-[#190108]">
                    <Star className="h-5 w-5 text-[#190108]" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      Eligible Expenses
                    </h2>
                  </div>
                </div>
              </div>

              <p className="mb-5 text-xs leading-relaxed text-gray-300">
                According to Bihar Film Promotion Policy–2024, the following
                expense categories are considered eligible within the total
                project cost.
              </p>

              <div className="space-y-3 text-sm text-gray-300 overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
                {eligibleExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/0 px-3 py-2.5 transition-all duration-200 hover:border-[#a92b4e]/40 hover:bg-white/5"
                  >
                    <span className="flex items-center justify-center p-1.5 rounded-full bg-[#a92b4e]/20 text-[#a92b4e] group-hover:bg-[#a92b4e] group-hover:text-white transition-colors duration-200">
                      {expense.icon}
                    </span>
                    <p className="leading-snug">{expense.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Top-right card */}
          <div className="md:col-span-2 rounded-3xl border border-[#a92b4e]/25 bg-[#ffff]/5 p-6 md:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a92b4e]/50 hover:bg-[#a92b4e]/10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-[#a92b4e]">
                Regional Cinema Hub
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              Bihar has become a hub for regional filmmaking, in most of the
              languages of Bihar and the films showing culture, heritage,
              traditions and beautiful tourist places are being shot across
              various districts, involving local talent and dialects.
            </p>
          </div>

          {/* Bottom-right card */}
          <div className="md:col-span-2 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a92b4e]/30 hover:bg-white">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-[#a92b4e]">
                Documentary Films
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              Documentary productions highlighting the state’s art, culture, and
              development narrative inspiring filmmakers to explore Bihar's
              untold stories of its heritage, traditions and tourist places
              through a realistic lens.
            </p>
          </div>
          {/* Bottom-right card */}
        </div>
      </div>
      <ContactUs />
    </div>
  );
}
