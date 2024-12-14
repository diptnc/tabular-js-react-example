/* eslint-disable react/prop-types */
import { CgClose } from "react-icons/cg"

const AddTaskModal = ({ setShowAddTaskModal, handleAddTask }) => {

    return (
      <div className="w-full max-w-md p-6 border border-blue-500 rounded bg-gray-50">
        <div className="flex justify-end w-full"><CgClose onClick={() => setShowAddTaskModal(false)} className="text-2xl text-gray-500 cursor-pointer hover:text-red-500" /></div>
        <h3 className="pb-2 text-base font-medium text-gray-800">Add Task</h3>
        <form method="post" onSubmit={(e) => handleAddTask(e)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="task_name" className="text-sm text-gray-500" >Task Name <span className="text-red-500">*</span></label>
            <input type="text" name="task_name" id="task_name" placeholder="Enter the task name" className="w-full px-4 py-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="task_description" className="text-sm text-gray-500">Task Description</label>
            <textarea name="task_description" id="task_description" rows="5" placeholder="Enter the task description" className="w-full px-4 py-2 border rounded"></textarea>
          </div>
          <div>
            <label htmlFor="task_status" className="text-sm text-gray-500">Task Status</label>
            <select name="task_status" id="task_status" className="w-full p-4 border">
              <option value="1">To-do</option>
              <option value="2">In-progress</option>
              <option value="3">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Add Task</button>
            <button onClick={() => setShowAddTaskModal(false)} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">Cancel</button>
          </div>
  
        </form>
      </div>
    )
  }


  export default AddTaskModal