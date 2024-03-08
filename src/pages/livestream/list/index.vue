<script setup>
import ChangeRoleUserDrawer from '@/views/user/list/ChangeRoleUserDrawer.vue'
import { useUserListStore } from '@/views/user/useUserStore'
import { avatarText } from '@core/utils/formatters'

const userStore = useUserListStore()
const snack = reactive({
  type: "success",
  isVisible: false,
  message: ""
})
// const snackMessage = ref("")
const searchQuery = ref('')
const selectedRole = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)
const loading = ref(false)
const users = ref([])
const userId = ref(0)

const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

// 👉 Fetching users
const fetchUsers = () => {
  loading.value = true;
  userStore.fetchUsers({
    q: searchQuery.value,
    status: selectedStatus.value,
    role: selectedRole.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    const { data } = response.data
    const count = users.length
    users.value = data.users
    // console.log(users.value);
    totalPage.value = count % rowPerPage.value == 0 ? count % rowPerPage.value : Math.ceil(count / rowPerPage.value) 
    totalUsers.value = count
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

watchEffect(fetchUsers)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value && currentPage.value > 1)
    currentPage.value = totalPage.value
})

//
const lockOrUnlockUser = ({ id, isLock }) => {
  userStore.lockOrUnlockUser({ user_id: id, isLock: !isLock }).then((res) => {
    fetchUsers()
    if(!isLock){
      snack.message = "Khóa thành công"
    } else {
      snack.message = "Mở thành công"
    }
    snack.isVisible = true
  }).catch(err => {
    Object.assign(snack, {
      type: "error",
      isVisible: true,
      message: err?.response ? err.response.data.message : err
    })
  })
}

// 👉 search filters
const roles = [
  {
    title: 'Người quản trị',
    value: 'admin',
  },
  {
    title: 'Người dùng',
    value: 'user',
  }
]

const status = [
  {
    title: 'Hoạt động',
    value: false,
  },
  {
    title: 'Bị khóa',
    value: true,
  },
]

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

const resolveUserStatusVariant = stat => {
  if (!stat)
    return 'success'
  return 'primary'
}

const isUserDrawerVisible = ref(false)

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = users.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalUsers.value } mục`
})

const changeRole = userData => {
  // userListStore.addUser(userData)
  fetchUsers()
  // refetch User
  // fetchUsers()
}

const openDraw = (id) => {
  userId.value = id;
  isUserDrawerVisible.value = true
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
              <!-- 👉 Select Role -->
              <VCol
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
              </VCol>
              <!-- 👉 Select Status -->
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
                @click="fetchUsers"
              >
                Làm mới
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
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="rol">
                  #STT
                </th>
                <th scope="col">
                  HỌ VÀ TÊN
                </th>
                <th scope="col">
                  QUYỀN
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
                v-for="user, index in users"
                :key="user.id"
                style="height: 3.75rem;"
              >
              <td style="color: rgb(var(--v-theme-primary)); font-weight: bold;">
                #{{ (index + (rowPerPage * (currentPage - 1))) + 1  }}
              </td>
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      :color="resolveUserRoleVariant(user.role).color"
                      class="me-3"
                      size="38"
                    >
                      <VImg
                        v-if="user.avatar"
                        :src="user.avatar"
                      />
                      <span v-else>{{ avatarText(user?.fullname) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                          {{ user?.fullname }}
                      </h6>
                      <span class="text-sm text-disabled">@{{ user.email }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Role -->
                <td>
                  <VAvatar
                    :color="resolveUserRoleVariant(user.role).color"
                    :icon="resolveUserRoleVariant(user.role).icon"
                    variant="tonal"
                    size="30"
                    class="me-4"
                  />
                  <span class="text-capitalize text-base">{{ user.role }}</span>
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.isLock)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ user.isLock ? "Khóa" : "Hoạt động" }}
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
                    @click="openDraw(user.id)"
                  >
                    <VTooltip activator="parent" location="start">Thay đổi quyền</VTooltip>

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
                    @click="lockOrUnlockUser(user)"
                  >
                    <VTooltip activator="parent" location="end">Khoá hoặc mở khóa người dùng</VTooltip>

                    <VIcon
                      size="22"
                      icon="tabler-lock-open-off"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!users.length">
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

        <VSnackbar
          v-model="snack.isVisible"
          location="top end"
        >
          <VAlert :type="snack.type">
            {{ snack.message  }}
          </VAlert>
        </VSnackbar>
      </VCol>
    </VRow>

    <!--  -->
    <ChangeRoleUserDrawer
      v-model:id="userId"
      v-model:isDrawerOpen="isUserDrawerVisible"
      @data="changeRole"
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
