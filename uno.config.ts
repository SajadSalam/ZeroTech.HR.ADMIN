// uno.config.ts
import colors from 'tailwindcss/colors'
import { defineConfig } from 'unocss'


export default defineConfig({
    // ...UnoCSS options
    theme: {
        colors: {
            veryCool: '#0000ff', // class="text-very-cool"
            brand: {
                primary: '#1A2951', //class="bg-brand-primary"
                DEFAULT: '#1A2951', //class="bg-brand"
            },
            primary: {
               DEFAULT: '#1A2951',
                50: '#5978CA',
                100: '#496BC5',
                200: '#3858AE',
                300: '#2E488F',
                400: '#243970',
                500: '#1A2951',
                600: '#0C1427',
                700: '#000000',
                800: '#000000',
                900: '#000000',
                950: '#000000'
            },
            secondary: {
                 DEFAULT: '#AA80FF',
                50: '#FFFFFF',
                100: '#FFFFFF',
                200: '#FCFAFF',
                300: '#E1D2FF',
                400: '#C5A9FF',
                500: '#AA80FF',
                600: '#8448FF',
                700: '#5F10FF',
                800: '#4700D7',
                900: '#34009F',
                950: '#2B0083'
            },
            muted: colors.slate,
            neutral: {
                100: "#FFFFFF",
                200: "#F9FAFB",
                300: "#F0F3F5",
                400: "#F0F3F5",
                500: "#698596",
                600: "#435560",
                700: "#273137",
                800: "#111618",
                900: "#0C0808",
            },
            success: {
                100: '#F7FDF9',
                200: '#EAFAF1',
                300: '#D5F6E3',
                400: '#ACECC6',
                500: '#44D580',
                600: '#1E8549',
                700: '#166437',
                800: '#0F4324',
                900: '#072112',
            },
            danger: {
                100: '#FDF7F7',
                200: '#FDF7F7',
                300: '#F6D5D5',
                400: '#ECACAC',
                500: '#D54444',
                600: '#851E1E',
                700: '#641616',
                800: '#430F0F',
                900: '#210707',
            },
            warning: {
                DEFAULT: '#FF9B2A',
                100: '#FFFDF5',
                200: '#FEFBE6',
                300: '#FEF7CD',
                400: '#FCEE9C',
                500: '#FF9B2A',
                600: '#9F8804',
                700: '#776603',
                800: '#504402',
                900: '#282201',
            },

            info: {
                DEFAULT: '#FF9B2A',
                100: '#FFFDF5',
                200: '#FEFBE6',
                300: '#FEF7CD',
                400: '#FCEE9C',
                500: '#FF9B2A',
                600: '#9F8804',
                700: '#776603',
                800: '#504402',
                900: '#282201',
            },
        },
    },
})
