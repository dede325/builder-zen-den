import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useDoctorStore } from "@/store/doctor";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import OptimizedDashboardLayout from "./OptimizedDashboardLayout";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

export default function DoctorLayout() {
  const { user } = useAuthStore();
  const { messages, consultations, exams } = useDoctorStore();

  // Contar itens não lidos/pendentes para badges
  const unreadMessages = messages.filter(
    (msg) => !msg.read && msg.recipientId === user?.id,
  ).length;
  const urgentMessages = messages.filter(
    (msg) =>
      !msg.read && msg.priority === "urgent" && msg.recipientId === user?.id,
  ).length;
  const todayConsultations = consultations.filter((consult) => {
    const today = new Date().toISOString().split("T")[0];
    return consult.date === today && consult.status === "scheduled";
  }).length;
  const pendingExams = exams.filter(
    (exam) => exam.status === "requested" || exam.status === "scheduled",
  ).length;

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/portal/doctor/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Meus Pacientes",
      href: "/portal/doctor/patients",
      icon: Users,
      color: "text-green-600 dark:text-green-400",
    },
    {
      name: "Consultas",
      href: "/portal/doctor/consultations",
      icon: Calendar,
      badge: todayConsultations,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Exames",
      href: "/portal/doctor/exams",
      icon: FileText,
      badge: pendingExams,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "Mensagens",
      href: "/portal/doctor/messages",
      icon: MessageSquare,
      badge: unreadMessages,
      color: "text-red-600 dark:text-red-400",
    },
    {
      name: "Perfil Médico",
      href: "/portal/doctor/profile",
      icon: User,
      color: "text-gray-600 dark:text-gray-400",
    },
  ];

  const quickStats = [
    {
      label: "Hoje",
      value: todayConsultations,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Exames",
      value: pendingExams,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    },
  ];

  const rightHeaderContent = urgentMessages > 0 ? (
    <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
      <span className="text-xs font-medium text-red-600 dark:text-red-400">
        {urgentMessages} urgente(s)
      </span>
    </div>
  ) : null;

  if (!user || user.role !== "doctor") {
    return null;
  }

  return (
    <OptimizedDashboardLayout
      navigation={navigation}
      title="Dashboard Médico"
      subtitle="Cardiologista • CRM-AO-12345"
      headerIcon={Stethoscope}
      showQuickStats={true}
      quickStats={quickStats}
      rightHeaderContent={rightHeaderContent}
    >
      <Outlet />
    </OptimizedDashboardLayout>
  );
}
