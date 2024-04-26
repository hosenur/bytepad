import { File } from "@/lib/fsUtils";
import { Editor } from "@monaco-editor/react";
import { XIcon } from "lucide-react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
type WindowProps = {
    path: MosaicBranch[];
    file: File | undefined;
    closeFile: (id: string) => void;
}
export default function Window({
    path,
    file,
    closeFile,
}: WindowProps) {
    const fileName = file?.name || "Untitled";
    return (
        <MosaicWindow
            toolbarControls={<div className="flex items-center mr-2">
                <XIcon 
                    onClick={() => closeFile(file?.id || "")}
                size={20} className="cursor-pointer" />
            </div>}
            path={path} title={fileName}>
            <Editor
                value={file?.content}
                theme="vs-dark" height="100%" defaultLanguage="javascript"
            />
        </MosaicWindow>
    )
}

