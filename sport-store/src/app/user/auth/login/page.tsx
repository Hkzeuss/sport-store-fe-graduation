'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const LoginTemplate: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      router.push('/');
    }
  }, [router]);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z]).{8,25}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, tối đa 25 ký tự và chứa ít nhất 1 chữ in hoa.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/user');
      const users: { username: string; email: string; password: string }[] = response.data;

      const user = users.find((u) => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
      );

      if (user) {
        console.log('Đăng nhập thành công:', user);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
      } else {
        setError('Sai thông tin đăng nhập. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[calc(100vw-40px)] h-[calc(100vh-40px)] bg-white rounded-[12px] shadow-lg overflow-hidden flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/30">
            <Image src="/image.png" alt="Sports Player" layout="fill" objectFit="cover" priority />
          </div>
        </div>

        <div className="w-full bg-white lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-4xl text-black font-bold">Đăng nhập</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && <div className="text-red-500 text-center">{error}</div>}

              <div className="text-center text-sm">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link href="/user/auth/register" className="font-bold text-red-600 hover:text-blue-500">Đăng ký ngay</Link>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">Email / Tên đăng nhập</label>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Nhập Email / Tên đăng nhập"
                    className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link href="/user/auth/forgot-password-email-1" className="text-base text-black hover:text-blue-500">Quên mật khẩu?</Link>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;
