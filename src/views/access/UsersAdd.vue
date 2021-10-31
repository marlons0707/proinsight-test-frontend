<template>
  <div>
    <b-sidebar
      id="sidebar-backdrop"
      backdrop
      shadow
      bg-variant="white"
      sidebar-class="sidebar-lg"
      no-header
      right
      :visible="productAddSidebarActive"
      @change="(val) => $emit('update:product-add-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Nuevo usuario
          </h5>
          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>

        <!-- Campos formulario -->
        <validation-observer ref="simpleRules">
          <b-form
            v-if="show"
            class="p-2"
            @submit="onSubmit"
            @reset="onReset"
          >
            <validation-provider
              #default="{ errors }"
              name="nombre"
              rules="required"
            >
              <b-form-group
                label="Nombre:"
                label-for="input-name"
              >
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  placeholder="Ingresa el nombre"
                  :state="errors.length > 0 ? false:null"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <validation-provider
              #default="{ errors }"
              name="email"
              rules="required|email"
            >
              <b-form-group
                label="Email:"
                label-for="register-email"
              >
                <b-form-input
                  id="register-email"
                  v-model="form.email"
                  name="register-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="john@example.com"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <validation-provider
              #default="{ errors }"
              name="usuario"
              rules="required"
            >
              <b-form-group
                label="Usuario:"
                label-for="input-user"
              >
                <b-form-input
                  id="input-user"
                  v-model="form.user"
                  placeholder="Ingresa el usuario"
                  :state="errors.length > 0 ? false:null"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <validation-provider
              #default="{ errors }"
              name="Contraseña"
              rules="required"
            >
              <b-form-group
                label="Contraseña:"
                label-for="input-password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="input-password"
                    v-model="form.password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="Ingrese su contraseña"
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
              </b-form-group>
            </validation-provider>

            <validation-provider
              #default="{ errors }"
              name="Confirmación de contraseña"
              rules="required"
            >
              <b-form-group
                label="Confirmación de contraseña:"
                label-for="input-password-confirm"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="input-password-confirm"
                    v-model="form.password_confirmation"
                    :type="passwordConfFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="Ingrese nuevamente la contraseña"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordConfToggleIcon"
                      @click="toggleConfPasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <b-button
              type="submit"
              variant="primary"
            >
              Crear
            </b-button>
            <b-button
              style="margin-left: 5px;"
              type="reset"
              variant="danger"
            >
              Limpiar
            </b-button>

          </b-form>
        </validation-observer>

      </template>

    </b-sidebar>
  </div>
</template>

<script>
import axios from '@axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { required } from '@/utils/validations/validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  model: {
    prop: 'productAddSidebarActive',
    event: 'update:product-add-sidebar-active',
  },
  props: {
    productAddSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      show: true,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    passwordConfToggleIcon() {
      return this.passwordConfFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          if (this.confirmPassword()) {
            axios
              .post('register', this.form)
              .then(response => {
                this.makeToast('success', 'Usuario agregado', `Se ha creado el usuario ${response.data.user.name}.`)
                this.clearForm()
                this.$emit('update:product-add-sidebar-active', false)
                this.$emit('refreshData')
              })
              .catch(error => {
                this.showErrors(error)
              })
          } else {
            this.makeToast('danger', 'Error', 'Las contraseñas no coinciden.')
          }
        } else {
          this.makeToast('danger', 'Error', 'No es posible crear el usuario.')
        }
      })
    },

    confirmPassword() {
      if (this.form.password === this.form.password_confirmation) {
        return true
      }
      return false
    },

    onReset(event) {
      event.preventDefault()
      this.clearForm()
    },

    clearForm() {
      // Reset our form values
      this.form.name = ''
      this.form.email = ''
      this.form.user = ''
      this.form.password = ''
      this.form.password_confirmation = ''

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    makeToast(variant = null, title = null, message = null) {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
      })
    },
  },
}
</script>
