import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
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
import { cilLockLocked } from '@coreui/icons';
import { service } from "./../../services";
import { isNullOrUndef } from 'chart.js/helpers';

const ValidaCodConfirmacao = () => {
  const navigate = useNavigate();

  if (!isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/dashboard" />;
  }

  const [codConfirmacao, setCodConfirmacao] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('pendenteUser')) || {});
  const [isValidated, setIsValidated] = useState(false); // State to track validation success

  const validateCodConfirmacao = (codConfirmacao) => {
    const regex = /^[0-9]{6}$/;
    return regex.test(codConfirmacao);
  };

  const handleRegister = async () => {
    // Reset alert messages
    setMsgDoAlert("");
    setCorDoAlert("");

    if (!codConfirmacao) {
      setMsgDoAlert("Por favor, insira o código!");
      setCorDoAlert("danger");
      return;
    }

    if (!validateCodConfirmacao(codConfirmacao)) {
      setMsgDoAlert("Por favor, o código deve possuir exatamente 6 dígitos!");
      setCorDoAlert("danger");
      return;
    }

    if (codConfirmacao !== user.codVerificacao) {
      setMsgDoAlert("Por favor, insira o código correto!");
      setCorDoAlert("danger");
      return;
    }

    setLoading(true); // Start loading
    setTimeout(async () => {
      const formData = new FormData(); // Create a new FormData object
      formData.append('codVerificacao', codConfirmacao);
      formData.append('codUtilizador', user.codUtilizador);
      formData.append('estado', "ativo");

      const response = await service.auth.update(formData);
      if (response?.status === 200) {
        setMsgDoAlert("Validado Com Sucesso!");
        setCorDoAlert("success");
        setIsValidated(true); // Mark as validated
        localStorage.removeItem("pendenteUser");
        setTimeout(() => {
          localStorage.setItem("loggedUser", JSON.stringify(response?.data));
          navigate("/dashboard");
        }, 3000);
      } else {
        setMsgDoAlert("Falha na Validação de Conta, Tente Novamente!");
        setCorDoAlert("danger");
      }
      setLoading(false); // End loading
    }, 6000);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
              <CCardBody className="p-4">
                <CForm>
                  <h1>Código de Confirmação</h1>
                  {!isValidated && (
                    <>
                      <p className="text-body-secondary">Enviamos o código no seu email.</p>


                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Exemplo: 123456"
                          autoComplete="username"
                          value={codConfirmacao}
                          type="number"
                          onChange={(e) => setCodConfirmacao(e.target.value)}
                          onPaste={(e) => e.preventDefault()}  // Prevent paste
                        />
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton color="success" onClick={handleRegister}>
                          {loading ? <CSpinner size="sm" /> : 'Enviar'}
                        </CButton>
                      </div>

                      <div className="text-center mt-3">
                        Já tem uma conta? <Link to="/login">Entrar</Link>
                      </div>
                    </>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ValidaCodConfirmacao;
