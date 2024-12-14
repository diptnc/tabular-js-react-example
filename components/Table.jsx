import { TabulatorFull as Tabulator } from "tabulator-tables"; // Import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; // Import Tabulator CSS
import { useState, useEffect, useRef } from "react";
/* Dummy data : used for testing */
// import { dummyDataTable } from "../lib/dummy-data"; 
import { addTask, deleteTask, getDataBySearchText, getMainTableData, getTaskReportByStatus, updateTask } from "../lib/functions";
import { MdDelete } from "react-icons/md";
import { ReactToHtml } from "../lib/react-to-html";
import ToastNotification from "./ToastNotification";
import { CgClose } from "react-icons/cg";
import Container from "./Container";




const Table = () => {

  const [tableData, setTableData] = useState([]); // State to store the table data when it is fetched from the server
  const tableElementRef = useRef(null); // Ref to the table element

  /*
   * State to store the notification status and message
  */
  const [notify, setNotify] = useState(false); // State to store the notification status
  const [notifyMessage, setNotifyMessage] = useState(""); // State to store the notification message

  /*
     * State to store the notification status and message
  */

  const [showAddTaskModal, setShowAddTaskModal] = useState(false); // State to store the Add task form visibility state

  // initial fetch of the data from the server
  useEffect(() => {
    (async () => {
      const mainTableData = await getMainTableData(20); // Fetch the data from the server
      console.log("Fetched Data - frontend: ", mainTableData); 
      setTableData(mainTableData);
    })();
  }, []);

  // handle the cell edit event
  const handleCellEdited = async (cell) => {
    // get the id of the row
    const id = cell.getRow().getData().id;
    // get the new value
    const newValue = cell.getRow().getData();
    const res = await updateTask(id, newValue); // update the task in the server
    if (res) {
      cell.getRow().update(newValue); // update the cell with the new value
      setNotify(true);  // set the notification state to true
      setNotifyMessage("Task updated successfully"); // set the notification message to success
    }
  }


  const columns = [
    {
      title: "Task ID",
      field: "id",
      sorter: "number",
      width: 100,
      
    },
    {
      title: "Task Title",
      field: "title",
      minWidth:150,
      editable: true,
      editor: "input",
      widthGrow:2,
      // update on change
      cellEdited: handleCellEdited,
    },
    {
      title: "Task Description",
      field: "description",
      minWidth:150,
      widthGrow:2,

      editable: true,
      editor: "textarea",
      cellEdited: handleCellEdited,

    },
    {
      title: "Task Status",
      field: "completed",
      width: 150,
      editable: true,
      editor: "list",
      editorParams: {
        values: [
          { label: "To-do", value: 1 },
          { label: "In-progress", value: 2 },
          { label: "Done", value: 3 },
        ],
      },
      cellEdited: handleCellEdited,

      formatter: function (cell, formatterParams) {
        let cellClassNames, cellValue;
        switch (cell.getValue()) {
          case 1:
            cellClassNames = "text-orange-500 bg-orange-100";
            cellValue = "To-do";
            break;
          case 2:
            cellClassNames = "text-blue-500 bg-blue-100";
            cellValue = "In-progress";
            break;
          case 3:
            cellClassNames = "text-green-500 bg-green-100";
            cellValue = "Done";
            break;
          default:
            cellClassNames = "text-gray-500";
            cellValue = "Unknown";
            break;
        }

        return `<div class="${cellClassNames} p-2 font-medium">${cellValue}</div>`;
      },
    },

    {
      title: "Actions",
      field: "actions",
      width: 100,
      vertAlign: "middle",
      hozAlign: "center",
      formatter: function (cell, formatterParams, onRendered) {
        // return react element
        const html = ReactToHtml(<div className="flex items-center gap-1"><MdDelete className="text-lg text-red-500" /> <span className="text-xs text-gray-500">Delete</span></div>);
        return html;
      },
      cellClick: async (e, cell) => {
        console.log("delete action clicked", cell.getRow().getData());
        const id = cell.getRow().getData().id;
        const res = await deleteTask(id);
        if (res) {
          setNotify(true);
          setNotifyMessage("Task deleted successfully");
          cell.getRow().delete();

        }
      },
    },
  ];

  useEffect(() => {
    let tableInstance = new Tabulator(tableElementRef.current, {
      data: tableData, // Assign data to table
      layout:"fitColumns",
      addRowPos: "top", // Add new rows to the top
      history: true, // Enable undo/redo functionality
      pagination: "local", // Enable local pagination
      paginationSize: 10, // Pagination size
      paginationCounter: "rows",
      movableColumns: true, // Allow column reordering
      initialSort: [{ column: "id", dir: "asc" }], // Initial sort
      columnDefaults: { tooltip: true ,}, // Default column settings
      placeholder: "No data available", // Placeholder text
      columns: columns, // Columns definition
      autoResize:false, // prevent auto resizing of table

    });

    // redraw the table when the window is resized as of docs ; else the table will not resize on widow resize
    window.addEventListener('resize', function(){
      tableInstance.redraw();
    });


    return () => {
      tableInstance.destroy();
    };
  }, [tableData]); // Dependencies: tableData
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (e.target.task_name.value === "") {
      alert("Task name cannot be empty");
      return;
    }
    const data = {

      id: tableData?.length + 1 || 1,
      title: e.target.task_name.value,
      description: e.target.task_description.value || "",
      completed: parseInt(e.target.task_status.value) || 1,
      userId: 1,
    };
    // console.log("data", data);

    const res = await addTask(data);
    if (res) {
      setTableData(res);
      setNotify(true);
      setNotifyMessage("Task added successfully");
      setShowAddTaskModal(false);

    }


  };
  const handleSearch = (e) => {
    e.preventDefault();
    const searchText = e.target.task_search.value;
    setTableData(getDataBySearchText(searchText));
  };

  return (
    <div className="relative">
      <Container>
        
      <div>
        reports
        <div>
          <h3>To-do</h3>
          <div>
            <p>todo tasks: {getTaskReportByStatus(1).length}</p>
            <p>Completed tasks: {getTaskReportByStatus(3).length}</p>
            <p>in progress tasks: {getTaskReportByStatus(2).length}</p>
          </div>
        </div>
      </div>
      <div>
        {/* filtering */}
        <div>
          {/* searching */}
          <form className="flex gap-4" onSubmit={(e) => handleSearch(e)}>
            <label htmlFor="task_search">Search</label>
            <input type="text" name="task_search" id="task_search" placeholder="Search tasks" className="w-full p-4 border" />
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Search</button>
          </form>
        </div>
        <div>
          <label htmlFor="task_status">Filter by status</label>
          <select name="task_status" id="task_status" className="w-full p-4 border" onChange={(e) => setTableData(getTaskReportByStatus(parseInt(e.target.value)))}>
            <option value="1">To-do</option>
            <option value="2">In-progress</option>
            <option value="3">Done</option>
            <option value="0" selected>All</option>
          </select>
        </div>
      </div>
      <div><button onClick={() => setShowAddTaskModal(true)}>Add Task</button></div>
      <div ref={tableElementRef} id="main-table"></div>
      <div>
        <ToastNotification notify={notify} message={notifyMessage} setNotify={setNotify} setNotifyMessage={setNotifyMessage} />
      </div>
      <div>
        {showAddTaskModal && <AddTaskModal setShowAddTaskModal={setShowAddTaskModal} handleAddTask={handleAddTask} />}
      </div>
      </Container>

    </div>
  );
};

export default Table;


const AddTaskModal = ({ setShowAddTaskModal, handleAddTask }) => {

  return (
    <div className="w-full max-w-md p-4 border rounded bg-gray-50">
      <div><CgClose onClick={() => setShowAddTaskModal(false)} className="text-gray-500 cursor-pointer hover:text-red-500" /></div>
      <h3>Add Task</h3>
      <form method="post" onSubmit={(e) => handleAddTask(e)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="task_name" >Task Name</label>
          <input type="text" name="task_name" id="task_name" placeholder="Enter the task name" className="w-full p-4 border" required />
        </div>
        <div>
          <label htmlFor="task_description">Task Description</label>
          <textarea name="task_description" id="task_description" rows="5" placeholder="Enter the task description" className="w-full p-4 border"></textarea>
        </div>
        <div>
          <label htmlFor="task_status">Task Status</label>
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