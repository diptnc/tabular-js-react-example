/*
This component is used to display the data in a table format.
** Not used in the main project
Issues : modification 
*/
import 'react-tabulator/lib/styles.css'; // required styles
import { reactFormatter, ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";
import { dummyDataTable } from "../lib/dummy-data";
import { MdDelete } from "react-icons/md";

const columns = [
  {
    title: "Task ID",
    field: "id",
    sorter: "number",
    formatter: "number",
  },
  {
    title: "Task Name",
    field: "title",
    editable: true,
    editor: "input",
  },
  {
    title: "Task Description",
    field: "description",
    editable: true,
    editor: "textarea",
  },
  {
    title: "Task Status",
    field: "completed",
    editable: true,
    editor: "select",
    editorParams: {
      values: [
        { label: "Done", value: true },
        { label: "to-do", value: false },
      ],
    },
    formatter: function (cell, formatterParams, onRendered) {
        return cell.getValue() ? `<span class="text-green-500 bg-green-50">${'Done'}</span>` : `<span class="text-orange-500 bg-orange-50   ">${'to-do'}</span>`;
    },
  },
  {
    title: "Actions",
    field: "actions",
    reactFormatter: <MdDelete/>,
  },
];

const ReactTableComponent = () => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
      });
  }, []);
  return (
    <div>
      <ReactTabulator
        data={tableData}
        columns={columns}
        layout={"fitColumns"}
        placeholder={"No data"}
        pagination={true}
        paginationMode={"local"}
        paginationSize={20}
        paginationCount={[20, 50, 100]}
      />
    </div>
  );
};

export default ReactTableComponent;


const Demo = () => {
    return  ( "hello")
}
