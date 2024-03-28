<script setup>
import { watchEffect, ref } from 'vue';
import axios from '@axios'

watchEffect(() => {
  // axios.get("/api/admin/v1/analytics/general").then(({ data }) => {
  //   statistics.value = [
  //     {
  //       title: 'Mã giảm giá',
  //       stats: data.data.sale,
  //       icon: 'tabler-chart-pie-2',
  //       color: 'primary',
  //     },
  //     {
  //       title: 'Khách hàng',
  //       stats: data.data.user,
  //       icon: 'tabler-users',
  //       color: 'info',
  //     },
  //     {
  //       title: 'Sản phẩm',
  //       stats: data.data.product,
  //       icon: 'tabler-shopping-cart',
  //       color: 'warning',
  //     },
  //     {
  //       title: 'Bài viết',
  //       stats: data.data.post,
  //       icon: 'tabler-pencil',
  //       color: 'success',
  //     },
  //   ]
  // }).catch((err) => {
  //   alert(err)
  // })
})

const statistics = ref([])
</script>

<template>
  <VCard title="Thống kê">
    <template #append>
      <span class="text-body-2">Cập nhật 10s trước</span>
    </template>

    <VCardText class="pt-6">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="6"
          md="3"
        >
          <div class="d-flex">
            <VAvatar
              :color="item.color"
              variant="tonal"
              size="42"
              class="me-3"
            >
              <VIcon
                size="24"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-medium">{{ item.stats }}</span>
              <span class="text-caption">
                {{ item.title }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
