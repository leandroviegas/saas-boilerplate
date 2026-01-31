'use client'

import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function Home() {
  const { user, signOut } = useAuth()
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full">
        {user ? (
          <div className='flex gap-5'>
            <p className="text-2xl font-bold">{t('welcome, #?', ['leandro'])}</p>
          </div>
        ) : (
          <p>{t('please sign in to view the dashboard')}</p>
        )}
        <div className='py-4'>
          <Link className='text-blue-400' href="/auth">{t("go to authentication")}</Link>
        </div>
        <button className="bg-red-500 text-white px-4 rounded cursor-pointer" onClick={() => signOut()}>{t('sign out')}</button>
      </div>
    </main>
  )
}
