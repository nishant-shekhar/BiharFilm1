import React from "react";
import Longcards from "../Cards/Longcards";

// import InfiniteCarousel from "../Cards/InfiniteCarousel";
import Location from "../NavigationCards/Location";
;



function App() {
  return (
    <div className="bg-[#190108]">
      

      <div className="min-h-screen flex bg-[#190108] justify-center items-center gap-10  p-8>">
        <Longcards imageUrl="https://cdn.mos.cms.futurecdn.net/jFqPQMdiTQXx6TA4sGiqr8-1280-80.jpg" title="Ready to fly" description="This is a description of the image." />
        <Longcards imageUrl="https://worldwildschooling.com/wp-content/uploads/2024/05/Mountains-in-the-US_Grand-Teton-Wyoming_Kennytong_Adobe-Stock-Photo_67602283.webp" title="Mountains" description="This is a description of the image." />
        <Longcards imageUrl="https://worldwildschooling.com/wp-content/uploads/2024/05/Mountains-in-the-US_Grand-Teton-Wyoming_Kennytong_Adobe-Stock-Photo_67602283.webp" title="Mountains" description="This is a description of the image." />
    </div>

      
    
    </div>
  );
}

export default App;
