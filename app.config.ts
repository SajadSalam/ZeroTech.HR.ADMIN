import pages from './navigation'

export default defineAppConfig({
  tairo: {
    title: 'ZeroTech - Human Resources Management System',
    collapse: {
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: true,
        tools: [
          // {
          // 	component: 'DemoThemeToggle',
          // },
        //   {
        //     component: 'DemoToolbarNotifications',
        //   },
          {
            component: 'DemoToolbarAccountMenu',
          },
        ],
      },
      circularMenu: {
        enabled: false,
      },
      navigation: {
        enabled: true,
        header: {
          component: 'ToseelLogo',
          props: {
            class: 'w-100% text-center',
          },
        },
        // footer: {
        // 	component: 'DemoCollapseNavigationFooter',
        // },
        items: pages as any,
        footer: {
          component: 'NavigationFooter',
          props: {
            class: 'w-100% text-center',
          },
        },
      },
    },
  },
})
