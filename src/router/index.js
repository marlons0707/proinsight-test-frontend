import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Inicio',
        breadcrumb: [
          {
            text: 'Inicio',
            active: true,
          },
        ],
      },
    },

    // Catalogs
    // =====================================================================
    {
      path: '/catalogos/categorias',
      name: 'catalogs-categories',
      component: () => import('@/views/catalogs/categories/Categories.vue'),
      meta: {
        pageTitle: 'Categorías',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Categorías',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogos/presentaciones',
      name: 'catalogs-units',
      component: () => import('@/views/catalogs/units/Units.vue'),
      meta: {
        pageTitle: 'Presentaciones',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Presentaciones',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogo/productos',
      name: 'catalogs-products',
      component: () => import('@/views/catalogs/products/Products.vue'),
      meta: {
        pageTitle: 'Productos',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Productos',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogo/precios',
      name: 'catalogs-prices',
      component: () => import('@/views/catalogs/prices/Prices.vue'),
      meta: {
        pageTitle: 'Precios',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Precios',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogo/contenedores',
      name: 'catalogs-containers',
      component: () => import('@/views/catalogs/containers/Containers.vue'),
      meta: {
        pageTitle: 'Contenedores',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Contenedores',
            active: true,
          },
        ],
      },
    },

    // Contacts
    // =====================================================================
    {
      path: '/contactos/proveedores',
      name: 'contacts-suppliers',
      component: () => import('@/views/contacts/suppliers/Suppliers.vue'),
      meta: {
        pageTitle: 'Proveedores',
        breadcrumb: [
          {
            text: 'Contactos',
            link: true,
          },
          {
            text: 'Proveedores',
            active: true,
          },
        ],
      },
    },

    // Transactions
    // =====================================================================
    {
      path: '/transacciones/compras',
      name: 'transactions-purchases',
      component: () => import('@/views/transactions/purchases/Purchases.vue'),
      meta: {
        pageTitle: 'Compras',
        breadcrumb: [
          {
            text: 'Transacciones',
            link: true,
          },
          {
            text: 'Compras',
            active: true,
          },
        ],
      },
    },

    // Access
    // =====================================================================
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/access/Users.vue'),
      meta: {
        pageTitle: 'Usuarios',
        breadcrumb: [
          {
            text: 'Accesos',
            link: true,
          },
          {
            text: 'Usuarios',
            active: true,
          },
        ],
      },
    },

    // Pages
    // =====================================================================
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
