<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from '@axios'

import {
  emailValidator,
  requiredValidator,
} from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const role = ref()
const loading = ref(false)
const roleItem = [
  {
    title: "Người dùng",
    value: "USER"
  },
  {
    title: "Người quản trị",
    value: "ADMIN"
  },
]

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
      loading.value = true
      let res = await axios.put(`/api/admin/v1/users/change-role/${props.id}`, { user_id: props.id, role: role.value})

      setTimeout(() => {
        emit('update:isDrawerOpen', false)
        emit('data', {
          status: res.status,
        })
        loading.value = false
      }, 300)
      
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })

}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
        Cập nhật quyền
      </h6>

      <VSpacer />

      <!-- 👉 Close btn -->
      <VBtn
        variant="tonal"
        color="default"
        icon
        size="32"
        class="rounded"
        @click="closeNavigationDrawer"
      >
        <VIcon
          size="18"
          icon="tabler-x"
        />
      </VBTn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>

              <!-- 👉 Role -->
              <VCol cols="12">
                <VSelect
                  v-model="role"
                  label="Chọn quyền"
                  :rules="[requiredValidator]"
                  :items="roleItem"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                  :loading="loading"
                >
                  Xác nhận
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Hủy bỏ
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
