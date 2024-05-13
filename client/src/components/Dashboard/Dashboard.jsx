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
  const [taskId, setTaskId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPopup, setshowPopup] = useState(false)
  const [completedTask, setCompletedTask] = useState([])
  const [editDetails, setEditDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "high" // Default priority
  });


  const getTask = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("https://pabbly-backend.onrender.com/task")
      // const data = response
      // console.log(data);
      setAllTask(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTask();
  }, [])


  // Delete Function
  const handleDeleteTask = async (id) => {

    try {
      const token = localStorage.getItem("token") || null;
      if (!token) {
        return toast.error("User not Authenticated")
      }
      await axios.delete(`https://pabbly-backend.onrender.com/task/${id}`);
      toast.success("Task deleted successfully");
      setTimeout(() => {
        getTask();
      }, 1000);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };



  //Edit functionality
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || null;
    if (!token) {
      return toast.error("User not Authenticated")
    }
    else if (editDetails.title === "" || editDetails.description === "" || editDetails.dueDate === "") {
      return toast.error("Input fields are empty!")
    }
    try {
      await axios.put(`https://pabbly-backend.onrender.com/task/${taskId}`, {
        title: editDetails.title,
        description: editDetails.description,
        dueDate: editDetails.dueDate,
        priority: editDetails.priority
      });

      toast.success("Task updated successfully!");

      setEditDetails({
        title: "",
        description: "",
        dueDate: "",
        priority: "high" // Reset priority to default
      });

      setshowPopup(!showPopup)
      setTimeout(() => {
        getTask()
      }, 1000);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task");
    }
  };


  //Handle Status Change
  const handleStatusChange = (taskId) => {
    toast.success("Task completed!")
    setTimeout(() => {
      const taskIndex = allTask.findIndex(task => task._id === taskId);
      if (taskIndex !== -1) {
        
        const updatedAllTask = [...allTask];
        const removedTask = updatedAllTask.splice(taskIndex, 1)[0];

        removedTask.status = "completed";

        setCompletedTask(prevCompletedTasks => [...prevCompletedTasks, removedTask]);
        setAllTask(updatedAllTask);
      }

    }, 1000);

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
                color={"rgb(74,83,215)"}
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
                    <button onClick={() => handleStatusChange(ele._id)} className='btn'>status: <span style={{ fontWeight: "bold" }}>{ele.status}</span></button>
                    <button onClick={() => { setshowPopup(!showPopup), setTaskId(ele._id) }} className='btn'>Edit</button>
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
          {completedTask.map((task, index) => (
            <div key={index}>
              <p style={{ color: task.priority === "high" ? "red" : "green", fontWeight: "bold" }}>{task.priority}</p>
              <p>Title: {task.title}</p>
              <p>Description: {task.description}</p>
              <p>Due Date: {task.dueDate}</p>
              <button className='btn'>Status: <span style={{ fontWeight: "bold" }}>{task.status}</span></button>
              <button className='btn' onClick={() => handleDeleteTask(ele._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
        <React.Fragment>
          <div className='backdrop' ></div>
          <div className='store-add-div'>
            <form onSubmit={handleSubmit}>
              <h2>Edit Task</h2>
              <select name="priority" value={editDetails.priority} onChange={handleChange} style={{ marginBottom: "10px" }}>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <input type="text" placeholder="Edit Title" name="title" value={editDetails.title} onChange={handleChange} />
              <input type="text" placeholder="Edit Description" name="description" value={editDetails.description} onChange={handleChange} />
              <input type="date" placeholder="Edit Due Date" name="dueDate" value={editDetails.dueDate} onChange={handleChange} />
              <button className="btn" style={{ marginTop: "10px", cursor: "pointer" }} type="submit">Edit</button>
            </form>

            <div>
              <button style={{ marginTop: "10px" }} className="btn" onClick={() => setshowPopup(!showPopup)}  >Cancel</button>
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  )
}

export default Dashboard