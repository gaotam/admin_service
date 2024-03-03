<script setup>
import UpdateCampaignDrawer from '@/views/campaigns/list/UpdateCampaignDrawer.vue'
import { useCampaignStore } from '@/views/campaigns/useCampaignStore'

const campaignStore = useCampaignStore()
const isSnackbarVisible = ref(false)
const snackMessage = ref("")
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCampaign = ref(0)
const campaigns = ref([])
const campaignId = ref("")
const loading = ref(false)

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// TODO: 🌼 Load danh sách chiến dịch 🌼
const fetchCampaigns = () => {
  loading.value = true;
  campaignStore.fetchCampaigns({
    q: searchQuery.value,
    status: selectedStatus.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    campaigns.value = data
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalCampaign.value = count
  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  }).finally(() => {
    loading.value = false;

  })
}

watchEffect(fetchCampaigns)

// 👉 Phân trang
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 1){
    currentPage.value = totalPage.value
  }
})

const status = [
  {
    title: 'Chờ duyệt',
    value: 'waiting',
  },
  {
    title: 'Được duyệt',
    value: 'accept',
  },
  {
    title: 'Từ chối',
    value: 'reject',
  },
]

const statusTranslate = {
  "waiting": "Chờ duyệt",
  "accept": "Đã duyệt",
  "reject": "Từ chối",
  "lock": "Khóa"
}

const sumMoney = (data) => {
  return data.reduce((a, b) => a + b.revenue, 0)
}

const resolveUserStatusVariant = status => {
  if (status == 'accept')
    return 'success'
  if(status == 'reject' || status == 'lock')
    return 'primary'
  return 'warning'
}

const isAddNewUserDrawerVisible = ref(false)

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = campaigns.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = campaigns.value.length + (currentPage.value - 1) * rowPerPage.value
  return `Hiển thị ${ firstIndex } đến ${ lastIndex < 0 ? lastIndex * -1 : lastIndex} của ${ totalCampaign.value } mục`
})

const handlerUpdate = data => {
  if(data.status === 200){
    isSnackbarVisible.value = true
    fetchCampaigns()
  }else {
    alert("Thất bại")
  }
}

const openDraw = (id) => {
  campaignId.value = id;
  isAddNewUserDrawerVisible.value = true
}
// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'Tổng số lượng',
    stats: '3',
    percentage: +0,
    subtitle: '',
  },
  {
    icon: 'tabler-user-plus',
    color: 'error',
    title: 'Người dùng hoạt động',
    stats: '3',
    percentage: +0,
    subtitle: '',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    title: 'Người dùng bị khóa',
    stats: '0',
    percentage: 0,
    subtitle: '',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'warning',
    title: 'Số lượng Admin',
    stats: '3',
    percentage: +0,
    subtitle: '',
  },
]
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Bộ lọc">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedRole"
                  label="Chọn quyền"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
              <!-- 👉 Select Status -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedStatus"
                  label="Chọn trạng thái"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <div class="me-3">
              <VBtn
                prepend-icon="tabler-refresh"
                color="warning"
                :loading="loading"
                @click="fetchCampaigns"
              >
                Làm mới
              </VBtn>
            </div>

            <VSpacer />

            <div class="d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="width: 20rem;">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Tìm kiếm"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Xuất dữ liệu
              </VBtn> -->

              <!-- 👉 Add user button -->
              <!-- <VBtn
                prepend-icon="tabler-plus"
                
              >
                Tạo mới
              </VBtn> -->
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
                  TÊN CHIẾN DỊCH
                </th>
                <th scope="col">
                  SẢN PHẨM
                </th>
                <th scope="col">
                  NGƯỜI TẠO
                </th>
                <th scope="col">
                  Doanh thu
                </th>
                <th scope="col">
                  TRẠNG THÁI
                </th>
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="campaign, index in campaigns"
                :key="campaign.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                </td>

                <!-- 👉 Role -->
                <td>
                  <span class="text-base">{{ campaign.name }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base ">{{ campaign.product.name }}</span>
                </td>

                <!-- 👉 Billing -->
                <td>
                  <span class="text-base">{{ campaign.user.first_name }} {{ campaign.user.last_name }}</span>
                </td>

                <td>
                  <span class="text-base">{{ sumMoney(campaign.history) }}</span>
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(campaign.status)"
                    size="small"
                    class=""
                  >
                    {{ statusTranslate[campaign.status] }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDraw(campaign.id)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <!-- <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-dots-vertical"
                    />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          title="Xem chi tiết"
                        />
                      </VList>
                    </VMenu>
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!campaigns.length">
              <tr>
                <td
                  colspan="7"
                  class="text-center"
                >
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

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>

        <VSnackbar
          v-model="isSnackbarVisible"
          location="top end"
        >
          <VAlert type="success">
            Cập nhật thành công
          </VAlert>
        </VSnackbar>
      </VCol>
    </VRow>

    <!-- TODO: 🌼 Cập nhật trạng thái của chiến dịch 🌼 -->
    <UpdateCampaignDrawer
      v-model:id="campaignId"
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @data="handlerUpdate"
    />

    <VSnackbar v-model="error.isSnackbarVisible" location="top end">
      <VAlert type="error">
        {{ error.message }}
      </VAlert>
    </VSnackbar>
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
