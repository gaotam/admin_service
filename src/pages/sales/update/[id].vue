<script setup>
import {
  requiredValidator,
} from '@validators'
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useSaleStore } from '@/views/sale/useSaleStore'
import { watchEffect } from 'vue';
const saleStore = useSaleStore()
const route = useRoute()

const form = ref()
const loading = ref(false)
const isSnackbarVisible = ref(false)
const saleData = reactive({
  code: "",
  percent: null,
  quantity: null,
  start_time: "",
  type: null,
  end_time: ""
})

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

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

watchEffect(() => {
  saleStore.fetchSale(route.params.id).then(res => {
    const data = res.data.data
    Object.assign(saleData, data)
  }).catch(err => {
    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
})

const onSubmit = async () => {
  let { valid } = await form.value?.validate()
  
  if (valid) {
    loading.value = true
    saleStore.updateById(route.params.id, toRaw(saleData)).then((res) => {
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

</script>

<template>
  <VRow>
    <!-- 👉  -->
    <VCol cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Cập nhật sale
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VSelect
                  prepend-icon="tabler-barcode"
                  v-model="saleData.type"
                  label="Chọn kiểu"
                  :items="types"
                  clearable
                  :rules="[requiredValidator]"
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="saleData.code" prepend-icon="tabler-barcode" :rules="[requiredValidator]" label="Mã code" required />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="saleData.percent" type="number" prepend-icon="tabler-percentage" :rules="[requiredValidator]" label="% giảm" required />
              </VCol>
              <VCol cols="12" v-if="saleData.type === 'single'">
                <VTextField v-model="saleData.quantity" type="number" prepend-icon="tabler-123" :rules="[requiredValidator]" label="Số lượng" required />
              </VCol>
              <VCol cols="12">
                <AppDateTimePicker
                  prepend-icon="tabler-calendar-time"
                  v-model="saleData.start_time"
                  label="Thời gian bắt đầu"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  prepend-icon="tabler-calendar-time"
                  v-model="saleData.end_time"
                  label="Thời gian kết thúc"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
              </VCol>
              
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit" :loading="loading">
                  Cập nhật
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
          Cập nhật thành công
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

