
export default function FileExplorer({
    files,
    setOpenFile
}: {
    files: string[],
    setOpenFile: (file: string) => void
}) {
    return (
        <div className="bg-zinc-900 text-white  h-screen flex flex-col">
            {files.map((file, index) => (
                <div
                    className="hover:bg-zinc-800 p-2 cursor-pointer"
                    onClick={() => setOpenFile(file)}
                    key={index}>{file}</div>
            )
            )}
        </div>
    )
}
