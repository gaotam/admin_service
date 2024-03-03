<script setup>
import { useSaleStore } from '@/views/sale/useSaleStore'
import dayjs from 'dayjs'

const HOST_CLIENT = import.meta.env.VITE_CLIENT

const saleStore = useSaleStore()
const searchQuery = ref('')
const isConfirmDialogOpen = ref(false)
const isDialogBack = ref(false)

const isSnackbarVisible = ref(false)
const isSnackbarBackVisible = ref(false)
const deleteId = ref("")
const selectedType = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPost = ref(0)
const sales = ref([])
const loading = ref(false)

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// 👉 Fetching 
const fetchSales = () => {
  loading.value = true;
  saleStore.fetchSales({
    q: searchQuery.value,
    type: selectedType.value,
    status: selectedStatus.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    sales.value = data;
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalPost.value = count
  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  }).finally(() => {
    setTimeout(() => {
      loading.value = false;
    }, 300)
  })
}

watchEffect(fetchSales)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

const status = [
  {
    title: 'Còn hiệu lực',
    value: 'active',
  },
  {
    title: 'Hết hạn',
    value: 'expired',
  }
]

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = sales.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = sales.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalPost.value } mục`
})

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const openDialogBack = (id) => {
  isDialogBack.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    saleStore.deleteById(deleteId.value).then((res) => {
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      fetchSales()
    }).catch((err) => {
      console.log(err);
    })
  }

}

const backSale = (isConfirm) => {
  if(isConfirm){
    saleStore.campaign({
      type: "DELETE",
      sale_id: deleteId.value
    }).then((res) => {
      if(res.status == 201){
        isSnackbarBackVisible.value = true
      }

      fetchSales()
    }).catch((err) => {
      Object.assign(err, {
        isSnackbarVisible: true,
        message: err?.response ? err.response.data.message : err
      })
    })
  }
}

const enumType = {
  single: "Giỏ hàng",
  group: "Sản phẩm"
}

const types = [
  {
    title: "Giỏ hàng",
    value: "single"
  },
  {
    title: "Sản phẩm",
    value: "group"
  },
]
</script>

<template>
  <section>
    <VRow>

      <VCol cols="12">
        <VCard title="Quản lý Sale">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedType"
                  label="Chọn kiểu"
                  :items="types"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
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
                @click="fetchSales"
              >
                Làm mới
              </VBtn>
            </div>

            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
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
              <VBtn
                prepend-icon="tabler-plus"
                :to="{ name: 'sales-create' }"
              >
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
                  Kiểu
                </th>
                <th scope="col">
                  CODE
                </th>
                <th scope="col">
                  %
                </th>
                <th scope="col">
                  SỐ LƯỢNG
                </th>
                <th scope="col">
                  NGÀY BẮT ĐẦU
                </th>
                <th scope="col">
                  NGÀY KẾT THÚC
                </th>
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="sale, index in sales"
                :key="sale.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                </td>

                <td>
                  <span class="text-base">{{ enumType[sale.type] }}</span>
                </td>

                <td>
                  <span class="text-base">{{ sale.code }}</span>
                </td>

                <!-- 👉 Role -->
                <td>
                  <span class="text-base">{{ sale.percent }}%</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base">{{ sale.type === 'group' ? 'Không giới hạn': sale.quantity }}</span>
                </td>

                <td>
                  <span class="text-base">{{ dayjs(sale.start_time).format('DD/MM/YYYY HH:mm:ss') }}</span>
                </td>

                <td>
                  <span class="text-base">{{ dayjs(sale.end_time).format('DD/MM/YYYY HH:mm:ss') }}</span>
                </td>
                <!-- 👉 Billing -->
                

                <!-- 👉 Actions -->
                <td
                  class="text-center"
                  style="width: 5rem;"
                >

                  <VBtn
                    v-if="sale.type == 'group'"
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDialogBack(sale.id)"
                  >
                    <VTooltip activator="parent" location="start">Thu hồi</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-arrow-back"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    :to="{ name: 'sales-update-id', params: { id: sale.id }}"
                  >
                    <VTooltip activator="parent" location="start">Cập nhật</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDialog(sale.id)"
                  >
                    <VTooltip activator="parent" location="end">Xóa</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!sales.length">
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
      </VCol>

      <ConfirmDialog
        v-model:isDialogVisible="isConfirmDialogOpen"
        confirmation-msg="Bạn chắn chắn muốn xóa mã giảm giá này?"
        @confirm="confirmHandler"
      />

      <ConfirmDialog
        v-model:isDialogVisible="isDialogBack"
        confirmation-msg="Khi bạn xác nhận, các sản phẩm gắn mã sale này sẽ bị gỡ sale?"
        @confirm="backSale"
      />

      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Xóa thành công
        </VAlert>
      </VSnackbar>

      <VSnackbar
        v-model="isSnackbarBackVisible"
        location="top end"
      >
        <VAlert type="success">
          Yêu cầu đang được xử lý, có thể mất một vài phút
        </VAlert>
      </VSnackbar>

      <VSnackbar v-model="error.isSnackbarVisible" location="top end">
        <VAlert type="error">
          {{ error.message }}
        </VAlert>
      </VSnackbar>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
