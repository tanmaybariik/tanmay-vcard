'use client';
import { memo } from 'react';

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050812]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Optimized CSS gradients instead of heavy React rendering */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-blue-900/10 rounded-full blur-[120px]" />
      <div className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-cyan-900/10 rounded-full blur-[90px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] bg-indigo-900/10 rounded-full blur-[110px]" />

      {/* Subtle Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
    </div>
  );
});

export default AnimatedBackground;
