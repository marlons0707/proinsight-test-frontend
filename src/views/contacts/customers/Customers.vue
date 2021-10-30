<template>

  <div>
    <customers-add
      :customer-add-sidebar-active.sync="customerAddSidebarActive"
      @refreshData="getCustomers"
    />

    <customers-edit
      v-if="updateShow"
      :customer-id="customerId"
      :customer-edit-sidebar-active.sync="customerEditSidebarActive"
      @refreshData="getCustomers"
    />

    <!-- Table Container Card -->
    <b-card
      no-body
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Mostrar</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block ml-50 mr-1"
            />
            <b-button
              _class="btn-icon rounded-circle"
              variant="primary"
              @click="customerAddSidebarActive = true"
            >
              Nuevo
            </b-button>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        class="position-relative"
        hover
        responsive
        primary-key="id"
        show-empty
        empty-text="No se encontraron registros coincidientes"
        :items="customersData"
        :fields="customersFields"
        :per-page="perPage"
      >

        <template #head(id)="data">
          <span
            class="text-secondary pointer"
            @click="sortColumn(data.column)"
          >{{ data.label }}
          </span>
        </template>

        <template #head(name)="data">
          <span
            class="text-secondary pointer"
            @click="sortColumn(data.column)"
          >{{ data.label }}
          </span>
        </template>

        <template #head(nit)="data">
          <span
            class="text-secondary pointer"
            @click="sortColumn(data.column)"
          >{{ data.label }}
          </span>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <!-- Dropdown -->
            <b-dropdown
              variant="link"
              no-caret
            >
              <template #button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="align-middle text-body"
                />
              </template>
              <b-dropdown-item
                @click="updateCustomer(data.item.id)"
              >
                <feather-icon icon="Edit2Icon" />
                <span class="align-middle ml-50">Editar</span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="deleteCustomer(data.item.id)"
              >
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Eliminar</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>

      </b-table>

      <div class="mx-2 mb-2">
        <b-row>

          <!-- Pagination info -->
          <b-col
            v-if="customersMeta"
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Mostrando del {{ customersMeta.from }} al {{ customersMeta.to }} de {{ customersMeta.total }} registros</span>
          </b-col>

          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-if="customersMeta"
              v-model="currentPage"
              :total-rows="customersMeta.total"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </b-col>

        </b-row>
      </div>
    </b-card>
  </div>

</template>

<script>
import axios from '@axios'
import vSelect from 'vue-select'
import CustomersAdd from './CustomersAdd.vue'
import CustomersEdit from './CustomersEdit.vue'

export default {
  components: {
    vSelect,
    CustomersAdd,
    CustomersEdit,
  },

  data() {
    return {
      customerAddSidebarActive: false,
      customerEditSidebarActive: false,

      searchQuery: '',

      sortField: 'id',
      sortDesc: 'desc',

      perPage: 10,
      perPageOptions: [5, 10, 25, 50, 100],
      currentPage: 1,

      customersFields: [
        { key: 'actions', label: 'Acciones' },
        { key: 'id', label: '#' },
        { key: 'name', label: 'Cliente' },
        { key: 'nit', label: 'NIT' },
        { key: 'nit_name', label: 'NIT Nombre' },
        { key: 'cellphone', label: 'Celular' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'email', label: 'Correo' },
        { key: 'fax', label: 'Fax' },
        { key: 'address', label: 'Dirección' },
        { key: 'status', label: 'Estado' },
        { key: 'created_at', label: 'Creado' },
        { key: 'updated_at', label: 'Actualizado' },
      ],
      customersData: null,
      customersMeta: null,

      updateShow: false,
      customerId: 0,
    }
  },

  watch: {
    perPage() {
      this.getCustomers()
    },
    currentPage() {
      this.getCustomers()
    },
    searchQuery() {
      this.getCustomers()
    },
  },

  created() {
    this.getCustomers()
  },

  methods: {
    getCustomers() {
      axios
        .get(`customer?perPage=${this.perPage}&page=${this.currentPage}&query=${this.searchQuery}&sortField=${this.sortField}&sortDesc=${this.sortDesc}`)
        .then(response => {
          this.customersMeta = response.data.meta
          this.customersData = response.data.data
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    updateCustomer(id) {
      this.updateShow = true
      this.customerEditSidebarActive = true
      this.customerId = id
    },

    deleteCustomer(id) {
      this.$bvModal
        .msgBoxConfirm('¿Deseas eliminar el cliente?', {
          title: 'Eliminar cliente',
          size: 'sm',
          okVariant: 'danger',
          okTitle: 'SI',
          cancelTitle: 'NO',
          okTitleVariant: 'outline-danger',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            axios
              .delete(`customer/${id}`)
              .then(response => {
                this.makeToast('success', 'Cliente eliminado', `Se ha eliminado el cliente ${response.data.data.name}.`)
                this.getCustomers()
              })
              .catch(error => {
                this.showErrors(error)
              })
          }
        })
    },

    sortColumn(field) {
      if (this.sortField === field) {
        if (this.sortDesc === 'asc') {
          this.sortDesc = 'desc'
        } else {
          this.sortDesc = 'asc'
        }
      } else {
        this.sortField = field
        this.sortDesc = 'asc'
      }
      this.getCustomers()
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

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.pointer {
  cursor: pointer;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
