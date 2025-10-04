import axios from 'axios'
import { useAppToaster } from '../toaster/toaster'

// export const baseURL = 'http://localhost:1337/'
// export const baseURL = ' '
export const baseURL = import.meta.env.VITE_BASE_URL

const axiosIns = axios.create({
    baseURL: `${baseURL}api`,
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use((config) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return config
    }
    
    const token = localStorage.getItem('token')
    const locale = localStorage.getItem('locale')
    //

    if (!token)
        useRouter().push("/login")

    config.headers = config.headers || {}

    config.headers['Accept-Language'] = locale
    config.headers.Authorization = token ? `Bearer ${token}` : ''

    return config
})

// ℹ️ Add response interceptor to handle 401 
axiosIns.interceptors.response.use(
    (response) => {
        // Check for post, put, delete methods and status 200
        if (response.status === 200) {
            if (response.config.url !== '/file/multi') {
                switch (response.config.method) {
                    case 'post':
                        useAppToaster().show('success', 'تمت إضافة البيانات بنجاح')
                        break
                    case 'put':
                        useAppToaster().show('success', 'تم التعديل بنجاح.')
                        break
                    case 'delete':
                        useAppToaster().show('success', 'تم حذف البيانات بنجاح')
                        break
                    default:
                        break
                }
            }
        }
        return response
    },
    (error) => {
        // Handle error
      //  useAppToaster().show('danger', "حدث خطأ ما")
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
