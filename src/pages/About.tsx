/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect } from 'react';

import Navbar from './About/Navbar';
import Navbar2 from './About/Navbar2';
import Home from './About/Home';
import About from './About/About';
import Story from './About/Story';
import Values from './About/Values';
import OurTeam from './About/OurTeam';
import Footer from './About/Footer';

const AboutUs = () => {
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

export default AboutUs;
