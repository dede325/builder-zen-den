import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  Menu,
  X,
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Globe,
  Wifi,
  WifiOff,
  Battery,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-portal';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
  badge?: number;
  disabled?: boolean;
}

interface FullscreenLayoutProps {
  sections: NavigationItem[];
  defaultSection?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

export default function FullscreenLayout({
  sections,
  defaultSection,
  showHeader = true,
  showSidebar = true,
  className = '',
}: FullscreenLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [activeSection, setActiveSection] = useState(defaultSection || sections[0]?.id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState(3);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigateSection('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateSection('next');
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeSection]);

  const navigateSection = (direction: 'next' | 'prev') => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % sections.length
      : (currentIndex - 1 + sections.length) % sections.length;
    
    setActiveSection(sections[nextIndex].id);
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const CurrentComponent = currentSection?.component;

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  return (
    <div 
      ref={containerRef}
      className={`h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}
    >
      {/* Header */}
      {showHeader && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 relative z-50"
        >
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-clinic-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Clínica Bem Cuidar
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentSection?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Navigation Indicators */}
          <div className="hidden md:flex items-center space-x-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  section.id === activeSection
                    ? 'bg-clinic-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
                aria-label={`Ir para ${section.label}`}
              />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center space-x-2 mr-4">
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <Battery className="w-4 h-4 text-gray-500" />
              
              <button
                onClick={toggleFullscreen}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-gray-500" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>

            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Idioma (PT-AO)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        {showSidebar && (
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col relative z-40"
              >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-clinic-gradient text-white text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = section.id === activeSection;
                    
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        disabled={section.disabled}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-clinic-gradient text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        } ${section.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{section.label}</span>
                        {section.badge && section.badge > 0 && (
                          <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {section.badge}
                          </Badge>
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateSection('prev')}
                      className="flex-1 mr-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateSection('next')}
                      className="flex-1 ml-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {CurrentComponent && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                  duration: 0.3
                }}
                className="h-full w-full"
              >
                <CurrentComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation */}
      {!sidebarOpen && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 lg:hidden z-50"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex justify-around">
              {sections.slice(0, 5).map((section) => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-clinic-gradient text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
