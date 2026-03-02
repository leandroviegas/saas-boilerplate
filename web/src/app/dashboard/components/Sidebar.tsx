'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiCoupon2Fill } from "react-icons/ri";
import { Shield, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { rolesEnum } from '@/context/AuthContext';
import { Package } from 'lucide-react';

interface SidebarItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  access?: boolean;
  type: "division" | "item"
}


const Sidebar: React.FC<{ className?: string; isOpen?: boolean; isMinimized?: boolean; onMinimizeToggle?: () => void }> = ({ className, isOpen = true, isMinimized = false, onMinimizeToggle }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuth();

  const userRole = user?.roleSlug || rolesEnum.ANON

  const sidebarItems: SidebarItem[] = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: FiHome,
      type: 'item'
    },
    {
      name: t('billing'),
      type: 'division',
    },
    {
      name: t('products'),
      href: '/dashboard/billing',
      icon: Package,
      type: 'item',
    },
    {
      name: t('products management'),
      type: 'division',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
    {
      name: t('manage products'),
      href: '/dashboard/products',
      icon: Package,
      type: 'item',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
    {
      name: t('manage coupons'),
      href: '/dashboard/coupons',
      icon: RiCoupon2Fill,
      type: 'item',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
    {
      name: t('system management'),
      type: 'division',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
    {
      name: t('manage roles'),
      href: '/dashboard/roles',
      icon: Shield,
      type: 'item',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
    {
      name: t('manage role permissions'),
      href: '/dashboard/role-permissions',
      icon: ShieldCheck,
      type: 'item',
      access: [rolesEnum.ADMIN].includes(userRole)
    },
  ];


  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border",
      isMinimized ? "w-16" : "w-48",
      "fixed inset-y-0 left-0 z-50 md:relative md:inset-auto md:z-auto",
      "transition-[width,translate] duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "md:translate-x-0",
      className
    )}>

      <div className={`flex ${isMinimized ? 'justify-center' : 'justify-end'} py-2 border-t border-border`}>
        <button
          onClick={onMinimizeToggle}
          className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
          aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex-1 pb-6">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.access === false) return null;

            if (item.type === 'division') {
              return (
                <div key={`divider-${item.name}`} className="mt-6 mb-2 px-3">
                  <div className="flex items-center gap-2">
                    {!isMinimized && (
                      <span className="text-[10px] font-bold text-sidebar-foreground/40 uppercase whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                    <div className="h-[px] w-full bg-sidebar-foreground/10" />
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                className={cn(
                  "group flex items-center py-2 text-xs font-medium rounded-md transition-all duration-200",
                  isMinimized ? "justify-center px-2 mx-auto" : "px-3 mx-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "shrink-0 transition-colors",
                      isMinimized ? "h-5 w-5" : "mr-3 h-4 w-4",
                      isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                    )}
                    aria-hidden="true"
                  />
                )}
                {!isMinimized && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
