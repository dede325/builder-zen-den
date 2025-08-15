import { Outlet } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  Package,
  Activity,
  Heart,
} from "lucide-react";
import OptimizedDashboardLayout from "../dashboard/OptimizedDashboardLayout";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  description?: string;
  color?: string;
}

const managerNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral da clínica",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Funcionários",
    href: "/manager/staff",
    icon: Users,
    description: "Gestão de equipe",
    color: "text-green-600 dark:text-green-400",
  },
  {
    name: "Consultas",
    href: "/manager/appointments",
    icon: Calendar,
    badge: 5,
    description: "Agendamentos e consultas",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Exames",
    href: "/manager/exams",
    icon: FileText,
    badge: 3,
    description: "Gestão de exames",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Mensagens",
    href: "/manager/messages",
    icon: MessageSquare,
    badge: 12,
    description: "Comunicação interna",
    color: "text-red-600 dark:text-red-400",
  },
  {
    name: "Financeiro",
    href: "/manager/finances",
    icon: DollarSign,
    description: "Relatórios financeiros",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Estoque",
    href: "/manager/inventory",
    icon: Package,
    description: "Controle de estoque",
    color: "text-amber-600 dark:text-amber-400",
  },
];

export function ManagerLayout() {
  const quickStats = [
    {
      label: "Consultas",
      value: 5,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Mensagens",
      value: 12,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
  ];

  const rightHeaderContent = (
    <div className="flex items-center gap-2">
      {/* Quick Actions */}
      <button className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
        <Activity className="w-4 h-4" />
        Relatório
      </button>
    </div>
  );

  return (
    <OptimizedDashboardLayout
      navigation={managerNavigation}
      title="Gestão da Clínica"
      subtitle="Gestor Geral • gestor@bemcuidar.ao"
      headerIcon={Heart}
      showQuickStats={true}
      quickStats={quickStats}
      rightHeaderContent={rightHeaderContent}
    >
      <Outlet />
    </OptimizedDashboardLayout>
  );
}

export default ManagerLayout;
