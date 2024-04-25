import { File } from "@/lib/fsUtils";
import { Editor } from "@monaco-editor/react";
import { Mosaic } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import Window from "./Window";

type EditorComponentProps = {
    openFiles: File[],
    setOpenFiles: (files: File[]) => void;
}

export default function EditorComponent({
    openFiles,
    // setOpenFiles
}: EditorComponentProps) {
    // const closeFile = (id: string) => {
    //     setOpenFiles(openFiles.filter(file => file.id !== id));
    // }
    if (openFiles.length === 0) {
        return <div className="w-full h-full flex items-center justify-center">
            <p>Open Up A File To Start Editing</p>
        </div>
    }
    if (openFiles.length === 1) {
        return (
            <Editor theme="vs-dark" height="100%" defaultLanguage="javascript" defaultValue={openFiles[0].content} />
        )
    }
    return (
        <Mosaic

            renderTile={(id, path) => (
                <Window
                    file={openFiles.find(file => file.id === id)}
                    id={id}
                    path={path} />
            )}
            initialValue={{
                direction: "row",
                first: openFiles[0]?.id,
                second: openFiles[1]?.id,

            }}
        />
    )
}

