import React from 'react';
import { useState } from 'react';
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
import { cilList, cilLockLocked, cilPhone, cilUser } from '@coreui/icons';
import { service } from "./../../services";
import { isNullOrUndef } from 'chart.js/helpers';
import InputMask from 'react-input-mask';

const Register = () => {
  if (!isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/dashboard"></Navigate>
  }
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotografia, setFotografia] = useState(null); // Novo estado para armazenar a fotografia
  const [corDoAlert, setCorDoAlert] = useState("");
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{4,}$/;
    return regex.test(username);
  };

  const validatePassword = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (telefone) => {
    const regex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;
    return regex.test(telefone);
  };

  const handleRegister = async () => {
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
    if (!email) {
      setMsgDoAlert("Por favor, preencha o campo Email!");
      setCorDoAlert("danger");
      return;
    } else if (!validateEmail(email)) {
      setMsgDoAlert("Por favor, insira um email válido!");
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

    if (senha !== repetirSenha) {
      setMsgDoAlert("As senhas não coincidem!");
      setCorDoAlert("danger");
      return;
    }

    if (!telefone) {
      setMsgDoAlert("Por favor, preencha o campo Telefone!");
      setCorDoAlert("danger");
      return;
    } else if (!validatePhone(telefone)) {
      setMsgDoAlert("Telefone deve estar no formato XXX-XXX-XXX!");
      setCorDoAlert("danger");
      return;
    }

    setLoading(true); // Start loading

    setTimeout(async () => {
      const formData = new FormData(); // Create a new FormData object
      formData.append('username', username);
      formData.append('senha', senha);
      formData.append('email', email);
      formData.append('telefone', telefone);
      formData.append('estado', 'pendente');
      const response2 = await service.auth.listar();
      formData.append('tipoDeUtilizador', response2.data.length === 0 ? 'admin' : 'normal');
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
        localStorage.setItem("pendenteUser", JSON.stringify(response?.data));
        setTimeout(() => {
          navigate('/valida')
        }, 1500);

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
                      onPaste={(e) => e.preventDefault()}  // Prevent paste
                      onCopy={(e) => e.preventDefault()}  // Prevent copy
                      onCut={(e) => e.preventDefault()}  // Prevent cut
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
                      onPaste={(e) => e.preventDefault()}  // Prevent paste
                      onCopy={(e) => e.preventDefault()}  // Prevent copy
                      onCut={(e) => e.preventDefault()}  // Prevent cut

                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <InputMask
                      mask="999-999-999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    >
                      {(inputProps) => <CFormInput {...inputProps} type="text" placeholder="999-999-999" />}
                    </InputMask>
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
