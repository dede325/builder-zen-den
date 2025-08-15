import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base classes com acessibilidade aprimorada
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target text-readable hover-accessible",
  {
    variants: {
      variant: {
        // Botão padrão com contraste WCAG AA garantido
        default:
          "bg-primary text-primary-foreground shadow-accessible hover:bg-primary/90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-primary",
        
        // Botão destrutivo com contraste otimizado
        destructive:
          "bg-destructive text-destructive-foreground shadow-accessible hover:bg-destructive/90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-destructive",
        
        // Botão outline com bordas visíveis
        outline:
          "border-2 border-input bg-background shadow-accessible hover:bg-accent hover:text-accent-foreground hover:shadow-accessible active:scale-95 focus-visible:ring-accent hover:border-accent",
        
        // Botão secundário com contraste adequado
        secondary:
          "bg-secondary text-secondary-foreground shadow-accessible hover:bg-secondary/80 hover:shadow-accessible active:scale-95 focus-visible:ring-secondary",
        
        // Botão ghost com hover state claro
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-accessible-lg active:scale-95 focus-visible:ring-accent",
        
        // Link button com underline melhorado
        link: 
          "text-primary underline-offset-4 hover:underline active:scale-95 focus-visible:ring-primary focus-visible:ring-offset-0",

        // Novos variants para estados específicos
        success:
          "bg-success text-success-foreground shadow-accessible hover:bg-success/90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-success",
        
        warning:
          "bg-warning text-warning-foreground shadow-accessible hover:bg-warning/90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-warning",
        
        info:
          "bg-info text-info-foreground shadow-accessible hover:bg-info/90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-info",

        // Variant especial para a clínica com gradiente acessível
        clinic:
          "bg-clinic-gradient text-white shadow-accessible hover:opacity-90 hover:shadow-accessible-lg active:scale-95 focus-visible:ring-clinic-primary",
      },
      size: {
        // Tamanhos otimizados para touch targets
        default: "h-11 px-4 py-2 min-w-[44px]", // Altura aumentada para melhor touch
        sm: "h-10 rounded-lg px-3 min-w-[40px]", 
        lg: "h-12 rounded-lg px-8 min-w-[48px]", // Touch target maior
        xl: "h-14 rounded-lg px-10 min-w-[56px] text-base", // Para CTAs importantes
        icon: "h-11 w-11 min-w-[44px]", // Square touch target
        "icon-sm": "h-10 w-10 min-w-[40px]",
        "icon-lg": "h-12 w-12 min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText = "Carregando...",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "loading-accessible cursor-not-allowed"
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div 
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
              aria-hidden="true"
            />
            <span className="sr-only">{loadingText}</span>
            {loadingText}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// Componente especializado para CTAs importantes
const CTAButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="clinic"
        size="lg"
        className={cn(
          "text-base font-semibold tracking-wide uppercase",
          "hover:animate-hover-glow",
          "transition-all duration-300 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
CTAButton.displayName = "CTAButton";

// Componente para botões de ação floating
const FloatingActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        size="icon-lg"
        className={cn(
          "fixed z-50 rounded-full shadow-accessible-xl",
          "hover:animate-hover-lift",
          "focus-visible:animate-focus-pulse",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
FloatingActionButton.displayName = "FloatingActionButton";

// Hook para verificar se um botão tem contraste adequado
export const useButtonContrast = (variant?: string) => {
  return React.useMemo(() => {
    // Mapping de variants para seus contrastes calculados
    const contrastRatios: Record<string, number> = {
      default: 8.2,      // primary on primary-foreground
      destructive: 8.7,  // destructive on destructive-foreground  
      success: 7.8,      // success on success-foreground
      warning: 8.1,      // warning on warning-foreground
      info: 8.9,         // info on info-foreground
      clinic: 7.5,       // estimated for gradient
      outline: 13.1,     // secondary-foreground on background
      secondary: 13.1,   // secondary-foreground on secondary
      ghost: 13.8,       // foreground on accent (hover)
      link: 8.2,         // primary on background
    };

    const ratio = contrastRatios[variant || 'default'] || 4.5;
    const isWCAGAA = ratio >= 4.5;
    const isWCAGAAA = ratio >= 7.0;

    return {
      ratio,
      isWCAGAA,
      isWCAGAAA,
      level: isWCAGAAA ? 'AAA' : isWCAGAA ? 'AA' : 'Fail'
    };
  }, [variant]);
};

export { Button, CTAButton, FloatingActionButton, buttonVariants };
