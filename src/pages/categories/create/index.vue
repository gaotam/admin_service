<script setup>
import {
  requiredValidator,
} from '@validators'

import { useCategoryStore } from '@/views/categories/useCategoryStore'
const categoryStore = useCategoryStore()
const form = ref()
const isSnackbarVisible = ref(false)
const categoryData = reactive({
  name: "",
  priority: null
})

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

const onSubmit = async() => {
  let { valid } = await form.value?.validate()
  
  if(valid){
    categoryStore.createCategory(categoryData).then((res) => {
      if(res.status == 201){
        isSnackbarVisible.value = true;
        form.value.reset()
      }
    }).catch(err => {
      Object.assign(error, {
        isSnackbarVisible: true,
        message: err?.response ? err.response.data.message : err
      })
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
            Tạo mới thể loại
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VTextField prepend-icon="tabler-heading" v-model="categoryData.name" :rules="[requiredValidator]" label="Tên thể lại" required />
              </VCol>

              <VCol cols="12">
                <VTextField prepend-icon="tabler-rosette-number-1" v-model="categoryData.priority" :rules="[requiredValidator]" label="Độ ưu tiên" type="number" required />
              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit">
                  Tạo mới
                </VBtn>

                <VBtn color="info" @click="form?.reset()">
                  Làm mới
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>
    </VCol>

    <VSnackbar v-model="error.isSnackbarVisible" location="top end">
      <VAlert type="error">
        {{ error.message }}
      </VAlert>
    </VSnackbar>
    
    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
    </VCol>
  </VRow>
</template>

