import Container from "../components/Container"
import Table from "../components/Table"


const App = () => {
  return (
    <section className="">
      <Container>
        <div className="flex items-center px-4 py-2 mt-4 border rounded"> 
          <img src="/vite.svg" className="w-10" alt="logo"/>
        <h1 className="font-medium">Assignment</h1>

        </div>
        <Table/>
      </Container>
    </section>
  )
}

export default App