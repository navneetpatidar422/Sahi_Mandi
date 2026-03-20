import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { MandiDiscovery } from './pages/MandiDiscovery';
import { MandiDetails } from './pages/MandiDetails';
import { SmartAnalyzer } from './pages/SmartAnalyzer';
import { ChatInterface } from './pages/Chat';
import { AdminLogin, AdminDashboard } from './pages/Admin';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { PlatformDocs } from './pages/PlatformDocs';
import { MandiMap } from './pages/MandiMap';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedMandiId, setSelectedMandiId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  
  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [farmerData, setFarmerData] = useState<any>(null);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSelectedMandiId(null);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleNavigate('mandis');
  };

  const handleMandiSelect = (mandiId: string) => {
    setSelectedMandiId(mandiId);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (data: any) => {
    setFarmerData(data);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    setActivePage('dashboard'); // Redirect to dashboard on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFarmerData(null);
    setActivePage('home');
  };

  const handleUserUpdate = (updatedUser: any) => {
    setFarmerData(updatedUser);
  };

  const handleNavigateToAnalyzer = (cropId: string) => {
    setSelectedCropId(cropId);
    setActivePage('analyze');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    // Mandi Details View
    if (selectedMandiId) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          <MandiDetails 
            mandiId={selectedMandiId} 
            onBack={() => setSelectedMandiId(null)} 
          />
        </div>
      );
    }

    // Main Page Views
    switch (activePage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onSearch={handleSearch} />;
      
      case 'mandis':
        return <MandiDiscovery onMandiSelect={handleMandiSelect} initialSearch={searchQuery} />;
      
      case 'map':
        return <MandiMap onMandiSelect={handleMandiSelect} />;
      
      case 'dashboard':
        return isLoggedIn ? (
          <FarmerDashboard 
            user={farmerData} 
            onLogout={handleLogout} 
            onUpdateUser={handleUserUpdate}
            onNavigateToAnalyzer={handleNavigateToAnalyzer}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h2>
             <p className="text-gray-500 mb-8 max-w-md">Access your personalized farmer dashboard to see crop prices, profit calculators, and more.</p>
             <button 
               onClick={() => setIsAuthModalOpen(true)}
               className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
             >
               Login / Register
             </button>
          </div>
        );

      case 'analyze':
        return isLoggedIn ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <SmartAnalyzer onMandiSelect={handleMandiSelect} initialCropId={selectedCropId} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h2>
             <p className="text-gray-500 mb-8 max-w-md">Access your personalized farmer dashboard to see crop prices, profit calculators, and more.</p>
             <button 
               onClick={() => setIsAuthModalOpen(true)}
               className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
             >
               Login / Register
             </button>
          </div>
        );
      
      case 'chat':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
            <ChatInterface />
          </div>
        );
      
      case 'admin':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            {isAdminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            )}
          </div>
        );
        
      case 'docs':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <PlatformDocs />
          </div>
        );
        
      default:
        return <Home onNavigate={handleNavigate} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 flex flex-col min-h-screen">
      <Header 
        activePage={activePage} 
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsAuthModalOpen(true)}
        user={farmerData}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer onOpenDocs={() => handleNavigate('docs')} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}