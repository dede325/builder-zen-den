import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  Package,
  User,
  LogOut,
  Settings,
  Bell,
  Moon,
  Sun,
  Home,
  Activity,
  Heart,
  Shield,
  ChevronRight,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  description?: string;
}

const managerNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral da clínica",
  },
  {
    name: "Funcionários",
    href: "/manager/staff",
    icon: Users,
    description: "Gestão de equipe",
  },
  {
    name: "Consultas",
    href: "/manager/appointments",
    icon: Calendar,
    badge: 5,
    description: "Agendamentos e consultas",
  },
  {
    name: "Exames",
    href: "/manager/exams",
    icon: FileText,
    badge: 3,
    description: "Gestão de exames",
  },
  {
    name: "Mensagens",
    href: "/manager/messages",
    icon: MessageSquare,
    badge: 12,
    description: "Comunicação interna",
  },
  {
    name: "Financeiro",
    href: "/manager/finances",
    icon: DollarSign,
    description: "Relatórios financeiros",
  },
  {
    name: "Estoque",
    href: "/manager/inventory",
    icon: Package,
    description: "Controle de estoque",
  },
];

function AppSidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-clinic-gradient text-sidebar-primary-foreground">
                  <Heart className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Bem Cuidar</span>
                  <span className="truncate text-xs">Gestão</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isMobile ? undefined : item.description}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 text-xs px-1.5"
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-user.jpg" alt="Manager" />
                    <AvatarFallback className="rounded-lg bg-clinic-gradient text-white">
                      CS
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Carlos Silva</span>
                    <span className="truncate text-xs">Gestor Geral</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder-user.jpg" alt="Manager" />
                      <AvatarFallback className="rounded-lg bg-clinic-gradient text-white">
                        CS
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Carlos Silva</span>
                      <span className="truncate text-xs">gestor@bemcuidar.ao</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function ManagerLayout() {
  const location = useLocation();
  const { theme } = useTheme();
  const [notificationCount, setNotificationCount] = useState(7);

  // Simular dados dinâmicos
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationCount((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentPageTitle = () => {
    const currentItem = managerNavigation.find(item => item.href === location.pathname);
    return currentItem?.name || "Dashboard";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                {getCurrentPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </Button>

              {/* Quick Actions */}
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Activity className="mr-2 h-4 w-4" />
                Relatório
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Footer with connection status */}
        <footer className="border-t bg-background p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Conexão Segura</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar ao Site</span>
              </Link>
              <span className="hidden sm:inline">
                Bem Cuidar © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ManagerLayout;
