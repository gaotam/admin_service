<script setup>
import {
  requiredValidator,
} from '@validators'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useCategoryStore } from '@/views/categories/useCategoryStore'
import { useSaleStore } from '@/views/sale/useSaleStore'

const categoryStore = useCategoryStore()
const saleStore = useSaleStore()

const form = ref()
const sales = ref();
const categories = ref();
const loading = ref(false)
const isSnackbarVisible = ref(false)

const campaignData = reactive({
  type: null,
  sale_id: null,
  data: null
})

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
    console.log(err);
  })
}

watchEffect(fetchSales)

const onSubmit = async () => {
  let { valid } = await form.value?.validate()
  
  if (valid) {
    loading.value = true
    saleStore.campaign(toRaw(campaignData)).then((res) => {
      if (res.status == 201) {
        isSnackbarVisible.value = true;
        form.value.reset()
        postData.content = "<p></p>"
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      loading.value = false
    })
  }
}

const resetForm = () => {
  postData.content = "<p></p>"
  form.value.reset()
}


const types = [
  {
    title: "Theo thể loại",
    value: "CATEGORY"
  }
]
</script>

<template>
  <VRow>
    <!-- 👉  -->
    <VCol cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Tạo kịch bản sale
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VSelect
                  prepend-icon="tabler-box"
                  v-model="campaignData.type"
                  label="Chọn kiểu"
                  :items="types"
                  clearable
                  :rules="[requiredValidator]"
                  clear-icon="tabler-x"
                />
              </VCol>
              
              <VCol cols="12">
                <VSelect
                  v-model="campaignData.sale_id"
                  :items="sales"
                  prepend-icon="tabler-discount-2"
                  :loading="loading"
                  label="Giảm giá"
                />
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="campaignData.data"
                  :items="categories"
                  prepend-icon="tabler-box"
                  :loading="loading"
                  label="Thể loại"
                />
              </VCol>

              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit" :loading="loading">
                  Tạo mới
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Yêu cầu đang được xử lý, có thể mất một vài phút
        </VAlert>
      </VSnackbar>
    </VCol>
  </VRow>
</template>

