<script setup>
import { useBannerStore } from '@/views/banner/useBannerStore'

const bannerStore = useBannerStore()
const searchQuery = ref('')
const selectedType = ref()
const selectedPage = ref()
const selectedPosition = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalBanners = ref(0)
const banners = ref([])

const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const deleteId = ref("")

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// 👉 
const fetchBanners = () => {
  bannerStore.fetchBanners({
    q: searchQuery.value,
    pg: selectedPage.value,
    type: selectedType.value,
    position: selectedPosition.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    banners.value = data
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalBanners.value = count
  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
}

watchEffect(fetchBanners)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

// 👉 search filters
const pages = [
  {
    title: 'Trang chủ',
    value: 'home',
  },
  {
    title: 'Trang danh sách sản phẩm',
    value: 'list-product',
  },
  {
    title: 'Trang tin tức',
    value: 'blog',
  }
]

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
  },
]

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

const pageTranslate = {
  "home": "Trang chủ",
  "list-product": "Danh sách sản phẩm",
  "blog": "Bài viết"
}

const positionTranslate = {
  "top": "Đầu trang",
  "center": "Giữa trang",
  "bottom": "Cuối trang"
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = banners.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = banners.value.length + (currentPage.value - 1) * rowPerPage.value

  return `Hiển thị ${firstIndex} đến ${lastIndex} của ${totalBanners.value} mục`
})

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    bannerStore.deleteById(deleteId.value).then((res) => {
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      fetchBanners()
    }).catch((err) => {
      Object.assign(error, {
        isSnackbarVisible: true,
        message: err?.response ? err.response.data.message : err
      })
    })
  }
}

</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Quản lý quảng cáo">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol cols="12" sm="4">
                <VSelect v-model="selectedPage" label="Chọn trang" :items="pages" clearable clear-icon="tabler-x" />
              </VCol>
              <!-- 👉 Select Status -->
              <VCol cols="12" sm="4">
                <VSelect v-model="selectedType" label="Chọn kiểu" :items="types" clearable clear-icon="tabler-x" />
              </VCol>

              <VCol cols="12" sm="4">
                <VSelect v-model="selectedPosition" label="Chọn vị trí" :items="positions" clearable clear-icon="tabler-x" />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px;">
              <VSelect v-model="rowPerPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
            </div>

            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="width: 20rem;">
                <!-- <VTextField v-model="searchQuery" placeholder="Tìm kiếm" density="compact" /> -->
              </div>

              <!-- 👉 Export button -->
              <!-- <VBtn variant="tonal" color="secondary" prepend-icon="tabler-screen-share">
                Xuất dữ liệu
              </VBtn> -->

              <!-- 👉 Add user button -->
              <VBtn prepend-icon="tabler-plus" :to="{ name: 'banners-create' }">
                Tạo mới
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">
                  #STT
                </th>
                <th scope="col">
                  ẢNH
                </th>
                <th scope="col">
                  KIỂU
                </th>
                <th scope="col">
                  TRANG
                </th>
                <th scope="col">
                  VỊ TRÍ
                </th>
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="banner, index in banners" :key="banner.id" style="height: 3.75rem;">
                <!-- 👉 User -->
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                </td>

                <!-- 👉 Role -->
                <td>
                  <VImg v-if="banner.url" :src="banner.url" :width="300" :height="150" cover style="margin: 5px !important;"/>
                </td>

                <!-- 👉  -->
                <td>
                  <span class="text-base">{{ banner.type }}</span>
                </td>

                <!-- 👉 Billing -->
                <td>
                  <span class="text-base">{{ pageTranslate[banner.page] }}</span>
                </td>

                <!-- 👉 Status -->
                <td>
                  <span class="text-base"> {{ positionTranslate[banner.position] }} </span>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem;">
                  <VBtn icon size="x-small" color="default" variant="text" :to="{ name: 'banners-edit-id', params: { id: banner.id } }" >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text" @click="openDialog(banner.id)">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!banners.length">
              <tr>
                <td colspan="7" class="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
          </VCardText>

          <ConfirmDialog
            v-model:isDialogVisible="isConfirmDialogOpen"
            confirmation-msg="Bạn chắn chắn muốn xóa quảng cáo này ?"
            @confirm="confirmHandler"
          />

          <VSnackbar
            v-model="isSnackbarVisible"
            location="top end"
          >
            <VAlert type="success">
              Xóa thành công
            </VAlert>
          </VSnackbar>


          <VSnackbar v-model="error.isSnackbarVisible" location="top end">
            <VAlert type="error">
              {{ error.message }}
            </VAlert>
          </VSnackbar>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
// .app-user-search-filter {
//   inline-size: 31.6rem;
// }

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
