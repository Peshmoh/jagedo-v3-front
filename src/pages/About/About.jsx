import { Card, CardBody, Typography } from "@material-tailwind/react";

const About = () => {
  return (
    <div className="bg-white p-6" id="About">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#000072] border-b-4 border-[#000072] inline-block pb-2">
          Who We Are
        </h1>
      </div>

      {/* Container for image and cards */}
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Image on the left */}
        <div className="md:w-1/2">
          <img
            src="/Sub-landing/who we are.jpg"
            className="rounded-lg w-full h-93.5"
            alt="Who We Are"
          />
        </div>

        {/* Mission  */}
        <div className="md:w-1/2 flex flex-col gap-6">

          <Card className="w-full border-2 border-[#000072] hover:bg-[#000072]/10 md:hover:border-[#000072] transition-all duration-300 md:hover:scale-105 md:hover:shadow-xl">
            <CardBody>
              <Typography variant="h6" style={{ color: '#000072' }} className="mb-4 uppercase">
                Our Mission
              </Typography>
              <Typography color="gray" className="mb-8 font-normal">
                Our mission is to promote efficient and effective design, recommendation,
                and implementation of sustainable infrastructural solutions to individuals, households,
                and communities towards a prosperous Africa.
              </Typography>
            </CardBody>
          </Card>

          {/* Vision Card */}
          <Card className="w-full border-2 border-[#88f384] hover:bg-[#88f384]/10 md:hover:border-[#88f384] transition-all duration-300 md:hover:scale-105 md:hover:shadow-xl">
            <CardBody>
              <Typography variant="h6" style={{ color: '#000072' }} className="mb-4 uppercase">
                Our Vision
              </Typography>
              <Typography color="gray" className="mb-8 font-normal">
              {"Africa's hub of sustainable infrastructural solutions"}
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;