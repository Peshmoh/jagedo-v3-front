import { useState } from "react";
import PropTypes from "prop-types";

import { ChevronDown, ChevronUp } from "lucide-react"; 


const teamMembers = [
  {
    name: "James Ayako",
    role: "CEO & Co-founder",
    image: 'bg-[url("/Sub-landing/jim.png")] bg-cover bg-center h-74 w-70',
    Bio: "James is a visionary leader in the construction industry with 8+ years of experience. He has led innovative projects, built strong teams, and driven sustainable growth. As CEO of JaGedo, he continues to shape the future of construction. James holds dual degrees in Civil Engineering and Finance and is a Certified Public Accountant (CPA)."
  },
  {
    name: "Florence Njoki",
    role: "Chief Operation Officer",
    image: 'bg-[url("/Sub-landing/njoki.jpg")] bg-cover bg-center h-74 w-70',
    Bio: "Florence is a strategic operations expert at JaGedo, known for her precision and process optimization. With a background in Urban Planning and Development, she brings strong project management skills and cross-functional coordination to streamline workflows and drive efficiency across the organization."
  },
  {
    name: "Charles Nyamwaro",
    role: "Chief Business Developer",
    image: 'bg-[url("/Sub-landing/chuck.jpg")] bg-cover bg-center h-74 w-70',
    Bio: "Charles is a results-driven strategist at JaGedo, leading growth through market insights and strong partnerships. With a background in Economics and Statistics and certification as a CPA, he drives revenue, expands market presence, and positions JaGedo as an industry leader."
  },
  {
    name: "Micheal Deya",
    role: "Chief Construction Officer",
    image: 'bg-[url("/Sub-landing/Deya.jpeg")] bg-cover bg-center h-74 w-70',
    Bio: "Michael is a seasoned leader at JaGedo, guiding construction strategy with a focus on innovation, sustainability, and operational excellence. With strong engineering and project management expertise, he drives efficient, high-impact infrastructure delivery aligned with JaGedo’s tech vision."
  },
];

const BioText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative text-sm sm:text-base leading-relaxed transition-all duration-300">
      <p className={expanded ? "max-h-full" : "max-h-[6.5rem] overflow-hidden"}>
        {text}
      </p>

      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 transition"
      >
        {expanded ? (
          <>
            Show less <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            Read more <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
};

BioText.propTypes = {
    text: PropTypes.string, // or PropTypes.number, PropTypes.string, etc.
  };


const OurTeam = () => {
  return (
    <section className="bg-gray-50 py-10 sm:py-20" id="OurTeam">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000072]">Our Team</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
            >
              <div className={`h-48 ${member.image} relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-[#000072] text-sm sm:text-base font-medium mb-2">
                  {member.role}
                </div>
                <div className="text-[#000072] text-sm sm:text-base">
                  <BioText text={member.Bio} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
