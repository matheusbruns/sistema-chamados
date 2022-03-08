import firebase from './services/firebaseConnection';
import Routes from './routes';
import AuthProvider from './contexts/Auth';
import 'react-toastify/dist/ReactToastify.css'; // css do toastify - para alertas e mensagens em tela
import { ToastContainer } from 'react-toastify';

import './index.css';

function App(){
    return(
        <AuthProvider>
                <Routes/>
                <ToastContainer 
                    position='top-right'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
        </AuthProvider>
    )
}

export default App;