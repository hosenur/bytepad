import { File } from "@/lib/fsUtils";
import { Editor } from "@monaco-editor/react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
type WindowProps = {
    id: string;
    path: MosaicBranch[];
    file: File | undefined;
}
export default function Window({
    id,
    path,
    file
}: WindowProps) {
    const fileName = file?.name || "Untitled";
    return (
        <MosaicWindow path={path} title={fileName}>
            <Editor
                value={file?.content}
                theme="vs-dark" height="100%" defaultLanguage="javascript"
            />
        </MosaicWindow>
    )
}

