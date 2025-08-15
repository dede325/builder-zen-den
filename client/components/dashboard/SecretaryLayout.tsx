import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Phone,
  FileText,
  MessageSquare,
  DollarSign,
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  Home,
  Clock,
  ClipboardList,
  Shield,
  AlertTriangle,
  UserPlus,
  CalendarCheck,
  Receipt,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

export default function SecretaryLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  // Mock data para badges
  const pendingAppointments = 12;
  const todayCalls = 8;
  const unreadMessages = 5;
  const pendingPayments = 3;
  const waitingPatients = 4;

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/portal/secretary/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
    },
    {
      name: "Agenda",
      href: "/portal/secretary/appointments",
      icon: Calendar,
      badge: pendingAppointments,
      color: "text-green-600",
    },
    {
      name: "Pacientes",
      href: "/portal/secretary/patients",
      icon: Users,
      badge: waitingPatients,
      color: "text-purple-600",
    },
    {
      name: "Recepção",
      href: "/portal/secretary/reception",
      icon: UserPlus,
      color: "text-indigo-600",
    },
    {
      name: "Financeiro",
      href: "/portal/secretary/billing",
      icon: DollarSign,
      badge: pendingPayments,
      color: "text-orange-600",
    },
    {
      name: "Chamadas",
      href: "/portal/secretary/calls",
      icon: Phone,
      badge: todayCalls,
      color: "text-teal-600",
    },
    {
      name: "Documentos",
      href: "/portal/secretary/documents",
      icon: FileText,
      color: "text-cyan-600",
    },
    {
      name: "Mensagens",
      href: "/portal/secretary/messages",
      icon: MessageSquare,
      badge: unreadMessages,
      color: "text-pink-600",
    },
    {
      name: "Perfil",
      href: "/portal/secretary/profile",
      icon: User,
      color: "text-gray-600",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/portal");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  if (!user || user.role !== "secretary") {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Bem Cuidar
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard Secretaria
                </p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Secretary Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Secretária - Recepção
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {pendingAppointments}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Agenda</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {waitingPatients}
                </div>
                <div className="text-purple-600 dark:text-purple-400">
                  Espera
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : item.color}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant={
                        (item.name === "Agenda" && pendingAppointments > 10) ||
                        (item.name === "Financeiro" && pendingPayments > 0)
                          ? "destructive"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {(pendingAppointments > 10 || waitingPatients > 5) && (
              <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Alta demanda detectada
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Sistema de Recepção Seguro
              </span>
            </div>

            <Link
              to="/"
              className="flex items-center space-x-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Home className="w-4 h-4" />
              <span>Site Principal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page title and time */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {navigation.find((item) => item.href === location.pathname)
                    ?.name || "Dashboard"}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {new Date().toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Current time */}
              <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Quick actions */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                asChild
              >
                <Link to="/portal/secretary/appointments">
                  <CalendarCheck className="w-4 h-4" />
                  {pendingAppointments > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                    >
                      {pendingAppointments > 99 ? "99+" : pendingAppointments}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                asChild
              >
                <Link to="/portal/secretary/messages">
                  <Bell className="w-4 h-4" />
                  {unreadMessages > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                    >
                      {unreadMessages}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Secretária • Recepção
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        Secretária da Recepção
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/portal/secretary/profile"
                      className="flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/portal/secretary/appointments"
                      className="flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Agenda Rápida
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
