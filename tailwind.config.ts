import { withShurikenUI } from '@shuriken-ui/tailwind'
import { join } from 'pathe'
import colors from 'tailwindcss/colors'
/**
 * This is the Tailwind config file for the demo.
 * It extends the default config from @shuriken-ui/tailwind
 *
 * You can add/override your own customizations here.
 */
export default withShurikenUI({
    content: [join(__dirname, `/utils/**/*.ts`)], // Parse the utils folder for demo

    safelist: [
        'transition-all',
        'duration-200',
        'duration-75',
        'ease-out',
        'ease-in',
        'opacity-0',
        'opacity-100',
    ],
    theme: {
        borderRadius: {
            DEFAULT: '8px',
            none: '0px',
            sm: '8x',
            md: '12px',
            lg: '24px',
            xl: '32px',
            '2xl': '48px',
            '3xl': '60px',
            full: '50%',
        },
        extend: {
            backgroundImage: {
                'primary-gradient': 'linear-gradient(180deg, #A01E11 0%, #750D02 100%)',
            },
            colors: {
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
                success: {
                    DEFAULT: '#44D580',
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
                    DEFAULT: '#E47563',
                    100: '#FDF7F7',
                    200: '#FDF7F7',
                    300: '#F6D5D5',
                    400: '#ECACAC',
                    500: '#E47563',
                    600: '#851E1E',
                    700: '#641616',
                    800: '#430F0F',
                    900: '#210707',
                },
                warning: {
                    DEFAULT: '#DB7909',
                    100: '#FFFDF5',
                    200: '#FEFBE6',
                    300: '#FEF7CD',
                    400: '#FCEE9C',
                    500: '#DB7909',
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
                background: {
                    dark: '#191A1C',
                    light: '#F4F7FB',
                    'primary-gradient': 'linear-gradient(180deg, #A01E11 0%, #750D02 100%)',

                },
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'spin-fast': 'spin 0.65s linear infinite',
            },
        },
    },
})
