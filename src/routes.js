import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/login/Login'))
const Register = React.lazy(() => import('./views/registar/Register'))
const GrupoMusical = React.lazy(() => import('./views/grupoMusical/GrupoMusical'))
const NovoGrupoMusical = React.lazy(() => import('./views/grupoMusical/NovoGrupoMusical'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/grupoMusical', name: 'GrupoMusical', element: GrupoMusical },
  { path: '/novoGrupoMusical', name: 'NovoGrupoMusical', element: NovoGrupoMusical },
]

export default routes
