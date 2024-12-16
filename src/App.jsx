import { BsGithub } from "react-icons/bs"
import Container from "../components/Container"
import Table from "../components/Table"
import { BiAnchor } from "react-icons/bi"
import { MdArrowOutward } from "react-icons/md"
import ResetLocalStorage from "../components/ResetLocalStorage"


const App = () => {
  return (
    <section className="">
      <Container>
        <div className="h-4 "></div>
        <div className="flex items-center gap-2 px-4 py-2 mt-4 border rounded"> 
          <img src="/vite.svg" className="w-10" alt="logo"/>
          <div>
        <h1 className="font-medium">Tabulator js</h1>
            <p className="text-xs text-gray-400">React Example</p>
          </div>
        

        </div>
        <Table/>

        <div className="h-4 "></div>
        <div className="flex flex-col gap-4 py-2 mt-4 text-sm text-gray-800">
          <p>1. This is a project to learn and explore Tabulator js</p>
          <p className="hyphens-auto ">2. Data is fetched from the api <code className="break-words hyphens-auto">https://jsonplaceholder.typicode.com/todos</code> on 1st run. The data is then stored in local storage and used for the table.</p>
          <p>3. For resetting the table data, delete the local storage data <code>mainTableData</code></p>
        </div>
        <div className="">
          <ResetLocalStorage/>
          
        </div>
      </Container>
      <footer className="py-2 mt-6 border-t bg-gray-50">
          <a href="https://github.com/diptnc/tabulator-js-react-example" className="flex items-center justify-center gap-2 px-2 py-2 mx-auto text-center bg-white border rounded-full w-max" target="_blank" rel="noreferrer">
            <BsGithub size={24}/> <span>Github</span> <MdArrowOutward />

          </a>
        <div className="flex justify-center gap-4 px-4 py-2 text-sm text-gray-800">
          <p>Made by <a className="text-blue-500" href="https://diptanuchakraborty.in?ref=assignment-1-flowlaunch" target="_blank" rel="noreferrer">diptanuchakraborty.in</a></p>
        </div>
      </footer>
    </section>
  )
}

export default App