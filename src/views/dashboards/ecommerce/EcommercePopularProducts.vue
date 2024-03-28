<script setup>
import amazonEchoDot from '@images/eCommerce/amazon-echo-dot.png'
import appleWatch from '@images/eCommerce/apple-watch.png'
import headphone from '@images/eCommerce/headphone.png'
import iphone from '@images/eCommerce/iphone.png'
import nike from '@images/eCommerce/nike.png'
import sonyDualsense from '@images/eCommerce/sony-dualsense.png'
import axios from '@axios'
import { watchEffect, ref } from 'vue'

watchEffect(() => {
  // axios.get("/api/v1/products/home?type=hot&limit=6").then(({ data }) => {
  //   let cView = 0;
  //   const temp = data.data.map(p => {
  //     cView += p.view;
  //     return {
  //       avatarImg: p.images[0].url,
  //       title: p.name,
  //       subtitle: p.short_desc,
  //       stats: ''
  //     }
  //   })

  //   popularProducts.value = temp;
  //   totalView.value = cView;
  // }).catch((err) => {
  //   alert(err)
  // })
})

const totalView = ref(0)
const popularProducts = ref([])
</script>

<template>
  <VCard
    title="Sản phẩm phổ biến"
    :subtitle="'Tổng ' + totalView + ' lượt xem'"
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <VBtn
          icon
          color="default"
          size="x-small"
          variant="plain"
        >
          <VIcon
            size="22"
            icon="tabler-dots-vertical"
          />

          <VMenu activator="parent">
            <VList>
              <VListItem
                v-for="(item, index) in ['Refresh', 'Download', 'View All']"
                :key="index"
                :value="index"
              >
                <VListItemTitle>{{ item }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="product in popularProducts"
          :key="product.title"
        >
          <template #prepend>
            <VAvatar
              size="44"
              rounded
              :image="product.avatarImg"
            />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ product.title }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ product.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <span class="font-weight-medium text-medium-emphasis me-2">{{ product.stats }}</span>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 29px;
}
</style>
