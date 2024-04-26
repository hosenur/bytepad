import { File } from "@/lib/fsUtils";
import { Editor } from "@monaco-editor/react";
import { XIcon } from "lucide-react";
import { useMemo } from "react";
import _ from "lodash"; // Import lodash debounce

import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { Socket } from "socket.io-client";
type WindowProps = {
    path: MosaicBranch[];
    file: File | undefined;
    closeFile: (id: string) => void;
    socket: Socket | undefined;
}
export default function Window({
    path,
    file,
    socket,
    closeFile,
}: WindowProps) {
    const fileName = file?.name || "Untitled";
    const debouncedSaveFile = useMemo(() => _.debounce((value: string) => {
        if (!file) {
            return;
        }
        socket?.emit("saveFile", { path: file.path, content: value });
    }, 1500), [file, socket]);
    return (
        <MosaicWindow
            toolbarControls={<div className="flex items-center mr-2">
                <XIcon
                    onClick={() => closeFile(file?.id || "")}
                    size={20} className="cursor-pointer" />
            </div>}
            path={path} title={fileName}>
            <Editor
                onChange={(value) => {
                    debouncedSaveFile(value!);
                }}
                value={file?.content}
                theme="vs-dark" height="100%" defaultLanguage="javascript"
            />
        </MosaicWindow>
    )
}

