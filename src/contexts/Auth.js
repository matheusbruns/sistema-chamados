import { useState, createContext, useEffect }from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
            console.log(storageUser)
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadStorage();

    }, []);

    // Fazendo o login do usuário
    async function signIn(email, password){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success(`Bem vindo de volta ${data.nome.split(' ')[0]}!`); // vai dar um success com o primeiro nome apenas
        })
        .catch((err)=>{
            console.log(err);
            toast.error('Ops algo deu errado!');
            setLoadingAuth(false);
        })
    }

    // Cadastrando um novo usuário
    async function signUp(email, password, nome){
        setLoadingAuth(true);
        // cadastrar usuario
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value)=>{
            let uid = value.user.uid;

            //cadastrar no banco 
            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                setLoading(false);
                toast.success("Bem vindo a plataforma!")
            })
        })
        .catch((err)=>{
            console.log(err);
            toast.error("Ops algo deu errado!");
            setLoadingAuth(false);
        })
    }

    // salvar no localStorage
    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    // fazer logout do usuário remove do localStorage
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
        setLoadingAuth(false);
    }

    return(
        // esse signed: !!user vai converter a useState user para um booleano para poder retornar true ou false, o user é o objeto das informações do usuario
        <AuthContext.Provider 
        value={{ 
                signed: !!user, 
                user, 
                loading,
                signUp,
                signOut, 
                signIn,
                loadingAuth,
                setUser,
                storageUser
            }} >
                 
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider