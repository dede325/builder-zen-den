import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  User,
  FileText,
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Heart,
  Baby,
  Brain,
  Shield,
  Activity,
  Eye,
  UserCheck,
  Zap,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  const searchData: SearchResult[] = [
    // Especialidades
    {
      id: "cardiologia",
      title: "Cardiologia",
      description: "Cuidados especializados do coração e sistema cardiovascular",
      category: "Especialidade",
      url: "/especialidades/cardiologia",
      icon: Heart,
    },
    {
      id: "pediatria",
      title: "Pediatria",
      description: "Atendimento médico dedicado às crianças e adolescentes",
      category: "Especialidade",
      url: "/especialidades/pediatria",
      icon: Baby,
    },
    {
      id: "neurologia",
      title: "Neurologia",
      description: "Diagnóstico e tratamento de doenças do sistema nervoso",
      category: "Especialidade",
      url: "#",
      icon: Brain,
    },
    {
      id: "dermatologia",
      title: "Dermatologia",
      description: "Cuidados com a saúde da pele, cabelos e unhas",
      category: "Especialidade",
      url: "/especialidades/dermatologia",
      icon: Shield,
    },
    {
      id: "ginecologia",
      title: "Ginecologia-Obstetrícia",
      description: "Saúde da mulher em todas as fases da vida",
      category: "Especialidade",
      url: "#",
      icon: UserCheck,
    },
    {
      id: "ortopedia",
      title: "Ortopedia",
      description: "Cuidados com ossos, articulações e sistema musculoesquelético",
      category: "Especialidade",
      url: "#",
      icon: Activity,
    },
    {
      id: "otorrino",
      title: "Otorrinolaringologia",
      description: "Tratamento de ouvido, nariz e garganta",
      category: "Especialidade",
      url: "#",
      icon: Eye,
    },
    {
      id: "endocrinologia",
      title: "Endocrinologia",
      description: "Cuidados com hormônios e metabolismo",
      category: "Especialidade",
      url: "#",
      icon: Zap,
    },

    // Médicos
    {
      id: "dr-antonio",
      title: "Dr. António Silva",
      description: "Cardiologista Sênior com 15+ anos de experiência",
      category: "Médico",
      url: "/equipe",
      icon: User,
    },
    {
      id: "dra-maria",
      title: "Dra. Maria Santos",
      description: "Pediatra especializada em neonatologia",
      category: "Médico",
      url: "/equipe",
      icon: User,
    },
    {
      id: "dr-joao",
      title: "Dr. João Mendes",
      description: "Cirurgião Geral especialista em laparoscopia",
      category: "Médico",
      url: "/equipe",
      icon: User,
    },
    {
      id: "dra-ana",
      title: "Dra. Ana Costa",
      description: "Dermatologista com foco em dermatologia estética",
      category: "Médico",
      url: "/equipe",
      icon: User,
    },

    // Exames
    {
      id: "eletrocardiograma",
      title: "Eletrocardiograma",
      description: "Exame que avalia a atividade elétrica do coração",
      category: "Exame",
      url: "/exames",
      icon: FileText,
    },
    {
      id: "ecocardiograma",
      title: "Ecocardiograma",
      description: "Ultrassom do coração para diagnóstico detalhado",
      category: "Exame",
      url: "/exames",
      icon: FileText,
    },
    {
      id: "analises-clinicas",
      title: "Análises Clínicas",
      description: "Exames laboratoriais completos e precisos",
      category: "Exame",
      url: "/exames",
      icon: FileText,
    },
    {
      id: "ultrassom",
      title: "Ultrassom",
      description: "Exames de ultrassonografia para diagnóstico por imagem",
      category: "Exame",
      url: "/exames",
      icon: FileText,
    },
    {
      id: "radiologia",
      title: "Radiologia",
      description: "Exames de raio-X e diagnóstico por imagem",
      category: "Exame",
      url: "/exames",
      icon: FileText,
    },

    // Páginas
    {
      id: "agendamento",
      title: "Agendar Consulta",
      description: "Marque sua consulta online",
      category: "Serviço",
      url: "/contato",
      icon: Calendar,
    },
    {
      id: "contato",
      title: "Contato",
      description: "Entre em contato conosco",
      category: "Página",
      url: "/contato",
      icon: Phone,
    },
    {
      id: "galeria",
      title: "Galeria",
      description: "Conheça nossas instalações modernas",
      category: "Página",
      url: "/galeria",
      icon: Building2,
    },
    {
      id: "equipe",
      title: "Equipe Médica",
      description: "Conheça nossos profissionais qualificados",
      category: "Página",
      url: "/equipe",
      icon: User,
    },
    {
      id: "planos",
      title: "Planos e Convênios",
      description: "Veja os planos de saúde aceitos",
      category: "Página",
      url: "/planos",
      icon: FileText,
    },
    {
      id: "faq",
      title: "Perguntas Frequentes",
      description: "Tire suas dúvidas mais comuns",
      category: "Página",
      url: "/faq",
      icon: FileText,
    },
    {
      id: "portal",
      title: "Portal do Paciente",
      description: "Acesse seus exames e informações",
      category: "Serviço",
      url: "/portal",
      icon: User,
    },

    // Contato/Informações
    {
      id: "telefone",
      title: "Telefone: +244 945 344 650",
      description: "Ligue para agendar ou tirar dúvidas",
      category: "Contato",
      url: "tel:+244945344650",
      icon: Phone,
    },
    {
      id: "email",
      title: "E-mail: recepcao@bemcuidar.co.ao",
      description: "Envie suas dúvidas por e-mail",
      category: "Contato",
      url: "mailto:recepcao@bemcuidar.co.ao",
      icon: Mail,
    },
    {
      id: "endereco",
      title: "Endereço: Avenida 21 de Janeiro, 351",
      description: "Benfica, Luanda - próximo à Talatona",
      category: "Localização",
      url: "/contato",
      icon: Building2,
    },
  ];

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = searchData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.url.startsWith('http') || result.url.startsWith('tel:') || result.url.startsWith('mailto:')) {
      window.open(result.url, '_blank');
    } else {
      navigate(result.url);
    }
    onClose();
    setQuery("");
  };

  const handleClose = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  const categoryColors: Record<string, string> = {
    "Especialidade": "bg-blue-100 text-blue-800",
    "Médico": "bg-green-100 text-green-800",
    "Exame": "bg-purple-100 text-purple-800",
    "Página": "bg-gray-100 text-gray-800",
    "Serviço": "bg-orange-100 text-orange-800",
    "Contato": "bg-red-100 text-red-800",
    "Localização": "bg-yellow-100 text-yellow-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-clinic-primary" />
            Buscar na Clínica Bem Cuidar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por especialidades, médicos, exames..."
              className="pl-10"
              autoFocus
            />
          </div>

          {query.trim() !== "" && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-4 text-left"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <Icon className="w-5 h-5 text-clinic-accent mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-foreground truncate">
                              {result.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={`ml-2 text-xs ${categoryColors[result.category] || 'bg-gray-100 text-gray-800'}`}
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum resultado encontrado para "{query}"</p>
                  <p className="text-sm mt-2">
                    Tente buscar por especialidades, nomes de médicos ou tipos de exames
                  </p>
                </div>
              )}
            </div>
          )}

          {query.trim() === "" && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Digite para buscar...</p>
              <p className="text-sm mt-2">
                Especialidades • Médicos • Exames • Páginas
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
