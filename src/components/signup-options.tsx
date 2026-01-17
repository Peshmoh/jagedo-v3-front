import { User, Wrench, Briefcase, HardHat, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
const Link = ({ to, children, className = "" }) => (
  <a href={to} className={className}>
    {children}
  </a>
);

export function SignupOptions() {
  const options = [
    {
      title: "Customer",
      icon: <User className="h-10 w-10" />,
      description: "Looking for professional services",
      color: "#00007a",
      bgGradient: "from-[#00007a] to-[#000055]",
      path: "/signup/customer",
    },
    {
      title: "Fundi",
      icon: <Wrench className="h-10 w-10" />,
      description: "Skilled tradesperson",
      color: "#00a63e",
      bgGradient: "from-[#00a63e] to-[#00b347]",
      path: "/signup/fundi",
    },
    {
      title: "Professional",
      icon: <Briefcase className="h-10 w-10" />,
      description: "Licensed professional",
      color: "#00007a",
      bgGradient: "from-[#00007a] to-[#000055]",
      path: "/signup/professional",
    },
    {
      title: "Contractor",
      icon: <HardHat className="h-10 w-10" />,
      description: "Construction contractor",
      color: "#00a63e",
      bgGradient: "from-[#00a63e] to-[#00b347]",
      path: "/signup/contractor",
    },
    {
      title: "Hardware",
      icon: <ShoppingBag className="h-10 w-10" />,
      description: "Hardware supplier",
      color: "#00007a",
      bgGradient: "from-[#00007a] to-[#000055]",
      path: "/signup/hardware",
    },
  ];

  return (
    <div className="relative mx-auto px-4 py-12 overflow-x-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-[#00a63e]/5 to-[#00007a]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#00007a]/5 to-[#00a63e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-[#00a63e]/3 to-transparent rounded-full blur-2xl"></div>

      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00007a]/10 to-[#00a63e]/10 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-[#00a63e]" />
          <span className="text-sm font-medium text-[#00007a]">Choose Your Path</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00007a] via-[#00a63e] to-[#00007a] bg-clip-text text-transparent mb-4">
          Join JAGEDO Today
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the option that best describes you and unlock your potential in our professional network
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
        {options.map((option, index) => (
          <Link key={index} to={option.path} className="group relative block">
            <div
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-6 hover:rotate-1 transform-gpu"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: "fadeInUp 0.8s ease-out both"
              }}
            >
              {/* Gradient background overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-0 group-hover:opacity-8 transition-opacity duration-700`}
              ></div>

              {/* Top accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${option.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}
              ></div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon container with enhanced effects */}
                <div className="relative mx-auto mb-6">
                  <div
                    className="relative h-20 w-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-lg"
                    style={{ backgroundColor: `${option.color}08` }}
                  >
                    <div className="transition-all duration-700 group-hover:scale-125" style={{ color: option.color }}>
                      {option.icon}
                    </div>

                    {/* Enhanced ripple effects */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 group-hover:animate-ping"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 group-hover:animate-ping"
                      style={{ backgroundColor: option.color, animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 group-hover:animate-ping"
                      style={{ backgroundColor: option.color, animationDelay: "0.4s" }}
                    ></div>
                  </div>

                  {/* Enhanced floating particles */}
                  <div className="absolute -top-3 -right-3 w-4 h-4 bg-[#00a63e] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500"></div>
                  <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-[#00007a] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: "0.3s" }}></div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-[#00a63e] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: "0.6s" }}></div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-[#00007a] transition-colors duration-500">
                  {option.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-500 mb-6 text-sm leading-relaxed">
                  {option.description}
                </p>

                {/* Call to action */}
                <div className="flex items-center justify-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span style={{ color: option.color }}>Get Started</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    style={{ color: option.color }}
                  />
                </div>
              </div>

              {/* Bottom gradient bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
              ></div>

              {/* Enhanced shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200"></div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-2 border-dashed opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" style={{ borderColor: option.color }}></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Enhanced bottom section */}
      <div className="text-center space-y-6">
        {/* Stats */}
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00a63e]">10,000+</div>
            <div className="text-sm text-gray-600">Professionals</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00007a]">500+</div>
            <div className="text-sm text-gray-600">Projects Daily</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00a63e]">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-lg max-w-3xl mx-auto">
          Join Kenya's fastest-growing professional network and connect with opportunities that match your skills and ambitions
        </p>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure Platform</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <span>Verified Professionals</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}