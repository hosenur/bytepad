import EditorComponent from "@/components/Editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSocket } from "@/hooks/useSocket";
import { File, RemoteFile, Type, buildFileTree } from "@/lib/fsUtils";
import _ from "lodash"; // Import lodash debounce
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FileExplorer } from "./FileExplorer";
import Preview from "./Preview";
import Terminal from "./Terminal";


export default function Playground() {

  const { tag } = useParams();
  const navigate = useNavigate();
  if (!tag) {
    navigate("/playgrounds");
  }
  const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [openFiles, setOpenFiles] = useState<File[]>([]);
  const [containerStatus, setContainerStatus] = useState<boolean>(false);
  const [previewStatus, setPreviewStatus] = useState<boolean>(false);
  const socket = useSocket(tag);

  // Debounced onChange handler
  // const debouncedSaveFile = useMemo(() => _.debounce((value: string) => {
  //   if (!selectedFile) {
  //     return;
  //   }
  //   socket?.emit("saveFile", { path: selectedFile.path, content: value });
  // }, 1500), [selectedFile, socket]);

  useEffect(() => {
    if (!socket || !tag) {
      return;
    }
    socket.on("containerCreated", () => {
      setContainerStatus(true);
      toast.success("Connected to container");
    });
    socket.on("directory", (directory) => {
      console.log("Directory Refresh")
      setContainerStatus(true);
      console.log("directory");
      setRemoteFiles(directory);
    });
  }, [socket, tag]);
  const rootDir = useMemo(() => {
    return buildFileTree(remoteFiles);
  }, [remoteFiles]);
  //create a useeffect hook to set open files to readme.md and package.json




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
        console.log("getFile", data);
        setOpenFiles((prev) => {
          const allFiles = [...prev, file];
          return allFiles.filter(
            (file, index, self) => index === self.findIndex((f) => f.path === file.path)
          );
        });
        file.content = data;
        setSelectedFile(file);
      });
    }
  };



  return (

    <div className="w-full h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">

        <ResizablePanel defaultSize={12} className="bg-zinc-800 font-bold text-zinc-400 text-sm">
          <FileExplorer rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <EditorComponent
                setOpenFiles={setOpenFiles}
                openFiles={openFiles}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <Terminal tag={tag} container={containerStatus} previewStatus={previewStatus} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30}>
          <Preview setPreviewStatus={setPreviewStatus} previewStatus={previewStatus} tag={tag} />
        </ResizablePanel>

      </ResizablePanelGroup>

    </div>
  );
}

