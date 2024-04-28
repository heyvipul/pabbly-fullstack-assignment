import { useEffect, useState } from 'react'
import React from 'react'
import AddTask from '../AddTask/AddTask'
import Navbar from '../Navbar/Navbar'
import "./Dashboard.css"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import BeatLoader from "react-spinners/BeatLoader";

const Dashboard = () => {

  const [allTask, setAllTask] = useState([]);
  const [loading, setLoading] = useState(true)
  const [showPopup, setshowPopup] = useState(false)
  let [color, setColor] = useState("rgb(74,83,215)");

  const getTask = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("https://pabbly-backend.onrender.com/task")
      // const data = response
      console.log(data);
      setAllTask(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTask();
  }, [])

  console.log(allTask);

  // Delete Function
  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token") || null;
      if (!token) {
        return toast.error("User not Authenticated")
      }
      await axios.delete(`https://pabbly-backend.onrender.com/${id}`);
      toast.success("Task deleted successfully");
      getTask();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };


  return (
    <>
      <Navbar />
      <AddTask getTask={getTask} />
      <div className='dashboard-container'>
        <div className='first-div'>
          <h4>InProgress</h4>

          {
            loading ? <div className='loading-indicator'>
              <BeatLoader
                color={color}
                loading={loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div> : <div className='task-cards'>
              {
                allTask?.map(function (ele, index) {
                  return <div key={index}>
                    <p style={{ color: ele.priority === "high" ? "red" : "green", fontWeight: "bold" }}>{ele.priority}</p>
                    <p>Title :{ele.title}</p>
                    <p>Description: {ele.description}</p>
                    <p>dueDate: {ele.dueDate}</p>
                    <p>status: <span style={{ color: "green", fontWeight: "bold" }}>{ele.status}</span></p>
                    <button onClick={() => setshowPopup(!showPopup)} className='btn'>Edit</button>
                    <Toaster />
                    <button className='btn' onClick={() => handleDeleteTask(ele._id)}>Delete</button>
                  </div>
                })
              }
            </div>
          }

        </div>
        <div className='second-div'>
          <h4>Completed</h4>
        </div>
      </div>
      {showPopup && (
        <React.Fragment>
          <div className='backdrop' ></div>
          <div className='store-add-div'>
            <form onSubmit={""}>
              <h2>Edit Task</h2>
              <select style={{ marginBottom: "10px" }}>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <input type="text" placeholder='Edit Title' />
              <input type="text" placeholder='Edit Description' />
              <input type="date" placeholder='Edit dueDate' />

              <button className="btn" style={{ marginTop: "10px", cursor: "pointer" }} type="submit">Edit</button>
            </form>

            <div>
              <button style={{marginTop:"10px"}} className="btn" onClick={() => setshowPopup(!showPopup)}  >Cancel</button>
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  )
}

export default Dashboard