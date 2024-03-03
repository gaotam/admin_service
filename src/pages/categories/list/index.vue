<script setup>
import { useCategoryStore } from '@/views/categories/useCategoryStore'

const categoryStore = useCategoryStore()
const searchQuery = ref('')
const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const deleteId = ref("")
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalInvoices = ref(0)
const categories = ref([])
const selectedRows = ref([])
const loading = ref(false)

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// 👉
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = categories.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = categories.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalInvoices.value } mục`
})

const loadData = () => {
  loading.value = true;
  categoryStore.fetchCategories({
    q: searchQuery.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    categories.value = data
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalInvoices.value = count

  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err
    })
  }).finally(() => {
    setTimeout(() => {
      loading.value = false;
    }, 300)
  })
}


// 👉 
watchEffect(() => {
  loadData()
})

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    categoryStore.deleteCategory(deleteId.value).then((res) => {
      console.log(res);
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      loadData()
    }).catch((err) => {
      console.log(err);
    })
  }

}
</script>

<template>
  <VCard
    v-if="categories"
    id="invoice-list"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <!-- 👉 Rows per page -->
      <div
        class="d-flex align-center"
        style="width: 145px;"
      >
        <span class="text-no-wrap me-3">Hiển thị:</span>
        <VSelect
          v-model="rowPerPage"
          density="compact"
          :items="[10, 20, 30, 50]"
        />
      </div>

      <div class="me-3">
        <VBtn
          prepend-icon="tabler-refresh"
          color="warning"
          :loading="loading"
          @click="loadData"
        >
          Làm mới
        </VBtn>
      </div>

      <VSpacer />

      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="invoice-list-filter">
          <VTextField
            v-model="searchQuery"
            placeholder="Tìm kiếm"
            density="compact"
          />
        </div>

        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'categories-create' }"
        >
          Tạo mới
        </VBtn>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION Table -->
    <VTable class="text-no-wrap invoice-list-table">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            #STT
          </th>
          <th scope="col">
            TÊN THỂ LOẠI
          </th>

          <th
            scope="col"
            class=""
          >
            SLUG
          </th>

          <th scope="col">
            ĐỘ ƯU TIÊN
          </th>

          <th scope="col">
            CHỨC NĂNG
          </th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr
          v-for="category, index in categories"
          :key="category.id"
          style="height: 3.75rem;"
        >
          <!-- 👉 Id -->
          <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
            #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
          </td>

          <!-- 👉  -->
          <td class="">
            {{ category.name }}
          </td>

          <!-- 👉  -->
          <td>{{ category.slug }}</td>

          <!-- 👉  -->
          <td class="">{{ category.priority }}</td>

          <!-- 👉 Actions -->
          <td style="width: 8rem;">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'categories-edit-id', params: { id: category.id } }"
            >
              <VIcon
                icon="tabler-pencil"
                :size="22"
              />
            </VBtn>

            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="openDialog(category.id)"
            >
              <VIcon
                icon="tabler-trash"
                :size="22"
              />
            </VBtn>

          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->
      <tfoot v-show="!categories.length">
        <tr>
          <td
            colspan="8"
            class="text-center text-body-1"
          >
            Không có dữ liệu
          </td>
        </tr>
      </tfoot>
    </VTable>
    <!-- !SECTION -->

    <VDivider />

    <!-- SECTION Pagination -->
    <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
      <!-- 👉 Pagination meta -->
      <span class="text-sm text-disabled">
        {{ paginationData }}
      </span>

      <VSpacer />

      <!-- 👉 Pagination -->
      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="5"
        :length="totalPage"
        @next="selectedRows = []"
        @prev="selectedRows = []"
      />
    </VCardText>
    <!-- !SECTION -->

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogOpen"
      confirmation-msg="Bạn chắn chắn muốn xóa thể loại này ?"
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
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 20rem;
  }
}
</style>
