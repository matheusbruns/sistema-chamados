import './header.css';
import { useContext } from 'react';
import {AuthContext} from '../../contexts/Auth';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { FiHome, FiSettings, FiUsers } from "react-icons/fi"; // para icones svg


export default function Header(){
    const { user } = useContext(AuthContext);

    return(
        <div className='sideBar'>
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt='Foto avatar' />
            </div>

            <Link to='/dashboard'><FiHome color='#FFF' size={24}/> Chamados</Link>
            <Link to='/customers'><FiUsers color='#FFF' size={24}/> Clientes</Link>
            <Link to='/profile'><FiSettings color='#FFF' size={24}/> Configurações</Link>
        </div>
    )
}