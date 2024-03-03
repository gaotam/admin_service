<script setup>
import {
  requiredValidator,
} from '@validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useBannerStore } from '@/views/banner/useBannerStore'
const bannerStore = useBannerStore();
const route = useRoute();
const router = useRouter()

const form = ref();
const loading = ref(false);
const isSnackbarVisible = ref(false);
const bannerData = reactive({
  page: {
    title: 'Trang chủ',
    value: 'home',
  },
  position: {
    title: 'Đầu trang',
    value: 'top',
  },
  type: {
    title: 'Banner',
    value: 'banner',
  },
  content: `<h2>Mua ngay</h2><p>Giá chỉ từ <span class="ql-size-large">5.000.000 VND</span></p>`,
  redirect_link: "",
  image: []
});

const pages = [
  {
    title: 'Trang chủ',
    value: 'home',
  },
  {
    title: 'Danh sách sản phẩm',
    value: 'list-product',
  },
  {
    title: 'Tin tức',
    value: 'blog',
  }
];

const positions = [
  {
    title: 'Đầu trang',
    value: 'top',
  },
  {
    title: 'Giữa trang',
    value: 'center',
  },
  {
    title: 'Cuối trang',
    value: 'bottom',
  }
];

const types = [
  {
    title: 'Banner',
    value: 'banner',
  },
  {
    title: 'Slider',
    value: 'slider',
  }
];

bannerStore.fetchBanner((route.params.id)).then(res => {
  const data = res.data.data

  const type = types.find((t) => t.value == data.type)
  const page = pages.find((t) => t.value == data.page)
  const position = positions.find((t) => t.value == data.position)

  Object.assign(bannerData, {
    redirect_link: data.redirect_link,
    type,
    page,
    position,
    content: data.content
  })
}).catch(error => {
  console.log(error)
})

const onSubmit = async () => {
  let { valid } = await form.value?.validate()

  if (valid) {
    loading.value = true
    bannerStore.updateById(route.params.id, toRaw(bannerData)).then((res) => {
      if (res.status == 200) {
        isSnackbarVisible.value = true;
        setTimeout(() => {
          router.push({name: "banners-list"})
        }, 400)
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      loading.value = false
    })
  }
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], 
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, true] }],    
  [{ 'align': [] }],
] 
</script>

<template>
  <VRow>
    <!-- 👉  -->
    <VCol cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Tạo mới quảng cáo
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VSelect v-model="bannerData.page" :items="pages" prepend-icon="tabler-app-window"
                  item-title="title" item-value="value" label="Select" return-object single-line />
              </VCol>
              <VCol cols="12">
                <VSelect v-model="bannerData.position" :items="positions" prepend-icon="tabler-layout-align-center"
                  item-title="title" item-value="value" label="Select" return-object single-line />
              </VCol>
              <VCol cols="12">
                <VSelect v-model="bannerData.type" :items="types" prepend-icon="tabler-ad-filled"
                  item-title="title" item-value="value" label="Select" return-object single-line />
              </VCol>
              <VCol cols="12" style="height: 100%;color: black;">
                <QuillEditor theme="snow" :toolbar="toolbarOptions" content-type="html" v-model:content="bannerData.content"/>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="bannerData.redirect_link" prepend-icon="tabler-link" :rules="[requiredValidator]" label="Trang chuyển hướng" required />
              </VCol>
              <VCol cols="12">
                <VFileInput v-model="bannerData.image" prepend-icon="tabler-camera"
                  placeholder="Upload your documents" label="Tải lên ảnh">
                  <template #selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                      <VChip label size="small" variant="outlined" color="primary" class="me-2">
                        {{ fileName }}
                      </VChip>
                    </template>
                  </template>
                </VFileInput>
              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit" :loading="loading">
                  Cập nhật
                </VBtn>

                <VBtn color="info" @click="form?.reset()">
                  Làm mới
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <VSnackbar v-model="isSnackbarVisible" location="top end">
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
      <VSnackbar v-model="isSnackbarVisible" location="top end">
        <VAlert type="success">
          Cập nhật thành công
        </VAlert>
      </VSnackbar>
    </VCol>
  </VRow>
</template>

