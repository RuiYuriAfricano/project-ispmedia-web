import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CForm,
  CFormInput,
  useColorModes,
  CRow,
  CCol,
  CImage,
  CButton,
  CDropdownHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilAudio,
  cilBell,
  cilContrast,
  cilEyedropper,
  cilLibrary,
  cilMenu,
  cilMoon,
  cilMusicNote,
  cilPlus,
  cilSun,
  cilVideo,
} from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import { setSidebarShow } from '../redux/app/slice';
import { Link } from 'react-router-dom';

const AppHeader = () => {
  // State to manage the number of notifications
  const [notifications, setNotifications] = useState(5); // Example initial count

  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.app.sidebarShow);

  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-6px',
    padding: '2px 8px',
    borderRadius: '50%',
    background: 'red',
    color: 'white',
    fontSize: '12px',
  };

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    dispatch(setSidebarShow(!sidebarShow));
  };

  const togglePlusDropdown = () => {
    setIsPlusDropdownOpen(!isPlusDropdownOpen);
    // Fechar outros dropdowns se estiverem abertos
    setIsBellDropdownOpen(false);
    setIsModeDropdownOpen(false);
  };

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen(!isBellDropdownOpen);
  };

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
    // Fechar outros dropdowns se estiverem abertos
    setIsPlusDropdownOpen(false);
    setIsBellDropdownOpen(false);
  };

  const toggleOptionsDropdown = () => {
    setIsOptionsOpen(!isOptionsOpen);
    // Fechar outros dropdowns se estiverem abertos
    setIsPlusDropdownOpen(false);
    setIsBellDropdownOpen(true);
    setIsModeDropdownOpen(false);
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler onClick={toggleSidebar} style={{ marginInlineStart: '-14px' }}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex mx-auto w-50 justify-content-md-center justify-content-start">
          <CNavItem className="w-100">
            <CForm className="w-100">
              <div className="mb-0">
                <CFormInput
                  type="Search"
                  id="exampleFormControlInput1"
                  placeholder="Pesquisar Conteúdo"
                  className="w-100"
                />
              </div>
            </CForm>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <CDropdown isOpen={isPlusDropdownOpen} toggle={togglePlusDropdown} variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilPlus} size="lg" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem className="d-flex align-items-center" as="button" type="button">
                <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/video'>
                  <CIcon className="me-2" icon={cilVideo} size="lg" /> Vídeo
                </Link>
              </CDropdownItem>
              <CDropdownItem className="d-flex align-items-center" as="button" type="button">
                <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/musica'>
                  <CIcon className="me-2" icon={cilMusicNote} size="lg" /> Música
                </Link>
              </CDropdownItem>
              <CDropdownItem className="d-flex align-items-center" as="button" type="button">
                <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/album'>
                  <CIcon className="me-2" icon={cilLibrary} size="lg" /> Album
                </Link>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <CDropdown isOpen={isBellDropdownOpen} toggle={toggleBellDropdown} variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilBell} size="lg" />
              {notifications > 0 && (
                <span style={badgeStyle}>{notifications}</span>
              )}
            </CDropdownToggle>
            <CDropdownMenu style={{ width: '300px' }} className="scrollable-table">
              <CDropdownHeader style={{ borderBottom: 'solid 1px #333', marginBottom: '10px' }}>
                <h6 style={{ color: '#fff' }}>Notificações</h6>
              </CDropdownHeader>
              <CDropdownItem>
                {/* Conteúdo do dropdown de notificações */}
                <CRow>
                  <CCol xl='2'>
                    <CImage style={{ marginLeft: '-18px', marginTop: '-10px' }} width="60" height="60" src={'http://localhost:3333/utilizador/download/' + 'RuiMalemba'} />
                  </CCol>
                  <CCol xl='8'>Texto Notificação 1</CCol>
                  <CCol xl='2'>
                    <CButton><CIcon icon={cilEyedropper} /></CButton>

                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl='2'></CCol>
                  <CCol xl='8' style={{ fontSize: '12px', color: '#999', marginTop: '-16px' }}>12/06/2023</CCol>
                </CRow>
              </CDropdownItem>

            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <CDropdown isOpen={isModeDropdownOpen} toggle={toggleModeDropdown} variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;

