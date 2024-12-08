import React, { useState } from 'react';
import './login.css'; // Import CSS file with styles
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendApi } from '../Url';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '' // State to store OTP entered by user
    });
    const [isOtpSent, setIsOtpSent] = useState(false); // Flag to toggle OTP input visibility
    const [eyeBallStyles, setEyeBallStyles] = useState({ eyeball1: {}, eyeball2: {} });
    const [handStyles, setHandStyles] = useState({ handl: {}, handr: {} });

    // Handle input changes for email, password, and OTP
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendApi}/api/users/login`, formData);
            toast.success('Login successful. OTP sent to your email.');
            setIsOtpSent(true); // Show OTP input after successful login
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    // Handle OTP verification submission
    const handleOtpVerification = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendApi}/api/users/verify-otp`, { email: formData.email, otp: formData.otp });
            toast.success('OTP verified successfully');
            localStorage.setItem('token', res.data.token);
            navigate('/'); // Navigate to the homepage/dashboard after successful login and OTP verification
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleFocusUsername = () => {
        setEyeBallStyles({ eyeball1: { top: '20px', left: '13px' }, eyeball2: { top: '20px', left: '8px' } });
        setHandStyles({ handl: { transform: 'rotate(0deg)', bottom: '140px', left: '50px', height: '45px', width: '35px' }, handr: { transform: 'rotate(0deg)', bottom: '185px', left: '250px', height: '45px', width: '35px' } });
    };

    const handleFocusPassword = () => {
        setEyeBallStyles({ eyeball1: { top: '10px', left: '10px' }, eyeball2: { top: '10px', left: '10px' } });
        setHandStyles({ handl: { transform: 'rotate(-150deg)', bottom: '215px', left: '105px', height: '90px', width: '40px' }, handr: { transform: 'rotate(150deg)', bottom: '308px', left: '192px', height: '90px', width: '40px' } });
    };

    return (
        <div className='h-[90vh] bg-gray-200 w-full absolute flex justify-center items-center'>
            <div className='absolute p-8'>
                <span>If you haven't logged in, please <Link className='text-blue-400' to='/signup'>sign up here</Link></span>

                {!isOtpSent ? (
                    <form onSubmit={handleSubmit} className="login rounded-3xl bg-blue-300">
                        <i className="fa fa-user" aria-hidden="true">&nbsp;&nbsp;</i>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className='p-2 rounded-xl' 
                            placeholder='Username' 
                            onFocus={handleFocusUsername} 
                        />
                        <br /><br />
                        <i className="fa fa-unlock-alt" aria-hidden="true">&nbsp;&nbsp;</i>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className='p-2 rounded-xl' 
                            placeholder='Password' 
                            onFocus={handleFocusPassword} 
                        />
                        <br /><br />
                        <button type="submit" className='primary-btn'>Login</button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpVerification} className="login rounded-3xl bg-blue-300">
                        <i className="fa fa-key" aria-hidden="true">&nbsp;&nbsp;</i>
                        <input 
                            type="text" 
                            name="otp" 
                            value={formData.otp} 
                            onChange={handleChange} 
                            className='p-2 rounded-xl' 
                            placeholder='Enter OTP' 
                        />
                        <br /><br />
                        <button type="submit" className='primary-btn'>Verify OTP</button>
                    </form>
                )}
                <div className="backg">
                    <div className="panda">
                        <div className="earl"></div>
                        <div className="earr"></div>
                        <div className="face">
                            <div className="blshl"></div>
                            <div className="blshr"></div>
                            <div className="eyel">
                                <div className="eyeball1" style={eyeBallStyles.eyeball1}></div>
                            </div>
                            <div className="eyer">
                                <div className="eyeball2" style={eyeBallStyles.eyeball2}></div>
                            </div>
                            <div className="nose">
                                <div className="line"></div>
                            </div>
                            <div className="mouth">
                                <div className="m">
                                    <div className="m1"></div>
                                </div>
                                <div className="mm">
                                    <div className="m1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pawl">
                    <div className="p1">
                        <div className="p2"></div>
                        <div className="p3"></div>
                        <div className="p4"></div>
                    </div>
                </div>
                <div className="pawr">
                    <div className="p1">
                        <div className="p2"></div>
                        <div className="p3"></div>
                        <div className="p4"></div>
                    </div>
                </div>
                <div className="handl" style={handStyles.handl}></div>
                <div className="handr" style={handStyles.handr}></div>
            </div>
        </div>
    );
}

export default Login;
