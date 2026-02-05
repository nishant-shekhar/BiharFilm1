import React from 'react';
import { CiMail, CiLocationOn, CiPhone } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import ContactUs from "./ContactUs";

const ContactBSFDFC = () => {
    return (
        <div className="min-h-screen bg-[#190108] font-sans py-10">
            <Navbar />
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Contact Details */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#891737] mb-6">Get in Touch</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We are here to assist you with any queries related to film shooting, subsidies, and permissions in Bihar. Feel free to reach out to us through any of the following channels.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Address */}
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-[#a92b4e]/10 rounded-full flex items-center justify-center text-[#a92b4e] shrink-0">
                                    <CiLocationOn className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Office Address</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Bihar State Film Development & Finance Corporation Ltd.<br />
                                        Vikas Bhawan, New Secretariat,<br />
                                        Patna - 800015, Bihar, India
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-[#a92b4e]/10 rounded-full flex items-center justify-center text-[#a92b4e] shrink-0">
                                    <CiPhone className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        0612-2219213
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-[#a92b4e]/10 rounded-full flex items-center justify-center text-[#a92b4e] shrink-0">
                                    <CiMail className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Address</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        biharfilmnigam@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Map */}
                    <div className="h-full min-h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.873634876543!2d85.11351767604604!3d25.60560951491176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5822abfea4b3%3A0x294c847495e62f9d!2sVikas%20Bhawan%2C%20New%20Secretariat!5e0!3m2!1sen!2sin!4v1716888888888!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>

                </div>

                {/* <div className="py-10 rounde">
                    <div id='details' className='bg-white rounded-2xl'>
                        <div className="flex flex-col md:flex-row justify-center py-10 gap-8 md:gap-16">
                            {[
                                {
                                    src: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2FDr.-Siddharth-Pic-1.jpeg?alt=media&token=94a2aea8-df19-467d-8a12-504c6cab5f98",
                                    alt: "Leader 1",
                                    name: "Shri Dr S Siddharth",
                                    namee: "Director-cum-Chairman, BSFDFC",
                                    nameee: "(Development Commissioner, Goverment of Bihar)",
                                },
                                {
                                    src: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/biharfilm%2Fhome_secy.jpeg?alt=media&token=2f9b010e-0fed-4627-949d-a4779308a995",
                                    alt: "Leader 2",
                                    name: "Sri Pranav Kumar, IAS",
                                    namee: "Managing Director",
                                    nameee: "Secretary (Art & Culture Department)",
                                },
                            ].map((leader, index) => (
                                <div key={index} className="relative group w-full md:w-[450px]">
                                    <div className="absolute inset-0 bg-[#420415] rounded-3xl bg-opacity-25 group-hover:bg-opacity-50 transition duration-500"></div>
                                    <div className="relative  backdrop-blur-md border rounded-3xl p-6 flex items-center gap-6 hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#a92b4e]/50 shadow-lg shrink-0">
                                            <img
                                                src={leader.src}
                                                alt={leader.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                                            <p className="text-[#a92b4e] font-semibold text-sm mb-1">{leader.namee}</p>
                                            <p className="text-gray-400 text-xs leading-tight">{leader.nameee}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
            </div>

            <ContactUs />
        </div>
    );
};

export default ContactBSFDFC;
