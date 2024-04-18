import { usePlaygrounds } from '@/hooks/usePlaygrounds'
import { PlaygroundTemplateType } from '../../types'

export default function PlaygroundTemplate({ playground }: { playground: PlaygroundTemplateType }) {
    const { createPlayground } = usePlaygrounds()
    return (
        <div
            onClick={() => {
                createPlayground(playground.value)
            }}
            className='bg-zinc-50 border border-zinc-100 shadow rounded p-2.5 flex gap-5 cursor-pointer hover:shadow-md transition-all ease-in-out'>
            <div className='items-center justify-center flex w-15'>

                <img src={playground.image} className='w-10' alt="" />
            </div>
            <div>

                <h2 className='font-medium'>
                    {playground.name}
                </h2>
                <p className='text-sm'>
                    {playground.description}
                </p>
            </div>
        </div>
    )
}
