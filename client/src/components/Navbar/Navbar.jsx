import axios from "axios";
import "./Navbar.css"
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: ""
  })
  const [signupDetails, setSignupDetails] = useState({
    email: "",
    username1: "",
    password1: ""
  })
  const [userLoggedIn, setuserLoggedIn] = useState(false);
  const [showPopup, setshowPopup] = useState(false)
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setuserLoggedIn(true);
    }
  }, [])

  //Login Input Function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    if(loginDetails.username === "" || loginDetails.password === "") {
      return toast.error("Input fields are empty!")
    }
    try {
      const { data } = await axios.post("https://pabbly-backend.onrender.com/user/login", {
        username: loginDetails.username,
        password: loginDetails.password
      })
      const { token,user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setuserLoggedIn(true);
      setshowPopup(false)

      toast.success("login successfull!")
    } catch (error) {
      console.log(error);
      toast.error("login failed")
    }
  };

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  //Singup Input
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setSignupDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if(signupDetails.email === "" || signupDetails.username1 === "" || signupDetails.password1 === "") {
      return toast.error("Input fields are empty!")
    }
    try {
      const { data } = await axios.post("https://pabbly-backend.onrender.com/user/register", {
        username: signupDetails.username1,
        password: signupDetails.password1
      })
      // console.log(data);
      toast.success("Signup successfull! Pls Login")
      setToggle(!toggle)
      setSignupDetails({
        email: "",
        username1: "",
        password1: ""
      });
    } catch (error) {
      console.log(error);
      toast.error("login failed")
    }
  };



  return (
    <>
      <div className="navbar">
        <div className="nav-first">
          <h2 style={{ color: "rgb(48, 48, 48)" }}>Pabbly</h2>
        </div>
        <div className="nav-second">
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="search task..." />
            <IoIosSearch
              style={{
                position: 'absolute',
                marginLeft: "-25px",
                fontSize: '20px'
              }}
            />
          </div>
          {
            userLoggedIn ? <button onClick={handleLogout}>Logout</button> :
              <button onClick={() => setshowPopup(!showPopup)}>Login</button>
          }

        </div>
      </div>
      <Toaster/>
      {showPopup && (
        <React.Fragment>
          <div className='backdrop' ></div>
          {
            toggle ? <div className='store-add-div'>
              <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <input type="text"
                  placeholder="Enter username"
                  name="username"
                  value={loginDetails.username}
                  onChange={handleChange} />

                <input type="password"
                  placeholder="Enter password"
                  name="password"
                  value={loginDetails.password}
                  onChange={handleChange} />

                <button className="btn" type="submit">Login</button>
                <p>Don't have an account? <span
                  style={{ cursor: "pointer", color: "rgb(1,112,210)", fontWeight: "bold" }} onClick={() => setToggle(!toggle)}>Signup</span> </p>
              </form>
              <div>
                <br />
                <button className="btn" onClick={() => setshowPopup(!showPopup)}>Cancel</button>
              </div>
            </div> :
              <div className='store-add-div'>
                <form onSubmit={handleSignUp}>
                  <h2>Signup</h2>
                  <input type="email"
                    placeholder="Enter email"
                    name="email"
                    value={signupDetails.email}
                    onChange={handleChange1} />

                  <input type="text"
                    placeholder="Enter username"
                    name="username1"
                    value={signupDetails.username1}
                    onChange={handleChange1} />

                  <input type="password"
                    placeholder="Enter password"
                    name="password1"
                    value={signupDetails.password1}
                    onChange={handleChange1} />

                  <button className="btn" type="submit">Signup</button>
                  <p>Already have an account? <span
                    style={{ cursor: "pointer", color: "rgb(1,112,210)", fontWeight: "bold" }} onClick={() => setToggle(!toggle)}>Login</span> </p>
                </form>
                <div>
                  <br />
                  <button className="btn" onClick={() => setshowPopup(!showPopup)}>Cancel</button>
                </div>
              </div>
          }
        </React.Fragment>
      )}
    </>
  )
}

export default Navbar