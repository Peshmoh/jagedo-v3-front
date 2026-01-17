import { useEffect } from 'react';

import Navbar from './Navbar';
import Navbar2 from './Navbar2';
import Home from './Home';
import About from './About';
import Story from './Story';
import Values from './Values';
import OurTeam from './OurTeam';
import Footer from './Footer';

const SubPage = () => {
  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Main navbar */}
      <Navbar />

      {/* Sub-navbar */}
      <div className="mt-24 bg-white border-b shadow-sm z-40 relative">
        <Navbar2 />
      </div>

      <div id="home">
        <Home />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="story">
        <Story />
      </div>
      <div id="values">
        <Values />
      </div>
      <div id="ourteam">
        <OurTeam />
      </div>

      <Footer />
    </div>
  );
};

export default SubPage;
