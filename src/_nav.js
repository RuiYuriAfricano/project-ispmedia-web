import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
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
  cilUser,
  cilUserFollow,
  cilUserPlus,
  cilUserUnfollow,
  cilUserX,
  cilWifiSignal0,
  cilWifiSignal1,
  cilWifiSignal4,
  cilWifiSignalOff,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const DynamicNav = () => {
  const [user, setUser] = useState(null);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    setUser(loggedUser);
  }, []);

  useEffect(() => {
    if (user) {
      const adminNav = [
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
          component: CNavTitle,
          name: 'Avançado',
        },
        {
          component: CNavItem,
          name: 'Grupos De Amigos',
          to: '/grupoDeAmigos',
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
          to: '/playlist',
          icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
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
          to: '/listaDePartilha',
          icon: <CIcon icon={cilList} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Utilizadores',
          to: '/utilizadores',
          icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
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
          to: '/estacoesDeRadio',
          icon: <CIcon icon={cilWifiSignal1} customClassName="nav-icon" />,
        },
      ];

      const userNav = [
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
          to: '/grupoDeAmigos',
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
          to: '/playlist',
          icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
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
          to: '/listaDePartilha',
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
          to: '/estacoesDeRadio',
          icon: <CIcon icon={cilWifiSignal1} customClassName="nav-icon" />,
        },
      ];

      setNavItems(user.tipoDeUtilizador === 'admin' ? adminNav : userNav);
    }
  }, [user]);

  return navItems;
};

export default DynamicNav;
