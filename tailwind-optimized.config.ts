import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        clinic: {
          primary: "hsl(var(--clinic-primary))",
          secondary: "hsl(var(--clinic-secondary))",
          accent: "hsl(var(--clinic-accent))",
          light: "hsl(var(--clinic-light))",
        },
        // Novas cores para estados
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      backgroundImage: {
        // Gradiente acessível usando as novas cores
        "clinic-gradient":
          "linear-gradient(135deg, hsl(var(--clinic-primary)) 0%, hsl(var(--clinic-secondary)) 100%)",
        "clinic-gradient-soft":
          "linear-gradient(135deg, hsl(var(--clinic-primary) / 0.1) 0%, hsl(var(--clinic-secondary) / 0.1) 100%)",
        "clinic-hero":
          "linear-gradient(135deg, hsl(var(--clinic-primary) / 0.05) 0%, hsl(var(--clinic-secondary) / 0.05) 100%)",
        // Gradientes para estados
        "success-gradient":
          "linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)",
        "warning-gradient":
          "linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(var(--warning) / 0.8) 100%)",
        "info-gradient":
          "linear-gradient(135deg, hsl(var(--info)) 0%, hsl(var(--info) / 0.8) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Animações suaves para hover states
        "hover-lift": {
          "0%": {
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            transform: "translateY(-2px) scale(1.02)",
          },
        },
        "hover-glow": {
          "0%": {
            boxShadow: "0 0 0 0 hsl(var(--primary) / 0)",
          },
          "100%": {
            boxShadow: "0 0 20px 0 hsl(var(--primary) / 0.2)",
          },
        },
        // Animação para indicar elementos focados
        "focus-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 2px hsl(var(--ring))",
          },
          "50%": {
            boxShadow: "0 0 0 4px hsl(var(--ring) / 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "hover-lift": "hover-lift 0.2s ease-out forwards",
        "hover-glow": "hover-glow 0.3s ease-out forwards",
        "focus-pulse": "focus-pulse 1s ease-in-out infinite",
      },
      // Sombras otimizadas para melhor contraste
      boxShadow: {
        accessible: "0 2px 8px 0 hsl(var(--foreground) / 0.15)",
        "accessible-lg": "0 4px 16px 0 hsl(var(--foreground) / 0.15)",
        "accessible-xl": "0 8px 32px 0 hsl(var(--foreground) / 0.15)",
        "focus-ring": "0 0 0 2px hsl(var(--ring))",
        "focus-ring-offset":
          "0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))",
      },
      // Tipografia com melhor legibilidade
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.6", letterSpacing: "0.0125em" }],
        lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0.0125em" }],
        xl: ["1.25rem", { lineHeight: "1.6", letterSpacing: "0em" }],
        "2xl": ["1.5rem", { lineHeight: "1.5", letterSpacing: "-0.0125em" }],
        "3xl": ["1.875rem", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        "4xl": ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "7xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      // Espaçamentos otimizados para touch targets
      spacing: {
        "18": "4.5rem", // 72px - bom para touch targets grandes
        "22": "5.5rem", // 88px
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin customizado para classes de acessibilidade
    function ({ addUtilities }: any) {
      const newUtilities = {
        // Classe para garantir touch targets adequados
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        // Classe para melhorar legibilidade de texto
        ".text-readable": {
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
          textRendering: "optimizeLegibility",
        },
        // Classe para hover states acessíveis
        ".hover-accessible": {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px 0 hsl(var(--foreground) / 0.15)",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 2px hsl(var(--ring))",
          },
          "&:active": {
            transform: "translateY(0) scale(0.98)",
          },
        },
        // Classe para estados de loading
        ".loading-accessible": {
          position: "relative",
          pointerEvents: "none",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: "0",
            backgroundColor: "hsl(var(--background) / 0.8)",
            borderRadius: "inherit",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
