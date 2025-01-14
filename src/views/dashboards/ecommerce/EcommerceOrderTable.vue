<script setup>
import { useOrderStore } from '@/views/order/useOrderStore'
import ChangeStatusDrawer from '@/views/order/list/ChangeStatusDrawer.vue'

const snack = reactive({
  type: "success",
  isVisible: false,
  message: ""
})

const orderStore = useOrderStore()
const searchQuery = ref('')
const selectedPayMethod = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrder = ref(0)
const orders = ref([])
const loading = ref(false)
const isDrawerVisible = ref(false)
const orderId = ref(0);

// 👉 Fetching orders
const fetchOrders = () => {
  loading.value = true;
  orderStore.fetchOrders({
    q: searchQuery.value,
    status: selectedStatus.value,
    pay_method: selectedPayMethod.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    orders.value = data
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalOrder.value = count
  }).catch(error => {
    console.error(error)
  }).finally(() => {
    setTimeout(() => {
      loading.value = false;
    }, 300)
  })
}

watchEffect(fetchOrders)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})


const openDraw = (id) => {
  orderId.value = id;
  isDrawerVisible.value = true;
}

// 👉 search filters
const payMethods = [
  {
    title: 'Tiền mặt',
    value: 'cash',
  },
  {
    title: 'Ngân hàng',
    value: 'bank',
  }
]

const status = [
  {
    title: 'Đang chờ duyệt',
    value: 'waiting',
  },
  {
    title: 'Thành công',
    value: 'success',
  },
  {
    title: 'Thất bại',
    value: 'fail',
  },
]

const resolveStatusVariant = stat => {
  if (stat === 'waiting')
    return 'warning'
  if (stat === 'success')
    return 'success'
  return 'primary'
}

const enumPayMethod = {
  "cash": "Tiền mặt",
  "bank": "Ngân hàng"
}

const enumStatus = {
  "waiting": "Chờ duyệt",
  "success": "Thành công",
  "fail": "Thất bại"
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = orders.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = orders.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalOrder.value } mục`
})

const changeStatus = ({ status }) => {
  console.log('changeStatus', status);
  if(status == 200){
    fetchOrders()
    snack.isVisible = true,
    snack.message = "Cập nhật thành công"
  }
}

</script>

<template>
  <section>
    <VRow>

      <VCol cols="12">
        <VCard title="Đơn hàng">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedPayMethod"
                  label="Chọn phương thức thanh toán"
                  :items="payMethods"
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
                @click="fetchOrders"
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
                @click="isAddNewUserDrawerVisible = true"
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
                  KHÁCH HÀNG
                </th>
                <th scope="col">
                  EMAIL
                </th>
                <th scope="col">
                  SĐT
                </th>
                <th scope="col">
                  PHƯƠNG THỨC THANH TOÁN
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
                v-for="order, index in orders"
                :key="order.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                </td>

                <!-- 👉 Role -->
                <td>
                  <span>{{ order.fullname }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base ">{{ order.email }}</span>
                </td>

                <!-- 👉 Billing -->
                <td>
                  <span class="text-base ">{{ order.phone }}</span>
                </td>

                <td>
                  <span class="text-base text-center">{{ enumPayMethod[order.pay_method] }}</span>
                </td>


                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveStatusVariant(order.status)"
                    size="small"
                    
                  >
                    {{ enumStatus[order.status] }}
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
                    :to="{name: 'orders-detail-id', params: { id: order.id }}"
                  >
                    <VTooltip activator="parent" location="start">Xem chi tiết</VTooltip>
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    />
                  </VBtn>

                  <VBtn
                    v-if="order.status == 'waiting'" 
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDraw(order.id)"
                  >
                    <VTooltip activator="parent" location="end">Duyệt đơn hàng</VTooltip>
                    <VIcon
                      size="22"
                      icon="tabler-square-rounded-check"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!orders.length">
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

      <VSnackbar
        v-model="snack.isVisible"
        location="top end"
      >
        <VAlert :type="snack.type">
          {{ snack.message  }}
        </VAlert>
      </VSnackbar>
    </VRow>

    <ChangeStatusDrawer
      v-model:id="orderId"
      v-model:isDrawerOpen="isDrawerVisible"
      @data="changeStatus"
    />

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
