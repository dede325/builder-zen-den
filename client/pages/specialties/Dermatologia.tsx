import SpecialtyTemplate from '@/components/SpecialtyTemplate';
import { Shield } from 'lucide-react';

const dermatologiaInfo = {
  name: 'Dermatologia',
  description: 'Cuidados especializados da pele, cabelos e unhas',
  icon: Shield,
  fullDescription: 'A Dermatologia é a especialidade médica que cuida da saúde da pele, cabelos, unhas e mucosas. Nossa equipe oferece tratamentos preventivos, diagnósticos e terapêuticos para todas as condições dermatológicas, desde cuidados estéticos até tratamentos de doenças complexas.',
  benefits: [
    'Prevenção do câncer de pele',
    'Tratamento de doenças dermatológicas',
    'Cuidados estéticos especializados',
    'Melhoria da autoestima',
    'Acompanhamento de lesões de pele',
    'Orientações preventivas personalizadas'
  ],
  doctors: [
    {
      name: 'Dr. Paulo Mendes',
      credentials: 'Dermatologista | CRM 11111',
      experience: '16 anos de experiência',
      specialization: 'Dermatologia Clínica'
    },
    {
      name: 'Dra. Isabel Santos',
      credentials: 'Dermatologista | CRM 22222',
      experience: '12 anos de experiência',
      specialization: 'Dermatologia Estética'
    }
  ],
  procedures: [
    {
      name: 'Dermatoscopia',
      description: 'Exame detalhado de pintas e lesões de pele.',
      duration: '20 minutos',
      preparation: 'Pele limpa, sem maquiagem'
    },
    {
      name: 'Biópsia de Pele',
      description: 'Coleta de amostra de tecido para análise histopatológica.',
      duration: '30 minutos',
      preparation: 'Jejum de 4 horas, não tomar anticoagulantes'
    },
    {
      name: 'Crioterapia',
      description: 'Tratamento com nitrogênio líquido para lesões benignas.',
      duration: '15 minutos',
      preparation: 'Área limpa e seca'
    },
    {
      name: 'Peeling Químico',
      description: 'Renovação da pele através de ácidos específicos.',
      duration: '45 minutos',
      preparation: 'Evitar exposição solar 15 dias antes'
    }
  ],
  commonConditions: [
    'Acne',
    'Dermatite',
    'Psoríase',
    'Vitiligo',
    'Melanoma',
    'Rosácea',
    'Eczema',
    'Verrugas',
    'Micoses',
    'Alopecia'
  ],
  preventiveCare: [
    'Uso diário de protetor solar',
    'Autoexame mensal da pele',
    'Hidratação adequada da pele',
    'Evitar exposição solar excessiva',
    'Consultas dermatológicas anuais',
    'Cuidados adequados com produtos cosméticos'
  ]
};

export default function Dermatologia() {
  return <SpecialtyTemplate specialty={dermatologiaInfo} />;
}
