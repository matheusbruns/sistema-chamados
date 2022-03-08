import './signin.css';
import { useState, useContext, useEffect } from 'react';
import logo from '../../assets/logo.png'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth'
import { toast } from 'react-toastify';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { signIn, loading, loadingAuth } = useContext(AuthContext);
    
    const handleSubmit = (e) =>{
        e.preventDefault(); // para nao atualizar a pagina
        if(email !== '' && password !== ''){
            signIn(email, password);
        }else{
            return toast.error('Valores vazios')
        }
    }

    const sendEnter = (e) => {
        if(email !== '' && password !== ''){
            if(e.key === 'Enter'){
                e.preventDefault();
                signIn(email, password);
            }
        }else{
            return toast.error('Valores vazios')
        }
    }
    return(
        <div className='container-center'>
            <div className='login'>
                <div className='logo-area'>
                    <img src={logo} alt='Sistema Logo'/>
                </div>
                <form>
                    <h1>Entrar</h1>
                    <input type='email' placeholder='Digite seu email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit' onClick={ handleSubmit } onKeyPress={ sendEnter }>{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>
                <Link to='/register'>Criar uma conta</Link>
            </div>
        </div>
    )
}

export default SignIn;