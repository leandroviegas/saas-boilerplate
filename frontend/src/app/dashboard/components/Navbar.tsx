'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { FiSun, FiMoon, FiMenu, FiSettings, FiLogOut } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationDropdown from './NotificationDropdown';

interface NavbarProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onSidebarToggle,
  showSidebarToggle = true
}) => {
  const { toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showSidebarToggle && onSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <NotificationDropdown />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative"
          >
            <FiSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <FiMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User menu"
                className="relative"
              >
                <Avatar className="h-8 w-8 border-2 border-border">
                  <AvatarImage src={user?.image || undefined} alt={t("profile")} />
                  <AvatarFallback className="text-sm uppercase">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className=''>{user?.name || t('user')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/settings">
                <DropdownMenuItem>
                  <FiSettings className="mr-2 h-4 w-4" />
                  {t('settings')}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={signOut}>
                <FiLogOut className="mr-2 h-4 w-4" />
                {t('sign out')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;