'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, HelpCircle, ShoppingBag, User, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError('root', {
          type: 'manual',
          message: result.error || 'Kirish muvaffaqiyatsiz. Iltimos, qaytadan urinib ko\'ring.',
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-700 to-blue-600 p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-sm relative border border-white/20">
        <div className="text-center mb-12 relative">
          {/* Decorative line */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
          
          <div className="flex justify-center mb-4 text-blue-500 opacity-90">
            <ShoppingBag size={32} />
          </div>
          <h1 className="m-0 mb-2 text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent tracking-tight">
            Enrico Cerrini
          </h1>
          <p className="m-0 text-sm text-gray-500 font-medium">Kiyim Do'koni Boshqaruvi</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              label="Email"
              type="email"
              placeholder="Email manzilingizni kiriting"
              error={errors.email?.message}
              icon={User}
              {...register('email', {
                required: 'Email talab qilinadi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Noto\'g\'ri email manzil',
                },
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <Input
                label="Parol"
                type={showPassword ? 'text' : 'password'}
                placeholder="Parolingizni kiriting"
                error={errors.password?.message}
                icon={Lock}
                {...register('password', {
                  required: 'Parol talab qilinadi',
                  minLength: {
                    value: 3,
                    message: 'Parol kamida 3 ta belgidan iborat bo\'lishi kerak',
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer p-2 rounded-lg z-10 hover:text-blue-500 hover:bg-blue-500/10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errors.root && (
            <div className="text-red-500 text-xs font-medium flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border-l-4 border-red-500">
              <span>⚠️</span>
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 h-12 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kirish amalga oshirilmoqda...
              </>
            ) : (
              'Kirish'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 