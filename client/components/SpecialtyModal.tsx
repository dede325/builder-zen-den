import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SpecialtyInfo {
  name: string;
  icon: LucideIcon;
  description: string;
  detailedDescription: string;
  conditions: string[];
  procedures: string[];
  imageUrl: string;
  specialists: string[];
}

interface SpecialtyModalProps {
  specialty: SpecialtyInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SpecialtyModal({ specialty, isOpen, onClose }: SpecialtyModalProps) {
  if (!specialty) return null;

  const IconComponent = specialty.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-clinic-gradient rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-clinic-primary">
                {specialty.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {specialty.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem da especialidade */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src={specialty.imageUrl}
              alt={specialty.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Descrição detalhada */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-clinic-primary">Sobre a Especialidade</h4>
            <p className="text-muted-foreground leading-relaxed">
              {specialty.detailedDescription}
            </p>
          </div>

          {/* Condições tratadas */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-clinic-primary">Principais Condições Tratadas</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {specialty.conditions.map((condition, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-clinic-accent rounded-full mr-2" />
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* Procedimentos */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-clinic-primary">Principais Procedimentos</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {specialty.procedures.map((procedure, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-clinic-accent rounded-full mr-2" />
                  {procedure}
                </li>
              ))}
            </ul>
          </div>

          {/* Especialistas */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-clinic-primary">Nossa Equipe</h4>
            <div className="flex flex-wrap gap-2">
              {specialty.specialists.map((specialist, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-clinic-light/50 text-clinic-primary text-sm rounded-full"
                >
                  Dr(a). {specialist}
                </span>
              ))}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to="/contato" className="flex-1">
              <Button className="w-full bg-clinic-gradient hover:opacity-90">
                Agendar Consulta
              </Button>
            </Link>
            <Link to="/portal" className="flex-1">
              <Button variant="outline" className="w-full">
                Portal do Paciente
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
