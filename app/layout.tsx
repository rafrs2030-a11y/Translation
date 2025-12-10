import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { SubmissionsProvider } from '@/contexts/SubmissionsContext';
import { ToastProvider } from '@/contexts/ToastContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-cairo',
});

// Force dynamic rendering to avoid build-time Supabase errors
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'منصة نشر الأبحاث العربية',
  description: 'منصة رقمية شاملة تمكّن الهيئات والمؤسسات والجامعات والباحثين العرب من تقديم أبحاثهم العلمية وكتبهم للمراجعة والنشر عالمياً في مجلات عالمية علمية محكمة',
  keywords: 'أبحاث عربية، نشر علمي، باحثين عرب، نشر كتب',
  themeColor: '#3D5A94',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={cairo.variable}>
        <AuthProvider>
          <NotificationsProvider>
            <SubmissionsProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SubmissionsProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

