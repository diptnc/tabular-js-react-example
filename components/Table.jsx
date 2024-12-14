import { TabulatorFull as Tabulator } from "tabulator-tables"; // Import Tabulator library
import { useState, useEffect, useRef } from "react";
/* Dummy data : used for testing */
// import { dummyDataTable } from "../lib/dummy-data"; 
import { addTask, deleteTask, getDataBySearchText, getMainTableData, getTaskReportByStatus, updateTask } from "../lib/functions";
import { MdAdd, MdDelete } from "react-icons/md";
import { ReactToHtml } from "../lib/react-to-html";
import ToastNotification from "./ToastNotification";
import { IoChevronDownOutline } from "react-icons/io5";
import AddTaskModal from "./AddTaskModal";




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
      minWidth: 150,
      editable: true,
      editor: "input",
      widthGrow: 2,
      // update on change
      cellEdited: handleCellEdited,
    },
    {
      title: "Task Description",
      field: "description",
      minWidth: 150,
      widthGrow: 2,

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

        // return `<div class="${cellClassNames} p-2 font-medium h-full">${cellValue}</div>`;
        return ReactToHtml(<div className={`${cellClassNames} p-2 font-medium h-full flex gap-2 items-center justify-between`}><span>{cellValue} </span> <span><IoChevronDownOutline />
</span></div>);
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
      layout: "fitColumns",
      addRowPos: "top", // Add new rows to the top
      history: true, // Enable undo/redo functionality
      pagination: "local", // Enable local pagination
      paginationSize: 10, // Pagination size
      paginationCounter: "rows",
      movableColumns: true, // Allow column reordering
      initialSort: [{ column: "id", dir: "asc" }], // Initial sort
      columnDefaults: { tooltip: true, }, // Default column settings
      placeholder: "No data available", // Placeholder text
      columns: columns, // Columns definition
      autoResize: false, // prevent auto resizing of table

    });

    // redraw the table when the window is resized as of docs ; else the table will not resize on widow resize
    window.addEventListener('resize', function () {
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
    <div className="flex flex-col gap-6 pt-4">


      <div className="__upper-remote-section">

        <div className="flex-col w-full space-y-4 ">
          <h3 className="text-sm text-gray-500">Reports</h3>
          <div className="grid w-full gap-2 md:grid-cols-4">
            <div className="p-6 border border-orange-500 rounded bg-orange-50">
              <p>Todo tasks</p>
              <h4 className="text-2xl font-bold text-orange-500">{getTaskReportByStatus(1).length}</h4>
            </div>
            <div className="p-6 border border-blue-500 rounded bg-blue-50">
              <p>In processing tasks</p>
              <h4 className="text-2xl font-bold text-blue-500">{getTaskReportByStatus(2).length}</h4>
            </div>


            <div className="p-6 border border-green-500 rounded bg-green-50">
              <p>Completed tasks</p>
              <h4 className="text-2xl font-bold text-green-500">{getTaskReportByStatus(3).length}</h4>
            </div>

            <div className="p-6 border border-purple-500 rounded bg-purple-50">
              <p>Total tasks</p>
              <h4 className="text-2xl font-bold text-purple-500">{getTaskReportByStatus(0).length}</h4>
            </div>
          </div>
        </div>
      </div>
      <div>
      <h3 className="py-4 text-sm text-gray-500">Filters</h3>
        
     
      <div className="grid grid-cols-1 gap-4 __operation_section md:grid-cols-2">
        <div className="__search-section">
          {/* searching */}
          <form className="flex gap-4" onSubmit={(e) => handleSearch(e)}>
            <input type="text" name="task_search" id="task_search" placeholder="Search tasks" className="w-full px-4 py-2 border rounded" />
            <button type="submit" className="px-4 py-2 font-medium text-white bg-blue-400 border border-blue-600 rounded hover:bg-blue-500">Search</button>
          </form>
        </div>
        <div className="flex items-center gap-2 __filter-section">
          <label htmlFor="task_status" className="text-sm text-gray-500">Filter by status</label>
          <select name="task_status" id="task_status" className="px-4 py-2 border rounded" onChange={(e) => setTableData(getTaskReportByStatus(parseInt(e.target.value)))}>
            <option value="1">To-do</option>
            <option value="2">In-progress</option>
            <option value="3">Done</option>
            <option value="0" selected>All</option>
          </select>
        </div>
        
      </div>
      </div>
      <div><button onClick={() => setShowAddTaskModal(true)} className="flex gap-2 px-4 py-2 font-medium text-white border rounded bg-violet-500 border-violet-800 hover:bg-violet-600"><MdAdd size={24}/> Add Task</button></div>
      <div ref={tableElementRef} id="main-table"></div>
      <div>
        <ToastNotification notify={notify} message={notifyMessage} setNotify={setNotify} setNotifyMessage={setNotifyMessage} />
      </div>
      {showAddTaskModal &&
      <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-screen bg-black/10">
        <AddTaskModal setShowAddTaskModal={setShowAddTaskModal} handleAddTask={handleAddTask} />
      </div>
    }

    </div>
  );
};

export default Table;

