import { useEffect, useState } from 'react'
import AddTask from '../AddTask/AddTask'
import Navbar from '../Navbar/Navbar'
import "./Dashboard.css"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {

  const [allTask, setAllTask] = useState([]);

  const getTask = async () => {
    try {
      const { data } = await axios.get("https://pabbly-backend.onrender.com/task")
      // const data = response
      console.log(data);
      setAllTask(data);
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
      if(!token){
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
          <div className='task-cards'>
            {
              allTask?.map(function (ele, index) {
                return <div key={index}>
                  <p style={{ color: ele.priority === "high" ? "red" : "green", fontWeight: "bold" }}>{ele.priority}</p>
                  <p>Title :{ele.title}</p>
                  <p>Description: {ele.description}</p>
                  <p>dueDate: {ele.dueDate}</p>
                  <p>status: <span style={{ color: "green", fontWeight: "bold" }}>{ele.status}</span></p>
                  <button className='btn'>Edit</button>
                  <Toaster />
                  <button className='btn' onClick={() => handleDeleteTask(ele._id)}>Delete</button>
                </div>
              })
            }
          </div>

        </div>
        <div className='second-div'>
          <h4>Completed</h4>
        </div>
      </div>
    </>
  )
}

export default Dashboard