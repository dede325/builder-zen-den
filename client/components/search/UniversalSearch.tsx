import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Filter,
  User,
  Calendar,
  FileText,
  Stethoscope,
  TestTube,
  Pill,
  MessageSquare,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  Hash,
  Tag,
  ChevronRight,
  Star,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SearchResult {
  id: string;
  type:
    | "patient"
    | "appointment"
    | "exam"
    | "medical_record"
    | "medication"
    | "doctor"
    | "message";
  title: string;
  subtitle: string;
  description: string;
  metadata: Record<string, any>;
  relevanceScore: number;
  lastUpdated: string;
  status?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  tags?: string[];
}

interface SearchFilter {
  category: string;
  label: string;
  value: any;
  count?: number;
}

interface UniversalSearchProps {
  placeholder?: string;
  categories?: string[];
  onResultSelect?: (result: SearchResult) => void;
  showFilters?: boolean;
  maxResults?: number;
}

export default function UniversalSearch({
  placeholder = "Pesquisar pacientes, consultas, exames...",
  categories = ["all"],
  onResultSelect,
  showFilters = true,
  maxResults = 50,
}: UniversalSearchProps) {
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [availableFilters, setAvailableFilters] = useState<SearchFilter[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: "pat-1",
      type: "patient",
      title: "Carlos Mendes",
      subtitle: "Paciente • Masculino, 38 anos",
      description: "Última consulta: Cardiologia - 15/12/2024",
      metadata: {
        phone: "+244 923 456 789",
        email: "carlos@email.com",
        bloodType: "O+",
        lastVisit: "2024-12-15",
        chronicConditions: ["Hipertensão"],
      },
      relevanceScore: 95,
      lastUpdated: "2024-12-20T10:30:00Z",
      status: "active",
      tags: ["hipertensão", "cardiologia"],
    },
    {
      id: "apt-1",
      type: "appointment",
      title: "Consulta Cardiologia",
      subtitle: "Dr. António Silva • 21/12/2024 14:30",
      description: "Carlos Mendes - Checkup cardíaco de rotina",
      metadata: {
        patientName: "Carlos Mendes",
        doctorName: "Dr. António Silva",
        specialty: "Cardiologia",
        date: "2024-12-21",
        time: "14:30",
        room: "Sala 105",
        duration: 30,
      },
      relevanceScore: 88,
      lastUpdated: "2024-12-20T09:15:00Z",
      status: "scheduled",
      priority: "normal",
    },
    {
      id: "exam-1",
      type: "exam",
      title: "Hemograma Completo",
      subtitle: "Resultado disponível • 18/12/2024",
      description: "Carlos Mendes - Valores dentro da normalidade",
      metadata: {
        patientName: "Carlos Mendes",
        category: "Análises Clínicas",
        results: "Normal",
        requestedBy: "Dr. António Silva",
        collectionDate: "2024-12-18",
      },
      relevanceScore: 82,
      lastUpdated: "2024-12-18T16:45:00Z",
      status: "ready",
      tags: ["hemograma", "análises"],
    },
    {
      id: "med-1",
      type: "medication",
      title: "Losartana 50mg",
      subtitle: "Medicação ativa • 1x ao dia",
      description: "Prescrição para Carlos Mendes - Controle de hipertensão",
      metadata: {
        patientName: "Carlos Mendes",
        dosage: "50mg",
        frequency: "1x ao dia",
        prescribedBy: "Dr. António Silva",
        startDate: "2024-12-15",
        endDate: "2025-01-15",
      },
      relevanceScore: 75,
      lastUpdated: "2024-12-15T11:20:00Z",
      status: "active",
      tags: ["anti-hipertensivo", "cardiovascular"],
    },
    {
      id: "doc-1",
      type: "doctor",
      title: "Dr. António Silva",
      subtitle: "Cardiologista • CRM 12345-AO",
      description: "Especialista em cardiologia clínica e preventiva",
      metadata: {
        specialty: "Cardiologia",
        crm: "12345-AO",
        phone: "+244 923 111 222",
        email: "antonio.silva@bemcuidar.co.ao",
        experience: "15 anos",
        rating: 4.8,
      },
      relevanceScore: 70,
      lastUpdated: "2024-12-19T14:00:00Z",
      status: "active",
      tags: ["cardiologia", "especialista"],
    },
    {
      id: "rec-1",
      type: "medical_record",
      title: "Consulta Cardiologia - 15/12/2024",
      subtitle: "Dr. António Silva • Carlos Mendes",
      description: "Dor torácica investigada, ECG normal, ajuste medicação",
      metadata: {
        patientName: "Carlos Mendes",
        doctorName: "Dr. António Silva",
        specialty: "Cardiologia",
        date: "2024-12-15",
        diagnosis: "Hipertensão arterial",
        followUp: true,
      },
      relevanceScore: 85,
      lastUpdated: "2024-12-15T15:30:00Z",
      status: "active",
      tags: ["dor torácica", "hipertensão", "ecg"],
    },
  ];

  const searchSuggestions = [
    "Carlos Mendes",
    "Consultas cardiologia",
    "Exames pendentes",
    "Dr. António Silva",
    "Hipertensão",
    "Hemograma",
    "Medicações ativas",
    "Pacientes diabéticos",
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query, activeFilters]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock search logic
    const filtered = mockResults.filter((result) => {
      const searchText =
        `${result.title} ${result.subtitle} ${result.description} ${result.tags?.join(" ") || ""}`.toLowerCase();
      const queryMatch = searchText.includes(searchQuery.toLowerCase());

      // Apply active filters
      const filterMatch =
        activeFilters.length === 0 ||
        activeFilters.every((filter) => {
          switch (filter.category) {
            case "type":
              return result.type === filter.value;
            case "status":
              return result.status === filter.value;
            case "priority":
              return result.priority === filter.value;
            case "dateRange":
              const resultDate = new Date(result.lastUpdated);
              const now = new Date();
              const days = Math.floor(
                (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24),
              );
              return days <= filter.value;
            default:
              return true;
          }
        });

      return queryMatch && filterMatch;
    });

    // Sort by relevance score
    const sorted = filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setResults(sorted.slice(0, maxResults));
    setLoading(false);

    // Update suggestions based on search
    const newSuggestions = searchSuggestions.filter(
      (s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()) &&
        s !== searchQuery,
    );
    setSuggestions(newSuggestions);

    // Generate available filters based on results
    generateFilters(sorted);
  };

  const generateFilters = (searchResults: SearchResult[]) => {
    const filters: SearchFilter[] = [];

    // Type filter
    const types = [...new Set(searchResults.map((r) => r.type))];
    types.forEach((type) => {
      const count = searchResults.filter((r) => r.type === type).length;
      filters.push({
        category: "type",
        label: getTypeLabel(type),
        value: type,
        count,
      });
    });

    // Status filter
    const statuses = [
      ...new Set(searchResults.map((r) => r.status).filter(Boolean)),
    ];
    statuses.forEach((status) => {
      const count = searchResults.filter((r) => r.status === status).length;
      filters.push({
        category: "status",
        label: getStatusLabel(status!),
        value: status,
        count,
      });
    });

    // Date range filters
    filters.push(
      { category: "dateRange", label: "Última semana", value: 7 },
      { category: "dateRange", label: "Último mês", value: 30 },
      { category: "dateRange", label: "Últimos 3 meses", value: 90 },
    );

    setAvailableFilters(filters);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      patient: "Pacientes",
      appointment: "Consultas",
      exam: "Exames",
      medical_record: "Prontuários",
      medication: "Medicações",
      doctor: "Médicos",
      message: "Mensagens",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      scheduled: "Agendado",
      completed: "Concluído",
      cancelled: "Cancelado",
      pending: "Pendente",
      ready: "Pronto",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      patient: User,
      appointment: Calendar,
      exam: TestTube,
      medical_record: FileText,
      medication: Pill,
      doctor: Stethoscope,
      message: MessageSquare,
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    // Add to recent searches
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      const updated = [searchQuery, ...recentSearches.slice(0, 9)];
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const addFilter = (filter: SearchFilter) => {
    const existing = activeFilters.find(
      (f) => f.category === filter.category && f.value === filter.value,
    );

    if (!existing) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: SearchFilter) => {
    setActiveFilters(
      activeFilters.filter(
        (f) => !(f.category === filter.category && f.value === filter.value),
      ),
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }

    // Add to recent searches
    if (!recentSearches.includes(result.title)) {
      const updated = [result.title, ...recentSearches.slice(0, 9)];
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const getStatusColor = (status?: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      ready: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority?: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      normal: "bg-blue-100 text-blue-600",
      high: "bg-orange-100 text-orange-600",
      urgent: "bg-red-100 text-red-600",
    };
    return colors[priority as keyof typeof colors] || "";
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={searchInputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20"
        />

        {showFilters && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Dialog
              open={showAdvancedSearch}
              onOpenChange={setShowAdvancedSearch}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Filtros Avançados</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="filters">
                  <TabsList>
                    <TabsTrigger value="filters">Filtros</TabsTrigger>
                    <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
                    <TabsTrigger value="recent">Recentes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="filters" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Type filters */}
                      <div>
                        <h4 className="font-medium mb-2">Tipo de Conteúdo</h4>
                        <div className="space-y-2">
                          {availableFilters
                            .filter((f) => f.category === "type")
                            .map((filter) => (
                              <div
                                key={`${filter.category}-${filter.value}`}
                                className="flex items-center justify-between"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="justify-start"
                                  onClick={() => addFilter(filter)}
                                >
                                  {getTypeIcon(filter.value)}
                                  <span className="ml-2">{filter.label}</span>
                                  {filter.count && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-auto"
                                    >
                                      {filter.count}
                                    </Badge>
                                  )}
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Status filters */}
                      <div>
                        <h4 className="font-medium mb-2">Status</h4>
                        <div className="space-y-2">
                          {availableFilters
                            .filter((f) => f.category === "status")
                            .map((filter) => (
                              <Button
                                key={`${filter.category}-${filter.value}`}
                                variant="outline"
                                size="sm"
                                className="justify-start w-full"
                                onClick={() => addFilter(filter)}
                              >
                                {filter.label}
                                {filter.count && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-auto"
                                  >
                                    {filter.count}
                                  </Badge>
                                )}
                              </Button>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Date range filters */}
                    <div>
                      <h4 className="font-medium mb-2">Período</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableFilters
                          .filter((f) => f.category === "dateRange")
                          .map((filter) => (
                            <Button
                              key={`${filter.category}-${filter.value}`}
                              variant="outline"
                              size="sm"
                              onClick={() => addFilter(filter)}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {filter.label}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions">
                    <div className="space-y-2">
                      <h4 className="font-medium">Pesquisas Sugeridas</h4>
                      {searchSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => {
                            handleSearch(suggestion);
                            setShowAdvancedSearch(false);
                          }}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recent">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Pesquisas Recentes</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("recentSearches");
                          }}
                        >
                          Limpar
                        </Button>
                      </div>
                      {recentSearches.length > 0 ? (
                        recentSearches.map((recent) => (
                          <Button
                            key={recent}
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => {
                              handleSearch(recent);
                              setShowAdvancedSearch(false);
                            }}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {recent}
                          </Button>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Nenhuma pesquisa recente
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center space-x-1"
            >
              <span>{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => removeFilter(filter)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Limpar todos
          </Button>
        </div>
      )}

      {/* Search Results */}
      {query.length >= 2 && (
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-muted-foreground">Pesquisando...</p>
              </div>
            ) : results.length > 0 ? (
              <ScrollArea className="h-96">
                <div className="divide-y">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTypeIcon(result.type)}
                            <h4 className="font-medium">{result.title}</h4>
                            {result.status && (
                              <Badge className={getStatusColor(result.status)}>
                                {getStatusLabel(result.status)}
                              </Badge>
                            )}
                            {result.priority &&
                              result.priority !== "normal" && (
                                <Badge
                                  className={getPriorityColor(result.priority)}
                                >
                                  {result.priority}
                                </Badge>
                              )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {result.subtitle}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {result.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {result.metadata.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{result.metadata.phone}</span>
                              </div>
                            )}
                            {result.metadata.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{result.metadata.email}</span>
                              </div>
                            )}
                            {result.metadata.room && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{result.metadata.room}</span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {result.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{result.tags.length - 3} mais
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-1 ml-4">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3" />
                            <span>{result.relevanceScore}%</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(result.lastUpdated),
                              "dd/MM HH:mm",
                            )}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-6 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os termos de pesquisa ou filtros
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.slice(0, 3).map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick suggestions when not searching */}
      {query.length < 2 && suggestions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Pesquisas Populares</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 6).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
