import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Glassmorphism Card Component
interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  animation?: 'none' | 'hover' | 'continuous';
}

export const GlassmorphismCard = ({ 
  children, 
  className, 
  intensity = 'medium',
  animation = 'hover'
}: GlassmorphismCardProps) => {
  const intensityClasses = {
    light: 'bg-white/10 backdrop-blur-sm border-white/20',
    medium: 'bg-white/20 backdrop-blur-md border-white/30',
    heavy: 'bg-white/30 backdrop-blur-lg border-white/40'
  };

  const animationVariants = {
    none: {},
    hover: {
      whileHover: { 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }
    },
    continuous: {
      animate: {
        y: [0, -10, 0],
        transition: { 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl border shadow-xl",
        intensityClasses[intensity],
        className
      )}
      {...animationVariants[animation]}
    >
      {children}
    </motion.div>
  );
};

// Parallax Background Component
interface ParallaxBackgroundProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxBackground = ({ 
  children, 
  speed = 0.5,
  className 
}: ParallaxBackgroundProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000]);

  return (
    <motion.div
      style={{ y }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
};

// Fade In on Scroll Component
interface FadeInScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const FadeInScroll = ({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1
}: FadeInScrollProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: `-${threshold * 100}%` });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        x: 0 
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Animation
interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerChildren = ({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggerChildrenProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        )) :
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      }
    </motion.div>
  );
};

// Floating Element Component
interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
  delay?: number;
}

export const FloatingElement = ({ 
  children, 
  duration = 3,
  intensity = 10,
  delay = 0
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [0, -intensity, 0],
        x: [0, intensity/2, 0],
        rotate: [0, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
};

// Scale on Hover Component
interface ScaleOnHoverProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export const ScaleOnHover = ({ 
  children, 
  scale = 1.05,
  duration = 0.2,
  className 
}: ScaleOnHoverProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale,
        transition: { duration, ease: "easeOut" }
      }}
      whileTap={{ scale: scale * 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic Button Effect
interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticButton = ({ 
  children, 
  strength = 0.3,
  className 
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-300 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Text Reveal Animation
interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TextReveal = ({ 
  text, 
  delay = 0,
  className 
}: TextRevealProps) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay
      }
    }
  };

  const wordVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      rotateX: -90
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={wordVariants}
          style={{ perspective: '1000px' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Gradient Orb Background
interface GradientOrbProps {
  size?: number;
  color1?: string;
  color2?: string;
  duration?: number;
  className?: string;
}

export const GradientOrb = ({ 
  size = 400,
  color1 = "rgb(121, 203, 203)",
  color2 = "rgb(86, 98, 100)",
  duration = 8,
  className 
}: GradientOrbProps) => {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl opacity-30", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color1}, ${color2})`
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

// Counter Animation
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = ({ 
  from, 
  to, 
  duration = 2,
  className,
  suffix = "",
  prefix = ""
}: AnimatedCounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });
    }
  }, [isInView, controls]);

  const counter = useTransform(
    useAnimation().get() as any,
    [0, 1],
    [from, to]
  );

  useEffect(() => {
    if (isInView) {
      controls.start(1, { duration });
    }
  }, [isInView, controls, duration]);

  return (
    <motion.div ref={ref} animate={controls} initial={{ opacity: 0 }}>
      <motion.span className={className}>
        {prefix}
        <motion.span>
          {isInView && (
            <CounterDisplay from={from} to={to} duration={duration} />
          )}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.div>
  );
};

// Helper component for counter display
const CounterDisplay = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(from + (to - from) * progress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <>{count}</>;
};

// Ripple Effect Component
interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
}

export const RippleEffect = ({ children, className }: RippleEffectProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const addRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Progress Bar Animation
interface AnimatedProgressProps {
  progress: number;
  duration?: number;
  className?: string;
  color?: string;
}

export const AnimatedProgress = ({ 
  progress, 
  duration = 1,
  className,
  color = "bg-clinic-gradient"
}: AnimatedProgressProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <motion.div
        className={cn("h-2 rounded-full", color)}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${progress}%` } : { width: 0 }}
        transition={{ duration, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
};
