import React from 'react';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import { cilWifiSignal3 } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPlayer from 'react-player';

// Importe suas imagens relacionadas às estações de rádio
import radioImage1 from './images/image1.jpeg';
import radioImage2 from './images/image2.png';
import radioImage3 from './images/image3.jpeg';
// Importe mais imagens conforme necessário

const EstacoesRadio = () => {
  // Aqui, você pode adicionar mais estações de rádio conforme necessário
  const radioStations = [
    { name: 'Radio 5', icon: cilWifiSignal3, link: 'https://radios.vpn.sapo.pt/AO/radio5.mp3', image: radioImage1 },
    { name: 'Radio Mais', icon: cilWifiSignal3, link: 'https://radios.vpn.sapo.pt/AO/radio10.mp3', image: radioImage2 },
    { name: 'Radio UNIA', icon: cilWifiSignal3, link: 'https://radios.vpn.sapo.pt/AO/radio2.mp3', image: radioImage3 },
    // Adicione mais estações de rádio conforme necessário 
  ];

  const cardStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza verticalmente os itens
    marginTop: '2rem', // Aumenta a margem superior
    height: '120px', // Ajusta a altura das caixas
  };

  const iconStyle = {
    marginBottom: '1rem', // Ajusta a margem inferior dos ícones
  };

  return (
    <CRow className="justify-content-center mt-5">
      {radioStations.map((station, index) => (
        <CCol sm="12" md="4" key={index}>
          <CCard style={cardStyle}>
            <CCardHeader>
              <h5>{station.name}</h5>
            </CCardHeader>
            <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={station.image} alt={station.name} style={{ marginBottom: '1rem', width: '180px', height: '120px', borderRadius: '2px' }} />
              <ReactPlayer url={station.link} playing={false} controls={true} width="100%" height="50px" />
              <CButton color="primary" className="mt-3" to={station.link} style={buttonStyle}>
                <CIcon icon={station.icon} size="5xl" style={iconStyle} /> {/* Ajusta o tamanho dos ícones */}
                <div>{station.name}</div>
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default EstacoesRadio;
