<script setup>
import {
  requiredValidator,
} from '@validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useVideoStore } from '@/views/product/useVideoStore'
import { useCategoryStore } from '@/views/categories/useCategoryStore'

const productStore = useVideoStore()
const categoryStore = useCategoryStore()

const form = ref()
const categories = ref();
const loading = ref(false)
const isSnackbarVisible = ref(false)

const rSizes = ref([])

const productData = reactive({
  name: "",
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

const handleQuantity = ({ target }, size) => {
  let index = productData.sizes.findIndex(s => s.size == size)

  if(index == -1){
    productData.sizes.push({
      size,
      quantity: parseInt(target.value)
    })
  } else {
    productData.sizes[index].quantity = parseInt(target.value)
  }
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

watchEffect(fetchCategories)

const onSubmit = async () => {
  let { valid } = await form.value?.validate()

  if (valid) {
    loading.value = true
    productStore.createProduct(toRaw(productData)).then((res) => {
      if (res.status == 201) {
        isSnackbarVisible.value = true;
        Object.assign(productData, {
          desc: "<h1>Điền mô tả</h1>",
          detail: "<h1>Điền bài giới thiệu</h1>",
        })
        form.value.reset()
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
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea v-model="productData.short_desc" :rules="[requiredValidator]" prepend-icon="tabler-alphabet-latin" label="Mô tả ngắn" rows="2" required />
              </VCol>
              <VCol cols="12" style="height: 100%;">
                <QuillEditor theme="snow" toolbar="full" :rules="[requiredValidator]" content-type="html" v-model:content="productData.desc"/>
              </VCol>
              <VCol cols="12" style="height: 100%;">
                <QuillEditor theme="snow" toolbar="full" content-type="html" v-model:content="productData.detail"/>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="productData.material"
                  :items="materials"
                  prepend-icon="tabler-assembly"
                  label="Chất liệu"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="rSizes"
                  :items="sizes"
                  prepend-icon="tabler-ruler-3"
                  label="Size"
                  chips
                  multiple
                />
              </VCol>
              <VCol cols="12" v-for="size in rSizes">
                <VTextField  type="number" prepend-icon="tabler-123" :label="titleQuantity(size)" @change="handleQuantity($event, size)" required />
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
                <VTextField  type="number" v-model="productData.price" prepend-icon="tabler-brand-cashapp" :rules="[requiredValidator]" label="Giá tiền" required />
              </VCol>
              <VCol cols="12">
                <VFileInput v-model="productData.images" prepend-icon="tabler-camera" :rules="[requiredValidator]" placeholder="Upload your documents" label="Ảnh sản phẩm" multiple>
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
                  Tạo mới
                </VBtn>

                <VBtn color="info" @click="form.reset()">
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
      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>

      <VSnackbar v-model="error.isSnackbarVisible" location="top end">
        <VAlert type="error">
          {{ error.message }}
        </VAlert>
      </VSnackbar>
    </VCol>
  </VRow>
</template>

