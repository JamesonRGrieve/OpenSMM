import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
// eslint-disable-next-line import/no-unassigned-import
import 'jrgcomponents/Style/Global';
import AppWrapper from 'jrgcomponents/AppWrapper/Wrapper/Themed';
import theme from './theme';
import Head from 'jrgcomponents/Head';
import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '@/app/Nav';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  const cookieStore = cookies();

  return (
    <html lang='en'>
      <Head />
      <body className={inter.className}>
        {/* <AppWrapper
          themeConfig={{
            themeInjection: { theme: theme },
            defaultTheme: {
              dark: cookieStore.get('dark')?.value
                ? cookieStore.get('dark')?.value === 'true'
                : process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE === 'dark',
              colorblind: cookieStore.get('colorblind')?.value === 'true',
            },
          }}
          appWrapperConfig={{
            header: {
              components: {
                left: {
                  width: '8rem',
                  staticMenu: <Sidebar />,
                },
              },
            },
            footer: {
              components: {
                center: (
                  <Box textAlign='center'>
                    <Typography sx={{ margin: 0 }} variant='caption'>
                      Brought to you by <a href='https://sintelli-tech.com'>SiNtelli Technologies</a> (Pty) Ltd and{' '}
                      <a href='https://zephyrex.dev/'>Zephyrex Technologies Limited</a>
                    </Typography>
                  </Box>
                ),
              },
            },
          }}
        > */}
        {children}
        {/* </AppWrapper> */}
        <Toaster />
      </body>
    </html>
  );
}
