import { useSocket } from "@/hooks/useSocket";
import { File, RemoteFile, Type, buildFileTree } from "@/lib/fsUtils";
import Editor from "@monaco-editor/react";
import _ from "lodash"; // Import lodash debounce
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FileExplorer } from "./FileExplorer";
import Header from "./Header";
import Preview from "./Preview";
import TerminalComponent from "./Terminal";


export default function Playground() {
  
  const { tag } = useParams();
  const navigate = useNavigate();
  if (!tag) {
    navigate("/playgrounds");
  }
  const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [containerStatus, setContainerStatus] = useState<boolean>(false);
  const socket = useSocket(tag);

  // Debounced onChange handler
  const debouncedSaveFile = useMemo(() => _.debounce((value: string) => {
    if (!selectedFile) {
      return;
    }
    socket?.emit("saveFile", { path: selectedFile.path, content: value });
  }, 1500), [selectedFile, socket]);

  useEffect(() => {
    if (!socket || !tag) {
      return;
    }
    socket.on("containerCreated", () => {
      setContainerStatus(true);
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
    <div className="flex flex-col overflow-hidden max-h-[100vh] max-w-[100vw]">
      <Header tag={tag} />
      <div className="flex h-full max-w-[100vw] overflow-hidden">

        <div className="bg-zinc-900 text-zinc-500 text-sm font-semibold min-h-screen w-2/12">
          <FileExplorer rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
        </div>
        <div className="w-6/12">
          <Editor
            language="javascriptreact"
            theme="vs-dark"
            height={"70vh"}
            onChange={(value) => {
              if (!value) return;
              // Call the debounced function
              debouncedSaveFile(value);
            }}
            value={selectedFile?.content}
          />
          <div className="text-white h-full w-full border border-zinc-800">

          <TerminalComponent container={containerStatus} tag={tag} />
          </div>
        </div>
        <div className="w-4/12">
          <Preview tag={tag} />
        </div>
      </div>
    </div>
  );
}

