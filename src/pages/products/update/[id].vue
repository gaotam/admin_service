<script setup>
import {
  requiredValidator,
} from '@validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useProductStore } from '@/views/product/useProductStore'
import { useCategoryStore } from '@/views/categories/useCategoryStore'
import { useSaleStore } from '@/views/sale/useSaleStore'

const route = useRoute()

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const saleStore = useSaleStore()


const form = ref()
const categories = ref();
const sales = ref();
const loading = ref(false)
const isSnackbarVisible = ref(false)
const rSizes = ref([])

const productData = reactive({
  name: "",
  sale_id: null,
  short_desc: "",
  category_id: null,
  desc: "<h1>Điền mô tả</h1>",
  price: null,
  detail: "<h1>Điền bài giới thiệu</h1>",
  sizes: [],
  material: null,
  style: [],
  images: [],
  tags: [],
  content: "",
})

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

const fetchProductDetail = () => {
  productStore.fetchPost((route.params.id)).then((res) => {
    const { 
      name, 
      category, 
      short_desc, 
      material, 
      price,
      sale, 
      detail, 
      desc, 
      sizes,
      style,
      tags
    } = res.data.data

    Object.assign(productData, {
      name,
      category_id: category,
      short_desc,
      material,
      price,
      detail,
      sale_id: sale?.id ? sale.id : null,
      desc,
      sizes,
      style,
      tags
    })

    rSizes.value = sizes.map(s => s.size)
  }).catch((err) => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
}

const handleQuantity = ({ target }, index) => {
  productData.sizes[index].quantity = target.value
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
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
}

const fetchSales = () => {
  saleStore.fetchSales({type: 'group'}).then((res) => {
    let temp = []

    for(let c of res.data.data){
      temp.push({
        title: `${c.code} - ${c.percent}%`,
        value: c.id
      })
    }
    sales.value = temp
  }).catch((err) => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
}

watchEffect(fetchCategories)
watchEffect(fetchProductDetail)
watchEffect(fetchSales)

const updateSize = (data) => {
  rSizes.value.sort()
  let temp = data.map(d => {
    let size = productData.sizes.find(s => s.size == d)
    return {
      size: d,
      quantity: size ? size.quantity : null
    }
  })
  productData.sizes = temp
}

const onSubmit = async () => {
  let { valid } = await form.value?.validate()

  if (valid) {
    loading.value = true
    productStore.updateById(route.params.id, toRaw(productData)).then((res) => {
      if (res.status == 200) {
        isSnackbarVisible.value = true;
        
      }
    }).catch(err => {
      Object.assign(error, {
        isSnackbarVisible: true,
        message: err?.response ? err.response.data.message : err
      })
    }).finally(() => {
      loading.value = false
    })
  }
}

const styles = [
{
    value: "youthful",
    title: "Trẻ trung"
  },
  {
    value: "luxurious",
    title: "Sang trọng"
  },
]

const tags = [
  {
    value: "limited-quantity",
    title: "Số lượng giới hạn"
  },
  {
    value: "expert-selection",
    title: "Lựa chọn chuyên gia"
  }
];

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
    title: "freesize"
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

const titleQuantity = (size) => {
  if(size == 99){
    return `Số lượng cho freesize`
  } else {
    return `Số lượng size ${size}`
  }
}
</script>

<template>
  <VRow>
    <!-- 👉  -->
    <VCol cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Tạo mới sản phẩm
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="productData.name" prepend-icon="tabler-h-1" :rules="[requiredValidator]" label="Tên sản phẩm" required />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.category_id"
                  :items="categories"
                  prepend-icon="tabler-box"
                  :loading="loading"
                  label="Thể loại"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.sale_id"
                  :items="sales"
                  prepend-icon="tabler-discount-2"
                  :loading="loading"
                  label="Giảm giá"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea v-model="productData.short_desc" :rules="[requiredValidator]" prepend-icon="tabler-alphabet-latin" label="Mô tả ngắn" rows="2" required />
              </VCol>
              <VCol cols="12" style="height: 100%;">
                <QuillEditor theme="snow" toolbar="full" :rules="[requiredValidator]" content-type="html" v-model:content="productData.desc"/>
              </VCol>
              <VCol cols="12" style="height: 100%;">
                <QuillEditor theme="snow" toolbar="full" :rules="[requiredValidator]" content-type="html" v-model:content="productData.detail"/>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.material"
                  :items="materials"
                  prepend-icon="tabler-box"
                  label="Chất liệu"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="rSizes"
                  :items="sizes"
                  prepend-icon="tabler-box"
                  label="Size"
                  chips
                  multiple
                  @update:model-value="updateSize"
                />
              </VCol>
              <VCol cols="12" v-for="s, index in rSizes">
                <VTextField  type="number" :model-value="productData.sizes[index]?.quantity" prepend-icon="tabler-h-1" :label="titleQuantity(s)" @change="handleQuantity($event, index)" required />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.style"
                  :items="styles"
                  prepend-icon="tabler-tie"
                  label="Kiểu"
                  chips
                  multiple
                />
              </VCol>
              <VCol cols="12">
                <VTextField  type="number" v-model="productData.price" prepend-icon="tabler-h-1" :rules="[requiredValidator]" label="Giá tiền" required />
              </VCol>
              <VCol cols="12">
                <VFileInput v-model="productData.images" prepend-icon="tabler-camera" placeholder="Upload your documents" label="Ảnh sản phẩm" multiple>
                  <template #selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                      <VChip label size="small" variant="outlined" color="primary" class="me-2">
                        {{ fileName }}
                      </VChip>
                    </template>
                  </template>
                </VFileInput>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.tags"
                  :items="tags"
                  prepend-icon="tabler-tag"
                  label="Tags"
                  chips
                  multiple
                />
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

        <VSnackbar v-model="isSnackbarVisible" location="top end">
          <VAlert type="success">
            Cập nhật thành công
          </VAlert>
        </VSnackbar>
      </VCard>
    </VCol>
  </VRow>
</template>

