<script setup>
import { usePostStore } from '@/views/post/usePostStore'

const HOST_CLIENT = import.meta.env.VITE_CLIENT

const postStore = usePostStore()
const searchQuery = ref('')
const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const deleteId = ref("")
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPost = ref(0)
const posts = ref([])
const loading = ref(false)

// 👉 Fetching 
const fetchPosts = () => {
  loading.value = true;
  postStore.fetchPosts({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    const { count, data } = response.data
    posts.value = data;
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalPost.value = count
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

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

watchEffect(fetchPosts)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

const status = [
  {
    title: 'Không hoạt động',
    value: 'pending',
  },
  {
    title: 'Hoạt động',
    value: 'active',
  },
  {
    title: 'Bị khóa',
    value: 'lock',
  },
]

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = posts.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = posts.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalPost.value } mục`
})

const getLink = (slug, id) => {
  return `${HOST_CLIENT}/tin-tuc/${slug}?id=${id}`
}

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    postStore.deleteById(deleteId.value).then((res) => {
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      fetchPosts()
    }).catch((err) => {
      Object.assign(error, {
        isSnackbarVisible: true,
        message: err?.response ? err.response.data.message : err
      })
    })
  }

}
</script>

<template>
  <section>
    <VRow>

      <VCol cols="12">
        <VCard title="Quản lý bài viết">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedRole"
                  label="Chọn quyền"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
              <!-- 👉 Select Status -->
              <!-- <VCol
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
              </VCol> -->
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
                @click="fetchPosts"
              >
                Làm mới
              </VBtn>
            </div>

            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
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
              <VBtn
                prepend-icon="tabler-plus"
                :to="{ name: 'posts-create' }"
              >
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
                  Ảnh thumnail
                </th>
                <th scope="col">
                  Tiêu đề
                </th>
                <th scope="col">
                  Tác giả
                </th>
                <!-- <th scope="col">
                  TRẠNG THÁI
                </th> -->
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="post, index in posts"
                :key="post.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                  #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
                </td>

                <td>
                  <VAvatar
                    variant="tonal"
                    size="50"
                    class="me-4"
                  >
                    <VImg
                      v-if="post.thumbnail"
                      :src="post.thumbnail"
                    />
                  </VAvatar>
                </td>

                <!-- 👉 Role -->
                <td>
                  <span class="text-capitalize text-base">{{ post.title }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base">{{ post.user.first_name }} {{ post.user.last_name }}</span>
                </td>

                <!-- 👉 Billing -->
                

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
                    :href="getLink(post.slug, post.id)"
                    target="_blank"
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
                    :to="{ name: 'posts-update-id', params: { id: post.id} }"
                  >
                    <VTooltip activator="parent" location="start">Sửa bài viêt</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDialog(post.id)"
                  >
                    <VTooltip activator="parent" location="end">Xóa bài viết</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!posts.length">
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

      <ConfirmDialog
        v-model:isDialogVisible="isConfirmDialogOpen"
        confirmation-msg="Bạn chắn chắn muốn xóa bài viết này ?"
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
    </VRow>
  </section>

  
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
