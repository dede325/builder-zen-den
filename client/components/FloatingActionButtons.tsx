import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  MessageCircle,
  Phone,
  Plus,
  X,
} from "lucide-react";

export default function FloatingActionButtons() {
  const [isExpanded, setIsExpanded] = useState(false);

  const whatsappNumber = "+244945344650";
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de agendar uma consulta na Clínica Bem Cuidar. Poderiam me ajudar?"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-3">
          {/* Expanded Actions */}
          {isExpanded && (
            <>
              {/* Schedule Appointment */}
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-clinic-gradient hover:opacity-90 text-white shadow-lg"
                      asChild
                    >
                      <Link to="/contato">
                        <Calendar className="w-5 h-5 mr-2" />
                        Agendar Consulta
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Agendar consulta online</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* WhatsApp */}
              <div className="animate-in slide-in-from-bottom-2 duration-300 delay-75">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                      asChild
                    >
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Conversar no WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Call */}
              <div className="animate-in slide-in-from-bottom-2 duration-300 delay-150">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-gray-50 shadow-lg"
                      asChild
                    >
                      <a href={`tel:${whatsappNumber}`}>
                        <Phone className="w-5 h-5 mr-2" />
                        Ligar
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Ligar para a clínica</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </>
          )}

          {/* Main Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleExpanded}
                size="lg"
                className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
                  isExpanded 
                    ? "bg-red-500 hover:bg-red-600 rotate-45" 
                    : "bg-clinic-gradient hover:opacity-90"
                }`}
              >
                {isExpanded ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isExpanded ? "Fechar menu" : "Ações rápidas"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
