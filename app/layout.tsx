import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-display',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://wetomind.ai'),

    title: {
        default: 'WetoMind AI',
        template: '%s | WetoMind AI',
    },

    description:
        'Konsultasi Primbon Jawa berbasis Kecerdasan AI untuk membantu memahami karakter, potensi diri, dan refleksi kehidupan melalui Weton.',

    keywords: [
        'Weton',
        'Primbon Jawa',
        'Neptu',
        'WetoMind AI',
        'AI Jawa',
        'Konsultasi Weton',
        'Kalender Jawa',
        'Kejawen',
    ],

    manifest: '/manifest.json',

    icons: {
        icon: [
            {
                url: '/images/icon.png',
                type: 'image/png',
            },
        ],
        shortcut: '/images/icon.png',
        apple: '/images/icon.png',
    },

    openGraph: {
        title: 'WetoMind AI',
        description: 'Konsultasi Primbon Jawa berbasis Kecerdasan AI.',
        type: 'website',
        locale: 'id_ID',
        images: [
            {
                url: '/images/icon.png',
                width: 512,
                height: 512,
                alt: 'WetoMind AI',
            },
        ],
    },

    twitter: {
        card: 'summary',
        title: 'WetoMind AI',
        description: 'Konsultasi Primbon Jawa berbasis Kecerdasan AI.',
        images: ['/images/icon.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
            <body className="font-sans antialiased transition-colors duration-300">
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
