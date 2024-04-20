import { Directory, File, sortDir, sortFile } from "@/lib/fsUtils";
import { getIcon } from '@/lib/getIcon';
import clsx from 'clsx';
import React, { useState } from 'react';

interface FileTreeProps {
    rootDir: Directory;   // 根目录
    selectedFile: File | undefined;   // 当前选中文件
    onSelect: (file: File) => void;  // 更改选中时触发事件
}

export const FileExplorer = (props: FileTreeProps) => {
    return <SubTree directory={props.rootDir} {...props} />
}

interface SubTreeProps {
    directory: Directory;   // 根目录
    selectedFile: File | undefined;   // 当前选中文件
    onSelect: (file: File) => void;  // 更改选中时触发事件
}

const SubTree = (props: SubTreeProps) => {
    return (
        <div>
            {
                props.directory.dirs
                    .sort(sortDir)
                    .map(dir => (
                        <React.Fragment key={dir.id}>
                            <DirDiv
                                directory={dir}
                                selectedFile={props.selectedFile}
                                onSelect={props.onSelect} />
                        </React.Fragment>
                    ))
            }
            {
                props.directory.files
                    .sort(sortFile)
                    .map(file => (
                        <React.Fragment key={file.id}>
                            <FileDiv
                                file={file}
                                selectedFile={props.selectedFile}
                                onClick={() => props.onSelect(file)} />
                        </React.Fragment>
                    ))
            }
        </div>
    )
}

const FileDiv = ({ file, selectedFile, onClick }: {
    file: File | Directory; // 当前文件
    icon?: string;          // 图标名称
    selectedFile: File | undefined;     // 选中的文件
    onClick: () => void;    // 点击事件
}) => {
    const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
    const depth = file.depth;
    return (
        <div className={clsx(
            "flex items-center px-1 py-0.5 gap-1.5 hover:bg-zinc-950",
            isSelected && "bg-zinc-800",
        )} onClick={onClick} style={{ paddingLeft: depth * 16 }}
        >
            <FileIcon name={file.name} />
            <span>
                {file.name}
            </span>
        </div>
        // <Div
        //     depth={depth}
        //     isSelected={isSelected}
        //     onClick={onClick}>
        //     <FileIcon name={file.name} />
        //     <span style={{ marginLeft: 1 }}>
        //         {file.name}
        //     </span>
        // </Div>
    )
}


const DirDiv = ({ directory, selectedFile, onSelect }: {
    directory: Directory;  // 当前目录
    selectedFile: File | undefined;    // 选中的文件
    onSelect: (file: File) => void;  // 点击事件
}) => {
    let defaultOpen = false;
    if (selectedFile)
        defaultOpen = isChildSelected(directory, selectedFile)
    const [open, setOpen] = useState(defaultOpen);
    return (
        <>
            <FileDiv
                file={directory}
                icon={open ? "openDirectory" : "closedDirectory"}
                selectedFile={selectedFile}
                onClick={() => {
                    if (!open) {
                        onSelect(directory)
                    }
                    setOpen(!open)
                }} />
            {
                open ? (
                    <SubTree
                        directory={directory}
                        selectedFile={selectedFile}
                        onSelect={onSelect} />
                ) : null
            }
        </>
    )
}

const isChildSelected = (directory: Directory, selectedFile: File) => {
    let res: boolean = false;

    function isChild(dir: Directory, file: File) {
        if (selectedFile.parentId === dir.id) {
            res = true;
            return;
        }
        if (selectedFile.parentId === '0') {
            res = false;
            return;
        }
        dir.dirs.forEach((item) => {
            isChild(item, file);
        })
    }

    isChild(directory, selectedFile);
    return res;
}

const FileIcon = ({ name }: { name: string }) => {
    return (
        <img src={getIcon(name)} className='w-4 h-4' alt="" />
    )
}