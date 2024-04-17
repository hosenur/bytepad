import { PlaygroundTemplateType } from '../../types'

export default function PlaygroundTemplate({ playground }: { playground: PlaygroundTemplateType }) {
    return (
        <div className='bg-zinc-50 border border-zinc-100 shadow rounded p-2.5 flex gap-5'>
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
