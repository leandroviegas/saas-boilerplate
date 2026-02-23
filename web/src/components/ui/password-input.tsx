"use client";

import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useTranslation } from "@/hooks/useTranslation";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({ ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <LuEyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <LuEye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">{t('toggle password visibility')}</span>
      </Button>
    </div>
  );
}