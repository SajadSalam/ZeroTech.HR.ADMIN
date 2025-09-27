import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'
import viteSvgLoader from 'vite-svg-loader'
export default defineNuxtConfig({
    typescript: {
        shim: false
    },
    ssr: false,
   
    extends: [
        './layers/tairo-layout-collapse',
        './layers/tairo',
    ],
    build: {
        transpile: [
            '@vuepic/vue-datepicker',
            'vue-i18n'
        ],
    },

    devtools: { enabled: true },
    pages: true,
    
    // Suppress middleware override warnings and disable route rules
    experimental: {
        payloadExtraction: false,
        scanPageMeta: false,
        writeEarlyHints: false,
    },
    
    // Configure Nitro to suppress middleware warnings
    nitro: {
        experimental: {
            warnOnMiddlewareConflict: false
        },
        routeRules: {
            // Disable all route rules to prevent middleware conflicts
        },
        logLevel: 'error' // Suppress warnings
    },

    modules: [
        '@pinia/nuxt', '@unocss/nuxt',
        '@vueuse/motion/nuxt'
    ],
    unocss: {
        nuxtLayers: true,
    },
    pinia: {
        storesDirs: ['./stores/**', './components/**/stores', './views/**/stores'],

    },

    css: [
        '~/assets/css/style.css',
    ],
    vite: {
        plugins: [
            viteSvgLoader(),
            VueI18nVitePlugin({
                include: [
                    resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
                ]
            })
        ], // Correctly include the vite-svg-loader plugin
    },
    app: {
        head: {
            viewport: 'width=device-width,initial-scale=1',
            link: [
                { rel: 'icon', href: '/logo.svg', sizes: 'any' },
                { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
                { href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap', rel: 'stylesheet' },
            ],
        }
    },
    
    // Route rules to control prerendering and middleware
    routeRules: {
        // Disable route rule warnings and override middleware
        '/**': { 
            prerender: false,
            headers: {
                'x-middleware': 'override'
            }
        }
    },
    
    // Override middleware configuration to prevent conflicts
    hooks: {
        'nitro:config': (nitroConfig) => {
            // Suppress middleware warnings in Nitro config
            nitroConfig.logLevel = 'error'
        }
    },
    
    compatibilityDate: '2024-08-06',
})
