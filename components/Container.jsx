/* eslint-disable react/prop-types */

const Container = ({ children }) => {
  return (
    <div className="container mx-auto px-4 max-w-screen-xl">{children}</div>
  )
}

export default Container