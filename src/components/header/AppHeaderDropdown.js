import React from 'react'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {

  const [login, setLogin] = useState(false)
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const userFoto = JSON.parse(localStorage.getItem("fotoUserLogado"));

  const handleLogout = () => {
    localStorage.removeItem("loggedUser")
    setLogin(true)
  }
  if (login) {
    return <Navigate to="/login" />
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={"https://localhost:3333/utilizador/download/" + user?.username + ""} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{user?.username}</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Notificações
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>


        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Configurações</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Configurações
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Pagamentos
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>

        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Terminar Sessão
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
