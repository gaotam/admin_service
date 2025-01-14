<script setup>
import { VForm } from 'vuetify/components'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {
  emailValidator,
  requiredValidator,
} from '@validators'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { reactive } from 'vue'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()
const email = ref('mynamebvh@gmail.com')
const password = ref('hoangdz')
const loading = ref(false)
const rememberMe = ref(false)
const error = reactive({
  isSnackbarVisible: false,
  message: ""
})

const login = () => {
  loading.value = true
  axios.post('/api/v1/auth/login', {
    account: email.value,
    password: password.value,
  }).then(r => {
    // const { accessToken, userData, userAbilities } = r.data
    const { access_token, user } = r.data.data
    const userAbilities = [
      {
        action: 'manage',
        subject: 'all',
      },
    ]

    const userData = {
      id: 1,
      fullName: user.fullname,
      username: 'hoangbui',
      // avatar: avatar1,
      role: 'admin',
      email: email,
    }

    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    ability.update(userAbilities)
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('accessToken', (access_token))

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : '/dashboards/ecommerce')
  }).catch(err => {
    // const { errors: formErrors } = e.response.data

    Object.assign(error, {
      isSnackbarVisible: true,
      message: err?.response ? err.response.data.message : err
    })

    // errors.value = formErrors
    // console.error(e)
  }).finally(() => {
    loading.value = false
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="505" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Chào mừng bạn đến {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
          </p>
        </VCardText>
        <VCardText>
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField v-model="email" label="Email" type="email" :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="password" label="Mật khẩu" :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'" :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox v-model="rememberMe" label="" />
                  <a>
                    Quên mật khẩu
                  </a>

                </div>

                <VBtn block type="submit" :loading="loading">
                  Đăng nhập
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center">

              </VCol>
              <VCol cols="12" class="d-flex align-center">
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VSnackbar v-model="error.isSnackbarVisible" location="top end">
    <VAlert type="error">
      {{ error.message }}
    </VAlert>
  </VSnackbar>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>