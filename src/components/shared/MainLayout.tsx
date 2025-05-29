import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import { useAuth } from '@/hooks/use-auth';

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

const MainLayout = ({ children, activeSection = 'home' }: MainLayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user} 
        toggleMobileMenu={toggleMobileMenu} 
        isMobileMenuOpen={mobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeSection={activeSection} user={user} />
        
        <main className="flex-1 overflow-auto bg-gray-50 pb-12 md:pb-6">
          {children}
        </main>
      </div>
      
      <MobileNavigation activeSection={activeSection} />
    </div>
  );
};

export default MainLayout;
