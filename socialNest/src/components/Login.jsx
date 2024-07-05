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
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendApi}/api/users/login`, formData);
            console.log(res.data);
            toast.success('Login successfully');
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error.response.data.message);
        }
    };
    const handleFocusUsername = () => {
        // Manipulate state to change styles for username focus
        setEyeBallStyles({ eyeball1: { top: '20px', left: '13px' }, eyeball2: { top: '20px', left: '8px' } });
        setHandStyles({ handl: { transform: 'rotate(0deg)', bottom: '140px', left: '50px', height: '45px', width: '35px' }, handr: { transform: 'rotate(0deg)', bottom: '185px', left: '250px', height: '45px', width: '35px' } });
    };

    const handleFocusPassword = () => {
        // Manipulate state to change styles for password focus
        setEyeBallStyles({ eyeball1: { top: '10px', left: '10px' }, eyeball2: { top: '10px', left: '10px' } });
        setHandStyles({ handl: { transform: 'rotate(-150deg)', bottom: '215px', left: '105px', height: '90px', width: '40px' }, handr: { transform: 'rotate(150deg)', bottom: '308px', left: '192px', height: '90px', width: '40px' } });
    };
    
    const [eyeBallStyles, setEyeBallStyles] = useState({ eyeball1: {}, eyeball2: {} });
    const [handStyles, setHandStyles] = useState({ handl: {}, handr: {} });
    
    return (
        <div className='h-[90vh] bg-gray-200 w-full absolute flex justify-center items-center'>
            <div className='absolute p-8'>
            <span>if you haven't login plz  <Link className='text-blue-400' to='/signup'>signup here</Link></span>
                <form onSubmit={handleSubmit} className="login rounded-3xl bg-blue-300 ">
                    <i className="fa fa-user" aria-hidden="true">&nbsp;&nbsp;</i>
                    <input type="email"
                        name="email" value={formData.email}
                        onChange={handleChange} className='p-2 rounded-xl' placeholder='username' onFocus={handleFocusUsername} />
                    <br /><br />
                    <i className="fa fa-unlock-alt" aria-hidden="true">&nbsp;&nbsp;</i>
                    <input type="password"
                        name="password" value={formData.password}
                        onChange={handleChange} className='p-2 rounded-xl' placeholder='password' onFocus={handleFocusPassword} />
                    <br /><br />
                    <button type="submit" className='primary-btn'>Login</button>
                </form>
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
