import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

import { service } from "./../../services";
import { useDispatch, useSelector } from "react-redux";
import { appSlice } from "../../redux/app/slice";
import { isNullOrUndef } from 'chart.js/helpers';

const Login = () => {
  if (!isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/dashboard" />;
  }

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const loggedUser = useSelector((state) => state.app);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{4,}$/;
    return regex.test(username);
  };

  const validatePassword = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const handleLogin = async () => {
    // Reset alert messages
    setMsgDoAlert("");
    setCorDoAlert("");

    if (!username) {
      setMsgDoAlert("Por favor, preencha o campo Username!");
      setCorDoAlert("danger");
      return;
    } else if (!validateUsername(username)) {
      setMsgDoAlert("Username deve conter apenas caracteres alfanuméricos e underscores e 4 caracteres no minimo!");
      setCorDoAlert("danger");
      return;
    }

    if (!senha) {
      setMsgDoAlert("Por favor, preencha o campo Senha!");
      setCorDoAlert("danger");
      return;
    } else if (!validatePassword(senha)) {
      setMsgDoAlert("Senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial!");
      setCorDoAlert("danger");
      return;
    }

    setLoading(true); // Start loading
    setTimeout(async () => {
      const response = await service.auth.login({
        username: username,
        senha: senha,
      });

      if (response?.status === 201) {
        localStorage.setItem("loggedUser", JSON.stringify(response?.data));
        const tipoDeUtilizador = response?.data.tipoDeUtilizador;
        dispatch(
          appSlice.actions.setLoggedUser({
            ...response?.data,
            username,
            senha,
            tipoDeUtilizador,
          })
        );

        dispatch(appSlice.actions.setIsLogged(true));
        const isLogged = loggedUser?.isLogged;

        navigate("/dashboard");
      } else {
        setMsgDoAlert("Falha ao fazer login, tente novamente!");
        setCorDoAlert("danger");
      }
      setLoading(false); // End loading
    }, 2000); // 2 second delay
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                {corDoAlert ? <CAlert color={corDoAlert}>{msgDoAlert}</CAlert> : ""}
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Entre na sua conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin} disabled={loading}>
                          {loading ? <CSpinner size="sm" /> : 'Entrar'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Esqueceu a sua senha?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Cadastre-se</h2>
                    <p>
                      Junte-se a nós e desfrute de um sistema rico em gestão de mídias. Crie sua conta e comece a aproveitar todos os benefícios exclusivos agora mesmo!
                    </p>
                    <Link to="/registar">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Registre-se agora!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
