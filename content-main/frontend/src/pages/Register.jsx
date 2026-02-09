import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import PolicyModal from '@/components/common/PolicyModal';
import { privacyPolicyTitle, privacyPolicyContent } from "@/lib/privacy-policy";
import { termsOfServiceTitle, termsOfServiceContent } from "@/lib/terms-of-service";
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';


const formSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  lastName: z.string().min(2, "Фамилия должна содержать не менее 2 символов."),
  email: z.string().email("Неверный формат email."),
  password: z.string()
    .min(8, "Пароль должен содержать не менее 8 символов.")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву.")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву.")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру.")
    .regex(/[^a-zA-Z0-9]/, "Пароль должен содержать хотя бы один специальный символ."),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "Вы должны принять условия обслуживания.",
  }),
});

export default function Register() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openPolicyModal = (type) => {
    if (type === 'privacy') {
      setModalContent({ title: privacyPolicyTitle, content: privacyPolicyContent });
    } else {
      setModalContent({ title: termsOfServiceTitle, content: termsOfServiceContent });
    }
    setIsPolicyModalOpen(true);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", agreeToTerms: false },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      const registerResponse = await apiClient.post('/auth/register', values);
      const { promoCode } = registerResponse.data;

      if (promoCode) {
        localStorage.setItem('newlyRegisteredPromoCode', JSON.stringify(promoCode));
      }
      
      const { data } = await apiClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem('authToken', data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/welcome-to-impulse');

    } catch (error) {
      console.error("Registration failed:", error);
      const message = error.message || error.response?.data?.message || 'Произошла неизвестная ошибка.';
      if (message === 'User already exists') {
        setFormError('Пользователь с таким email уже существует.');
      } else {
        setFormError(message);
      }
    }
  };
  
  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      <Helmet>
        <title>Регистрация - Impulse AI</title>
        {/* Top.Mail.Ru counter */}
        <script type="text/javascript">
          {`
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3724112", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `}
        </script>
        <noscript>
          {`
            <div><img src="https://top-fwz1.mail.ru/counter?id=3724112;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div>
          `}
        </noscript>
        {/* /Top.Mail.Ru counter */}
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Создать аккаунт</CardTitle>
            <CardDescription className="text-muted-foreground">
              Введите ваши данные для регистрации.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Иван" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input placeholder="Иванов" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 pt-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Я согласен с{' '}
                          <button type="button" onClick={() => openPolicyModal('terms')} className="underline hover:text-primary">
                            Условиями обслуживания
                          </button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                {formError && (
                  <p className="text-sm font-medium text-destructive text-center">{formError}</p>
                )}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </Form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Или продолжить с
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                Google
              </Button>
            </div>
             <p className="mt-4 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Войти
              </Link>
            </p>
          </CardContent>
        </Card>
        <footer className="py-8 text-center text-muted-foreground text-sm">
          <div className="flex justify-center gap-6">
            <button onClick={() => openPolicyModal('terms')} className="hover:text-foreground transition">
              Условия обслуживания
            </button>
            <button onClick={() => openPolicyModal('privacy')} className="hover:text-foreground transition">
              Политика конфиденциальности
            </button>
          </div>
        </footer>
      </div>
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onOpenChange={setIsPolicyModalOpen}
        title={modalContent.title}
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{modalContent.content}</ReactMarkdown>
        </div>
      </PolicyModal>
    </>
  );
}
