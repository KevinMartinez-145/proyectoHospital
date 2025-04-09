// src/components/layouts/Sidebar.tsx

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // Not needed for programmatic open
} from "@/components/ui/alert-dialog";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserPlus,
  CalendarDays,
  ClipboardList,
  Building,
  Pill,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

// --- Data and Types ---
interface NavLinkItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const mainNavLinks: NavLinkItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pacientes', label: 'Pacientes', icon: Users },
  { path: '/doctores', label: 'Doctores', icon: Stethoscope },
  { path: '/enfermeras', label: 'Enfermeras', icon: UserPlus },
  { path: '/citas', label: 'Citas', icon: CalendarDays },
  { path: '/tratamientos', label: 'Tratamientos', icon: ClipboardList },
  { path: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { path: '/departamentos', label: 'Departmentos', icon: Building },
];

const secondaryNavLinks: NavLinkItem[] = [
  // { path: '/settings', label: 'Settings', icon: Settings },
];

// --- Sidebar Component ---
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // State for dialog
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const checkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // Check if the current path starts with the link path, unless it's just '/'
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));
  };

  // --- Logout Handlers ---
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true); // Open the dialog
  };

  const confirmLogout = () => {
    logout(); // Clear auth state from store
    setIsLogoutDialogOpen(false); // Close dialog
    navigate('/login', { replace: true }); // Redirect to login
  };
  // --- End Logout Handlers ---

  // --- NavLink Renderer ---
  const renderNavLink = (link: NavLinkItem, isSidebarCollapsed: boolean) => {
    const isActive = checkActive(link.path);
    const linkContent = (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn('w-full justify-start h-10', isSidebarCollapsed ? 'px-2' : 'px-4')}
        asChild
      >
        <NavLink to={link.path}>
          <link.icon className={cn('h-5 w-5', isSidebarCollapsed ? 'mx-auto' : 'mr-3')} />
          {!isSidebarCollapsed && <span className="truncate">{link.label}</span>}
        </NavLink>
      </Button>
    );

    if (isSidebarCollapsed) {
      return (
        <Tooltip key={link.path} delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {link.label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return <React.Fragment key={link.path}>{linkContent}</React.Fragment>;
  };
  // --- End NavLink Renderer ---

  // --- Logout Button Renderer ---
  const logoutButtonContent = (
     <Button
        variant="ghost"
        className={cn('w-full justify-start h-10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-500', isCollapsed ? 'px-2' : 'px-4')}
        onClick={handleLogoutClick} // Opens the confirmation dialog
      >
        <LogOut className={cn('h-5 w-5', isCollapsed ? 'mx-auto' : 'mr-3')} />
        {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
      </Button>
  );

  const logoutButton = isCollapsed ? (
     <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{logoutButtonContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          Cerrar Sesión
        </TooltipContent>
      </Tooltip>
  ) : (
      logoutButtonContent
  );
  // --- End Logout Button Renderer ---


  // --- Component Return ---
  return (
    // Wrap everything that should be visible *while* the dialog might be open
    <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <TooltipProvider>
        <aside
          className={cn(
            'flex-shrink-0 border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'h-16 flex items-center border-b border-border flex-shrink-0',
              isCollapsed ? 'justify-center' : 'px-4 justify-between'
            )}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-semibold text-foreground truncate">
              App Hospital
              </h1>
            )}
             <Button
               variant="ghost"
               size="icon"
               onClick={toggleSidebar}
               className={cn(isCollapsed ? 'mx-auto' : '')}
               aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
             >
               {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
             </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {mainNavLinks.map(link => renderNavLink(link, isCollapsed))}
            {secondaryNavLinks.length > 0 && (
              <>
                <Separator className="my-2" />
                {secondaryNavLinks.map(link => renderNavLink(link, isCollapsed))}
              </>
            )}
          </nav>

          {/* Logout Button Section */}
          <div className="mt-auto p-2 border-t border-border">
             {logoutButton}
             {/* AlertDialogTrigger is not needed here */}
          </div>

        </aside>
      </TooltipProvider>

      {/* Logout Confirmation Dialog Content */}
      {/* This part is positioned by Radix UI, not visually inside the aside */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Confirmar Cierre de Sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Serás redirigido a la pantalla de inicio de sesión.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsLogoutDialogOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Sí, cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog> // End AlertDialog wrapper
  );
}