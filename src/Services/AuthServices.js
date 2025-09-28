import axios from "axios";
const API_URL = "http://localhost:5000/api/v1/users";


// Register user
const RegisterUser=(data)=>{
    return axios.post(`${API_URL}/register`, data);
}

// Login user
const LoginUser=(data)=>{
    return axios.post(`${API_URL}/login`, data);
}

const AuthService = { RegisterUser, LoginUser };
export default AuthService;