import { Globe, Loader, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

type PreviewProps = {
    tag: string | undefined;
}

export default function Preview({ tag }: PreviewProps) {
    if (!tag) return null;

    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    const [reloadKey, setReloadKey] = useState(0); // State to trigger iframe reload

    useEffect(() => {
        const interval = setInterval(() => {
            const URL = `https://${tag}.bytepad.pro`;
            fetch(URL)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        setIsPreviewAvailable(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, [tag]);

    const handleReload = () => {
        // Increment reload key to trigger iframe reload
        setReloadKey(prevKey => prevKey + 1);
    };

    if (isPreviewAvailable) {
        return (
            <div className="flex flex-col items-center h-full">
                <div className="flex items-center justify-between w-full max-w-3xl px-4 py-2   bg-zinc-900">
                    <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5  text-gray-400" />
                        <span className="text-sm font-medium  text-gray-300">
                            https://{tag}.hosenur.cloud
                        </span>
                    </div>
                        <div
                            onClick={handleReload}
                         className='flex items-center cursor-pointer justify-center w-10 h-10'>

                            <RefreshCcw className="w-5 h-5 text-gray-400" />
                            <span className="sr-only">Refresh</span>
                        </div>

                </div>
                <div className="w-full h-full bg-white -b-lg shadow-lg dark:bg-gray-900 overflow-hidden">
                    <iframe
                        key={reloadKey} // Use key to trigger iframe reload
                        src={`https://${tag}.bytepad.pro`}
                        className="w-full h-full"
                        title="Preview"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className='h-full bg-black flex items-center justify-center w-full'>
            <Loader className='w-5 h-5 text-white animate-spin' />
        </div>
    )
}
