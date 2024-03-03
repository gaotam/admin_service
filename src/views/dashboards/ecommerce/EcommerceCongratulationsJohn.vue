<script setup>
import congoImg from '@images/illustrations/laptop-girl.png'
import { watchEffect, ref } from 'vue';
import axios from '@axios'

let revenue = ref(0)

watchEffect(() => {
  axios.get("/api/admin/v1/analytics/revenue").then(({ data }) => {
    console.log(data);

    revenue.value = parseFloat(data.data.totalPrice)
  }).catch(err => alert(err))
})
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="8">
        <VCardText>
          <h6 class="text-lg text-no-wrap font-weight-semibold">
            Xin chào Admin! 🎉
          </h6>
          <p class="mb-2">
            Doanh số tháng này
          </p>
          <h5 class="text-h5 font-weight-semibold text-primary mb-2">
            {{ revenue.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }}
          </h5>
          <VBtn :to="{ name: 'orders-list' }">Xem chi tiết</VBtn>
        </VCardText>
      </VCol>

      <VCol cols="4">
        <VCardText class="pb-0 px-0 position-relative h-100">
          <VImg
            :src="congoImg"
            height="140"
            class="w-100 position-absolute"
            style="bottom: 0;"
          />
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
