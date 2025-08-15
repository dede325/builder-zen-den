import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { useMedicalStore } from "@/store/medical";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  Home,
  Activity,
  Heart,
  Shield,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
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

  const handleLogout = () => {
    logout();
    navigate("/portal");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  // Aplicar dark mode no carregamento inicial
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  // Salvar preferência do dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  // Fechar sidebar ao navegar em mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Fechar sidebar quando clicar fora em mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        const menuButton = document.getElementById('mobile-menu-button');
        
        if (sidebar && menuButton && 
            !sidebar.contains(event.target as Node) && 
            !menuButton.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  if (!user) {
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? "dark" : ""}`}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-clinic-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Bem Cuidar
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Portal do Paciente
                </p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 btn-hover-lift"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium group sidebar-item-hover focus-ring-enhanced ${
                    isActive
                      ? "active bg-primary text-primary-foreground shadow-accessible"
                      : "text-sidebar-foreground"
                  }`}
                  onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-primary" : item.color
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Conexão Segura
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            {/* Mobile menu button */}
            <Button
              id="mobile-menu-button"
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 btn-hover-lift"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page title */}
            <div className="hidden lg:block">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Dashboard"}
              </h1>
            </div>

            {/* Mobile page title */}
            <div className="lg:hidden flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Dashboard"}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 w-9 h-9 btn-hover-lift"
                aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2 w-9 h-9 btn-hover-lift">
                <Bell className="w-4 h-4" />
                {unreadMessages + newExamResults > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center badge-hover"
                  >
                    {unreadMessages + newExamResults > 99 ? '99+' : unreadMessages + newExamResults}
                  </Badge>
                )}
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 sm:space-x-3 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-clinic-gradient text-white text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {user.email}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/portal/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
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
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
