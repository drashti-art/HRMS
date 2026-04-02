
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-pulse flex flex-col items-center gap-6">
        <div className="relative w-20 h-20 overflow-hidden rounded-xl bg-white p-2 shadow-sm">
          <Image 
            src="https://www.banasdairy.coop/Content/assets/img/logo/banas_logo2.png" 
            alt="Banas Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <p className="text-muted-foreground font-medium">Loading Banas Dairy HR...</p>
      </div>
    </div>
  );
}
