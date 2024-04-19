import { useAuth } from "@clerk/clerk-react";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from 'socket.io-client';
import { toast } from "sonner";

export default function Playground() {
  const { tag } = useParams()
  const { getToken } = useAuth()
  const [port, setPort] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [containerStatus, setContainerStatus] = useState<boolean>(false)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  

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

  useEffect(() => {
    if (!socket || !tag) {
      return
    }
    socket.emit("getContainer", tag)
    socket.on("containerCreated", (port: number) => {
      console.log(port)
      toast.success("Connected to container")
      setContainerStatus(true)
      setPort(port.toString())
    })
  }, [socket, tag])
  useEffect(() => {
    if (containerStatus == false || !socket || !tag) {
      return
    }
    socket.emit("getDirectory", tag)
    socket.on("directory", (directory: any) => {
      console.log(directory)
    })
  }, [socket, tag, containerStatus])
  return (
    <div className="flex max-w-full">
      <div className="w-1/6 h-screen bg-zinc-900">

      </div>
      <div className="w-3/6">
        <Editor
          theme="vs-dark"
          height="100vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />

      </div>
      {
        isPreview ? <iframe src={`http://localhost:${port}`} className="w-2/6 h-screen" /> : <div className="w-2/6 animate-pulse h-screen bg-zinc-900"></div>
      }


    </div>
  )
}
