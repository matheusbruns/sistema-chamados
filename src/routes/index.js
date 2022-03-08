import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';


const PrivateRoute  = ({ children }) => {
    const {signed, loading} = useContext(AuthContext);
    
    return signed ? <>{children}</> : <Navigate to='/'/>
}
const PublicRoute = ({ children }) => {
    const {signed, loading} = useContext(AuthContext);

    return signed ? <Navigate to='/dashboard'/> : <>{children}</>
}

function AppRoutes (){
    return(
        <BrowserRouter>
            <Routes>
                {/* Private Routes === if signed */}
                <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
                <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
                <Route path='/customers' element={<PrivateRoute><Customers/></PrivateRoute>}/>
                <Route path='/new' element={<PrivateRoute><New/></PrivateRoute>}/>
                <Route path='/new/:id' element={<PrivateRoute><New/></PrivateRoute>}/>

                {/* Public routes === if not signed*/}
                <Route path='/' element={<PublicRoute><SignIn/></PublicRoute>}/>
                <Route path='/register' element={<PublicRoute><SignUp/></PublicRoute>}/>
                <Route path='*' element={<h1>ERROR 404 - PAGE NOT FOUND</h1>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;