import React, { useEffect } from 'react';
import { App, f7ready } from 'framework7-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot } from 'recoil';

import { RecoilRootPortal } from '@components/RecoilRootPortal';
import Views from '@components/Views';
import { IS_PRODUCTION } from '@config';
import capacitorApp from '@js/capacitor-app';
import { getDevice } from '@js/framework7-custom';
import { toast } from '@js/utils';
import routes from '@routes/index';

const F7App = () => {
  const device = getDevice();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: IS_PRODUCTION,
        refetchOnReconnect: IS_PRODUCTION,
      },
    },
  });

  const f7params = {
    name: '후팡',
    theme: 'ios',
    id: 'com.insomenia.practice',
    routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    view: {
      iosDynamicNavbar: device.ios,
    },
  };

  useEffect(() => {
    f7ready((f7) => {
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      toast.set(f7);
    });
  }, []);

  if (!IS_PRODUCTION) console.log(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App {...f7params}>
          <Views />
        </App>
        {IS_PRODUCTION ? null : <ReactQueryDevtools position="bottom-right" />}
        <RecoilRootPortal />
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default F7App;
