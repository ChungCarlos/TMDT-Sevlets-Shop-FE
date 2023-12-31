import {useEffect, useState} from 'react';
import './LoginRegister.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {Instagram, Twitter} from "@mui/icons-material";


export function LoginRegister() {
    const [country, setCountry] = useState([{
        id : 0,
        name : "",
        code : ""}])
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/customers/list-country").then(res => {
            console.log(res.data)
            setCountry(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const [isSignInActive, setIsSignInActive] = useState(true);
    const navigate = useNavigate()
    const [signIn,setSignIn] = useState({
        email:'',
        password:''
    });
    console.log(signIn)
    const [signUp,setSignUp] = useState({
        firstName : "First Name",
        lastName : "",
        email : "",
        password : "",
        country : {
            id : ""
        },
        phoneNumber : "Your Number",
        state : "Your State"
    })
    console.log(signUp);
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/customers/login").then(res => {
            console.log(res.data)
            setSignIn(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        axios.post("http://localhost:8080/api/v1/customers/register").then(res => {
            console.log(res.data)
            setSignUp(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleSignUpClick = () => {
        setIsSignInActive(false);
    };

    const handleSignInClick = () => {
        setIsSignInActive(true);
    };

    const handleSignIn = () => {
        // Gọi API hoặc xử lý đăng nhập ở đây
        axios.post("http://localhost:8080/api/v1/customers/login", signIn)
            .then(res => {
                // Xử lý kết quả đăng nhập từ API (nếu cần)
                console.log("Đăng nhập thành công!");
                console.log("Thông tin đăng nhập:", res.data);
                sessionStorage.setItem('user', JSON.stringify(res.data))
                const link = sessionStorage.getItem('link')
                if(link === null){
                    navigate('/')
                }else{
                    navigate(link)
                }
            })
            .catch(err => {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: err.response.data,
                    showConfirmButton: false,
                    timer: 10000
                })
            });
    };

    const handleSignUp = () => {
        console.log(signUp)
        // Gọi API hoặc xử lý đăng ký ở đây
        axios.post("http://localhost:8080/api/v1/customers/register", signUp)
            .then(res => {
                // Xử lý kết quả đăng ký từ API (nếu cần)
                console.log("Đăng ký thành công!");
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data + " " + "Please enter your Email to activate your account",
                    showConfirmButton: false,
                    timer: 10000
                })
                sessionStorage.setItem('user', JSON.stringify(res.data))

            })
            .catch(err => {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title:"Error! Re-enter again information!",
                    showConfirmButton: false,
                    timer: 10000
                })
            });
    };

    return (
        <>
            <div className= "body">
            <div className={`container ${isSignInActive ? '' : 'right-panel-active'}`} id="container">
                <div className="form-container sign-up-container">
                    <div id={'form-signUp'}>
                        <h1 className={'h1'}>Create Account</h1>
                        <div className="social-container">
                            <a id={'a-fb'} href="#" className="social"><FacebookIcon></FacebookIcon></a>
                            <a id={'a-in'} href="#" className="social"><Instagram></Instagram></a>
                            <a id={'a-tw'} href="#" className="social"><Twitter></Twitter></a>
                        </div>
                        <span className={'span'}>or use your email for registration</span>
                        <input
                            hidden={true}
                            onChange={(e) => setSignUp({ ...signUp, lastName: e.target.value })}
                        />
                        <input
                            hidden={true}
                            onChange={(e) => setSignUp({ ...signUp, phoneNumber: e.target.value })}
                        />
                        <input
                            hidden={true}
                            onChange={(e) => setSignUp({ ...signUp, state: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setSignUp({ ...signUp, firstName: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setSignUp({ ...signUp, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setSignUp({ ...signUp, password: e.target.value })}
                        />
                            <select name="country.id" onChange={(e) => setSignUp({ ...signUp, country:{id: e.target.value}  })}>
                                <option>
                                    Enter your country
                                </option>
                                {country.map(country => (
                                    <option key={country.id} value={country.id}>{country.code}</option>
                                ))}
                            </select>

                        <button id={'bnt-login'} onClick={handleSignUp}>Sign Up</button>
                    </div>
                </div>
                <div className="form-container sign-in-container">
                    <div id={'form-signUp'}>
                        <h1 className={'h1'}>Sign in</h1>
                        <div className="social-container">
                            <div className="social-container">
                                <a id={'a-fb'} href="#" className="social"><FacebookIcon></FacebookIcon></a>
                                <a id={'a-in'} href="#" className="social"><Instagram></Instagram></a>
                                <a id={'a-tw'} href="#" className="social"><Twitter></Twitter></a>
                            </div>
                        </div>
                        <span className={'span'}>or use your account</span>
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setSignIn({ ...signIn, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
                        />
                        <a id={'a'} href="#">Forgot your password?</a>
                        <button id={'bnt-login'} onClick={handleSignIn}>Sign In</button>
                    </div>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className={'h1'}>Welcome Back!</h1>
                            <p className={'p'}>To keep connected with us please login with your personal info</p>
                            <button id={'bnt-login'} className="ghost" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className={'h1'}>Hello, Friend!</h1>
                            <p className={'p'}>Enter your personal details and start journey with us</p>
                            <button id={'bnt-login'} className="ghost" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
