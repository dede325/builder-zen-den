import SpecialtyTemplate from '@/components/SpecialtyTemplate';
import { Baby } from 'lucide-react';

const pediatriaInfo = {
  name: 'Pediatria',
  description: 'Cuidados médicos especializados para bebês, crianças e adolescentes',
  icon: Baby,
  fullDescription: 'A Pediatria é a especialidade médica dedicada à assistência à criança e ao adolescente, nos seus diversos aspectos, sejam eles preventivos ou curativos. Nossa equipe pediátrica oferece cuidados abrangentes desde o nascimento até os 18 anos, priorizando o desenvolvimento saudável e o bem-estar integral de cada paciente.',
  benefits: [
    'Acompanhamento do crescimento e desenvolvimento',
    'Vacinação completa conforme calendário',
    'Diagnóstico precoce de condições pediátricas',
    'Orientação nutricional especializada',
    'Cuidados preventivos personalizados',
    'Suporte aos pais e família'
  ],
  doctors: [
    {
      name: 'Dra. Ana Costa',
      credentials: 'Pediatra | CRM 98765',
      experience: '18 anos de experiência',
      specialization: 'Neonatologia'
    },
    {
      name: 'Dr. Carlos Mendes',
      credentials: 'Pediatra | CRM 13579',
      experience: '10 anos de experiência',
      specialization: 'Pediatria Geral'
    },
    {
      name: 'Dra. Sofia Lima',
      credentials: 'Pediatra | CRM 24680',
      experience: '14 anos de experiência',
      specialization: 'Endocrinologia Pediátrica'
    }
  ],
  procedures: [
    {
      name: 'Consulta de Puericultura',
      description: 'Acompanhamento regular do crescimento e desenvolvimento da criança.',
      duration: '30 minutos',
      preparation: 'Trazer cartão de vacinas e exames anteriores'
    },
    {
      name: 'Vacinação',
      description: 'Aplicação de vacinas conforme calendário nacional e internacional.',
      duration: '15 minutos',
      preparation: 'Criança bem, sem febre'
    },
    {
      name: 'Avaliação Nutricional',
      description: 'Análise do estado nutricional e orientações alimentares.',
      duration: '45 minutos',
      preparation: 'Trazer diário alimentar se disponível'
    },
    {
      name: 'Teste do Pezinho',
      description: 'Triagem neonatal para detecção precoce de doenças.',
      duration: '10 minutos',
      preparation: 'Preferencialmente entre 3º e 7º dia de vida'
    },
    {
      name: 'Audiometria Infantil',
      description: 'Avaliação da audição em crianças e adolescentes.',
      duration: '30 minutos',
      preparation: 'Ouvidos limpos, criança cooperativa'
    },
    {
      name: 'Nebulização',
      description: 'Tratamento de problemas respiratórios com medicação inalatória.',
      duration: '20 minutos',
      preparation: 'Jejum de 1 hora'
    }
  ],
  commonConditions: [
    'Resfriados e gripes',
    'Otites',
    'Bronquiolite',
    'Asma infantil',
    'Gastroenterites',
    'Dermatite atópica',
    'Refluxo gastroesofágico',
    'Constipação intestinal',
    'Febre sem foco',
    'Distúrbios do sono'
  ],
  preventiveCare: [
    'Acompanhamento regular com pediatra',
    'Manutenção do calendário vacinal atualizado',
    'Alimentação saudável adequada à idade',
    'Estímulo ao aleitamento materno',
    'Promoção de atividades físicas',
    'Higiene adequada e cuidados preventivos',
    'Acompanhamento do desenvolvimento neuropsicomotor',
    'Orientação sobre segurança infantil'
  ]
};

export default function Pediatria() {
  return <SpecialtyTemplate specialty={pediatriaInfo} />;
}
