export default [
  {
    header: 'Menú',
  },
  {
    title: 'Inicio',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Catálogos',
    icon: 'FolderIcon',
    children: [
      {
        title: 'Categorías',
        route: 'catalogs-categories',
      },
      {
        title: 'Presentaciones',
        route: 'catalogs-units',
      },
      {
        title: 'Productos',
        route: 'catalogs-products',
      },
    ],
  },
  {
    title: 'Contactos',
    icon: 'UsersIcon',
    children: [
      {
        title: 'Proveedores',
        route: 'contacts-suppliers',
      },
    ],
  },
  {
    title: 'Transacciones',
    icon: 'BoxIcon',
    children: [
      {
        title: 'Compras',
        route: 'transactions-purchases',
      },
    ],
  },
  {
    title: 'Accesos',
    icon: 'LockIcon',
    children: [
      {
        title: 'Usuarios',
        route: 'users',
      },
    ],
  },
]
