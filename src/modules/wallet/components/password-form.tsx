"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PasswordFormProps {
  onSubmit: (password: string) => void;
  confirmPassword?: boolean;
  submitLabel?: string;
  error?: string | null;
  loading?: boolean;
}

export function PasswordForm({
  onSubmit,
  confirmPassword = false,
  submitLabel = "Continue",
  error,
  loading = false,
}: PasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (confirmPassword && password !== confirm) {
      setLocalError("Passwords do not match");
      return;
    }
    onSubmit(password);
  }

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      {confirmPassword && (
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
          />
        </div>
      )}

      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : submitLabel}
      </Button>
    </form>
  );
}
