<script setup>
import { useRoute } from 'vue-router'
import Inventory from '@/views/warehouse/Inventory.vue'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Kiểm kê',
    icon: 'tabler-users',
    tab: 'inventory',
  },
  // {
  //   title: 'Nhập hàng',
  //   icon: 'tabler-lock',
  //   tab: 'security',
  // },
  // {
  //   title: 'Xuất hàng',
  //   icon: 'tabler-file-text',
  //   tab: 'billing-plans',
  // },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'warehouse-tab', params: { tab: item.tab } }"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="inventory">
        <Inventory/>
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <!-- <AccountSettingsSecurity /> -->
      </VWindowItem>

      <!-- Billing -->
      <VWindowItem value="billing-plans">
        <!-- <AccountSettingsBillingAndPlans /> -->
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="notification">
        <!-- <AccountSettingsNotification /> -->
      </VWindowItem>

      <!-- Connections -->
      <VWindowItem value="connection">
        <!-- <AccountSettingsConnections /> -->
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: pages-account-settings-tab
</route>
