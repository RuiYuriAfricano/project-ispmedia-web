import React from 'react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
  CFormSelect,
  CAlert,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilLockLocked, cilPhone, cilUser } from '@coreui/icons';
import { service } from "./../../services";
import { isNullOrUndef } from 'chart.js/helpers';

const Register = () => {
  if (!isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/dashboard"></Navigate>
  }
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoDeUtilizador, setTipoDeUtilizador] = useState("");
  const [fotografia, setFotografia] = useState(null); // Novo estado para armazenar a fotografia
  const [corDoAlert, setCorDoAlert] = useState("");
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleRegister = async () => {
    setLoading(true); // Start loading

    setTimeout(async () => {
      const formData = new FormData(); // Create a new FormData object
      formData.append('username', username);
      formData.append('senha', senha);
      formData.append('email', email);
      formData.append('telefone', telefone);
      formData.append('tipoDeUtilizador', tipoDeUtilizador);
      if (fotografia) {
        // Obter a extensão do arquivo original
        const fileExtension = fotografia.name.split('.').pop();
        // Criar o novo nome do arquivo com a extensão
        const modifiedFilename = `${fotografia.name.split('.')[0]}-${username}.${fileExtension}`;
        // Criar um novo arquivo com o nome modificado
        const modifiedFile = new File([fotografia], modifiedFilename, {
          type: fotografia.type,
        });
        formData.append("files", modifiedFile);
        formData.append('fotografia', modifiedFilename);
      }

      const response = await service.auth.register(formData);
      if (response?.status === 201) {
        setMsgDoAlert("Conta Criada Com Sucesso!");
        setCorDoAlert("success");
        setUsername("");
        setSenha("");
        setRepetirSenha("");
        setEmail("");
        setTelefone("");
        setFotografia(null); // Limpa o estado da fotografia após o registro

      } else {
        setMsgDoAlert("Falha na Criação de Conta, Tente Novamente!");
        setCorDoAlert("danger");
      }
      setLoading(false); // End loading
    }, 6000)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              {
                corDoAlert ? <CAlert color={corDoAlert}> {msgDoAlert}</CAlert> : ""
              }
              <CCardBody className="p-4">
                <CForm>
                  <h1>Registar</h1>
                  <p className="text-body-secondary">Crie a sua conta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Senha"
                      autoComplete="new-password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir Senha"
                      autoComplete="new-password"
                      value={repetirSenha}
                      onChange={(e) => setRepetirSenha(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="921-157-495"
                      autoComplete="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilList} />
                    </CInputGroupText>
                    <CFormSelect aria-label="Default select example"
                      value={tipoDeUtilizador}
                      onChange={(e) => setTipoDeUtilizador(e.target.value)}>
                      <option>Selecionar Tipo de Conta</option>
                      <option value="editor">Editor</option>
                      <option value="naoEditor">Não Editor</option>
                    </CFormSelect>
                  </CInputGroup>
                  {/* Novo campo para fotografia */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      Foto
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFotografia(e.target.files[0])}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleRegister}>
                      {loading ? <CSpinner size="sm" /> : 'Criar Conta'}
                    </CButton>
                  </div>
                  <div className="text-center mt-3">
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;