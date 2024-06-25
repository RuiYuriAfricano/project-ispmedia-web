import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/login/Login'))
const Register = React.lazy(() => import('./views/registar/Register'))
const GrupoMusical = React.lazy(() => import('./views/grupoMusical/GrupoMusical'))
const Artista = React.lazy(() => import('./views/artista/Artista'))
const GerirConteudo = React.lazy(() => import('./views/gerirConteudo/GerirConteudo'))
const EstacoesDeRadio = React.lazy(() => import('./views/estacoesDeRadio/EstacoesDeRadio'))
const Album = React.lazy(() => import('./views/album/Album'))
const Musica = React.lazy(() => import('./views/musica/Musica'))
const Video = React.lazy(() => import('./views/video/Video'))
const Playlist = React.lazy(() => import('./views/playlist/Playlist'))
const GrupoDeAmigos = React.lazy(() => import('./views/grupoDeAmigos/GrupoDeAmigos'))
const PlaylistConteudo = React.lazy(() => import('./views/playlist/PlaylistConteudos'))
const GrupoConteudo = React.lazy(() => import('./views/grupoDeAmigos/GrupoConteudos'))
const Utilizadores = React.lazy(() => import('./views/utilizadores/Utilizadores'))
const SearchResults = React.lazy(() => import('./views/searchResults/SearchResults'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/grupoMusical', name: 'GrupoMusical', element: GrupoMusical },
  { path: '/artistas', name: 'Artistas', element: Artista },
  { path: '/gerirConteudo', name: 'GerirConteudo', element: GerirConteudo },
  { path: '/estacoesDeRadio', name: 'EstacoesDeRadio', element: EstacoesDeRadio },
  { path: '/album', name: 'Album', element: Album },
  { path: '/musica', name: 'Musica', element: Musica },
  { path: '/video', name: 'Video', element: Video },
  { path: '/grupoDeAmigos', name: 'GrupoDeAmigos', element: GrupoDeAmigos },
  { path: '/playlist', name: 'Playlist', element: Playlist },
  { path: '/playlistConteudo/:playlistId', name: 'PlaylistConteudo', element: PlaylistConteudo },
  { path: '/grupoConteudo/:grupoId', name: 'GrupoConteudo', element: GrupoConteudo },
  { path: '/utilizadores', name: 'Utilizadores', element: Utilizadores },
  { path: '/search/:query', name: 'ResultadosDaPesquisa', element: SearchResults },
]

export default routes
