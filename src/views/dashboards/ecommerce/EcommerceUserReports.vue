<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import axios from '@axios'
import { watchEffect, ref } from 'vue'

const vuetifyTheme = useTheme()

watchEffect(() => {
  axios.get("/api/admin/v1/analytics/week-account-signup").then(({ data }) => {
    let temp = [0, 0, 0, 0, 0, 0, 0];
    for (let item of data.data) {
      temp[item.weekday] = item.count
    }
    series.value = [{
      data: temp
    }]
  }).catch((err) => {
    alert(err)
  })
})

const series = ref([{
  data: [
    0,
    10,
    0,
    0,
    1,
    1,
    1,
  ],
}])

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['disabled-opacity'] })`
  
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    tooltip: { enabled: false },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '60%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        bottom: 0,
        left: -10,
        right: -10,
      },
    },
    colors: [
      currentTheme.primary,
      currentTheme.primary,
      currentTheme.primary,
      currentTheme.primary,
      currentTheme.primary,
      currentTheme.primary,
      currentTheme.primary,
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'CN',
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '14px',
        },
      },
    },
    yaxis: { labels: { show: false } },
  }
})
</script>

<template>
  <VCard
    title="Khách hàng mới"
    subtitle="Biểu đồ khách hàng mới trong tuần"
  >
    <VCardText class="pb-0">
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="400"
      />
    </VCardText>
  </VCard>
</template>
