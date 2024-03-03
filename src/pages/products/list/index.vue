<script setup>
import { useCategoryStore } from '@/views/categories/useCategoryStore'
import { useProductStore } from '@/views/product/useProductStore'
const HOST_CLIENT = import.meta.env.VITE_CLIENT

const categoryStore = useCategoryStore()
const productStore = useProductStore()

const searchQuery = ref('')
const selectedCategory = ref()
const selectedMaterial = ref()
const selectedSize = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalProduct = ref(0);
const loading = ref(false)
const products = ref([]);
const deleteId = ref("")
const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const categories = ref([])

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// 👉 Fetching
const fetchProducts = () => {
  loading.value = true;
  productStore.fetchProducts({
    q: searchQuery.value,
    size: selectedSize.value,
    material: selectedMaterial.value,
    category: selectedCategory.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    products.value = data;
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalProduct.value = count
  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  }).finally(() => {
    setTimeout(() => {
      loading.value = false;
    }, 200)
  })
}

const fetchCategories = () => {
  categoryStore.fetchCategories({}).then((res) => {
    let temp = []

    for(let c of res.data.data){
      if(c.slug != 'tin-tuc'){
        temp.push({
          title: c.name,
          value: c.id
        })
      }
    }
    categories.value = temp
  }).catch((err) => {
    console.log(err);
  })
}

watchEffect(fetchCategories)
watchEffect(fetchProducts)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

const materials = [
  {
    value: "silver",
    title: "Bạc"
  },
  {
    value: "gold",
    title: "Vàng"
  },
  {
    value: "platinum",
    title: "Bạch kim"
  }
]

const sizes = [
  {
    value: 99,
    title: "Freesize"
  },
  {
    value: 1,
    title: 1
  },
  {
    value: 2,
    title: 2,
  },
  {
    value: 3,
    title: 3
  },
  {
    value: 4,
    title: 4
  },
  {
    value: 5,
    title: 5
  }
];

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-device-laptop',
    }

  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}


// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value

  return `Hiển thị ${firstIndex} đến ${lastIndex} của ${totalProduct.value} mục`
})

const translateMaterial = {
  "gold": "Vàng",
  "silver": "Bạc",
  "titanium": "Titan",
  "platinum": "Bạch kim"
}

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    productStore.deleteById(deleteId.value).then((res) => {
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      fetchProducts()
    }).catch((err) => {
      console.log(err);
    })
  }

}

const getLink = (slug, id) => {
  return `${HOST_CLIENT}/san-pham/${slug}?id=${id}`
}
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Bộ lọc">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select  -->
              <VCol cols="12" sm="4">
                <VSelect v-model="selectedCategory" label="Chọn thể loại" :items="categories" clearable clear-icon="tabler-x" />
              </VCol>
              <!-- 👉 Select  -->
              <VCol cols="12" sm="4">
                <VSelect v-model="selectedMaterial" label="Chọn chất liệu" :items="materials" clearable
                  clear-icon="tabler-x" />
              </VCol>

              <VCol cols="12" sm="4">
                <VSelect v-model="selectedSize" label="Chọn size" :items="sizes" clearable
                  clear-icon="tabler-x" />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px;">
              <VSelect v-model="rowPerPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
            </div>

            <div class="me-3">
            <VBtn
              prepend-icon="tabler-refresh"
              color="warning"
              :loading="loading"
              @click="fetchProducts"
            >
              Làm mới
            </VBtn>
          </div>

            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="width: 20rem;">
                <VTextField v-model="searchQuery" placeholder="Tìm kiếm" density="compact" />
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
              <VBtn prepend-icon="tabler-plus" :to="{ name: 'products-create' }">
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
                  SẢN PHẨM
                </th>
                <th scope="col">
                  Ảnh
                </th>
                <th scope="col">
                  GIÁ
                </th>
                <th scope="col">
                  Size
                </th>
                <th scope="col">
                  Chất liệu
                </th>
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="product, index in products" :key="product?.id" style="height: 3.75rem;">
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  <span class="text-base">
                    #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                  </span>
                </td>

                <!-- 👉 Role -->
                <td>
                  <span class="text-capitalize text-base">{{ product.name }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <VAvatar variant="tonal" :color="resolveUserRoleVariant(product.name).color" class="me-3" size="50">
                    <VImg v-if="product.images" :src="product.images[0].url" />
                  </VAvatar>
                </td>

                <!-- 👉 Billing -->
                <td>
                  <span class="text-base">{{ product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                  }}</span>
                </td>

                <td>
                  <span class="text-base">{{ product.sizes.map(s => {
                    if(s.size == 99) return "Freesize"
                    else return s.size
                  }).join(", ") }}</span>
                </td>

                <td>
                  <span class="text-base">{{ translateMaterial[product.material] }}</span>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem;">
                  <VBtn icon size="x-small" color="default" variant="text" :href="getLink(product.slug, product.id)">
                    <VIcon size="22" icon="tabler-eye" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text"  :to="{ name: 'products-update-id', params: { id: product.id} }">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text" @click="openDialog(product.id)">
                    <VTooltip activator="parent" location="end">Xóa sản phẩm</VTooltip>
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!products.length">
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
        </VCard>

        <ConfirmDialog
          v-model:isDialogVisible="isConfirmDialogOpen"
          confirmation-msg="Bạn chắn chắn muốn xóa sản phẩm này ?"
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
