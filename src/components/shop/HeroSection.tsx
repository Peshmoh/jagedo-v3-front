import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-200 via-blue-500 to-blue-700 min-h-72 md:min-h-60 w-full flex justify-center items-center">
      <div className="flex justify-center container mx-auto items-center gap-6 px-6 flex-wrap md:my-9">
        {/* Logo Image */}
        <img
          src="/logo.png"
          alt="logo"
          className="w-1/3 min-w-[150px] mr-0 md:mr-10 hidden md:inline"
        />

        {/* Text Content */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-semibold text-white">Welcome to the Jagedo Shop</h1>
          <p className="text-xl my-6 text-white">
            Quality products from trusted and verified suppliers.
          </p>

          {/* CTA Button */}
          <Button variant="outline" className="bg-white w-40 hover:bg-white/90 border-white cursor-pointer font-semibold">
            SHOP NOW
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;