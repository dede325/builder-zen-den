import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Heart,
  Phone,
  MapPin,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Offline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncAttempt, setLastSyncAttempt] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      attemptSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("idle");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const attemptSync = async () => {
    setSyncStatus("syncing");
    setLastSyncAttempt(new Date());

    try {
      // Trigger background sync if service worker is available
      if (
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype
      ) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register("form-submission");
        await registration.sync.register("appointment-booking");
      }

      setSyncStatus("success");
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-AO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clinic-light to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Status Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-clinic-gradient rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Clínica Bem Cuidar
            </h1>
            <div className="flex items-center justify-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-success" />
                  <Badge
                    variant="outline"
                    className="border-success text-success"
                  >
                    Ligado à Internet
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-destructive" />
                  <Badge
                    variant="outline"
                    className="border-destructive text-destructive"
                  >
                    Sem Ligação à Internet
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-accessible-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              {isOnline
                ? "A restabelecer ligação..."
                : "Está sem ligação à internet"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isOnline ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  A sua ligação à internet foi restabelecida. A sincronizar os
                  seus dados...
                </p>

                {/* Sync Status */}
                <div className="flex items-center justify-center gap-2">
                  {syncStatus === "syncing" && (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-info" />
                      <span className="text-info">A sincronizar dados...</span>
                    </>
                  )}
                  {syncStatus === "success" && (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success">
                        Dados sincronizados com sucesso
                      </span>
                    </>
                  )}
                  {syncStatus === "error" && (
                    <>
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-destructive">
                        Erro na sincronização
                      </span>
                    </>
                  )}
                </div>

                {lastSyncAttempt && (
                  <p className="text-xs text-muted-foreground">
                    Última tentativa: {formatTime(lastSyncAttempt)}
                  </p>
                )}

                <Button onClick={refreshPage} className="btn-hover-lift">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Não se preocupe! Ainda pode consultar as nossas informações
                    básicas e os seus dados serão sincronizados assim que a
                    ligação for restabelecida.
                  </p>

                  <Button
                    onClick={refreshPage}
                    variant="outline"
                    className="btn-hover-lift"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>

                {/* Emergency Contact */}
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contacto de Urgência
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-destructive-foreground mb-3">
                      Em caso de emergência médica, contacte-nos directamente:
                    </p>
                    <a
                      href="tel:+244945344650"
                      className="text-destructive font-semibold text-lg hover:underline"
                    >
                      +244 945 344 650
                    </a>
                  </CardContent>
                </Card>

                {/* Offline Information */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="bg-info/5 border-info/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-info mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-info-foreground mb-1">
                            Localização
                          </h4>
                          <p className="text-sm text-info-foreground/80">
                            Avenida 21 de Janeiro, Nº 351
                            <br />
                            Benfica, Luanda
                            <br />
                            Angola
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-info/5 border-info/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-info mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-info-foreground mb-1">
                            Horários
                          </h4>
                          <div className="text-sm text-info-foreground/80 space-y-1">
                            <p>Seg-Sex: 07:00-19:00</p>
                            <p>Sábado: 07:00-13:00</p>
                            <p>Domingo: Fechado</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Available Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Funcionalidades Disponíveis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Visualizar informações básicas</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Formulários offline</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sincronização automática</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Agendamento online</span>
                        <WifiOff className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Portal do paciente</span>
                        <WifiOff className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Esta aplicação funciona offline graças à tecnologia PWA.{" "}
            <Link to="/" className="text-primary hover:underline">
              Voltar à página inicial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
