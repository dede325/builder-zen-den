import { Helmet } from "react-helmet-async";
import { angolaFormatter } from "@/lib/locale-angola";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
}

export default function SEOHead({
  title = "Clínica Bem Cuidar - Cuidados de Saúde Premium em Luanda, Angola",
  description = "Clínica médica premium em Luanda, Angola. Especialistas qualificados, tecnologia avançada e atendimento humanizado. Agendamento online 24h. Conveniamos com seguros.",
  canonical,
  ogImage = "/images/clinic-hero-og.jpg",
  ogType = "website",
  structuredData,
  noindex = false
}: SEOHeadProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonicalUrl = canonical || currentUrl;

  // Default structured data for medical business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://bemcuidar.co.ao",
    "name": "Clínica Bem Cuidar",
    "description": description,
    "url": "https://bemcuidar.co.ao",
    "logo": "https://bemcuidar.co.ao/logo.png",
    "image": [
      "https://bemcuidar.co.ao/images/clinic-exterior.jpg",
      "https://bemcuidar.co.ao/images/reception.jpg",
      "https://bemcuidar.co.ao/images/equipment.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida 21 de Janeiro, Nº 351",
      "addressLocality": "Benfica",
      "addressRegion": "Luanda",
      "addressCountry": "AO",
      "addressCountryName": "Angola"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.8383,
      "longitude": 13.2344
    },
    "telephone": "+244945344650",
    "email": "recepcao@bemcuidar.co.ao",
    "openingHours": [
      "Mo-Fr 07:00-19:00",
      "Sa 07:00-13:00"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "07:00",
        "closes": "13:00"
      }
    ],
    "priceRange": "Kz 5.000 - Kz 50.000",
    "currenciesAccepted": "AOA",
    "paymentAccepted": "Cash, Credit Card, Insurance",
    "medicalSpecialty": [
      "Cardiology",
      "Pediatrics", 
      "General Surgery",
      "Dermatology",
      "Neurology",
      "Gynecology",
      "Orthopedics",
      "Otolaryngology",
      "Urology",
      "Endocrinology",
      "Gastroenterology",
      "Occupational Medicine"
    ],
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Consulta Médica Geral",
        "description": "Consulta médica de rotina e diagnóstico"
      },
      {
        "@type": "MedicalProcedure", 
        "name": "Exames Cardiológicos",
        "description": "ECG, Ecocardiograma, Holter 24h"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Análises Clínicas",
        "description": "Exames laboratoriais completos"
      }
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Medical License",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Ordem dos Médicos de Angola"
      }
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Maria S."
        },
        "reviewBody": "Excelente atendimento e profissionais muito qualificados. Recomendo!"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "areaServed": {
      "@type": "State",
      "name": "Luanda",
      "containedInPlace": {
        "@type": "Country",
        "name": "Angola"
      }
    },
    "knowsAbout": [
      "Cardiologia",
      "Pediatria", 
      "Cirurgia Geral",
      "Dermatologia",
      "Neurologia",
      "Medicina Preventiva",
      "Diagnóstico por Imagem"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Associação Médica de Angola"
    },
    "sameAs": [
      "https://www.facebook.com/clinicabemcuidar",
      "https://www.instagram.com/clinicabemcuidar",
      "https://www.linkedin.com/company/clinica-bem-cuidar"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="clínica médica luanda, médicos angola, cardiologia luanda, pediatria angola, exames médicos luanda, seguro saúde angola, consulta médica online angola, hospital luanda, cirurgia angola, diagnóstico médico luanda" />
      <meta name="author" content="Clínica Bem Cuidar" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and Locale */}
      <html lang="pt-AO" />
      <meta name="language" content="pt-AO" />
      <meta name="geo.region" content="AO-LUA" />
      <meta name="geo.placename" content="Luanda" />
      <meta name="geo.position" content="-8.8383;13.2344" />
      <meta name="ICBM" content="-8.8383, 13.2344" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Clínica Bem Cuidar - Instalações modernas em Luanda" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Clínica Bem Cuidar" />
      <meta property="og:locale" content="pt_AO" />
      <meta property="og:locale:alternate" content="pt_PT" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Clínica Bem Cuidar" />
      <meta name="twitter:site" content="@clinicabemcuidar" />

      {/* Mobile and Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Bem Cuidar" />
      <meta name="msapplication-TileColor" content="#79cbcb" />
      <meta name="theme-color" content="#79cbcb" />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://images.pexels.com" />

      {/* Medical and Healthcare Specific */}
      <meta name="medical-disclaimer" content="As informações neste website não substituem o aconselhamento médico profissional. Consulte sempre um médico qualificado." />
      <meta name="healthcare-provider" content="Clínica Bem Cuidar, Luanda, Angola" />
      <meta name="medical-license" content="Licenciada pela Ordem dos Médicos de Angola" />

      {/* Business Information */}
      <meta name="business-hours" content="Segunda-Sexta: 07:00-19:00, Sábado: 07:00-13:00" />
      <meta name="contact-phone" content="+244945344650" />
      <meta name="contact-email" content="recepcao@bemcuidar.co.ao" />
      <meta name="business-address" content="Avenida 21 de Janeiro, Nº 351, Benfica, Luanda, Angola" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Additional Medical Business Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://bemcuidar.co.ao/#website",
          "url": "https://bemcuidar.co.ao",
          "name": "Clínica Bem Cuidar",
          "description": "Website oficial da Clínica Bem Cuidar em Luanda, Angola",
          "publisher": {
            "@id": "https://bemcuidar.co.ao"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://bemcuidar.co.ao/buscar?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "inLanguage": "pt-AO"
        })}
      </script>

      {/* Breadcrumb Structured Data for better navigation */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": "https://bemcuidar.co.ao"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "Especialidades",
              "item": "https://bemcuidar.co.ao/especialidades"
            },
            {
              "@type": "ListItem",
              "position": 3, 
              "name": "Contato",
              "item": "https://bemcuidar.co.ao/contato"
            }
          ]
        })}
      </script>

      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Quais são os horários de funcionamento da Clínica Bem Cuidar?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Clínica Bem Cuidar funciona de Segunda a Sexta das 07:00 às 19:00 e aos Sábados das 07:00 às 13:00. Domingos fechados. Atendimento de urgência disponível 24 horas."
              }
            },
            {
              "@type": "Question",
              "name": "Como posso agendar uma consulta?",
              "acceptedAnswer": {
                "@type": "Answer", 
                "text": "Pode agendar uma consulta através do nosso website, por telefone (+244 945 344 650) ou presencialmente na clínica. Também oferecemos agendamento online 24h através do Portal do Paciente."
              }
            },
            {
              "@type": "Question",
              "name": "A clínica aceita seguros de saúde?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, temos convenios com as principais seguradoras de Angola. Contacte-nos para verificar se o seu seguro está incluído na nossa rede."
              }
            },
            {
              "@type": "Question",
              "name": "Onde fica localizada a clínica?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Clínica Bem Cuidar está localizada na Avenida 21 de Janeiro, Nº 351, Benfica, Luanda, próximo à Talatona."
              }
            }
          ]
        })}
      </script>

      {/* Healthcare Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthcareOrganization",
          "name": "Clínica Bem Cuidar",
          "description": "Clínica médica especializada oferecendo cuidados de saúde de alta qualidade em Luanda, Angola",
          "url": "https://bemcuidar.co.ao",
          "logo": "https://bemcuidar.co.ao/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+244945344650",
            "contactType": "customer service",
            "availableLanguage": ["Portuguese"],
            "areaServed": "AO"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Avenida 21 de Janeiro, Nº 351",
            "addressLocality": "Benfica",
            "addressRegion": "Luanda", 
            "addressCountry": "AO"
          },
          "medicalSpecialty": [
            "https://schema.org/Cardiology",
            "https://schema.org/Pediatrics",
            "https://schema.org/GeneralSurgery",
            "https://schema.org/Dermatology"
          ]
        })}
      </script>

      {/* Performance Optimization */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Helmet>
  );
}

// Hook for dynamic SEO updates
export const useSEO = () => {
  const updateSEO = (seoData: Partial<SEOHeadProps>) => {
    // This would be used to dynamically update SEO data
    // Implementation depends on your routing solution
    console.log('Updating SEO data:', seoData);
  };

  return { updateSEO };
};

// Utility function to generate page-specific SEO
export const generatePageSEO = (pageName: string, customData?: Partial<SEOHeadProps>) => {
  const seoConfigs = {
    especialidades: {
      title: "Especialidades Médicas - Clínica Bem Cuidar | Luanda, Angola",
      description: "Conheça nossas especialidades médicas: Cardiologia, Pediatria, Cirurgia Geral, Dermatologia e mais. Especialistas qualificados em Luanda, Angola.",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalSpecialty",
        "name": "Especialidades Médicas da Clínica Bem Cuidar"
      }
    },
    contato: {
      title: "Contato e Agendamento - Clínica Bem Cuidar | Luanda",
      description: "Entre em contato com a Clínica Bem Cuidar. Agende sua consulta online ou por telefone. Estamos em Benfica, Luanda, Angola.",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contato - Clínica Bem Cuidar"
      }
    },
    sobre: {
      title: "Sobre a Clínica Bem Cuidar - História e Missão | Luanda, Angola",
      description: "Conheça a história da Clínica Bem Cuidar, nossa missão de proporcionar cuidados de saúde de excelência em Luanda, Angola.",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Sobre - Clínica Bem Cuidar"
      }
    }
  };

  const pageConfig = seoConfigs[pageName as keyof typeof seoConfigs] || {};
  return { ...pageConfig, ...customData };
};

console.log('[SEO] SEO Head component loaded for Angola locale');
