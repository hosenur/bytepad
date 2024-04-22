import { Button } from '@/components/ui/button'
import { usePlaygrounds } from '@/hooks/usePlaygrounds'
import { Globe, Trash } from 'lucide-react'

export default function Header({ tag }: { tag: string | undefined }) {
    const { deletePlayground } = usePlaygrounds()
    const handleDelete = () => {
        if (!tag) return
        console.log("deleting")
        deletePlayground(tag)
    }
    return (
        <header className='bg-zinc-900 w-full text-white border-b border-zinc-800 h-16 flex items-center justify-center px-5'>
            <div className='mr-auto font-black font-mono uppercase'>Bytepad</div>
            <div className='flex gap-2 items-center text-zinc-500'>
                <Globe className='w-4 h-4 text-gray-400' />
                <span className='text-sm font-medium text-gray-300'>https://{tag}.bytepad.pro</span>
            </div>
            <div className='ml-auto'>
                <Button
                    onClick={handleDelete}
                    className='flex gap-2 items-center'>
                    <Trash className='w-4 h-4 text-gray-400' />
                    Delete
                </Button>
            </div>
        </header>

        // <header className="flex h-16 w-full shrink-0 bg-zinc-900 border-b border-zinc-800 text-white items-center px-4 md:px-6">
        //     <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base" to="/">
        //         <span className="text-zinc-500">{tag}.bytepad.pro</span>
        //     </Link>
        //     <div className='place-self-center'>
        //         <span className="text-zinc-500">{tag}.bytepad.pro</span>
        //     </div>
        // </header>
    )
}
