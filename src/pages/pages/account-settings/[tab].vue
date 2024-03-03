<script setup>
import { useRoute } from 'vue-router'
// import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
// import AccountSettingsBillingAndPlans from '@/views/pages/account-settings/AccountSettingsBillingAndPlans.vue'
// import AccountSettingsConnections from '@/views/pages/account-settings/AccountSettingsConnections.vue'
// import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
// import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Account',
    icon: 'tabler-users',
    tab: 'account',
  },
  {
    title: 'Security',
    icon: 'tabler-lock',
    tab: 'security',
  },
  {
    title: 'Billing & Plans',
    icon: 'tabler-file-text',
    tab: 'billing-plans',
  },
  {
    title: 'Notifications',
    icon: 'tabler-bell',
    tab: 'notification',
  },
  {
    title: 'Connections',
    icon: 'tabler-link',
    tab: 'connection',
  },
]
</script>

<template>
  
</template>

<route lang="yaml">
meta:
  navActiveLink: pages-account-settings-tab
</route>
