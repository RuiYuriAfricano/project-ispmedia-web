// src/NotificationList.js
import React, { useEffect, useState } from 'react';
import './NotificationList.css';
import { FaBell } from 'react-icons/fa';
import { service } from './../services';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEyedropper } from '@coreui/icons';
import { CButton, CCol } from '@coreui/react';

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
    const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0);


    const fetchNotificacoes = async () => {
        try {
            const response = await service.notificacao.listar();
            const userNotifications = response.data.filter((item) => item.fkUtilizador === user.codUtilizador);
            setNotifications2(userNotifications);
            const unseenCount = userNotifications.filter(notification => notification.visto === 0).length;
            setUnseenNotificationsCount(unseenCount);
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
    const toggleNotifications = async () => {
        setShowNotifications(!showNotifications);
        setUnseenNotificationsCount(0);
        // Aqui você pode também atualizar as notificações no backend para marcá-las como vistas
        await Promise.all(notifications2.map(item => {

            return (
                service.notificacao.update({
                    "codNotificacao": Number(item.codNotificacao),
                    "visto": 1,
                })
            )

        }));
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
    const handleDelete = async (id) => {
        try {
            await service.notificacao.excluir(id);
            fetchNotificacoes()
        } catch (err) {
            console.error('Erro ao excluir a notificacao:', err);
        }
    };
    return (
        <div className="notification-dropdown">
            <button onClick={toggleNotifications} className="notification-button">

                <CIcon icon={cilBell} size='lg' />
                {unseenNotificationsCount > 0 && (
                    <span style={badgeStyle}>{unseenNotificationsCount}</span>
                )}
            </button>
            {showNotifications && (
                <div className="notification-list">
                    <h6>Notificações</h6>
                    {notifications2.map(notification => (
                        <div key={notification.codNotificacao} className="notification-item">
                            <img src={'http://localhost:3333/utilizador/download/' + notification.utilizadorOrigem} alt="user" className="user-image" />
                            <div className="notification-content">
                                <div className="notification-info">
                                    <h4>{notification.textoNotificacao}</h4>
                                    <p>{"Há " + timeElapsed(notification.dataNotificacao).value + " " + timeElapsed(notification.dataNotificacao).unit}</p>
                                </div>
                                {/*<img src={"https://via.placeholder.com/60"} alt="thumbnail" className="thumbnail2" />*/}
                                <CCol xl='2'>
                                    <CButton onClick={() => handleDelete(notification.codNotificacao)}><CIcon icon={cilEyedropper} /></CButton>
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
