
const ResetLocalStorage = () => {
  return (
    <div className="p-4 border rounded w-max">
        <p className="text-sm text-red-800">Reset local storage</p>
        <div className="h-2 "></div>
        <button className="px-4 py-2 font-medium text-white bg-red-500 rounded hover:bg-red-700" onClick={() => {
            localStorage.removeItem("mainTableData")
            window.location.reload()
        }}>Reset</button>
    </div>
  )
}

export default ResetLocalStorage