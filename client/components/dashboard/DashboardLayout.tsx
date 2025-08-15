import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useMedicalStore } from "@/store/medical";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  User,
  Heart,
} from "lucide-react";
import OptimizedDashboardLayout from "./OptimizedDashboardLayout";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const { messages, appointments, examResults } = useMedicalStore();

  // Contar itens não lidos/pendentes para badges
  const unreadMessages = messages.filter((msg) => !msg.read).length;
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled",
  ).length;
  const newExamResults = examResults.filter((exam) => !exam.viewed).length;

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/portal/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Consultas",
      href: "/portal/appointments",
      icon: Calendar,
      badge: pendingAppointments,
      color: "text-green-600 dark:text-green-400",
    },
    {
      name: "Exames",
      href: "/portal/exams",
      icon: FileText,
      badge: newExamResults,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Mensagens",
      href: "/portal/messages",
      icon: MessageSquare,
      badge: unreadMessages,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "Faturas",
      href: "/portal/invoices",
      icon: CreditCard,
      color: "text-red-600 dark:text-red-400",
    },
    {
      name: "Perfil",
      href: "/portal/profile",
      icon: User,
      color: "text-gray-600 dark:text-gray-400",
    },
  ];

  const quickStats = [
    {
      label: "Consultas",
      value: pendingAppointments,
      color:
        "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      label: "Exames",
      value: newExamResults,
      color:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <OptimizedDashboardLayout
      navigation={navigation}
      title="Portal do Paciente"
      subtitle={user.email}
      headerIcon={Heart}
      showQuickStats={true}
      quickStats={quickStats}
    >
      <Outlet />
    </OptimizedDashboardLayout>
  );
}
