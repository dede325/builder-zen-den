import SpecialtyTemplate from "@/components/SpecialtyTemplate";
import { Heart } from "lucide-react";

const cardiologyInfo = {
  name: "Cardiologia",
  description: "Cuidados especializados do coração e sistema cardiovascular",
  icon: Heart,
  fullDescription:
    "A Cardiologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção das doenças do coração e do sistema cardiovascular. Nossa equipe de cardiologistas utiliza tecnologia de ponta para oferecer cuidados personalizados e tratamentos eficazes para todas as condições cardíacas.",
  benefits: [
    "Diagnóstico precoce de doenças cardíacas",
    "Prevenção de eventos cardiovasculares",
    "Melhoria da qualidade de vida",
    "Acompanhamento especializado",
    "Tratamentos minimamente invasivos",
    "Reabilitação cardiovascular completa",
  ],
  doctors: [
    {
      name: "Dr. António Silva",
      credentials: "Cardiologista | CRM 12345",
      experience: "15 anos de experiência",
      specialization: "Cardiologia Intervencionista",
    },
    {
      name: "Dra. Maria Santos",
      credentials: "Cardiologista | CRM 67890",
      experience: "12 anos de experiência",
      specialization: "Ecocardiografia",
    },
    {
      name: "Dr. João Pereira",
      credentials: "Cardiologista | CRM 54321",
      experience: "20 anos de experiência",
      specialization: "Eletrofisiologia",
    },
  ],
  procedures: [
    {
      name: "Eletrocardiograma (ECG)",
      description:
        "Exame que registra a atividade elétrica do coração para detectar arritmias e outras alterações.",
      duration: "15 minutos",
      preparation: "Não é necessária preparação especial",
    },
    {
      name: "Ecocardiograma",
      description:
        "Ultrassom do coração que avalia a estrutura e função cardíaca.",
      duration: "30 minutos",
      preparation: "Jejum de 2 horas",
    },
    {
      name: "Teste de Esforço",
      description:
        "Avaliação da resposta cardiovascular durante exercício físico controlado.",
      duration: "45 minutos",
      preparation: "Roupas confortáveis, evitar cafeína 24h antes",
    },
    {
      name: "Holter 24h",
      description: "Monitoramento contínuo do ritmo cardíaco por 24 horas.",
      duration: "24 horas",
      preparation: "Banho antes da colocação do aparelho",
    },
    {
      name: "MAPA",
      description:
        "Monitorização ambulatorial da pressão arterial por 24 horas.",
      duration: "24 horas",
      preparation: "Atividades normais, evitar exercícios intensos",
    },
    {
      name: "Cateterismo Cardíaco",
      description:
        "Procedimento invasivo para avaliação das artérias coronárias.",
      duration: "60-90 minutos",
      preparation: "Jejum de 8 horas, exames pré-operatórios",
    },
  ],
  commonConditions: [
    "Hipertensão arterial",
    "Arritmias cardíacas",
    "Infarto do miocárdio",
    "Angina do peito",
    "Insuficiência cardíaca",
    "Valvulopatias",
    "Cardiomiopatias",
    "Doença arterial coronariana",
    "Pericardite",
    "Sopros cardíacos",
  ],
  preventiveCare: [
    "Controle regular da pressão arterial",
    "Manutenção de peso saudável",
    "Prática regular de exercícios físicos",
    "Alimentação balanceada e rica em frutas e vegetais",
    "Não fumar e evitar álcool em excesso",
    "Controle do estresse",
    "Exames cardiológicos periódicos",
    "Controle do colesterol e diabetes",
  ],
};

export default function Cardiologia() {
  return <SpecialtyTemplate specialty={cardiologyInfo} />;
}
