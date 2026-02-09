import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Save the token and update the API client
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Redirect to the dashboard or a desired page
      navigate('/dashboard');
    } else {
      // Handle error case - no token found
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-foreground">Аутентификация...</div>
    </div>
  );
}
