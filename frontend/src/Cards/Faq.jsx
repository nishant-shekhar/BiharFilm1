import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";

const faqData = [
  {
    question:
      "बिहार में फिल्म की शूटिंग की अनुमति प्राप्त करने के लिए क्या करना चाहिए?",
    answer: (
      <>
        बिहार राज्य में फिल्म, वेब सीरीज़, डॉक्यूमेंट्री या किसी भी प्रकार के
        ऑडियो-विज़ुअल प्रोजेक्ट की शूटिंग करने के लिए संबंधित
        प्रोड्यूसर/प्रोडक्शन हाउस को बिहार सरकार से{" "}
        <strong>No Objection Certificate (NOC)</strong> प्राप्त करना आवश्यक होता
        है। इसके लिए बिहार सरकार के फिल्म पोर्टल{" "}
        <strong>film.bihar.gov.in</strong> पर जाकर आवेदक को{" "}
        <strong>“Producer”</strong> के रूप में पंजीकरण करना होता है।
        <br />
        <br />
        पंजीकरण पूर्ण होने के पश्चात आवेदक अपने यूज़र आईडी एवं पासवर्ड के माध्यम
        से पोर्टल पर लॉगिन कर सकता है। लॉगिन करने के बाद आवेदक को सर्वप्रथम{" "}
        <strong>Producer Registration Form</strong> भरना अनिवार्य होता है,
        जिसमें प्रोड्यूसर तथा प्रोडक्शन हाउस से संबंधित आवश्यक विवरण दर्ज किए
        जाते हैं। यह फॉर्म सफलतापूर्वक पूर्ण करने के उपरांत आवेदक को अपने
        डैशबोर्ड पर उपलब्ध <strong>“Apply NOC”</strong> विकल्प पर क्लिक कर फिल्म
        शूटिंग के लिए अनुमति हेतु आवेदन करना होता है।
        <br />
        <br />
        NOC आवेदन प्रक्रिया के अंतर्गत आवेदक को निर्धारित प्रारूपों में आवश्यक
        जानकारी भरनी होती है, जिसमें विशेष रूप से निम्नलिखित शामिल हैं:
        <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
          <li>
            <strong>Annexure-1</strong>
          </li>
          <li>
            <strong>Annexure-2</strong>
          </li>
          <li>
            <strong>Annexure-A</strong> (यहाँ यह ध्यान रखना आवश्यक है कि
            Annexure-A{" "}
            <em>
              उस प्रत्येक जिले के लिए अलग-अलग भरना होता है जहाँ प्रस्तावित फिल्म
              की शूटिंग की जानी है
            </em>
            )
          </li>
        </ul>
        इन प्रपत्रों को सावधानीपूर्वक भरने के पश्चात आवेदक को आवश्यक दस्तावेज़
        पोर्टल पर अपलोड करने होते हैं।
        <br />
        <br />
        आवेदन के साथ <strong>Undertaking</strong> अपलोड करना भी अनिवार्य होता
        है, जिसमें प्रोड्यूसर द्वारा यह घोषित किया जाता है कि फिल्म निर्माण से
        संबंधित सभी नियमों, शर्तों तथा राज्य सरकार द्वारा निर्धारित
        दिशा-निर्देशों का पालन किया जाएगा।
        <br />
        <br />
        जब सभी आवश्यक जानकारी सही प्रकार से भर दी जाती है तथा सभी अपेक्षित
        दस्तावेज़ सफलतापूर्वक अपलोड कर दिए जाते हैं, तब आवेदक पोर्टल के माध्यम
        से अपना आवेदन सबमिट कर सकता है। आवेदन सबमिट होने के बाद संबंधित
        प्राधिकरण द्वारा उसकी समीक्षा की जाती है और सभी विवरण संतोषजनक पाए जाने
        पर फिल्म शूटिंग के लिए <strong>NOC जारी की जाती है</strong>।
      </>
    ),
  },
  {
    question: "अभिनेता या गायक के रूप में निबंधन कैसे किया जा सकता है?",
    answer:
      "अभिनेता या गायक के रूप में निबंधन के लिए film.bihar.gov.in पर जाएं और 'Sign Up' पर क्लिक करें। रोल चयन में 'Performer' चुनें, अपना पूरा नाम, ईमेल और पासवर्ड भरें। रजिस्ट्रेशन के बाद लॉगिन करें और अपने डैशबोर्ड में प्रोफ़ाइल पूरा करें। Performer के अंतर्गत Acting, Music, Dance, Writing, Cinematography, Sound Design, Editing, Art Direction, Makeup/Hair, Costume Design, VFX आदि विशेषज्ञताओं में से अपनी प्रोफ़ेशन चुन सकते हैं और अपना पोर्टफ़ोलियो बना सकते हैं।",
  },
  {
    question: "प्रोड्यूसर के रूप में निबंधन कैसे किया जा सकता है?",
    answer:
      "प्रोड्यूसर के रूप में निबंधन के लिए film.bihar.gov.in पर जाएं, 'Sign Up' पर क्लिक करें और रोल में 'Producer' चुनें। अपना नाम, ईमेल और एक मजबूत पासवर्ड (8+ अक्षर, अपरकेस, लोअरकेस, नंबर और स्पेशल कैरेक्टर) दर्ज करें। रजिस्ट्रेशन के बाद लॉगिन करें — आपका डैशबोर्ड खुलेगा जहाँ से आप NOC के लिए आवेदन कर सकते हैं, शूटिंग परमिट का प्रबंधन कर सकते हैं और सब्सिडी संबंधी कार्य कर सकते हैं।",
  },
  {
    question:
      "फिल्म निर्देशक तथा अन्य तकनीशियन के रूप में निबंधन कैसे किया जा सकता है?",
    answer:
      "फिल्म निर्देशक, सिनेमेटोग्राफर, एडिटर, साउंड डिज़ाइनर आदि तकनीशियनों के लिए film.bihar.gov.in पर 'Performer' रोल के अंतर्गत रजिस्टर करें। Sign Up में अपना नाम, ईमेल और पासवर्ड भरें। लॉगिन के बाद डैशबोर्ड में अपनी प्रोफ़ाइल में Directing, Cinematography, Editing, Sound Design, Art Direction, VFX जैसी विशेषज्ञता चुनें और अपना पोर्टफ़ोलियो अपलोड करें ताकि फ़िल्ममेकर्स आपसे जुड़ सकें।",
  },
  {
    question:
      "फिल्म निर्माण हेतु किसी भी सामग्री के वेंडर के रूप में निबंधन कैसे किया जा सकता है?",
    answer:
      "वेंडर के रूप में निबंधन के लिए film.bihar.gov.in पर 'Sign Up' करें और रोल में 'Vendor' चुनें। रजिस्ट्रेशन के बाद लॉगिन करें और अपनी सेवाएं दर्ज करें। वेंडर कैटेगरी में Studios, Editing, Animation, Costumes, Props, Catering, Equipment, Hospitality, Transport, Security, Logistics और Travel शामिल हैं। अपनी प्रोफ़ाइल पूरी करने पर प्रोडक्शन टीमें आपकी सेवाओं को खोज सकेंगी।",
  },
  {
    question: "बिहार में फिल्म की शूटिंग संबंधी जानकारी कहाँ मिल सकती है?",
    answer:
      "बिहार में फिल्म शूटिंग से संबंधित सभी जानकारी film.bihar.gov.in पोर्टल पर उपलब्ध है। वेबसाइट पर 'Shooting Location' सेक्शन में बिहार की विभिन्न शूटिंग लोकेशन्स श्रेणीवार देखी जा सकती हैं। 'Shooting in Bihar' पेज पर बिहार में शूट हुई 30+ फिल्मों (भोजपुरी, हिंदी, मगही, मैथिली) की सूची उपलब्ध है। शूटिंग परमिशन की पूरी प्रक्रिया, आवश्यक दस्तावेज़ और Operational Guidelines भी पोर्टल पर डाउनलोड किए जा सकते हैं। अधिक जानकारी के लिए biharfilmnigam@gmail.com पर संपर्क करें।",
  },
  {
    question:
      "बिहार में फिल्म निर्माण करने पर अनुदान संबंधी जानकारी कैसे प्राप्त होगी?",
    answer:
      "बिहार फिल्म प्रमोशन पॉलिसी 2024 के अंतर्गत फ़ीचर फ़िल्म निर्माण पर अनुदान का प्रावधान है। अनुदान प्राप्त करने के लिए पोर्टल पर Producer के रूप में रजिस्टर करें, NOC प्राप्त करें और शूटिंग पूर्ण करें। शूटिंग के बाद Annexure-5 पर Nodal Officer (ADM) और DM से हस्ताक्षर करवाएं — यह सब्सिडी के लिए अनिवार्य है। प्रत्येक शूटिंग दिवस से एक दिन पहले जिला कला एवं संस्कृति अधिकारी को सूचित करना आवश्यक है। विस्तृत जानकारी के लिए पोर्टल पर Operational Guidelines डाउनलोड करें या BSFDFC कार्यालय, Morrison Building, गोलघर के पास, पटना-800001 से संपर्क करें।",
  },
  {
    question:
      "बिहार में डॉक्यूमेंट्री फिल्म बनाने पर अनुदान संबंधी जानकारी कैसे प्राप्त होगी?",
    answer:
      "डॉक्यूमेंट्री फिल्म निर्माण पर अनुदान बिहार फिल्म प्रमोशन पॉलिसी 2024 के तहत उपलब्ध है। इसके लिए film.bihar.gov.in पर Producer के रूप में रजिस्टर करें और NOC के लिए आवेदन करें। अंतरराष्ट्रीय डॉक्यूमेंट्री के लिए MEA (Ministry of External Affairs) से शूट परमिशन सर्टिफ़िकेट संलग्न करना अनिवार्य है। सभी आवश्यक दस्तावेज़ (Request Letter, Undertaking, Synopsis, Annexures) शूटिंग से 3 सप्ताह पहले biharfilmnigam@gmail.com पर जमा करें। Operational Guidelines पोर्टल से डाउनलोड की जा सकती हैं।",
  },
  {
    question:
      "बिहार में वेब सीरीज बनाने पर अनुदान संबंधी जानकारी कैसे प्राप्त होगी?",
    answer:
      "वेब सीरीज निर्माण हेतु अनुदान बिहार फिल्म प्रमोशन पॉलिसी 2024 के अंतर्गत उपलब्ध है। film.bihar.gov.in पर Producer रोल से रजिस्टर करें और NOC आवेदन करें। अंतरराष्ट्रीय वेब सीरीज के लिए MIB (Ministry of Information & Broadcasting) का शूट परमिशन सर्टिफ़िकेट आवश्यक है। NOC फॉर्म में Project Information, Production House Details और Technical Specifications भरें। सब्सिडी के लिए शूटिंग पूर्ण होने पर Annexure-5 पर ADM और DM के हस्ताक्षर अनिवार्य हैं। विस्तृत प्रक्रिया के लिए पोर्टल पर Operational Guidelines देखें।",
  },
  {
    question:
      "बिहार में टीवी सीरियल बनाने पर अनुदान संबंधी जानकारी कैसे प्राप्त होगी?",
    answer:
      "टीवी सीरियल निर्माण पर अनुदान बिहार फिल्म प्रमोशन पॉलिसी 2024 के तहत प्राप्त किया जा सकता है। इसके लिए film.bihar.gov.in पर Producer के रूप में रजिस्टर करें। अंतरराष्ट्रीय टीवी सीरियल के लिए MIB (Ministry of Information & Broadcasting) से शूट परमिशन सर्टिफ़िकेट अनिवार्य है। NOC आवेदन में सभी सेक्शन भरें और आवश्यक दस्तावेज़ शूटिंग से 3 सप्ताह पूर्व biharfilmnigam@gmail.com पर ईमेल करें। सब्सिडी हेतु शूटिंग के बाद Annexure-5 पर Nodal Officer और DM से हस्ताक्षर करवाएं। BSFDFC कार्यालय, Morrison Building, गोलघर के पास, पटना-800001 से भी संपर्क किया जा सकता है।",
  },
];

const FaqModal = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40  animate-[fadeIn_0.2s_ease-out] p-10 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1100px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden flex flex-col"
        style={{
          height: "calc(100vh - 16px)",
          maxHeight: "calc(100vh - 16px)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close FAQ"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-all duration-200 cursor-pointer"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center pt-6 sm:pt-8 xl:pt-14 pb-3 sm:pb-4 xl:pb-8 px-6 sm:px-12 xl:px-16 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-[28px] xl:text-[34px] font-bold text-gray-900 tracking-tight mb-2 sm:mb-3">
            अक्सर पूछे जाने वाले प्रश्न
          </h1>
          <p className="text-xs sm:text-sm xl:text-[12px] text-gray-500 leading-relaxed max-w-lg xl:max-w-xl mx-auto">
            बिहार राज्य फिल्म विकास एवं वित्त निगम लिमिटेड
            <br className="hidden sm:block" />
            यदि आपको उत्तर प्राप्त नहीं होता है, तो कृपया ईमेल के माध्यम से
            संपर्क करें।{" "}
            <a
              href="mailto:biharfilmnigam@gmail.com"
              className="text-[#a92b43] font-medium underline underline-offset-2 hover:text-[#891737] transition-colors"
            >
              biharfilmnigam@gmail.com
            </a>
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 sm:mx-12 xl:mx-16 border-t border-gray-100 flex-shrink-0" />

        {/* FAQ List — scrollable, hidden scrollbar */}
        <div
          className="flex-1 overflow-y-auto px-6 sm:px-12 xl:px-16 py-4 sm:py-6 xl:py-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            .faq-scroll::-webkit-scrollbar { display: none; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
          `}</style>
          <div className="faq-scroll max-w-[720px] xl:max-w-[820px] mx-auto">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                  openIndex === index ? "bg-gray-50/60" : ""
                }`}
              >
                <button
                  className="w-full flex items-center justify-between py-5 sm:py-6 xl:py-7 px-1 sm:px-2 text-left gap-3 sm:gap-4 cursor-pointer group"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <span className="text-[14px] sm:text-[15px] xl:text-base font-semibold text-gray-700 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`text-sm text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <BsChevronDown />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-1 sm:px-2 pb-5 sm:pb-6 text-[13px] sm:text-[14px] xl:text-[15px] leading-[1.75] text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;
