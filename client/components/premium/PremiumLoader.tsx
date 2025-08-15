import { motion } from "framer-motion";
import { Heart, Stethoscope, Activity, Zap } from "lucide-react";
import { GlassmorphismCard } from "./AnimatedComponents";

interface PremiumLoaderProps {
  variant?: "page" | "component" | "inline";
  size?: "sm" | "md" | "lg";
  message?: string;
  showLogo?: boolean;
}

export default function PremiumLoader({
  variant = "component",
  size = "md",
  message = "Carregando...",
  showLogo = true,
}: PremiumLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerSizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Heartbeat animation for medical theme
  const heartbeatVariants = {
    animate: {
      scale: [1, 1.2, 1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Pulse rings animation
  const pulseVariants = {
    animate: {
      scale: [1, 2, 1],
      opacity: [0.7, 0, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Stethoscope wave animation
  const waveVariants = {
    animate: {
      pathLength: [0, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Medical icons rotation
  const iconRotateVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Dot sequence animation
  const dotVariants = {
    animate: (i: number) => ({
      scale: [1, 1.5, 1],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut",
      },
    }),
  };

  if (variant === "page") {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Logo Animation */}
          <motion.div
            variants={heartbeatVariants}
            animate="animate"
            className="relative mx-auto w-24 h-24"
          >
            {/* Pulse Rings */}
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="absolute inset-0 rounded-full bg-clinic-gradient opacity-20"
            />
            <motion.div
              variants={pulseVariants}
              animate="animate"
              style={{ animationDelay: "0.5s" }}
              className="absolute inset-2 rounded-full bg-clinic-gradient opacity-30"
            />

            {/* Main Logo */}
            <div className="absolute inset-4 bg-clinic-gradient rounded-full flex items-center justify-center shadow-2xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Brand Text */}
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-clinic-primary to-clinic-secondary bg-clip-text text-transparent"
            >
              Clínica Bem Cuidar
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-clinic-accent font-medium"
            >
              Cuidar é Amar
            </motion.p>
          </div>

          {/* Loading Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-gray-600">{message}</p>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={dotVariants}
                  animate="animate"
                  custom={i}
                  className="w-3 h-3 bg-clinic-gradient rounded-full"
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-clinic-gradient"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === "component") {
    return (
      <GlassmorphismCard
        intensity="light"
        className={`text-center ${containerSizes[size]} bg-white/90 border-clinic-accent/20`}
      >
        <div className="space-y-4">
          {showLogo && (
            <motion.div
              variants={heartbeatVariants}
              animate="animate"
              className={`relative mx-auto ${sizeClasses[size]}`}
            >
              <div className="absolute inset-0 bg-clinic-gradient rounded-full flex items-center justify-center shadow-lg">
                <Heart
                  className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-white`}
                />
              </div>

              {/* Rotating Ring */}
              <motion.div
                variants={iconRotateVariants}
                animate="animate"
                className="absolute inset-0 border-2 border-clinic-accent/30 border-t-clinic-accent rounded-full"
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <p
              className={`text-gray-600 ${size === "sm" ? "text-sm" : "text-base"}`}
            >
              {message}
            </p>

            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={dotVariants}
                  animate="animate"
                  custom={i}
                  className={`${size === "sm" ? "w-2 h-2" : "w-3 h-3"} bg-clinic-gradient rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    );
  }

  // Inline loader
  return (
    <div className="flex items-center justify-center space-x-2">
      <motion.div
        variants={heartbeatVariants}
        animate="animate"
        className={`${sizeClasses[size]} bg-clinic-gradient rounded-full flex items-center justify-center`}
      >
        <Heart
          className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"} text-white`}
        />
      </motion.div>

      <span
        className={`text-gray-600 ${size === "sm" ? "text-sm" : "text-base"}`}
      >
        {message}
      </span>

      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            custom={i}
            className={`${size === "sm" ? "w-1 h-1" : "w-2 h-2"} bg-clinic-gradient rounded-full`}
          />
        ))}
      </div>
    </div>
  );
}

// Medical-themed skeleton loader
export function MedicalSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-clinic-light/30 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-clinic-light/30 rounded w-3/4"></div>
          <div className="h-3 bg-clinic-light/20 rounded w-1/2"></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-clinic-light/30 rounded"></div>
        <div className="h-4 bg-clinic-light/20 rounded w-5/6"></div>
        <div className="h-4 bg-clinic-light/20 rounded w-4/6"></div>
      </div>

      <div className="flex space-x-2">
        <div className="w-16 h-8 bg-clinic-light/30 rounded-full"></div>
        <div className="w-20 h-8 bg-clinic-light/20 rounded-full"></div>
      </div>
    </div>
  );
}

// Specialized loading states
export function AppointmentLoader() {
  return (
    <div className="text-center space-y-4 p-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto"
      >
        <Stethoscope className="w-full h-full text-clinic-accent" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Processando Agendamento</h3>
        <p className="text-sm text-gray-600">
          A verificar disponibilidade de horários...
        </p>
      </div>

      <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
        <motion.div
          className="h-full bg-clinic-gradient"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

export function ExamLoader() {
  return (
    <div className="text-center space-y-4 p-6">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 mx-auto"
      >
        <Activity className="w-full h-full text-clinic-accent" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Processando Exame</h3>
        <p className="text-sm text-gray-600">
          A analisar resultados médicos...
        </p>
      </div>
    </div>
  );
}

export function EmergencyLoader() {
  return (
    <div className="text-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg">
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 mx-auto"
      >
        <Zap className="w-full h-full text-red-500" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="font-semibold text-red-800">Situação de Emergência</h3>
        <p className="text-sm text-red-600">A processar pedido urgente...</p>
      </div>

      <div className="text-xs text-red-500 font-medium">
        Para emergências imediatas: 112
      </div>
    </div>
  );
}
