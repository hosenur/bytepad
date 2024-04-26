import { File } from "@/lib/fsUtils";
import { Editor } from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { Mosaic } from "react-mosaic-component";
import { MosaicKey, MosaicNode } from "react-mosaic-component/lib/types";
import "react-mosaic-component/react-mosaic-component.css";
import { Socket } from "socket.io-client";
import Window from "./Window";
import _ from "lodash"; // Import lodash debounce

type EditorComponentProps = {
    openFiles: File[],
    setOpenFiles: (files: File[]) => void;
    socket: Socket | undefined;
}

export default function EditorComponent({
    openFiles,
    setOpenFiles,
    socket
}: EditorComponentProps) {
    const closeFile = (id: string) => {
        setOpenFiles(openFiles.filter(file => file.id !== id));
    }
    const [layout, setLayout] = useState<MosaicNode<MosaicKey> | null>()
    useEffect(() => {
        if (openFiles.length < 2) return;
        if (openFiles.length == 2) {
            setLayout({
                direction: "column",
                first: openFiles[0].id,
                second: openFiles[1].id,
            })
        }
        if (openFiles.length === 3) {
            setLayout({
                direction: "column",
                first: openFiles[0].id,
                second: {
                    direction: "row",
                    first: openFiles[1].id,
                    second: openFiles[2].id
                }
            })
        }
        if (openFiles.length === 4) {
            setLayout({
                direction: "column",
                first: {
                    direction: "row",
                    first: openFiles[0].id,
                    second: openFiles[1].id,
                },
                second: {
                    direction: "row",
                    first: openFiles[2].id,
                    second: openFiles[3].id,
                }
            })
        }
        if (openFiles.length === 5) {
            setLayout({
                direction: "column",
                first: {
                    direction: "row",
                    first: openFiles[0].id,
                    second: openFiles[1].id,
                },
                second: {
                    direction: "row",
                    first: openFiles[2].id,
                    second: {
                        direction: "column",
                        first: openFiles[3].id,
                        second: openFiles[4].id
                    }
                }
            })
        }
        if (openFiles.length === 6) {
            setLayout({
                direction: "column",
                first: {
                    direction: "row",
                    first: openFiles[0].id,
                    second: openFiles[1].id,
                },
                second: {
                    direction: "row",
                    first: openFiles[2].id,
                    second: {
                        direction: "column",
                        first: openFiles[3].id,
                        second: {
                            direction: "row",
                            first: openFiles[4].id,
                            second: openFiles[5].id
                        }
                    }
                }

            })
        }




    }, [openFiles])
    const debouncedSaveFile = useMemo(() => _.debounce((value: string) => {
        if (!openFiles[0]) {
            return;
        }
        socket?.emit("saveFile", { path: openFiles[0].path, content: value });
    }, 1500), [openFiles[0], socket]);
    if (openFiles.length === 0) {
        return <div className="w-full h-full flex items-center justify-center">
            <p>Open Up A File To Start Editing</p>
        </div>
    }
    if (openFiles.length === 1) {
        return (
            <Editor
                onChange={(value) => {
                    debouncedSaveFile(value!);
                }}
                theme="vs-dark" height="100%" defaultLanguage="javascript" defaultValue={openFiles[0].content} />
        )
    }
    return (
        <Mosaic

            renderTile={(id, path) => (
                <Window
                    socket={socket}
                    closeFile={closeFile}
                    file={openFiles.find(file => file.id === id)}
                    path={path} />
            )}
            initialValue={layout || {
                direction: "row",
                first: openFiles[0].id,
                second: openFiles[1].id,
            }}
        />
    )
}

