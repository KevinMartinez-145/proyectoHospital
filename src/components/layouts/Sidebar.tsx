// src/components/layouts/Sidebar.tsx

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Use Shadcn Button
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Use Shadcn Tooltip
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserPlus,
  CalendarDays,
  ClipboardList,
  Building,
  Pill,
  ChevronsLeft, // Icon for collapse button
  ChevronsRight, // Icon for expand button
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
  const location = useLocation(); // Get current location for active state check

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Helper to check active state, considering 'end' prop logic for '/'
  const checkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavLink = (link: NavLinkItem, isSidebarCollapsed: boolean) => {
    const isActive = checkActive(link.path);

    const linkContent = (
      <Button
        variant={isActive ? 'secondary' : 'ghost'} // Use Shadcn variants
        className={cn('w-full justify-start h-10', isSidebarCollapsed ? 'px-2' : 'px-4')} // Adjust padding when collapsed
        asChild // Important: Let NavLink handle navigation
      >
        <NavLink
          to={link.path}
          // No need for className function here as Button handles styling
        >
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

  return (
    // Use TooltipProvider at a higher level if many tooltips are used
    <TooltipProvider>
      <aside
        className={cn(
          'flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64' // Dynamic width
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'h-16 flex items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0',
            isCollapsed ? 'justify-center' : 'px-4 justify-between' // Center icon or show title/button
          )}
        >
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
            App Hospital
            </h1>
          )}
          {/* Always show toggle button, adjust position/styling if needed */}
           <Button
             variant="ghost"
             size="icon"
             onClick={toggleSidebar}
             className={cn(isCollapsed ? 'mx-auto' : '')} // Center button when collapsed
             aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
           >
             {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
           </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto"> {/* Use px-2 for collapsed padding */}
          {mainNavLinks.map(link => renderNavLink(link, isCollapsed))}
          {secondaryNavLinks.length > 0 && (
            <>
              <hr className="my-3 border-gray-200 dark:border-gray-700" />
              {secondaryNavLinks.map(link => renderNavLink(link, isCollapsed))}
            </>
          )}
        </nav>

        {/* Optional Footer */}
        {/* <div className={cn("p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0", isCollapsed ? 'hidden' : '')}>
           User Info / Logout
        </div> */}
      </aside>
    </TooltipProvider>
  );
}