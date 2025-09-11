import axios from 'axios'
import { useAppToaster } from '../toaster/toaster'

export const baseURL = 'http://192.168.50.157:5002/'
// export const baseURL = 'https://ums-national-ems-api-dev.mohesr.net/'
// export const baseURL = import.meta.env.VITE_BASE_URL

const axiosIns = axios.create({
    baseURL: `${baseURL}api`,
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    const locale = localStorage.getItem('locale')
    //

    // if (!token)
    //     useRouter().push("/login")

    config.headers = config.headers || {}

    config.headers['Accept-Language'] = locale
    config.headers.Authorization = token ? `Bearer ${token}` : ''

    return config
})

// ℹ️ Add response interceptor to handle 401 response
// Helper function to get translation based on current locale
const getSuccessMessage = (method: string) => {
    const locale = localStorage.getItem('locale') || 'ar'
    
    const messages = {
        en: {
            post: 'Data added successfully',
            put: 'Data updated successfully',
            delete: 'Data deleted successfully'
        },
        ar: {
            post: 'تمت إضافة البيانات بنجاح',
            put: 'تم التعديل بنجاح',
            delete: 'تم حذف البيانات بنجاح'
        }
    }
    
    return messages[locale as keyof typeof messages]?.[method as keyof typeof messages.en] || 'Success'
}

axiosIns.interceptors.response.use(
    (response) => {
        // Check for post, put, delete methods and status 200
        if (response.status === 200) {
            if (response.config.url !== '/file/multi') {
                const method = response.config.method
                if (method && ['post', 'put', 'delete'].includes(method)) {
                    useAppToaster().show('success', getSuccessMessage(method))
                }
            }
        }
        return response
    },
    (error) => {
        // Handle error
        useAppToaster().show('danger', error.response.data.message)
        // if (!error.response || error.response.status === 401) {
        //
        //   useAppUserStore().user = {}
        //   // Remove "userData" from localStorage
        //   localStorage.removeItem('userData')

        //   // Remove "accessToken" from localStorage
        //   localStorage.removeItem('token')
        //   useRouter().push('/login')
        // }
        throw error
    }
)
axiosIns.defaults.paramsSerializer = (params) => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()))
        } else {
            searchParams.append(key, value.toString())
        }
    })

    return searchParams.toString()
}
export default axiosIns
