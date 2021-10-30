<template>
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
      :items="purchasesData"
      :fields="purchasesFields"
      :per-page="perPage"
    >

      <template #head(id)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <template #head(status)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <template #head(document)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <template #head(supplier)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <template #head(user)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <template #head(created_at)="data">
        <span
          class="text-secondary pointer"
          @click="sortColumn(data.column)"
        >{{ data.label }}
        </span>
      </template>

      <!-- Column: Id -->
      <template #cell(id)="data">
        <b-link
          class="font-weight-bold text-warning"
          @click="$emit('addPurchaseTab', data.item.id)"
        >
          #{{ data.item.id }}
        </b-link>
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
              @click="deletePurchase(data.item.id)"
            >
              <feather-icon icon="SlashIcon" />
              <span class="align-middle ml-50">Anular</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>

      <!-- Column: Status -->
      <template #cell(status)="data">
        <b-badge :variant="`light-${ data.item.status === 'Active' ? 'success' : 'danger' }`">
          {{ data.item.status === 'Active' ? 'Activa' : 'Inactiva' }}
        </b-badge>
      </template>

    </b-table>

    <div class="mx-2 mb-2">
      <b-row>

        <!-- Pagination info -->
        <b-col
          v-if="purchasesMeta"
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Mostrando del {{ purchasesMeta.from }} al {{ purchasesMeta.to }} de {{ purchasesMeta.total }} registros</span>
        </b-col>

        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-if="purchasesMeta"
            v-model="currentPage"
            :total-rows="purchasesMeta.total"
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
</template>

<script>
import axios from '@axios'
import vSelect from 'vue-select'

export default {
  components: {
    vSelect,
  },

  data() {
    return {
      searchQuery: '',

      sortField: 'id',
      sortDesc: 'desc',

      perPage: 10,
      perPageOptions: [5, 10, 25, 50, 100],
      currentPage: 1,

      purchasesFields: [
        { key: 'actions', label: 'Acciones' },
        { key: 'id', label: '#' },
        { key: 'status', label: 'Estado' },
        { key: 'supplier', label: 'Proveedor' },
        { key: 'document', label: 'Documento Ext.' },
        { key: 'total', label: 'Total' },
        { key: 'comments', label: 'Comentarios' },
        { key: 'user', label: 'Ingresado por' },
        { key: 'purchase_date', label: 'Fecha de compra' },
        { key: 'created_at', label: 'Fecha de ingreso' },
      ],
      purchasesData: null,
      purchasesMeta: null,
    }
  },

  watch: {
    perPage() {
      this.getPurchases()
    },
    currentPage() {
      this.getPurchases()
    },
    searchQuery() {
      this.getPurchases()
    },
  },

  created() {
    this.getPurchases()
  },

  methods: {
    getPurchases() {
      axios
        .get(`purchase?perPage=${this.perPage}&page=${this.currentPage}&query=${this.searchQuery}&sortField=${this.sortField}&sortDesc=${this.sortDesc}`)
        .then(response => {
          this.purchasesMeta = response.data
          this.purchasesData = response.data.data
        })
        .catch(error => {
          this.showErrors(error)
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
      this.getPurchases()
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
