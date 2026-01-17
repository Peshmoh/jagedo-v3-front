export default function Loader({ fullscreen = false }: { fullscreen?: boolean }) {
  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white"
          : "flex items-center justify-center py-20 bg-white"
      }
    >
      <div className="relative">
        {/* Main ethereal spinner */}
        <div className="relative w-24 h-24">
          {/* Outer flowing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 border-r-cyan-400 animate-spin shadow-lg shadow-teal-100/50"
               style={{ animationDuration: '2s' }}>
          </div>
          
          {/* Inner counter-rotating ring */}
          <div className="absolute inset-3 rounded-full border-3 border-transparent border-b-cyan-500 border-l-teal-500 animate-spin"
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}>
          </div>
          
          {/* Center pulsing orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 rounded-full animate-pulse shadow-xl shadow-cyan-200/60">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
            </div>
          </div>
          
          {/* Orbiting particles */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full shadow-md animate-spin"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 90}deg) translate(40px, -4px)`,
                animationDuration: '3s',
                animationDelay: `${i * 0.25}s`
              }}
            />
          ))}
        </div>

        {/* Expanding ripple effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border border-teal-200/40 rounded-full animate-ping"
               style={{ animationDuration: '2s' }}>
          </div>
          <div className="absolute w-40 h-40 border border-cyan-200/30 rounded-full animate-ping"
               style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
          </div>
        </div>
      </div>
    </div>
  );
}