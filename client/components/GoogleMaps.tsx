import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Car,
  Bus,
  ExternalLink,
} from "lucide-react";

interface GoogleMapsProps {
  showDirections?: boolean;
  showBusinessHours?: boolean;
  className?: string;
}

export default function GoogleMaps({
  showDirections = true,
  showBusinessHours = true,
  className = "",
}: GoogleMapsProps) {
  const clinicAddress =
    "Avenida 21 de Janeiro, Nº 351, Benfica, Luanda, Angola";
  const clinicCoordinates = "-8.8163, 13.2302"; // Approximate coordinates for Benfica, Luanda

  // Google Maps URLs
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicAddress)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinicAddress)}`;

  // Embedded map URL
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.1234567890123!2d13.2302!3d-8.8163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDknMDUuOSJTIDEzwrAxMyczMC43IkU!5e0!3m2!1spt!2sao!4v1234567890`;

  const businessHours = [
    { day: "Segunda-feira", hours: "07:00 - 19:00" },
    { day: "Terça-feira", hours: "07:00 - 19:00" },
    { day: "Quarta-feira", hours: "07:00 - 19:00" },
    { day: "Quinta-feira", hours: "07:00 - 19:00" },
    { day: "Sexta-feira", hours: "07:00 - 19:00" },
    { day: "Sábado", hours: "07:00 - 13:00" },
    { day: "Domingo", hours: "Fechado" },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Map */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 text-clinic-accent mr-2" />
            Nossa Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Clínica Bem Cuidar"
              className="w-full h-full"
            />

            {/* Overlay with clinic info */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Clínica Bem Cuidar
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {clinicAddress}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Seg-Sex: 07:00-19:00 • Sáb: 07:00-13:00</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-4 flex-shrink-0"
                >
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Abrir no Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Directions */}
        {showDirections && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 text-clinic-accent mr-2" />
                Como Chegar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Car className="w-5 h-5 text-clinic-accent mt-0.5" />
                  <div>
                    <h5 className="font-medium text-foreground">De Carro</h5>
                    <p className="text-sm text-muted-foreground">
                      Estacionamento gratuito disponível. Próximo à Talatona,
                      fácil acesso pela Estrada de Catete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Bus className="w-5 h-5 text-clinic-accent mt-0.5" />
                  <div>
                    <h5 className="font-medium text-foreground">
                      Transporte Público
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Candongueiros e táxis passam regularmente pela região.
                      Próximo aos pontos de transporte de Benfica.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-clinic-gradient hover:opacity-90 flex-1"
                  asChild
                >
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver Direções
                  </a>
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+244945344650">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Hours */}
        {showBusinessHours && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 text-clinic-accent mr-2" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {businessHours.map((schedule, index) => {
                  const isToday = new Date().getDay() === (index + 1) % 7;
                  const isClosed = schedule.hours === "Fechado";

                  return (
                    <div
                      key={schedule.day}
                      className={`flex justify-between items-center p-2 rounded ${
                        isToday
                          ? "bg-clinic-light text-clinic-primary font-medium"
                          : ""
                      }`}
                    >
                      <span className="text-sm">
                        {schedule.day}
                        {isToday && " (hoje)"}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isClosed
                            ? "text-red-600"
                            : isToday
                              ? "text-clinic-primary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Atendimento de urgência 24 horas
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
