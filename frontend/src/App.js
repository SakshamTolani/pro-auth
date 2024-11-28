import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'

import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const theme = extendTheme({ colors })
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>

            <Route path="/reset/:token" element={<ResetPasswordPage />} />

            {/* PRIVATE ROUTES */}
            <Route path='/' element={<PrivateRoute><HomePage /></PrivateRoute>} exact />
            <Route path='/change-password' element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} exact />
            <Route path='/profile' element={<PrivateRoute><ProfilePage /></PrivateRoute>} exact />


            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
