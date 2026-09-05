'use client';
import { motion } from 'framer-motion';


export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0c]">
      {/* Background Video (Kept for texture/motion) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Apple-style Mesh Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{
          x: [0, -100, 80, 0],
          y: [0, 100, -80, 0],
          scale: [1, 0.9, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{
          x: [0, 50, -100, 0],
          y: [0, 50, -50, 0],
          scale: [0.8, 1.2, 1, 0.8]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-cyan-500/20 rounded-full blur-[90px] mix-blend-screen"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{
          x: [0, -50, 50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] left-[10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] bg-pink-600/20 rounded-full blur-[110px] mix-blend-screen"
        style={{ willChange: 'transform' }}
      />

      {/* Subtle Noise/Vignette Overlay for Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
    </div>
  );
}
