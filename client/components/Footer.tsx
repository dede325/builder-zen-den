import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { ServerDateResponse } from "@shared/api";

interface FooterProps {
  variant?: "default" | "simple";
  className?: string;
}

export default function Footer({
  variant = "default",
  className = "",
}: FooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch current year from server
  useEffect(() => {
    const fetchServerDate = async () => {
      try {
        const response = await fetch("/api/server-date");
        const data: ServerDateResponse = await response.json();
        setCurrentYear(data.year);
      } catch (error) {
        console.warn("Failed to fetch server date, using client date:", error);
        setCurrentYear(new Date().getFullYear());
      }
    };

    fetchServerDate();
  }, []);

  if (variant === "simple") {
    return (
      <footer className={`bg-gray-900 text-white py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                  alt="Clínica Bem Cuidar Logo"
                  className="w-10 h-10 object-contain filter brightness-0 invert"
                />
                <div>
                  <h4 className="text-xl font-bold">Clínica Bem Cuidar</h4>
                  <p className="text-gray-300">Cuidar é Amar</p>
                </div>
              </div>
              <p className="text-gray-300">
                Cuidamos da sua saúde com humanização, tecnologia e excelência
                médica.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <div className="space-y-2 text-gray-300">
                <p>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Av. 21 de Janeiro, Nº 351, Benfica
                </p>
                <p>
                  <Phone className="w-4 h-4 inline mr-2" />
                  +244 945 344 650
                </p>
                <p>
                  <Mail className="w-4 h-4 inline mr-2" />
                  recepcao@bemcuidar.co.ao
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link
                  to="/portal"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Portal do Paciente
                </Link>
                <Link
                  to="/#especialidades"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Especialidades
                </Link>
                <Link
                  to="/exames"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Exames
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>
              &copy; {currentYear} Clínica Bem Cuidar. Desenvolvido por{" "}
              <a
                href="https://bestservices.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 font-semibold underline transition-colors"
              >
                Kaijhe Morose
              </a>{" "}
              - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-clinic-gradient text-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-10 h-10 object-contain filter brightness-0 invert"
              />
              <div>
                <h4 className="text-xl font-bold">Clínica Bem Cuidar</h4>
                <p className="text-blue-100">Cuidar é Amar</p>
              </div>
            </div>
            <p className="text-blue-100">
              Cuidamos da sua saúde com humanização, tecnologia e excelência
              médica.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Contato</h5>
            <div className="space-y-2 text-blue-100">
              <p>
                <MapPin className="w-4 h-4 inline mr-2" />
                Av. 21 de Janeiro, Nº 351, Benfica
              </p>
              <p>
                <Phone className="w-4 h-4 inline mr-2" />
                +244 945 344 650
              </p>
              <p>
                <Mail className="w-4 h-4 inline mr-2" />
                recepcao@bemcuidar.co.ao
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Links Úteis</h5>
            <div className="space-y-2">
              <Link
                to="/portal"
                className="block text-blue-100 hover:text-white transition-colors"
              >
                Portal do Paciente
              </Link>
              <a
                href="#especialidades"
                className="block text-blue-100 hover:text-white transition-colors"
              >
                Especialidades
              </a>
              <a
                href="#exames"
                className="block text-blue-100 hover:text-white transition-colors"
              >
                Exames
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-600 mt-8 pt-8 text-center text-blue-100">
          <p>
            &copy; {currentYear} Clínica Bem Cuidar. Desenvolvido por{" "}
            <a
              href="https://bestservices.ao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 font-semibold underline transition-colors"
            >
              Kaijhe Morose
            </a>{" "}
            - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
