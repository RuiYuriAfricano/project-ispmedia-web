import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/login/Login'))
const Register = React.lazy(() => import('./views/registar/Register'))
const GrupoMusical = React.lazy(() => import('./views/grupoMusical/GrupoMusical'))
const ConfigGrupoMusical = React.lazy(() => import('./views/grupoMusical/ConfigGrupoMusical'))
const Artista = React.lazy(() => import('./views/artista/Artista'))
const ConfigArtista = React.lazy(() => import('./views/artista/ConfigArtista'))
const GerirConteudo = React.lazy(() => import('./views/gerirConteudo/GerirConteudo'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/grupoMusical', name: 'GrupoMusical', element: GrupoMusical },
  { path: '/configGrupoMusical', name: 'ConfigGrupoMusical', element: ConfigGrupoMusical },
  { path: '/configGrupoMusical/:idEditGrupo', name: 'ConfigGrupoMusical', element: ConfigGrupoMusical },
  { path: '/artistas', name: 'Artistas', element: Artista },
  { path: '/configArtista', name: 'ConfigArtista', element: ConfigArtista },
  { path: '/configArtista/:idEditArtista', name: 'ConfigArtista', element: ConfigArtista },
  { path: '/gerirConteudo', name: 'GerirConteudo', element: GerirConteudo },
]

export default routes
