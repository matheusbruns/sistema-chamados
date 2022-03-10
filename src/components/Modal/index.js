import './modal.css'
import firebase from '../../services/firebaseConnection';
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Modal({ conteudo, close }){

    // const idPassado = conteudo.id
    // console.log(idPassado)


    async function handleDelete(id){
    await firebase.firestore().collection('chamados').doc(id)
    .delete()
    .then(()=>{
        window.location.reload();
        toast.success('Chamado excluido com sucesso!');
    })
    .catch((err)=>{
        console.log('erro ', err);
        toast.error('Erro ao excluir chamado');
    })
    
    }
    

    return(
        <div className='content modal'>
            <div className='container'>
                <button className='close' onClick={ close }>
                    <FiX size={30} color='#686868'/>
                </button>

                <div>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{conteudo.createdFormated}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Status: <i style={{ color:'#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>{conteudo.status}</i>
                        </span>
                    </div>

                    {conteudo.complemento !== '' && (
                        <>
                            <h3>Complemento:</h3>
                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}
                    <button className='delete' onClick={() => handleDelete(conteudo.id)}>Excluir</button>

                </div>
            </div>
        </div>
    )
}