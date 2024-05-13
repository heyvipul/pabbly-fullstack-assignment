import "./AddTask.css"
import React, { useState } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';

const AddTask = ({getTask}) => {

  const [showPopup, setshowPopup] = useState(false)
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "high"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || null;
      if(!token){
        return  toast.error("User not Authenticated")
      }
      else if(taskDetails.title === "" || taskDetails.dueDate === "" || taskDetails.description === ""){
        return toast.error("Input fields are empty!")
      }
      const { data } = await axios.post("https://pabbly-backend.onrender.com/task/create", taskDetails);
      console.log(data);
      toast.success("Task created successfully!");
      setTaskDetails({
        title: "",
        description: "",
        dueDate: "",
        priority: "high" // Reset priority to default
      });
      setshowPopup(!showPopup)
      setTimeout(() => {
        getTask();
      }, 1000);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task");
    }
  };

  return (
    <>
      <div className='main-container'>
        <div>
          <h3 style={{ color: "rgb(48, 48, 48)" }}>Tasks</h3>
        </div>
        <div>
          <button onClick={() => setshowPopup(!showPopup)}>Add Task +</button>
        </div>
      </div>
      <Toaster />
      {showPopup && (
        <React.Fragment>
          <div className='backdrop' ></div>
          <div className='store-add-div'>
            <form onSubmit={handleSubmit}>
              <h2>Add Task</h2>
              <input type="text" placeholder="Enter title" name="title" value={taskDetails.title} onChange={handleChange} />
              <input type="text" placeholder="Enter description" name="description" value={taskDetails.description} onChange={handleChange} />
              <input type="date" placeholder="Enter Duedate" name="dueDate" value={taskDetails.dueDate} onChange={handleChange} />
              <select name="priority" value={taskDetails.priority} onChange={handleChange}>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <button className="btn" style={{ marginTop: "10px", cursor: "pointer" }} type="submit">Add +</button>
            </form>

            <div>
              <button className="btn" onClick={() => setshowPopup(!showPopup)} style={{ marginTop: "10px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  )
}

export default AddTask