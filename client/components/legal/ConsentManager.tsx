import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Cookie,
  BarChart3,
  Target,
  Settings,
  Info,
  Eye,
  Lock,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Check,
  X,
} from "lucide-react";

interface ConsentSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  healthData: boolean;
}

interface ConsentRecord {
  id: string;
  timestamp: Date;
  settings: ConsentSettings;
  ipAddress: string;
  userAgent: string;
  policyVersion: string;
  consentMethod: "banner" | "settings" | "form";
}

const CURRENT_POLICY_VERSION = "2024.1";
const CONSENT_STORAGE_KEY = "bem-cuidar-consent";
const CONSENT_LOG_KEY = "bem-cuidar-consent-log";

const consentCategories = [
  {
    id: "necessary" as keyof ConsentSettings,
    title: "Estritamente Necessários",
    description:
      "Estes cookies são essenciais para o funcionamento do website.",
    icon: Shield,
    required: true,
    examples: [
      "Cookies de sessão",
      "Preferências de segurança",
      "Funcionalidades básicas",
    ],
    legal:
      "Base legal: Interesse legítimo (Art. 6º, n.º 1, f) RGPD / Lei 22/11)",
  },
  {
    id: "functional" as keyof ConsentSettings,
    title: "Funcionais",
    description: "Melhoram a funcionalidade e personalização do website.",
    icon: Settings,
    required: false,
    examples: [
      "Preferências de idioma",
      "Configurações de interface",
      "Lembrança de escolhas",
    ],
    legal: "Base legal: Consentimento (Art. 6º, n.º 1, a) RGPD / Lei 22/11)",
  },
  {
    id: "analytics" as keyof ConsentSettings,
    title: "Análise e Performance",
    description: "Ajudam-nos a entender como os visitantes usam o website.",
    icon: BarChart3,
    required: false,
    examples: [
      "Google Analytics",
      "Estatísticas de uso",
      "Relatórios de performance",
    ],
    legal: "Base legal: Consentimento (Art. 6º, n.º 1, a) RGPD / Lei 22/11)",
  },
  {
    id: "marketing" as keyof ConsentSettings,
    title: "Marketing e Publicidade",
    description: "Usados para publicidade dirigida e campanhas de marketing.",
    icon: Target,
    required: false,
    examples: ["Anúncios personalizados", "Remarketing", "Redes sociais"],
    legal: "Base legal: Consentimento (Art. 6º, n.º 1, a) RGPD / Lei 22/11)",
  },
  {
    id: "healthData" as keyof ConsentSettings,
    title: "Dados de Saúde (Especiais)",
    description:
      "Processamento de dados sensíveis de saúde para prestação de cuidados médicos.",
    icon: FileText,
    required: false,
    examples: [
      "Histórico médico",
      "Informações de consultas",
      "Dados clínicos",
    ],
    legal:
      "Base legal: Consentimento explícito (Art. 9º, n.º 2, a) RGPD / Lei 22/11)",
    special: true,
  },
];

interface ConsentManagerProps {
  onConsentChange?: (settings: ConsentSettings) => void;
}

export default function ConsentManager({
  onConsentChange,
}: ConsentManagerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    keyof ConsentSettings | null
  >(null);

  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    healthData: false,
  });

  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check existing consent on mount
  useEffect(() => {
    const existingConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (existingConsent) {
      try {
        const parsed = JSON.parse(existingConsent);
        setConsentSettings(parsed.settings);
        setHasConsent(true);
      } catch (error) {
        console.error("Error parsing consent:", error);
        setShowBanner(true);
      }
    } else {
      // Show banner after 2 seconds if no consent
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Log consent record
  const logConsent = async (
    settings: ConsentSettings,
    method: ConsentRecord["consentMethod"],
  ) => {
    const record: ConsentRecord = {
      id: `consent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      settings,
      ipAddress: "hidden-for-privacy", // In production, get from backend
      userAgent: navigator.userAgent,
      policyVersion: CURRENT_POLICY_VERSION,
      consentMethod: method,
    };

    // Store locally (in production, also send to backend)
    const existingLogs = JSON.parse(
      localStorage.getItem(CONSENT_LOG_KEY) || "[]",
    );
    existingLogs.push(record);
    localStorage.setItem(CONSENT_LOG_KEY, JSON.stringify(existingLogs));

    console.log("[Consent] Logged consent record:", record);
  };

  // Save consent
  const saveConsent = async (
    settings: ConsentSettings,
    method: ConsentRecord["consentMethod"],
  ) => {
    setIsLoading(true);

    try {
      const consentData = {
        settings,
        timestamp: new Date().toISOString(),
        version: CURRENT_POLICY_VERSION,
      };

      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      await logConsent(settings, method);

      setConsentSettings(settings);
      setHasConsent(true);
      setShowBanner(false);
      setShowSettings(false);

      onConsentChange?.(settings);

      // In production, sync with backend
      // await fetch('/api/consent', { method: 'POST', body: JSON.stringify(consentData) });
    } catch (error) {
      console.error("Error saving consent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept all cookies
  const acceptAll = () => {
    const allAccepted: ConsentSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      healthData: false, // Health data requires explicit opt-in
    };
    saveConsent(allAccepted, "banner");
  };

  // Accept only necessary
  const acceptNecessary = () => {
    const necessaryOnly: ConsentSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      healthData: false,
    };
    saveConsent(necessaryOnly, "banner");
  };

  // Update specific consent
  const updateConsent = (category: keyof ConsentSettings, value: boolean) => {
    const updated = { ...consentSettings, [category]: value };
    setConsentSettings(updated);
  };

  // Save custom settings
  const saveCustomSettings = () => {
    saveConsent(consentSettings, "settings");
  };

  const bannerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  };

  const settingsVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <>
      {/* Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-lg border-t border-border shadow-2xl"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Proteção de Dados Pessoais
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Este website utiliza cookies e processa dados pessoais
                      para melhorar a sua experiência. Ao utilizar os nossos
                      serviços de saúde, poderemos processar dados sensíveis
                      mediante o seu consentimento explícito, conforme a{" "}
                      <button
                        onClick={() => setShowDetails(true)}
                        className="text-primary hover:underline font-medium"
                      >
                        Lei n.º 22/11 de Angola
                      </button>
                      .
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Dados protegidos
                      </span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        HTTPS seguro
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Versão {CURRENT_POLICY_VERSION}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="whitespace-nowrap"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Personalizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={acceptNecessary}
                    className="whitespace-nowrap"
                  >
                    Apenas Necessários
                  </Button>
                  <Button
                    variant="clinic"
                    size="sm"
                    onClick={acceptAll}
                    disabled={isLoading}
                    className="whitespace-nowrap"
                  >
                    {isLoading ? "A guardar..." : "Aceitar Todos"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Definições de Privacidade
            </DialogTitle>
            <DialogDescription>
              Escolha quais cookies e dados pretende partilhar connosco. Pode
              alterar estas preferências a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {consentCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${category.special ? "border-warning bg-warning/5" : "border-border"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        category.special ? "bg-warning/10" : "bg-primary/10"
                      }`}
                    >
                      <category.icon
                        className={`w-5 h-5 ${
                          category.special ? "text-warning" : "text-primary"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{category.title}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                        {category.special && (
                          <Badge
                            variant="outline"
                            className="text-xs border-warning text-warning"
                          >
                            Dados Especiais
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <strong>Exemplos:</strong>{" "}
                        {category.examples.join(", ")}
                      </div>
                      <div className="text-xs text-info mt-2">
                        {category.legal}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="p-1"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                    <Checkbox
                      checked={consentSettings[category.id]}
                      onCheckedChange={(checked) =>
                        updateConsent(category.id, !!checked)
                      }
                      disabled={category.required}
                      className="scale-125"
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            <Separator />

            <div className="bg-info/5 border border-info/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-info-foreground mb-2">
                    Informação Importante sobre Dados de Saúde
                  </p>
                  <p className="text-info-foreground/80 leading-relaxed">
                    Os dados de saúde são considerados dados pessoais especiais
                    e são processados apenas mediante o seu consentimento
                    explícito, conforme o Art. 9º da Lei n.º 22/11. Estes dados
                    são essenciais para a prestação de cuidados médicos
                    adequados e são protegidos com as mais altas medidas de
                    segurança.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="clinic"
                onClick={saveCustomSettings}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "A guardar..." : "Guardar Preferências"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Information Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Lei n.º 22/11 - Proteção de Dados Pessoais (Angola)
            </DialogTitle>
            <DialogDescription>
              Informações sobre os seus direitos e como protegemos os seus dados
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h4 className="font-semibold mb-3">Os Seus Direitos</h4>
              <div className="space-y-3">
                {[
                  {
                    icon: Eye,
                    title: "Direito de Acesso",
                    desc: "Consultar que dados pessoais processamos",
                  },
                  {
                    icon: Settings,
                    title: "Direito de Retificação",
                    desc: "Corrigir dados incorretos ou incompletos",
                  },
                  {
                    icon: X,
                    title: "Direito de Eliminação",
                    desc: "Solicitar a eliminação dos seus dados",
                  },
                  {
                    icon: Lock,
                    title: "Direito de Limitação",
                    desc: "Restringir o processamento dos seus dados",
                  },
                  {
                    icon: User,
                    title: "Direito de Portabilidade",
                    desc: "Receber os seus dados em formato estruturado",
                  },
                ].map((right) => (
                  <div
                    key={right.title}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg"
                  >
                    <right.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{right.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {right.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Contactos</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">
                      Encarregado de Proteção de Dados (DPO)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      dpo@bemcuidar.co.ao
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Questões Legais</div>
                    <div className="text-sm text-muted-foreground">
                      legal@bemcuidar.co.ao
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Para mais informações sobre a Lei n.º 22/11, consulte:{" "}
                <a
                  href="https://lex.ao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Lex.AO <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating consent settings button for users who have already consented */}
      {hasConsent && !showBanner && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 left-4 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="Definições de Privacidade"
        >
          <Shield className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}

// Export utilities for other components
export { CONSENT_STORAGE_KEY, CURRENT_POLICY_VERSION };
export type { ConsentSettings, ConsentRecord };
