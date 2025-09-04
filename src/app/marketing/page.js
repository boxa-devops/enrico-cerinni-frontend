/**
 * Marketing Page
 * 
 * Marketing interface for SMS and Telegram broadcasting to customers.
 * Includes broadcast management, statistics, and history tracking.
 * 
 * @page
 */

'use client';

import { useEffect, Suspense } from 'react';
import { MessageSquare } from 'lucide-react';
import logger from '../../utils/logger';
import Layout from '../../components/layout/Layout';
import PageLayout from '../../components/layout/PageLayout';
import { LoadingSpinner, Card } from '../../components/ui';
import MarketingContent from '../../components/marketing/MarketingContent';
import { useMarketing } from '../../hooks/useMarketing';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

// Marketing header component
const MarketingHeader = () => (
  <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
        <MessageSquare className="text-white" size={20} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 m-0">
          Marketing tizimi
        </h1>
        <p className="text-sm text-gray-600 m-0">
          SMS va Telegram orqali mijozlarga xabar yuborish
        </p>
      </div>
    </div>
  </Card>
);

// Main marketing content component
const MarketingPageContent = () => {
  const marketing = useMarketing();

  return (
    <div className="space-y-4">
      {/* Header */}
      <MarketingHeader />

      {/* Main Content */}
      <div className="min-h-[600px]">
        <MarketingContent {...marketing} />
      </div>
    </div>
  );
};

// Loading component
const MarketingLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner 
      message="Autentifikatsiya tekshirilmoqda..." 
      size="lg" 
    />
  </div>
);

/**
 * Main Marketing Page Component
 */
export default function MarketingPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Handle authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        logger.info('Redirecting to login - not authenticated');
        window.location.href = '/login';
      } else {
        logger.debug('Authentication successful, staying on marketing page');
      }
    } else {
      logger.debug('Still loading authentication...');
    }
  }, [authLoading, user, isAuthenticated]);

  // Show loading during authentication check
  if (authLoading) {
    return (
      <Layout>
        <PageLayout>
          <MarketingLoading />
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout 
        maxWidth="full"
        spacing="sm"
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen"
      >
        <Suspense fallback={<MarketingLoading />}>
          <MarketingPageContent />
        </Suspense>
      </PageLayout>
    </Layout>
  );
} 