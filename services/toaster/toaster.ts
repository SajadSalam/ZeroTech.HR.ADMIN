import { toasterThemes } from './utils'
import type { ToasterProps, ToasterColors } from './types'

export const useAppToaster = defineStore('Toaster ', () => {
  let toaster: any
  const show = (color: ToasterColors = 'primary', message: string, props?: ToasterProps) => {
    toaster?.clearAll()
    const icons =
      color === 'success'
        ? 'material-symbols:check'
        : color === 'danger'
          ? 'ph:warning-octagon'
          : ''
    toaster = createNinjaToaster({
      theme: toasterThemes[(props?.position || 'bottom-center') as keyof typeof toasterThemes],
    })

    toaster.showComponent('TairoToaster', {
      props: {
        title: props?.title || '',
        message: message,
        color: color,
        icon: props?.icon || icons,
        closable: true,
      },
    })
  }

  return {
    show,
  }
})
