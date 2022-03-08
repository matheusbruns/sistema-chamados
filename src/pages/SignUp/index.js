import './signup.css';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth';

function SignUp(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext); // importando a função de cadastro que foi criada no arquivo Auth.js

    function handleSubmit(e){
        e.preventDefault(); // para nao atualizar a pagina

        if(nome!=='' && email!=='' && password!==''){
            signUp(email, password, nome);
            setEmail('');
            setPassword('');
            setNome('');
        }
    }
    return(
        <div className='container-center'>
            <div className='login'>
                <div className='logo-area'>
                    <img src={logo} alt='Sistema Logo'/>
                </div>
                <form>
                    <h1>Cadastrar</h1>
                    <input type='text' placeholder='Seu nome' value={nome} onChange={(e)=> setNome(e.target.value)}/>
                    <input type='email' placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit' onClick={ handleSubmit } >{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>
                <Link to='/'>Já tem uma conta?</Link>
            </div>
        </div>
    )
}

export default SignUp;