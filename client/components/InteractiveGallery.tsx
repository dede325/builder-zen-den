import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  MapPin,
  Users,
  Stethoscope,
  Activity,
  Building2,
  Microscope,
  Heart,
  ShieldCheck,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  location: string;
  tags: string[];
}

interface InteractiveGalleryProps {
  items?: GalleryItem[];
}

export default function InteractiveGallery({ items }: InteractiveGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultItems: GalleryItem[] = [
    {
      id: "1",
      title: "Recepção Principal",
      description:
        "Ambiente acolhedor e moderno para receber nossos pacientes com conforto e eficiência.",
      imageUrl:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "recepcao",
      location: "Térreo - Entrada Principal",
      tags: ["Atendimento", "Recepção", "Conforto"],
    },
    {
      id: "2",
      title: "Consultório de Cardiologia",
      description:
        "Consultório especializado equipado com tecnologia avançada para diagnósticos cardiológicos precisos.",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "consultorios",
      location: "1º Andar - Ala Norte",
      tags: ["Cardiologia", "Diagnóstico", "Tecnologia"],
    },
    {
      id: "3",
      title: "Laboratório de Análises",
      description:
        "Laboratório moderno com equipamentos de última geração para análises clínicas completas.",
      imageUrl:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "laboratorio",
      location: "Térreo - Ala Sul",
      tags: ["Análises", "Laboratório", "Precisão"],
    },
    {
      id: "4",
      title: "Sala de Ecocardiograma",
      description:
        "Ambiente preparado para exames de ecocardiograma com equipamentos de alta resolução.",
      imageUrl:
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "exames",
      location: "1º Andar - Ala Sul",
      tags: ["Ecocardiograma", "Cardiologia", "Diagnóstico"],
    },
    {
      id: "5",
      title: "Centro Cirúrgico",
      description:
        "Centro cirúrgico com tecnologia de ponta e ambiente esterilizado para procedimentos seguros.",
      imageUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "cirurgia",
      location: "2º Andar - Centro",
      tags: ["Cirurgia", "Esterilização", "Segurança"],
    },
    {
      id: "6",
      title: "Consultório Pediátrico",
      description:
        "Ambiente lúdico e acolhedor especialmente projetado para o atendimento de crianças.",
      imageUrl:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "consultorios",
      location: "1º Andar - Ala Leste",
      tags: ["Pediatria", "Crianças", "Lúdico"],
    },
    {
      id: "7",
      title: "Sala de Radiologia",
      description:
        "Equipamentos modernos de radiologia digital para exames de imagem de alta qualidade.",
      imageUrl:
        "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "exames",
      location: "Térreo - Ala Norte",
      tags: ["Radiologia", "Imagem", "Digital"],
    },
    {
      id: "8",
      title: "Farmácia Hospitalar",
      description:
        "Farmácia interna com medicamentos selecionados e atendimento farmacêutico especializado.",
      imageUrl:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "farmacia",
      location: "Térreo - Próximo à Recepção",
      tags: ["Farmácia", "Medicamentos", "Atendimento"],
    },
    {
      id: "9",
      title: "Sala de Espera VIP",
      description:
        "Ambiente exclusivo para pacientes com atendimento personalizado e maior privacidade.",
      imageUrl:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "recepcao",
      location: "1º Andar - Entrada VIP",
      tags: ["VIP", "Exclusivo", "Privacidade"],
    },
    {
      id: "10",
      title: "Consultório de Dermatologia",
      description:
        "Consultório especializado com iluminação adequada para exames dermatológicos detalhados.",
      imageUrl:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "consultorios",
      location: "1º Andar - Ala Oeste",
      tags: ["Dermatologia", "Iluminação", "Especializado"],
    },
    {
      id: "11",
      title: "Sala de Recuperação",
      description:
        "Ambiente tranquilo e monitorado para recuperação pós-procedimentos e cirurgias.",
      imageUrl:
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "cirurgia",
      location: "2º Andar - Ala Norte",
      tags: ["Recuperação", "Monitoramento", "Conforto"],
    },
    {
      id: "12",
      title: "Equipamento de Ultrassom",
      description:
        "Aparelho de ultrassom de última geração para exames precisos e detalhados.",
      imageUrl:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "equipamentos",
      location: "1º Andar - Sala de Exames",
      tags: ["Ultrassom", "Tecnologia", "Precisão"],
    },
  ];

  const galleryItems = items || defaultItems;

  const categories = [
    { id: "all", name: "Todos", icon: Building2 },
    { id: "recepcao", name: "Recepção", icon: Users },
    { id: "consultorios", name: "Consultórios", icon: Stethoscope },
    { id: "exames", name: "Salas de Exame", icon: Activity },
    { id: "laboratorio", name: "Laboratório", icon: Microscope },
    { id: "cirurgia", name: "Centro Cirúrgico", icon: Heart },
    { id: "equipamentos", name: "Equipamentos", icon: ShieldCheck },
    { id: "farmacia", name: "Farmácia", icon: Building2 },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentSlideIndex(filteredItems.findIndex((i) => i.id === item.id));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsPlaying(false);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlideIndex + 1) % filteredItems.length;
    setCurrentSlideIndex(nextIndex);
    setSelectedItem(filteredItems[nextIndex]);
  };

  const prevSlide = () => {
    const prevIndex =
      (currentSlideIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentSlideIndex(prevIndex);
    setSelectedItem(filteredItems[prevIndex]);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 ${
                selectedCategory === category.id ? "bg-clinic-gradient" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => openModal(item)}
          >
            <div className="relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-white/90 text-black"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-clinic-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{item.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          {selectedItem && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-bold">
                  {selectedItem.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 relative">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-96 object-cover"
                />

                {/* Navigation Controls */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Slide Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentSlideIndex + 1} / {filteredItems.length}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1 text-clinic-accent" />
                    <span>{selectedItem.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-clinic-primary border-clinic-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
