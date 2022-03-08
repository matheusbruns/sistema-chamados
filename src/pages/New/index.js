import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/Auth';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import firebase from '../../services/firebaseConnection';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function New(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(()=>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = []

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                    console.log('NENHUMA EMPRESA ENCONTRADA');
                    setCustomers([ {id: '1', nomeFantasia: 'Freela'} ]);
                    setLoadCustomers(false);
                    return;
                }
                setCustomers(lista);
                setLoadCustomers(false);

                // se tiver id = quer dizer que o usuario está tentando editar
                if(id){
                    loadId(lista)
                }
            })
            .catch((err)=>{
                console.log('Deu algum erro: ' + err);
                setLoadCustomers(false);
                setCustomers([ {id: '1', nomeFantasia: ''} ])
            })
        }

        loadCustomers();

    }, [id]);

    // edição de algum chamado
    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);

        })
        .catch((err)=>{
            console.log("ERRO NO ID PASSADO: ", err);
            setIdCustomer(false);
        })
    }

    async function handleRegister(e){
        e.preventDefault();

        // se o idCustomer estiver true, o usuario está tentando editar
        if(idCustomer){
            // atualizando os dados quando o usuário editar
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado Editado com sucesso!');
                setCustomerSelected(0)
                setComplemento('');
                navigate('/dashboard')
            })
            .catch((err)=>{
                toast.error("Ops, erro ao registrar, verifique os campos.");
                console.log(err);
            })

            return;
        }


        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success("Chamado criado com sucesso!");
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch((err)=>{
            toast.error('Ops erro ao registrar, tente mais tarde.')
            console.log(err)
            
        })
    }
    
    // Chamado quando troca o assunto
    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }

    // Chamado quando troca o status
    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    // chamado quando troca o cliente
    function handleChangeCustomers(e){
        // console.log('index do cliente selecionado', e.target.value);
        // console.log('cliente selecionado', customers[e.target.value]);
        setCustomerSelected(e.target.value);
    }





    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Novo chamado'>
                    <FiPlusCircle size={25}/>
                </Title>
                
                <div className='container'>

                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type='text' disabled={true} value='Carregando cliente...'/>
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers} >
                            {customers.map((item, index)=>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.nomeFantasia}
                                    </option>
                                )
                            })}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input 
                            type='radio' 
                            name='radio'
                            value='Aberto'
                            onChange={handleOptionChange}
                            checked={status === 'Aberto'}                          
                            />
                            <span>Em aberto</span>

                            <input 
                            type='radio' 
                            name='radio'
                            value='Progresso'
                            onChange={handleOptionChange} 
                            checked={status === 'Progresso'}                          
                            />
                            <span>Progresso</span>
                            
                            <input 
                            type='radio' 
                            name='radio'
                            value='Atendido'
                            onChange={handleOptionChange}
                            checked={status === 'Atendido'}                         
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                        type='text'
                        placeholder='Descreva seu problema (opcional).'
                        value={complemento}
                        onChange={ (e) => setComplemento(e.target.value) }
                        />

                        <button type='submit'>Registrar</button>

                    </form>
                </div>

            </div>
        </div>
    )
}