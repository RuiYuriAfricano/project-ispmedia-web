import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCloudDownload,
  cilCloudUpload,
  cilControl,
  cilCursor,
  cilDescription,
  cilDrop,
  cilFeaturedPlaylist,
  cilGroup,
  cilHome,
  cilList,
  cilMediaPlay,
  cilMusicNote,
  cilNotes,
  cilPencil,
  cilPeople,
  cilPuzzle,
  cilSearch,
  cilShare,
  cilSpeedometer,
  cilStar,
  cilUserFollow,
  cilUserPlus,
  cilWifiSignal0,
  cilWifiSignal1,
  cilWifiSignal4,
  cilWifiSignalOff,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Conteúdo Multimidia',
  },
  {
    component: CNavItem,
    name: 'Gerir Conteúdo',
    to: '/gerirConteudo',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pesquisar Conteúdo',
    to: '/theme/typography',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Avançado',
  },
  {
    component: CNavItem,
    name: 'Grupos De Amigos',
    to: '/charts',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Grupos Musicais',
    to: '/grupoMusical',
    icon: <CIcon icon={cilMusicNote} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'PlayLists',
    to: '/charts',
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Upload',
    to: '/charts',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Partilhar Conteúdo',
    to: '/charts',
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Downloads',
    to: '/charts',
    icon: <CIcon icon={cilCloudDownload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Lista de Partilhas',
    to: '/charts',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Artistas',
    to: '/artistas',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Rádio',
    to: '/charts',
    icon: <CIcon icon={cilWifiSignal1} customClassName="nav-icon" />,
  },

]

export default _nav
