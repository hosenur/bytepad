import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from 'socket.io-client';
import { toast } from "sonner";
export default function Playground() {
  const { tag } = useParams()
  const { getToken } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [containerStatus, setContainerStatus] = useState<boolean>(false)
  const [fileTree, setFileTree] = useState<any>(null)

  // useEffect to create a new socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      auth: {
        token: `Bearer ${getToken()}`
      }
    })
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  // useEffect to connect to the container
  useEffect(() => {
    if (!socket || !tag) {
      return
    }
    socket.emit("getContainer", tag)
    socket.on("containerCreated", () => {
      setContainerStatus(true)
      toast.success("Connected to container")
    })
  }, [socket, tag])

  useEffect(() => {
    if (containerStatus == false || !socket || !tag) {
      return
    }
    socket.emit("getDirectory", tag)
    socket.on("directory", (directory: any) => {
      console.log(directory)
      setFileTree(directory)
    })
  }, [socket, tag, containerStatus])

  return (
    <div className="flex overflow-hidden max-h-[100vh] max-w-[100vw]">
    </div>
  )
}
