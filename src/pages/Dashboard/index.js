import './dashboard.css';
import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // para formatar data 


// components
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

function Dashboard() {

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false); // botao de buscar mais, aparece mais 
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState('');


    useEffect(()=>{
        
        loadChamados();

        return () => {

        }
    }, []);

    async function loadChamados(){
        await listRef.limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
        .catch((err)=>{
            console.log('erro: ' + err);
            setLoadingMore(false);
        })

        setLoading(false);
    }

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0; // para ver se essa coleção é vazia (não tem nenhum chamado)

        // se não estiver vazia construimos essa lista
        if(!isCollectionEmpty){
            
            let lista = [];

            snapshot.forEach( (doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1] // Pegando o ultimo documento buscado

            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);
        
        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore(){
        setLoadingMore(true);

        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
    }

    function toglePostModal(item){
        setShowPostModal(!showPostModal) // trocando de true para false
        setDetail(item);
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name='Atendimentos'>
                        <FiMessageSquare size={25}/>
                    </Title>

                    <div className='container'>
                        <span>Buscando chamados...</span>
                    </div>

                </div>
            </div>
        )
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>
                </Title>
                
                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado registrado...</span>

                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#FFF'/>
                            Novo Chamado
                        </Link>
                    </div>

                    ) : (
                    <>
                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#FFF'/>
                            Novo Chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-lable='Cliente'>{item.cliente}</td>
                                            <td data-lable='Assunto'>{item.assunto}</td>
                                            <td data-lable='Status'>
                                                <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'} }>{item.status}</span>
                                            </td>
                                            <td data-lable='Cadastrado'>{item.createdFormated}</td>
                                            <td data-lable='#'>
                                                <button className='action' 
                                                    style={{backgroundColor: '#3583f6'}} 
                                                    onClick={ ()=> toglePostModal(item) }
                                                >
                                                    <FiSearch color='#FFF' size={27} />
                                                </button>

                                                <Link className='action edit' style={{backgroundColor: '#F6a935'}} to={`/new/${item.id}`}>
                                                    <FiEdit2 color='#FFF' size={27} />
                                                </Link>

                                            </td>
                                        </tr>
                                    )
                                })}
                                
                            </tbody>
                        </table>
                            
                        {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}

                    </>

                    )
                }

            </div>

                {showPostModal && (
                    <Modal 
                        conteudo={detail}
                        close={toglePostModal}
                    />
                )}
        </div>
    )
}

export default Dashboard