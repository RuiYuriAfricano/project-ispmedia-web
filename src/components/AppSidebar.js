import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from './AppSidebarNav';
import { logo } from 'src/assets/brand/logo';
import { sygnet } from 'src/assets/brand/sygnet';
import navigation from '../_nav';
import { setSidebarShow } from '../redux/app/slice'; // Importando a ação Redux

const AppSidebar = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.app.sidebarShow); // Acessando o estado sidebarShow do Redux

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow} // Utilizando o estado do Redux para controlar a visibilidade do sidebar
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible)); // Disparando a ação para atualizar o estado do sidebarShow no Redux
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} width={200} height={62} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarShow(false))} // Fechando o sidebar ao clicar no botão de fechar
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch(setSidebarShow(!sidebarShow))} /> {/* Alternando a visibilidade do sidebar */}
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
