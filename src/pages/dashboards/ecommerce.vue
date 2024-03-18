<script setup>
import EcommerceCongratulationsJohn from '@/views/dashboards/ecommerce/EcommerceCongratulationsJohn.vue'
import EcommerceUserReports from '@/views/dashboards/ecommerce/EcommerceUserReports.vue'
//import EcommerceOrderTable from '@/views/dashboards/ecommerce/EcommerceOrderTable.vue'
import EcommerceOrder from '@/views/dashboards/ecommerce/EcommerceOrder.vue'
import EcommercePopularProducts from '@/views/dashboards/ecommerce/EcommercePopularProducts.vue'
import EcommerceStatistics from '@/views/dashboards/ecommerce/EcommerceStatistics.vue'
</script>

<template>
  <VRow>
    <!-- 👉 Hello Admin -->
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <!-- <EcommerceCongratulationsJohn /> -->
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <!-- <EcommerceStatistics class="h-100" /> -->
    </VCol>

    <!-- 👉 User Reports -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <!-- <EcommerceUserReports class="h-100"/> -->
    </VCol>

    <!-- 👉 Popular Products -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <!-- <EcommercePopularProducts /> -->
    </VCol>

    <!-- 👉 Order -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <!-- <EcommerceOrder /> -->
    </VCol>

    <!-- 👉 Transaction -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <!-- <EcommerceTransactions class="h-100"/> -->
    </VCol>

    <!-- 👉 Invoice Table -->
    <VCol
      cols="12"
      lg="12"
    >
      <!-- <EcommerceOrderTable /> -->
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
