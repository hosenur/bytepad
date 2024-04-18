import { useParams } from "react-router-dom"

export default function Playground() {
  const { name } = useParams()
  return (
    <div>
      {name}
    </div>
  )
}
