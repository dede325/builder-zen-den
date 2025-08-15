import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Cookie,
  Shield,
  Settings,
  Check,
  X,
  Info,
  ExternalLink,
  Eye,
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { angolaFormatter } from "@/lib/locale-angola";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieCategory {
  id: keyof ConsentPreferences;
  name: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  examples: string[];
  retention: string;
  purposes: string[];
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Estritamente Necessários',
    description: 'Essenciais para o funcionamento básico do website e serviços.',
    icon: Zap,
    required: true,
    examples: ['Autenticação', 'Segurança', 'Carrinho de compras', 'Preferências de idioma'],
    retention: 'Sessão até 1 ano',
    purposes: ['Funcionalidade básica', 'Segurança', 'Prevenção de fraude']
  },
  {
    id: 'analytics',
    name: 'Análise e Performance',
    description: 'Ajudam-nos a entender como usa o website para melhorar a experiência.',
    icon: BarChart3,
    required: false,
    examples: ['Google Analytics', 'Mapas de calor', 'Métricas de performance'],
    retention: '2 anos',
    purposes: ['Análise de tráfego', 'Melhoria da experiência', 'Estatísticas anónimas']
  },
  {
    id: 'marketing',
    name: 'Marketing e Publicidade',
    description: 'Utilizados para mostrar publicidade relevante e personalizada.',
    icon: Target,
    required: false,
    examples: ['Facebook Pixel', 'Google Ads', 'Remarketing'],
    retention: '13 meses',
    purposes: ['Publicidade direcionada', 'Remarketing', 'Medição de campanhas']
  },
  {
    id: 'personalization',
    name: 'Personalização',
    description: 'Personalizam o conteúdo e funcionalidades baseadas nas suas preferências.',
    icon: Eye,
    required: false,
    examples: ['Preferências de conteúdo', 'Recomendações', 'Configurações de UI'],
    retention: '1 ano',
    purposes: ['Experiência personalizada', 'Recomendações', 'Configurações do utilizador']
  }
];

const CONSENT_STORAGE_KEY = 'clinica-bem-cuidar-consent';
const CONSENT_VERSION = '1.0';

export default function ConsentManager() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });
  const [hasExistingConsent, setHasExistingConsent] = useState(false);

  useEffect(() => {
    checkExistingConsent();
  }, []);

  const checkExistingConsent = () => {
    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (storedConsent) {
        const consentData = JSON.parse(storedConsent);
        
        // Check if consent is still valid (within 1 year)
        const consentDate = new Date(consentData.timestamp);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (consentDate > oneYearAgo && consentData.version === CONSENT_VERSION) {
          setPreferences(consentData.preferences);
          setHasExistingConsent(true);
          applyConsentPreferences(consentData.preferences);
        } else {
          // Consent expired or version changed
          localStorage.removeItem(CONSENT_STORAGE_KEY);
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setIsVisible(true);
    }
  };

  const saveConsent = (newPreferences: ConsentPreferences) => {
    const consentData = {
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      locale: 'pt-AO',
      userAgent: navigator.userAgent,
      angolaTime: angolaFormatter.formatDateTime(new Date())
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      setPreferences(newPreferences);
      setHasExistingConsent(true);
      applyConsentPreferences(newPreferences);
      setIsVisible(false);
      
      // Log consent for audit trail (in production, this would be sent to server)
      console.log('[Consent] User consent saved:', consentData);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  const applyConsentPreferences = (prefs: ConsentPreferences) => {
    // Apply analytics consent
    if (prefs.analytics) {
      // Initialize analytics (Google Analytics, etc.)
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Apply marketing consent
    if (prefs.marketing) {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        });
      }
    } else {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
    }

    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('consentUpdated', {
      detail: prefs
    }));
  };

  const handleAcceptAll = () => {
    const allAcceptedPreferences: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    saveConsent(allAcceptedPreferences);
  };

  const handleRejectOptional = () => {
    const minimalPreferences: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    saveConsent(minimalPreferences);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  const handlePreferenceChange = (category: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const reopenConsentPanel = () => {
    setIsVisible(true);
    setShowDetails(true);
  };

  if (!isVisible) {
    // Show small consent management button when banner is hidden
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={reopenConsentPanel}
          className="bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <Cookie className="w-4 h-4 mr-2" />
          Gerir Cookies
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-clinic-gradient rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Gestão de Cookies e Privacidade
                </CardTitle>
                <CardDescription className="text-sm">
                  Conforme Lei n.º 22/11 de Proteção de Dados de Angola
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Seguro
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main message */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar a sua experiência, 
              personalizar conteúdo e analisar o tráfego do nosso website. 
              Pode escolher quais categorias de cookies aceita.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>
                Os seus dados são tratados com a máxima segurança e confidencialidade.
              </span>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Categorias de Cookies
              </h3>

              {COOKIE_CATEGORIES.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <category.icon className="w-5 h-5 text-clinic-accent" />
                      <div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={preferences[category.id]}
                      onCheckedChange={(checked) => handlePreferenceChange(category.id, checked)}
                      disabled={category.required}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <h5 className="font-medium mb-1">Exemplos:</h5>
                      <ul className="text-muted-foreground space-y-1">
                        {category.examples.map((example, idx) => (
                          <li key={idx}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Finalidades:</h5>
                      <ul className="text-muted-foreground space-y-1">
                        {category.purposes.map((purpose, idx) => (
                          <li key={idx}>• {purpose}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <strong>Retenção:</strong> {category.retention}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Informações Adicionais</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-medium mb-2">Os Seus Direitos:</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Retirar consentimento a qualquer momento</li>
                      <li>• Aceder aos seus dados pessoais</li>
                      <li>• Solicitar correção ou eliminação</li>
                      <li>• Apresentar reclamação</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Contactos:</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• DPO: dpo@bemcuidar.co.ao</li>
                      <li>• Geral: recepcao@bemcuidar.co.ao</li>
                      <li>• Telefone: +244 945 344 650</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {!showDetails && (
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="w-full text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Personalizar Preferências
              </Button>
            )}

            <div className={`grid gap-3 ${showDetails ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {showDetails && (
                <Button
                  onClick={handleSaveCustom}
                  className="bg-clinic-gradient hover:opacity-90 text-white text-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Guardar Preferências
                </Button>
              )}
              
              <Button
                onClick={handleAcceptAll}
                className="bg-clinic-gradient hover:opacity-90 text-white text-sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Aceitar Todos
              </Button>
              
              <Button
                onClick={handleRejectOptional}
                variant="outline"
                className="text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Apenas Necessários
              </Button>
            </div>
          </div>

          {/* Footer links */}
          <div className="pt-3 border-t border-border">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-clinic-primary">
                <ExternalLink className="w-3 h-3" />
                Política de Privacidade
              </button>
              <button className="flex items-center gap-1 hover:text-clinic-primary">
                <ExternalLink className="w-3 h-3" />
                Termos de Uso
              </button>
              <span>|</span>
              <span>
                Última atualização: {angolaFormatter.formatDate(new Date())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for other components to check consent status
export const useConsent = () => {
  const [consent, setConsent] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    const loadConsent = () => {
      try {
        const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (storedConsent) {
          const consentData = JSON.parse(storedConsent);
          setConsent(consentData.preferences);
        }
      } catch (error) {
        console.error('Error loading consent:', error);
      }
    };

    loadConsent();

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      setConsent(event.detail);
    };

    window.addEventListener('consentUpdated', handleConsentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('consentUpdated', handleConsentUpdate as EventListener);
    };
  }, []);

  return consent;
};

// Utility function to check if specific consent is granted
export const hasConsent = (category: keyof ConsentPreferences): boolean => {
  try {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent) {
      const consentData = JSON.parse(storedConsent);
      return consentData.preferences[category] || false;
    }
  } catch (error) {
    console.error('Error checking consent:', error);
  }
  return false;
};

// Utility function to log consent events for audit
export const logConsentEvent = (event: string, details?: any) => {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    angolaTime: angolaFormatter.formatDateTime(new Date()),
    userAgent: navigator.userAgent,
    url: window.location.href,
    details
  };

  // In production, send this to your audit log endpoint
  console.log('[Consent Audit]', logData);
  
  // Store locally for potential sync later
  try {
    const existingLogs = JSON.parse(localStorage.getItem('consent-audit-logs') || '[]');
    existingLogs.push(logData);
    
    // Keep only last 100 entries
    const recentLogs = existingLogs.slice(-100);
    localStorage.setItem('consent-audit-logs', JSON.stringify(recentLogs));
  } catch (error) {
    console.error('Error storing consent audit log:', error);
  }
};
