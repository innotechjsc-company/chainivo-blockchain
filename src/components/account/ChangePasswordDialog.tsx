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
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    old: false,
    new: false,
    confirm: false,
  });

  // Validation: Password strength
  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8 || password.length > 128) {
      return 'Mật khẩu phải có độ dài từ 8 đến 128 ký tự';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa';
    }

    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường';
    }

    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ số';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt';
    }

    return null;
  };

  // Validation: Full form validation
  const validateForm = (): boolean => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    let isValid = true;

    // Check old password
    if (!oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
      isValid = false;
    }

    // Check new password
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else {
      // Check password strength
      const strengthError = validatePasswordStrength(newPassword);
      if (strengthError) {
        newErrors.newPassword = strengthError;
        isValid = false;
      } else if (oldPassword && oldPassword === newPassword) {
        // Check if new password is same as old password
        newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
        isValid = false;
      } else if (userEmail && newPassword.toLowerCase().includes(userEmail.toLowerCase())) {
        // Check if password contains email
        newErrors.newPassword = 'Mật khẩu không được chứa địa chỉ email';
        isValid = false;
      }
    }

    // Check confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      isValid = false;
    } else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    // Client-side validation
    const isValid = validateForm();
    if (!isValid) {
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
        ToastService.success('Thay đổi mật khẩu thành công ', {
          description: 'Mật khẩu của bạn đã dược cập nhật ',
        });
        handleClose();
      } else {
        // Handle API errors
        const errorMessage = response.error || response.message || 'Có lỗi xảy ra ';

        // Check for specific error codes/messages
        if (errorMessage.includes('401') || errorMessage.includes('password') || errorMessage.includes('incorrect')) {
          setErrors((prev) => ({
            ...prev,
            oldPassword: 'Mật khẩu hiện tại không đúng',
          }));
        } else if (errorMessage.includes('429') || errorMessage.includes('many requests')) {
          ToastService.error('Quá nhiều yêu cầu', {
            description: 'Vui lòng thử lại sau 15 phút',
          });
        } else {
          ToastService.error('Thay đổi mật khẩu thất bại', {
            description: errorMessage,
          });
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Lỗi hệ thống';
      ToastService.error('Lỗi hệ thống', {
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
    setErrors({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
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
        <DialogHeader className="text-left">
          <DialogTitle className="leading-normal">Thay đổi mật khẩu </DialogTitle>
          <DialogDescription className="leading-normal">
            Nhập mật khẩu hiện tại và mật khẩu mới của bạn. Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Old Password */}
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPassword.old ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (errors.oldPassword) {
                      setErrors((prev) => ({ ...prev, oldPassword: '' }));
                    }
                  }}
                  placeholder="Nhập mật khẩu hiện tại"
                  disabled={loading}
                  className={`pr-10 ${errors.oldPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
              {errors.oldPassword && (
                <p className="text-destructive text-sm">{errors.oldPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors((prev) => ({ ...prev, newPassword: '' }));
                    }
                  }}
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                  className={`pr-10 ${errors.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
              {errors.newPassword && (
                <p className="text-destructive text-sm">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
