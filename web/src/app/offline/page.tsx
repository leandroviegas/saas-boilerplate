import { getTranslation } from '@/utils/server/translation';
import React from 'react';

const OfflinePage = async () => {
  const { t } = await getTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">{t('could not connect to the server')}</h1>
      <p className="text-lg mb-2">
        {t('it looks like the server is unavailable or you are not connected to the internet')}.
      </p>
      <p className="text-lg">
        {t('please check your connection and try again')}.
      </p>
    </div>
  );
};

export default OfflinePage;