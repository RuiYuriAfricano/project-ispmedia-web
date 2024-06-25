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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilContrast,
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
import { Link, useNavigate } from 'react-router-dom';
import NotificationList from './NotificationList';

const AppHeader = () => {

  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.app.sidebarShow);

  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);


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


  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
    // Fechar outros dropdowns se estiverem abertos
    setIsPlusDropdownOpen(false);
    setIsBellDropdownOpen(false);
  };

  const searchInputRef = useRef();
  const navigate = useNavigate();

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = searchInputRef.current.value;
      if (query) {
        navigate(`/search/${query}`);
      }
    }
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
                  type="search"
                  placeholder="Pesquisar Conteúdo"
                  className="w-100"
                  onKeyDown={handleSearchKeyPress}
                  ref={searchInputRef}
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

          <NotificationList />

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
