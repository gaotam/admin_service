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
  axios.get("/api/v1/posts?limit=6").then(({ data }) => {
    const temp = data.data.map(p => {
      return {
        avatarImg: p.thumbnail,
        title: p.title,
        subtitle: p.short_desc,
        stats: ''
      }
    })

    popularPosts.value = temp;
  }).catch((err) => {
    alert(err)
  })
})

const popularPosts = ref([])
</script>

<template>
  <VCard
    title="Bài viết mới"
    subtitle="Danh sách các bài viết mới"
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
          v-for="post in popularPosts"
          :key="post.id"
        >
          <template #prepend>
            <VAvatar
              size="44"
              rounded
              :image="post.avatarImg"
            />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ post.title }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ post.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <span class="font-weight-medium text-medium-emphasis me-2">{{ post.stats }}</span>
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
