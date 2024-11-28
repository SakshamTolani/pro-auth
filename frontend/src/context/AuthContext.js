import { useToast } from '@chakra-ui/react';
import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const toast = useToast()
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(() => localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenError, setTokenError] = useState(false);
    let loginUser = async (e, username, password) => {
        e.preventDefault();
        let response = await fetch("/api/token/",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'username': username, 'password': password }),
            },
        )
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem(('authTokens'), JSON.stringify(data));
            navigate("/")
        }
        else {
            toast({
                title: 'Some Error Occured',
                description: data.detail,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }


    let registerUser = async (e, rfirstname, rlastname, username, remail, rpassword) => {
        e.preventDefault();
        let response = await fetch("/api/register/",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'name': rfirstname + " " + rlastname, 'email': remail, 'password': rpassword, 'username': username }),
            },
        )
        let data = await response.json();
        if (response.status === 201) {
            toast({
                title: 'Registered Successfully!',
                description: `Registration with ${data.username} successful. Please login`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            loginUser(e, data.username, rpassword)
            navigate("/")
        }
        else {
            toast({
                title: 'Some Error Occured',
                description: data.detail,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }
    let validateToken = async (token) => {
        try {
            const response = await fetch('/api/validate-reset-roken/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setIsTokenValid(true);
                setTokenError("");
            } else {
                setIsTokenValid(false);
                setTokenError(data.detail || "Invalid or expired token");
            }
            return response;
        } catch (error) {
            setIsTokenValid(false);
            setTokenError("An error occurred while validating the token");
            throw error;
        }
    };

    let updateToken = async () => {

        let response = await fetch('/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        })

        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            // logoutUser()
        }
        if (loading) {
            setLoading(false)
        }
    }

    let profile = async (e) => {
        e.preventDefault();
        let response = await fetch('/api/profile/',
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + String(authTokens.access)
                },
            },
        )
        let data = await response.json();
        if (response.status === 200) {
            localStorage.setItem(('profile'), JSON.stringify(data));
            setProfileData(data)
            navigate("/profile")
        }
        else {
            console.log(data);
            toast({
                title: 'Some Error Occured',
                description: data.detail,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    let changePassword = async (e, oldPassword, newPassword) => {
        e.preventDefault();
        let response = await fetch('/api/change-password/',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + String(authTokens.access)
                },
                body: JSON.stringify({ 'old_password': oldPassword, 'new_password': newPassword }),
            },
        )
        let data = await response.json();
        if (response.status === 200) {
            toast({
                title: 'Password Changed Successfully!',
                description: `Password for ${data.username} has been changed successfully`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            loginUser(e, data.email, newPassword)
            navigate("/")
        }
        else {
            console.log(data);
            toast({
                title: 'Some Error Occured',
                description: data.detail,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }


    let resetPassword = async (e, email) => {
        e.preventDefault();
        let response = await fetch('/api/reset-password/',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'email': email }),
            },
        )
        let data = await response.json();
        if (response.status === 200) {
            toast({
                title: 'Reset Link Sent!',
                description: data.detail,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        else {
            toast({
                title: 'Some Error Occured',
                description: data.detail,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens')
        navigate("/login")
    }



    let contextData = {
        user: user,
        profile: profile,
        profileData: profileData,
        authTokens: authTokens,
        changePassword: changePassword,
        validateToken:validateToken,
        isTokenValid:isTokenValid,
        tokenError:tokenError,
        resetPassword: resetPassword,
        loginUser: loginUser,
        registerUser: registerUser,
        logoutUser: logoutUser,
    }


    useEffect(() => {
        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 10

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [authTokens, loading])



    return (
        <AuthContext.Provider value={contextData}>
            {/* {loading ? null : children} */}
            {children}
        </AuthContext.Provider>
    )
}