import { usePlaygrounds } from "@/hooks/usePlaygrounds";
import { useSocket } from "@/hooks/useSocket";
import { File, RemoteFile, Type, buildFileTree } from "@/lib/fsUtils";
import Editor from "@monaco-editor/react";
import { Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FileExplorer } from "./FileExplorer";


export default function Playground() {
  const { tag } = useParams();
  const navigate = useNavigate();
  if (!tag) {
    navigate("/playgrounds");
  }
  const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const { deletePlayground } = usePlaygrounds()
  const socket = useSocket(tag);
  const handleDeletePlyground = () => {
    if (!tag) return;
    deletePlayground(tag)
    navigate("/playgrounds")
  }
  useEffect(() => {
    if (!socket || !tag) {
      return;
    }
    socket.on("containerCreated", () => {
      toast.success("Connected to container");
    });
    socket.on("directory", (directory) => {
      console.log("directory");
      setRemoteFiles(directory);
    });
  }, [socket, tag]);

  const rootDir = useMemo(() => {
    return buildFileTree(remoteFiles);
  }, [remoteFiles]);
  console.log(rootDir);
  const onSelect = (file: File) => {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("getDirectory", file.path, (data: RemoteFile[]) => {
        setRemoteFiles((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) => index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket?.emit("getFile", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  return (
    <div className="flex overflow-hidden max-h-[100vh] max-w-[100vw]">
      <div className="bg-zinc-900 text-zinc-500 text-sm font-semibold min-h-screen w-2/12">
        <FileExplorer rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
      </div>
      <div className="w-10/12">
        <Editor
          language="typescript"
          theme="vs-dark"
          height={"80vh"}
          // onChange={debounce((value) => {
          //   if (!selectedFile) {
          //     return;
          //   }
          //   console.log("cahnged")
          //   socket?.emit("saveFile", { path: selectedFile.path, content: value });
          // }, 1000)}
          //the incgabge wiull debounce by 3 seconds, then fire the socket event
          onChange={(value) => {
            if (!selectedFile) {
              return;
            }
            socket?.emit("saveFile", { path: selectedFile.path, content: value });
          }}
          value={selectedFile?.content}
        />
      </div>
      <div
        onClick={handleDeletePlyground}
        className="fixed bottom-20 right-20 bg-zinc-100 rounded border border-zinc-200 p-2.5 cursor-pointer">
        <Trash className="w-8 h-8" />
      </div>
    </div>
  );
}
