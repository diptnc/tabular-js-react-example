/*
* Functions to fetch and store that data in local storage then return it to the component
*/
export const getMainTableData = async (limit = 20) => {

  // first check the local storage for the data
  const localStorageData = localStorage.getItem("mainTableData");

  if (localStorageData) {
    console.log("local storage data found");
    return JSON.parse(localStorageData); // return the data from local storage to the component
  }

  // if there is no data in local storage, fetch the data from the server and store it in local storage
  const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  //limit the size of the data
  data.splice(limit);
  // map the completed filed to a boolean value of Done:3 -> true, Todo:3 -> false 
  data.map((item) => {
    item.completed = item.completed === true ? 3 : 1;
    return item;
  });

  localStorage.setItem("mainTableData", JSON.stringify(data)); // store the data in local storage
  console.log("local storage data saved");
  
  return data; // return the modified data to the component
};


/*
* Functions to delete a task from the table
*/
export const deleteTask = async (id) => {

  //  delete the task from local storage
  const localStorageData = localStorage.getItem("mainTableData");
  if (localStorageData) {
    const data = JSON.parse(localStorageData);
    data.forEach((item, index) => {
      if (item.id === id) {
        data.splice(index, 1);
      }
    });
    localStorage.setItem("mainTableData", JSON.stringify(data));
    console.log(`local storage data item deleted with id: ${id}`);
    return true; // return true to the component to indicate that the task was deleted successfully
  } else {
    return false; // return false to the component to indicate deletion failed
  }
};


/*
* Function to update a task from the table
*/
export const updateTask = async (id, newRowData) => {
  // it will replace the whole object with the new object (inefficient but stress free)
  const localStorageData = localStorage.getItem("mainTableData");
  if (localStorageData) {
    const data = JSON.parse(localStorageData);
    data.forEach((item, index) => {
      if (item.id === id) {
        data[index] = newRowData; // replace the object with the new object
      }
    });
    localStorage.setItem("mainTableData", JSON.stringify(data)); // store the data in local storage with the updated object
    console.log("local storage data item updated");
    return true;
  } else {
    return false;
  }
};

/*
* Function to add a task into the table
*/
export const addTask = async (value) => {
  const localStorageData = localStorage.getItem("mainTableData");

  if (localStorageData) {
    const data = JSON.parse(localStorageData);
    data.push(value);
    localStorage.setItem("mainTableData", JSON.stringify(data)); // store the data in local storage with the new object
    console.log(`new task added with id: ${value.id} | refreshing data`);
    return data; // return the modified data to the component it will update the setTableData state in the frontend
  } else {
    return false; // return false to the component to indicate addition failed
  }
}

/*
* Function to get task reports by status
* it will return an array of tasks with the status specified
*/

export const getTaskReportByStatus = (status) => {
  const localStorageData = localStorage.getItem("mainTableData");
  if (localStorageData) {
    const data = JSON.parse(localStorageData);
    if (status === 0) {
      return data; // return all the tasks if the status is 0 kind of a reset option
    }

    // filter the data based on the status 1 -> To-do, 2 -> In-progress, 3 -> Done

    const filteredData = data.filter((item) => item.completed === status);
    console.log("filtered data by status", filteredData);
    return filteredData; // return the filtered data to the component , will be used to display the data in the frontend setTableData state change.
  } else {
    return 0; // return 0 to the component to indicate that there is no data in local storage
  }
}



/*
* Function search the data by the search text
* it will return an array of tasks with the search text in the title or description
*/
export const getDataBySearchText = (searchText) => {
  const localStorageData = localStorage.getItem("mainTableData");
  if (localStorageData) {
    const data = JSON.parse(localStorageData);
    //  if the search text is empty return all the data in the storage like reset option
    if (searchText === "") {
      return data;
    }
    // filter the data based on the search text in the title 
    let searchedData = data.filter((item) => {
      return item.title.toLowerCase().includes(searchText.toLowerCase());
    })
    // if the search text is not found in the title, filter the data based on the search text in the description
    if (searchedData.length < 1) {
      searchedData = data.filter((item) => {
        return item?.description && item.description.toLowerCase().includes(searchText.toLowerCase());
      })
    }

    console.log("searched data by search text", searchedData);
    return searchedData; //returning the array of the tasks matching almost the search text
  } else {
    return 0;
  }
}