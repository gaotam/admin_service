<script setup>
import { useOrderStore } from '@/views/order/useOrderStore'
import ChangeStatusDrawer from '@/views/order/list/ChangeStatusDrawer.vue'

const snack = reactive({
  type: "success",
  isVisible: false,
  message: ""
})

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

const orderStore = useOrderStore()
const searchQuery = ref('')
const selectedPayMethod = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const startTime = ref("")
const money = ref(0)
const analytic = ref([0, 0, 0])
const endTime = ref("")
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
    start_time: startTime.value,
    end_time: endTime.value,
    pay_method: selectedPayMethod.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    const { count, data, total, analytic } = response.data
    orders.value = data
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalOrder.value = count
    orderListMeta.value = orderListMeta.value.map((v, i) => {
      if (i == 0) return {
        icon: 'tabler-brand-cashapp',
        color: 'info',
        title: 'Doanh thu',
        stats: total,
        subtitle: '',
      }

      if(i == 1) return {
        icon: 'tabler-checks',
        color: 'success',
        title: 'Đơn hàng thành công',
        stats: analytic[0].success ? analytic[0].success : 0,
        subtitle: '',
      }

      if(i == 2) return {
        icon: 'tabler-bus-stop',
        color: 'warning',
        title: 'Đơn hàng đang chờ',
        stats: analytic[0].waiting ? analytic[0].waiting : 0,
        subtitle: '',
      }

      if(i == 3) return {
        icon: 'tabler-exclamation-circle',
        color: 'error',
        title: 'Đơn hàng thất bại',
        stats: analytic[0]?.fail ? analytic[0]?.fail : 0,
        subtitle: '',
      }

      return v
    })
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

// 👉 List
const orderListMeta = ref([
  {
    icon: 'tabler-brand-cashapp',
    color: 'success',
    title: 'Doanh thu',
    stats: '21,459',
    subtitle: '',
  },
  {
    icon: 'tabler-checks',
    color: 'success',
    title: 'Đơn hàng thành công',
    stats: '19,860',
    subtitle: '',
  },
  {
    icon: 'tabler-bus-stop',
    color: 'warning',
    title: 'Đơn hàng đang chờ',
    stats: '4,567',
    subtitle: '',
  },
  {
    icon: 'tabler-exclamation-circle',
    color: 'error',
    title: 'Đơn hàng thất bại',
    stats: '2',
    subtitle: '',
  },
]);

const changeStatus = ({ status }) => {
  console.log('changeStatus', status);
  if(status == 200){
    fetchOrders()
    snack.isVisible = true,
    snack.message = "Cập nhật thành công"
  }
}

const resetFilter = () => {
  selectedPayMethod.value = null
  selectedStatus.value = null
  startTime.value = ""
  endTime.value = ""
}
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in orderListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Bộ lọc">
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

              <VCol
                cols="12"
                sm="4"
              ></VCol>

              <VCol
                cols="12"
                sm="4"
              >
                <AppDateTimePicker
                  v-model="startTime"
                  label="Thời gian bắt đầu"
                />
              </VCol>

              <VCol
                cols="12"
                sm="4"
              >
                <AppDateTimePicker
                  v-model="endTime"
                  label="Thời gian kết thúc"
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

            <div class="">
              <VBtn
                prepend-icon="tabler-refresh"
                color="error"
                @click="resetFilter"
              >
                Xóa bộ lọc
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
