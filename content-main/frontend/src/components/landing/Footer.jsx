import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PolicyModal from '@/components/common/PolicyModal';
import Logo from '@/components/common/Logo';
import { privacyPolicyTitle, privacyPolicyContent } from "@/lib/privacy-policy";
import { termsOfServiceTitle, termsOfServiceContent } from "@/lib/terms-of-service";
import ReactMarkdown from 'react-markdown';
import { Mail, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
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

  return (
    <>
      <footer className="py-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
                AI-платформа нового поколения для создания профессионального контента. 
                Превращайте идеи в результаты быстрее, чем когда-либо.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110">
                  <Github className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Продукт</h3>
              <ul className="space-y-3">
                <li><Link to="/#how" className="text-muted-foreground hover:text-primary transition-colors">Как это работает</Link></li>
                <li><button onClick={() => document.dispatchEvent(new CustomEvent('openPricingModal'))} className="text-muted-foreground hover:text-primary transition-colors">Тарифы</button></li>
                <li><Link to="/lead-magnet" className="text-muted-foreground hover:text-primary transition-colors">Ресурсы</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Компания</h3>
              <ul className="space-y-3">
                <li><button onClick={() => openPolicyModal('privacy')} className="text-muted-foreground hover:text-primary transition-colors">Политика конфиденциальности</button></li>
                <li><button onClick={() => openPolicyModal('terms')} className="text-muted-foreground hover:text-primary transition-colors">Условия использования</button></li>
                <li><a href="mailto:support@impulse-ai.ru" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Поддержка
                </a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div>© {new Date().getFullYear()} Импульс AI. Все права защищены.</div>
              <div className="flex items-center gap-2">
                <span>Сделано с</span>
                <span className="text-red-500">♥</span>
                <span>для создателей контента</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Разработано{' '}
              <a 
                href="https://chameleona.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Chameleon
              </a>
            </div>
          </div>
        </div>
      </footer>
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
};

export default Footer;
