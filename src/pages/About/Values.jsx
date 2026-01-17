import  { useState } from 'react';

const core = [
  {
    title: "Partnership",
    description: "We build lasting trust with clients, experts, and colleagues. Through teamwork, we collaborate within our company and with partners to create better solutions and achieve shared success.",
    color: "border-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Results",
    description: "We exist to create a sustainable future. Every goal, outcome, and impact we achieve aligns with this mission. We stay focused, ensuring what needs to be done gets done",
    color: "border-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Integrity",
    description: "Trust is the foundation of our autonomy, authenticity, and transparency. It drives our connections with customers, partners, and each other, ensuring integrity in every interaction and enhancing the user experience",
    color: "border-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    title: "Trust",
    description: "Trust drives transparency, authenticity, and meaningful connections. Each individual builds trustworthiness and extends trust to others, ensuring credibility and integrity in every interaction, creating a reliable and seamless user experience",
    color: "border-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Efficiency",
    description: "We work efficiently by using creativity, smart planning, and agile problem-solving. With focus, flexibility, and hard work, we achieve results through practical solutions, clear priorities, and well-structured processes",
    color: "border-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50"
  },
];

const Values = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8" id='Values'>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#000072] text-center mb-4">
          Our Core Values
        </h2>
        <div className="w-20 h-1 bg-[#000072] mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {core.map((item, index) => (
            <div 
              key={index}
              onClick={() => toggleCard(index)}
              className={`border-2 ${item.color} ${item.bgColor} rounded-lg overflow-hidden shadow-sm 
                transition-all duration-300 cursor-pointer
                ${expandedCard === index ? 'lg:hover:scale-105' : ''}
                ${expandedCard === index ? 'scale-[1.02]' : ''}
                hover:shadow-md`}
            >
              <div className="p-5">
                <h3 className={`text-xl font-bold ${item.textColor} mb-3`}>
                  {item.title}
                </h3>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${expandedCard === index ? 'max-h-[500px]' : 'max-h-20 sm:max-h-[500px]'}`}>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="sm:hidden text-center mt-3">
                  <button 
                    className={`text-xs font-medium ${item.textColor} underline`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard(index);
                    }}
                  >
                    {expandedCard === index ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Values;