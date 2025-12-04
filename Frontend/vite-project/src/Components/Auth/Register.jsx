import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";

axios.defaults.withCredentials = true;

function Register() {


    const navigate = useNavigate()
    const [name, setName ] = useState("")
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")

    const handleSubmit = async (e)=>{
     try {
      e.preventDefault();

      const res = await axios.post('/register', {name, email, password }, {withCredentials : true})

       if(res.data.message === 'User Registered'){
        navigate('/login')
        console.log(name);
        alert(res.data.message)
       }else{
          alert(res.data.message)
       }
     } catch (error) {
      console.log(error,'register component Failed');
      
     }
    }
  return (
    <>
      <div className="min-h-[41.5em] p-5 flex items-center justify-center ">
        <div className="w-full max-w-md p-8 bg-white shadow">
          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-500 mb-6">
            Please fill in your details to create a new account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your name"
                onChange={(e)=>setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Create a password"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className="w-full px-4 py-2 rounded-md bg-black text-white font-semibold text-lg hover:bg-gray-800 transition"
            >
              Register
            </button>
            <div className="flex items-center my-2">
              <div className="grow border-t border-gray-200"></div>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Already have an account?
              <span className="font-semibold text-black hover:underline">
                <Link to='/login' >Login here</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
