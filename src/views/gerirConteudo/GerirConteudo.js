import React from 'react';
import { Link } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from '@coreui/react';
import {
  cilLibrary,
  cilMusicNote,
  cilVideo,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Importe suas imagens relacionadas aos álbuns, músicas e vídeos
import albumImage from './images/image1.jpeg';
import musicImage from './images/image2.jpeg';
import videoImage from './images/image3.png';

const GerirConteudo = () => {
  const menuItems = [
    { name: 'Gestão de Álbuns', icon: cilLibrary, link: '/album', image: albumImage },
    { name: 'Gestão de Músicas', icon: cilMusicNote, link: '/musica', image: musicImage },
    { name: 'Gestão de Vídeos', icon: cilVideo, link: '/videos', image: videoImage },
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
      {menuItems.map((item, index) => (
        <CCol sm="12" md="4" key={index}>
          <CCard style={cardStyle}>
            <CCardHeader>
              <h5>{item.name}</h5>
            </CCardHeader>
            <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ marginBottom: '1rem', maxWidth: '100%', height: '180px' }} />
              <Link to={item.link}>
                <CButton color="primary" className="mt-3" to={item.link} component={Link} style={buttonStyle}>
                  <CIcon icon={item.icon} size="5xl" style={iconStyle} /> {/* Ajusta o tamanho dos ícones */}
                  <div>{item.name}</div>
                </CButton>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default GerirConteudo;
