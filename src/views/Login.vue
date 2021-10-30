<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <ferre-sur-logo />
          <h2 class="brand-text text-primary">
            FerreSur
          </h2>
        </b-link>

        <!-- form -->
        <validation-observer
          ref="simpleRules"
          #default="{invalid}"
        >
          <b-form
            v-if="show"
            class="auth-login-form mt-2"
            @submit.prevent="onSubmit"
          >

            <!-- email -->
            <b-form-group
              label-for="email"
              label="Correo"
            >
              <validation-provider
                #default="{ errors }"
                name="Correo"
                rules="required|email"
              >
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="john@example.com"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Contraseña</label>
              </div>
              <validation-provider
                #default="{ errors }"
                name="Contraseña"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="Password"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              type="submit"
              block
              :disabled="invalid"
            >
              Ingresar
            </b-button>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <b-link>
            <span>¿Olvidaste tu contraseña?</span>
          </b-link>
        </b-card-text>

      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import axios from '@axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import FerreSurLogo from '@core/layouts/components/Logo.vue'
import { required, email } from '@/utils/validations/validations'

export default {
  components: {
    FerreSurLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: '',
      password: '',
      status: '',
      show: true,

      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const params = {
            email: this.userEmail,
            password: this.password,
          }
          axios
            .post('login', params)
            .then(response => {
              if (response.data.res) {
                localStorage.setItem('FerreAuthToken', response.data.token)
                this.$router.push({ name: 'home' })
              } else {
                throw (response)
              }
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible el ingreso.')
        }
      })
    },

    clearForm() {
      this.userEmail = ''
      this.password = ''

      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
