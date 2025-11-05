'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { UserService } from '@/api/services/user-service';
import { ToastService } from '@/services/ToastService';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

interface PasswordVisibility {
  old: boolean;
  new: boolean;
  confirm: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  userEmail = '',
}: ChangePasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    old: false,
    new: false,
    confirm: false,
  });

  // Validation: Password strength
  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8 || password.length > 128) {
      return 'Mat khau phai co do dai tu 8 den 128 ky tu';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Mat khau phai chua it nhat mot chu cai viet hoa';
    }

    if (!/[a-z]/.test(password)) {
      return 'Mat khau phai chua it nhat mot chu cai viet thuong';
    }

    if (!/[0-9]/.test(password)) {
      return 'Mat khau phai chua it nhat mot chu so';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Mat khau phai chua it nhat mot ky tu dac biet';
    }

    return null;
  };

  // Validation: Full form validation
  const validateForm = (): string | null => {
    // Check required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return 'Vui long dien day du thong tin';
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return 'Mat khau xac nhan khong khop';
    }

    // Check password strength
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      return strengthError;
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      return 'Mat khau moi khong duoc trung voi mat khau cu';
    }

    // Check if password contains email
    if (userEmail && newPassword.toLowerCase().includes(userEmail.toLowerCase())) {
      return 'Mat khau khong duoc chua dia chi email';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await UserService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        ToastService.success('Thay doi mat khau thanh cong', {
          description: 'Mat khau cua ban da duoc cap nhat',
        });
        handleClose();
      } else {
        // Handle API errors
        const errorMessage = response.error || response.message || 'Co loi xay ra';

        // Check for specific error codes/messages
        if (errorMessage.includes('401') || errorMessage.includes('password') || errorMessage.includes('incorrect')) {
          setError('Mat khau hien tai khong dung');
        } else if (errorMessage.includes('429') || errorMessage.includes('many requests')) {
          setError('Qua nhieu yeu cau. Vui long thu lai sau 15 phut');
        } else {
          setError(errorMessage);
        }

        ToastService.error('Thay doi mat khau that bai', {
          description: errorMessage,
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Loi he thong';
      setError(errorMessage);
      ToastService.error('Loi he thong', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword({ old: false, new: false, confirm: false });
    onOpenChange(false);
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thay doi mat khau</DialogTitle>
          <DialogDescription>
            Nhap mat khau hien tai va mat khau moi cua ban. Mat khau phai co it nhat 8 ky tu, bao gom chu hoa, chu thuong, so va ky tu dac biet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Old Password */}
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Mat khau hien tai</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPassword.old ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhap mat khau hien tai"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword.old ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Mat khau moi</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhap mat khau moi"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xac nhan mat khau moi</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhap lai mat khau moi"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="text-sm">
                {error}
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Huy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Dang xu ly...' : 'Xac nhan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
