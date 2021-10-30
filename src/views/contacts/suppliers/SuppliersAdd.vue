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
      :visible="supplierAddSidebarActive"
      @change="(val) => $emit('update:supplier-add-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Nuevo proveedor
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
            <!-- Nombre -->
            <validation-provider
              #default="{ errors }"
              name="proveedor"
              rules="required"
            >
              <b-form-group
                label="Proveedor:"
                label-for="input-name"
              >
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  placeholder="Ingresa el nombre del proveedor"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- NIT Checkbox -->
            <b-form-group
              label="NIT (Default: CF)"
              label-for="input-nit_active"
            >
              <b-form-checkbox
                id="input-nit_active"
                v-model="nit_active"
                checked="true"
                class="custom-control-dark"
                name="check-button"
                switch
              />
            </b-form-group>

            <!-- NIT -->
            <validation-provider
              v-if="nit_active"
              #default="{ errors }"
              name="nit"
              rules="required"
            >
              <b-form-group
                label="NIT:"
                label-for="input-nit"
              >
                <b-form-input
                  id="input-nit"
                  v-model="form.nit"
                  placeholder="Ingresa el NIT"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Nombre del NIT -->
            <validation-provider
              v-if="nit_active"
              #default="{ errors }"
              name="nombre del nit"
              rules="required"
            >
              <b-form-group
                label="NIT Nombre:"
                label-for="input-nit_name"
              >
                <b-form-input
                  id="input-nit_name"
                  v-model="form.nit_name"
                  placeholder="Ingresa el nombre del NIT"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Celular -->
            <b-form-group
              label="Número de celular"
              label-for="input-cellphone"
            >
              <cleave
                id="input-cellphone"
                v-model="form.cellphone"
                class="form-control"
                :raw="false"
                :options="options.cellphoneDelimiter"
                placeholder="Número de celular"
              />
            </b-form-group>

            <!-- Teléfono -->
            <b-form-group
              label="Número de teléfono"
              label-for="input-phone"
            >
              <cleave
                id="input-phone"
                v-model="form.phone"
                class="form-control"
                :raw="false"
                :options="options.cellphoneDelimiter"
                placeholder="Número de teléfono"
              />
            </b-form-group>

            <!-- Correo -->
            <validation-provider
              #default="{ errors }"
              name="correo"
              rules="email"
            >
              <b-form-group
                label="Correo:"
                label-for="input-email"
              >
                <b-form-input
                  id="input-email"
                  v-model="form.email"
                  placeholder="Ingresa el correo"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- DATOS DE CONTACTO -->
            <!-- Contacto nombre -->
            <validation-provider
              #default="{ errors }"
              name="nombre del contacto"
            >
              <b-form-group
                label="Nombre del contacto:"
                label-for="input-contact-name"
              >
                <b-form-input
                  id="input-contact-name"
                  v-model="form.contact_name"
                  placeholder="Ingresa el nombre del contacto"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Contacto Teléfono -->
            <b-form-group
              label="Número de teléfono del contacto"
              label-for="input-contact-phone"
            >
              <cleave
                id="input-contact-phone"
                v-model="form.contact_phone"
                class="form-control"
                :raw="false"
                :options="options.cellphoneDelimiter"
                placeholder="Número de teléfono del contacto"
              />
            </b-form-group>

            <!-- Contacto Correo -->
            <validation-provider
              #default="{ errors }"
              name="correo del contacto"
              rules="email"
            >
              <b-form-group
                label="Correo del contacto:"
                label-for="input-contact-email"
              >
                <b-form-input
                  id="input-contact-email"
                  v-model="form.contact_email"
                  placeholder="Ingresa el correo del contacto"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Fax -->
            <b-form-group
              label="Fax"
              label-for="input-fax"
            >
              <b-form-input
                id="input-fax"
                v-model="form.fax"
                placeholder="Ingresa el Fax"
              />
            </b-form-group>

            <!-- Dirección -->
            <validation-provider
              #default="{ errors }"
              name="dirección"
              rules="max:200"
            >
              <b-form-group
                label="Dirección"
                label-for="textarea-address"
              >
                <b-form-textarea
                  id="textarea-address"
                  v-model="form.address"
                  placeholder="Dirección del cliente (200 caracteres máximo)"
                  rows="3"
                />
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
import Cleave from 'vue-cleave-component'
import { required } from '@/utils/validations/validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    Cleave,
  },
  model: {
    prop: 'supplierAddSidebarActive',
    event: 'update:supplier-add-sidebar-active',
  },
  props: {
    supplierAddSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,

      form: {
        name: '',
        nit: 'CF',
        nit_name: '',
        cellphone: '',
        phone: '',
        email: '',
        fax: '',
        address: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
      },

      nit_active: false,
      show: true,

      options: {
        cellphoneDelimiter: {
          delimiters: ['-'],
          blocks: [4, 4],
          uppercase: true,
        },
      },
    }
  },
  watch: {
    nit_active() {
      if (this.nit_active) {
        this.form.nit = ''
      }
      this.form.nit = 'CF'
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .post('supplier', this.form)
            .then(response => {
              this.makeToast('success', 'Proveedor agregado', `Se ha creado el proveedor ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:supplier-add-sidebar-active', false)
              this.$emit('refreshData')
            })

            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible crear el proveedor.')
        }
      })
    },

    onReset(event) {
      event.preventDefault()
      this.clearForm()
    },

    clearForm() {
      // Reset our form values
      this.form.name = ''
      this.nit_active = false
      this.form.nit = 'CF'
      this.form.nit_name = ''
      this.form.cellphone = ''
      this.form.phone = ''
      this.form.email = ''
      this.form.fax = ''
      this.form.address = ''
      this.contact_name = ''
      this.contact_phone = ''
      this.contact_email = ''

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
