import { useState } from 'react'
import './customers.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUsers } from 'react-icons/fi'
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify'


export default function Customers() {

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e){
        e.preventDefault();

        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=>{
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Empresa cadastrada com sucesso');
            })
            .catch((err)=>{
                console.log(err);
                toast.error("Erro ao cadastrar essa empresa");
            })
        }else{
            toast.error("Preencha todos os campos! ");
        }
    }


    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Clientes'>
                    <FiUsers size={25}/>
                </Title>
                <div className='container'>
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label>Nome Fantasia</label>
                        <input type='text' placeholder='Nome da sua empresa' value={nomeFantasia} onChange={ (e) => setNomeFantasia(e.target.value) } />

                        <label>CNPJ</label>
                        <input type='text' placeholder='Seu cnpj' value={cnpj} onChange={ (e) => setCnpj(e.target.value) } />

                        <label>Endereço</label>
                        <input type='text' placeholder='Endereço da sua empresa' value={endereco} onChange={ (e) => setEndereco(e.target.value) } />

                        <button type='submit'> Cadastrar </button>
                    </form>
                </div>
            </div>
        </div>
    )
}