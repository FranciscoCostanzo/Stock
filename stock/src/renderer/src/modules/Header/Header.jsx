import { useAuth } from "../Auth/context/AuthContext"

const Header = () => {
  const dataUser = useAuth().user

console.log(dataUser)
  return (
    <header>
    </header>
  )
}

export default Header