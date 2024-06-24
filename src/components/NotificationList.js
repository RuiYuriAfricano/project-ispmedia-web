// src/NotificationList.js
import React, { useEffect, useState } from 'react';
import './NotificationList.css';
import { FaBell } from 'react-icons/fa';
import { service } from './../services';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEyedropper } from '@coreui/icons';
import { CButton, CCol } from '@coreui/react';

const notifications = [
    {
        id: 1,
        title: "Para si: SIM PASSEI",
        time: "há 23 horas",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    },
    {
        id: 2,
        title: "Professor Ferretto carregou: 3 ASSUNTOS DE HISTÓRIA QUE MAIS CAEM NO ENEM! #SHORTS",
        time: "há 3 dias",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    },
    {
        id: 3,
        title: "Para si: SIM PASSEI",
        time: "há 3 dias",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    },
    {
        id: 4,
        title: "João Ribeiro carregou: QUE DISTRIBUIÇÕES LINUX VOCÊS USAM?",
        time: "há 4 dias",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    },
    {
        id: 5,
        title: "Professor Ferretto carregou: Questão do sorteio do voucher: ENEM 2023 Matemática (Simplificada) - Probabilidade",
        time: "há 5 dias",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    },
    {
        id: 6,
        title: "Professor Ferretto carregou: Questão da média dos salários:",
        time: "há 5 dias",
        thumbnail: "https://via.placeholder.com/60",
        userImage: "https://via.placeholder.com/40"
    }
];

const timeElapsed = (date) => {
    const now = new Date();
    const past = new Date(date);

    const diffInMs = now - past;

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // Approximation
    const years = Math.floor(days / 365.25); // Approximation

    if (years > 0) {
        return { value: years, unit: 'anos' };
    } else if (months > 0) {
        return { value: months, unit: 'meses' };
    } else if (days > 0) {
        return { value: days, unit: 'dias' };
    } else if (hours > 0) {
        return { value: hours, unit: 'horas' };
    } else if (minutes > 0) {
        return { value: minutes, unit: 'minutos' };
    } else {
        return { value: seconds, unit: 'segundos' };
    }
};

const NotificationList = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    const [notifications2, setNotifications2] = useState([]);

    const fetchNotificacoes = async () => {
        try {
            const response = await service.notificacao.listar();
            setNotifications2(response.data.filter((item) => item.fkUtilizador === user.codUtilizador));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotificacoes()
        }, 2000);

        return () => clearInterval(interval);
    }, [user]);
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };
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
    return (
        <div className="notification-dropdown">
            <button onClick={toggleNotifications} className="notification-button">

                <CIcon icon={cilBell} size='lg' />
                {notifications2?.length > 0 && (
                    <span style={badgeStyle}>{notifications2?.length}</span>
                )}
            </button>
            {showNotifications && (
                <div className="notification-list">
                    <h6>Notificações</h6>
                    {notifications2.map(notification => (
                        <div key={notification.id} className="notification-item">
                            <img src={'http://localhost:3333/utilizador/download/' + notification.utilizadorOrigem} alt="user" className="user-image" />
                            <div className="notification-content">
                                <div className="notification-info">
                                    <h4>{notification.textoNotificacao}</h4>
                                    <p>{"Há " + timeElapsed(notification.dataNotificacao).value + " " + timeElapsed(notification.dataNotificacao).unit}</p>
                                </div>
                                <img src={"https://via.placeholder.com/60"} alt="thumbnail" className="thumbnail2" />
                                <CCol xl='2'>
                                    <CButton><CIcon icon={cilEyedropper} /></CButton>
                                </CCol>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationList;
