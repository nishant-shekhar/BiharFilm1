import React, { useState } from "react";
import "../App.css";

const topImages = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FOfficers%2FACS%20Industry.jpeg?alt=media&token=48a4ed7a-4f70-4113-b59b-de5ecb9aa6c3",
    alt: "Leader 1",
    name: "Shri Mihir Kumar Singh, IAS",
    namee: "Director-cum-Chairman, BSFDFC",
    nameee: "(Development Commissioner, Government of Bihar)",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2Fhome_secy.jpeg?alt=media&token=2f9b010e-0fed-4627-949d-a4779308a995",
    alt: "Leader 2",
    name: "Shri Pranav Kumar, IAS",
    namee: "Managing Director, BSFDFC",
    nameee: "Secretary (Art, Culture & Youth Department)",
  },
];

const boardMembers = [
  {
    name: "Shri Mihir Kumar Singh, IAS",
    role: "Development Commissioner, Govt. of Bihar, & Director-cum-Chairman, Bihar State Film Development and Finance Corporation Limited",
    img: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FOfficers%2FACS%20Industry.jpeg?alt=media&token=48a4ed7a-4f70-4113-b59b-de5ecb9aa6c3",
  },
  {
    name: "Shri Pranav Kumar, IAS",
    role: "Secretary, Art, Culture and Youth Department, Govt. of Bihar & Managing Director, Bihar State Film Development and Finance Corporation Limited",
    img: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2Fhome_secy.jpeg?alt=media&token=2f9b010e-0fed-4627-949d-a4779308a995",
  },
  {
    name: "Shri Kundan Kumar, IAS",
    role: "Secretary, Department of Industries, Govt. of Bihar & Nominee Director, Bihar State Film Development and Finance Corporation Limited",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkiPticRwETbwqYFSc-9QSq31XbbnW7pzyxw&s",
  },
  {
    name: "Shri Anupam Kumar, IAS",
    role: "Secretary, Information and Public Relations Department, Govt. of Bihar & Nominee Director, Bihar State Film Development and Finance Corporation Limited",
    img: "https://www.witnessinthecorridors.com/ImgNewsPolitical/240306161437635.png",
  },

  {
    name: "Shri Mukesh Kumar Lal, IAAS",
    role: "Special Secretary, Department of Finance, Govt. of Bihar & Nominee Director, Bihar State Film Development and Finance Corporation Limited",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEYTm34Dhbakb6IOciOhFU0pL_hU2xe6PCjA&s",
  },
];

const bodyMembers = [
  {
    img: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2Fgeneral_manger.jpeg?alt=media&token=d2df1145-cfd1-466b-ad41-2436c2692255",
    name: "Smt. Ruby, IAS",
    role: "General Manager, BSFDFC",
    description: "",
  },
  {
    img: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2Farvind-ranjan-das.jpeg?alt=media&token=3c9c7c30-d276-4d65-aacc-bbe00bc4ca9a",
    name: "Shri Arvind Ranjan Das",
    role: "Consultant(Film)",
    description: "0612-2219213",
  },
  {
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "V.D.Mishra",
    role: "Consultant (Fin. & Account)",
    description: "7482075777",
  },

  {
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "Sonika Kumari",
    role: "Assistant Section Officer",
    description: "",
  },
  {
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "Kumar Gaurav",
    role: "Junior Consultant (Communication and Networking)",
    description: "",
  },
  {
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "Leela Kumari Prasad",
    role: "Data Entry Operator",
    description: "",
  },
  {
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "Amit Ranjan",
    role: "Data Entry Operator",
    description: "",
  },
];

const nodalOfficers = [
  {
    name: "Sri Ujjwal Kumar",
    role: "ADM Disaster Mgmt (Araria)",
    contact: "9470701828",
    email: "arariaddmo@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Mr. Om Prakash Kumar",
    role: "ADM (Arwal)",
    contact: "9473191477",
    email: "adm-arwal-bih@nic.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Lalit Bhushan Shanu",
    role: "ADM & District Public Grievance Officer (Aurangabad)",
    contact: "9473191262",
    email: "adm.rev.aurangabad@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Smt. Pratibha Kumari",
    role: "ADM, Departmental Enquiry (Banka)",
    contact: "8544423663",
    email: "admpgrobanka@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Rajesh Kumar Singh",
    role: "ADM (Begusarai)",
    contact: "9473191413",
    email: "adm.beg.bih@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Manas Kumar Jha",
    role: "ADM (Bhojpur)",
    contact: "9473191235",
    email: "adm.bhojpur29@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Smt. Kumari Anupam Singh",
    role: "ADM & District Public Grievance Officer (Buxar)",
    contact: "9473191240",
    email: "admbxr@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Paritosh Kumar",
    role: "ADM (Gaya)",
    contact: "9473191245",
    email: "adm.rev.gaya@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Ashish Kumar Sinha",
    role: "ADM (Gopalganj)",
    contact: "9473191279",
    email: "adm.gopalganj@bihar.gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Subhash Chandra Mandal",
    role: "ADM (Jamui)",
    contact: "9473191405",
    email: "adm.rev.jamui@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Paritosh Kumar Singh",
    role: "District Public Grievance Officer (Jehanabad)",
    contact: "8873969356",
    email: "dpgrojeh@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Saurabh Suman Yadav",
    role: "ADM (Katihar)",
    contact: "9473191376",
    email: "adm.rev.katihar@gmil.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Smt. Aarti Kumari",
    role: "ADM (Khagaria)",
    contact: "9473191421",
    email: "adm.rev.khagaria@gmil.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Anuj Kumar Bharti",
    role: "ADM & PGRO (Kishanganj)",
    contact: "9473191372",
    email: "districtrevenuekne@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Arun Kumar Singh",
    role: "ADM & PGRO (Madhepura)",
    contact: "9473191354",
    email: "adm.madhepura-bih@gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Shailesh Kumar",
    role: "ADM & PGRO (Madhubani)",
    contact: "9473191325",
    email: "adm.rev.madhubani@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Manas Kumar",
    role: "ADM (Munger)",
    contact: "9473191392",
    email: "admmunger.bih@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Manji Kumar",
    role: "ADM (Nalanda)",
    contact: "9473191215",
    email: "ac-nalanda-bih@gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Chandrashekhar Azad",
    role: "ADM & PGRO (Nawada)",
    contact: "9473191257",
    email: "adm.rev.nawada@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Ravi Rakesh",
    role: "ADM (Purnia)",
    contact: "9473191359",
    email: "adm.rev.purnia@gamil.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Chandrashekhar Prasad Singh",
    role: "ADM & PGRO (Rohtas)",
    contact: "9473191222",
    email: "adm.rev.rohtas@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Ajay Kumar Tiwari",
    role: "ADM (Samastipur)",
    contact: "9473191333",
    email: "adm-samastipur-bih@gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Shambhu Sharan Pandey",
    role: "ADM (Saran)",
    contact: "9473191268",
    email: "admchapra@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Sanjay Kumar",
    role: "ADM (Sheikhpura)",
    contact: "7004622556",
    email: "adm-she-bih@nic.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Krishna Kumar",
    role: "In-charge ADM (Sheohar)",
    contact: "9473191492",
    email: "adm-rev-shr-bih@gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Sandeep Kumar",
    role: "District Public Grievance Officer (Sitamarhi)",
    contact: "9473191289",
    email: "edcgensit@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Raushan Kumar Singh",
    role: "ADM & PGRO (Vaishali)",
    contact: "9473191311",
    email: "adm.rev.vaishali@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Javed Ahsan",
    role: "ADM (Siwan)",
    contact: "9473191274",
    email: "siwanadm@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Rasheed Nayeem",
    role: "ADM (Supaul)",
    contact: "9473191346",
    email: "adm.rev.supaul-bih@gov.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Amresh Kumar Amar",
    role: "District Revenue Officer (Kaimur)",
    contact: "9473191228",
    email: "adm.rev.bhabhua@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri K.K. Singh",
    role: "ADM (Law & Order) & PGRO (Patna)",
    contact: "6205801411",
    email: "khageshjhabas@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Sudhanshu Shekhar",
    role: "ADM & District Revenue Officer (Lakhisarai)",
    contact: "9473191398",
    email: "adm.rev.lakhisarai@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Rajeev Kumar Singh",
    role: "ADM (West Champaran)",
    contact: "9473191295",
    email: "adm-bettiah-bih@nic.in",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Mahadev Kumar",
    role: "ADM Disaster Mgmt (Bhagalpur)",
    contact: "7903620279",
    email: "sdc.aapda.bgp@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Salim Kumar Jha",
    role: "ADM & PGRO (Darbhanga)",
    contact: "9473191318",
    email: "admdbg@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Jyoti Kumar",
    role: "PGRO & ADM (Saharsa)",
    contact: "9473191341",
    email: "adm.rev.saharsa@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Sri Manas Kumar",
    role: "ADM Disaster Mgmt (Muzaffarpur)",
    contact: "9771564176",
    email: "dism.muz@gmail.com",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
];

const districtOfficers = [
  {
    district: "Bhagalpur",
    officer: "ANKIT RANJAN",
    designation: "District Art & Culture Officer",
    contact: "9431020456",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Araria",
    officer: "SANIYAL KUMAR",
    designation: "District Art & Culture Officer",
    contact: "8434553767",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Aurangabad",
    officer: "KUMAR PAPPU RAJ",
    designation: "District Art & Culture Officer",
    contact: "7488153690",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Begusarai",
    officer: "SHYAM KUMAR SAHANI",
    designation: "District Art & Culture Officer",
    contact: "9582088060",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Bhojpur",
    officer: "ANUPRIYA",
    designation: "District Art & Culture Officer",
    contact: "7004260621",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Gaya",
    officer: "SURBHI BALA",
    designation: "District Art & Culture Officer",
    contact: "8252347604",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Gopalganj",
    officer: "CHANDRAMAULI KUMAR",
    designation: "District Art & Culture Officer",
    contact: "7982579634",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Katihar",
    officer: "KUMARI RINA GUPTA",
    designation: "District Art & Culture Officer",
    contact: "7906809506",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Sitamarhi",
    officer: "GHANSHYAM KUMAR",
    designation: "District Art & Culture Officer",
    contact: "9123437298",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Kishanganj",
    officer: "PRAHALAD KUMAR",
    designation: "District Art & Culture Officer",
    contact: "8409401938",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Madhepura",
    officer: "AMRAPALI KUMARI",
    designation: "District Art & Culture Officer",
    contact: "9334819118",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Munger",
    officer: "SUKANYA",
    designation: "District Art & Culture Officer",
    contact: "7584953429",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Nawada",
    officer: "PRATIBHA KUMARI",
    designation: "District Art & Culture Officer",
    contact: "9123168934",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Patna",
    officer: "KIRTY AALOK",
    designation: "District Art & Culture Officer",
    contact: "9576656757",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Rohtas",
    officer: "PANKAJ KUMAR",
    designation: "District Art & Culture Officer",
    contact: "8709664245",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Samastipur",
    officer: "JUHI KUMARI",
    designation: "District Art & Culture Officer",
    contact: "8448369635",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Saran",
    officer: "VIBHA BHARTI",
    designation: "District Art & Culture Officer",
    contact: "9031291904",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Sheikhpura",
    officer: "SUJEET KUMAR SUMAN",
    designation: "District Art & Culture Officer",
    contact: "9110090570",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Vaishali",
    officer: "SHALINI SHARMA",
    designation: "District Art & Culture Officer",
    contact: "9504437983",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "West Champaran",
    officer: "RAKESH KUMAR",
    designation: "District Art & Culture Officer",
    contact: "8972595783",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Muzaffarpur",
    officer: "SUSHMITA KUMARI",
    designation: "District Art & Culture Officer",
    contact: "7091172375",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Jehanabad",
    officer: "CHANDANI KUMARI",
    designation: "District Art & Culture Officer",
    contact: "9142416449",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Lakhisarai",
    officer: "MRINAL RANJAN",
    designation: "District Art & Culture Officer",
    contact: "9852836524",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Purnea",
    officer: "PANKAJ PATEL",
    designation: "District Art & Culture Officer",
    contact: "7985487243",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Siwan",
    officer: "RICHA VERMA",
    designation: "District Art & Culture Officer",
    contact: "9450100910",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Jamui",
    officer: "VIKESH KUMAR",
    designation: "District Art & Culture Officer",
    contact: "9973720710",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Banka",
    officer: "PRITY KUMARI",
    designation: "District Art & Culture Officer",
    contact: "7979911553",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Arwal",
    officer: "SUNAINA KUMARI",
    designation: "District Art & Culture Officer",
    contact: "8271163637",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Buxar",
    officer: "PRATIMA KUMARI",
    designation: "District Art & Culture Officer",
    contact: "7970629396",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Supaul",
    officer: "TARKESHWAR PATEL",
    designation: "District Art & Culture Officer",
    contact: "8092281780",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Kaimur",
    officer: "SUMAN SAURAV",
    designation: "District Art & Culture Officer",
    contact: "7677515231",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Darbhanga",
    officer: "CHANDAN KUMAR",
    designation: "District Art & Culture Officer",
    contact: "9315822497",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Nalanda",
    officer: "SHALINI PRAKASH",
    designation: "District Art & Culture Officer",
    contact: "8982773558",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Madhubani",
    officer: "NITISH KUMAR",
    designation: "District Art & Culture Officer",
    contact: "9958601845",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "Saharsa",
    officer: "SNEHA KUMARI",
    designation: "District Art & Culture Officer",
    contact: "7549717814",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    district: "East Champaran",
    officer: "FAHAD SIDDIQUI",
    designation: "District Art & Culture Officer",
    contact: "9660688737",
    img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
];

const MemberRow = ({ img, name, role, description }) => (
  <div className="grid grid-cols-[60px_1fr_1fr_1fr] items-center px-6 sm:px-10 lg:px-16 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <p className="text-gray-800 font-medium truncate pr-4">{name}</p>
    <p className="text-gray-500 text-sm pr-4">{role}</p>
    <p className="text-gray-600 text-sm truncate">{description}</p>
  </div>
);

const MobileMemberCard = ({ img, name, role, description }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-start gap-4">
    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <div>
      <p className="text-gray-900 font-semibold">{name}</p>
      <p className="text-gray-600 text-sm">{role}</p>
      {description && (
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      )}
    </div>
  </div>
);

const GoverningComponent = () => {
  const [activeTab, setActiveTab] = useState("board");

  const tabs = [
    { id: "board", label: "Board of Directors" },
    { id: "management", label: "Management" },
    { id: "nodal", label: "Nodal Officers" },
    { id: "districts", label: "District Art and Culture Officers" },
  ];

  return (
    <div
      className="px-4 sm:px-6 lg:px-20 pt-10 pb-20 bg-[#190108] w-full rounded-tl-4xl rounded-tr-4xl -mt-10 relative z-10 overflow-x-hidden"
      id="GoverningBody"
    >
      {/* Title */}
      <p className="text-white text-3xl sm:text-4xl md:text-7xl lg:text-8xl bebas-neue-regular pb-12 text-center sm:text-left sm:pl-12">
        Organizational Structure
      </p>

      {/* Top Leaders */}
      <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-12">
        {topImages.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center max-w-[240px]"
          >
            <div className="bg-white w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg hover:scale-105 transition">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-white text-base sm:text-lg font-semibold">
              {item.name}
            </p>
            <p className="text-zinc-400 text-sm">{item.namee}</p>
            {item.nameee && (
              <p className="text-zinc-400 text-sm">{item.nameee}</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#4f0419] text-white shadow-lg scale-105"
                : "bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {activeTab === "board" &&
              boardMembers.map((member, index) => (
                <MemberRow
                  key={index}
                  img={member.img}
                  name={member.name}
                  role={member.role}
                  description=""
                />
              ))}
            {activeTab === "management" &&
              bodyMembers.map((member, index) => (
                <MemberRow
                  key={index}
                  img={member.img}
                  name={member.name}
                  role={member.role}
                  description={member.description}
                />
              ))}
            {activeTab === "nodal" &&
              nodalOfficers.map((member, index) => (
                <MemberRow
                  key={index}
                  img={member.img}
                  name={member.name}
                  role={member.role}
                  description={`${member.contact} | ${member.email}`}
                />
              ))}
            {activeTab === "districts" &&
              districtOfficers.map((member, index) => (
                <MemberRow
                  key={index}
                  img={member.img}
                  name={member.officer}
                  role={`${member.designation}, ${member.district}`}
                  description={member.contact}
                />
              ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden space-y-6">
          {activeTab === "board" &&
            boardMembers.map((member, index) => (
              <MobileMemberCard
                key={index}
                img={member.img}
                name={member.name}
                role={member.role}
                description=""
              />
            ))}
          {activeTab === "management" &&
            bodyMembers.map((member, index) => (
              <MobileMemberCard
                key={index}
                img={member.img}
                name={member.name}
                role={member.role}
                description={member.description}
              />
            ))}
          {activeTab === "nodal" &&
            nodalOfficers.map((member, index) => (
              <MobileMemberCard
                key={index}
                img={member.img}
                name={member.name}
                role={member.role}
                description={`${member.contact} | ${member.email}`}
              />
            ))}
          {activeTab === "districts" &&
            districtOfficers.map((member, index) => (
              <MobileMemberCard
                key={index}
                img={member.img}
                name={member.officer}
                role={`${member.designation}, ${member.district}`}
                description={member.contact}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GoverningComponent;
