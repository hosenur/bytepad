import { getImage } from '@/constants/Image'
import { PlaygroundType } from 'types'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
export default function PlaygroundCard({ playground }: { playground: PlaygroundType }) {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => {
                navigate(`/playground/${playground.tag}`)
            }}
            className='bg-zinc-50 border border-zinc-100 h-24 shadow rounded p-2.5 flex gap-5 cursor-pointer hover:shadow-md transition-all ease-in-out'>
            <div className='items-center justify-center flex w-15'>

                <img src={getImage(playground.framework)} className='w-10' alt="" />
            </div>
            <div className='flex flex-col flex-1'>
                <div className=' items-center flex justify-between w-full'>


                    <h2 className='font-medium'>
                        {playground.tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h2>
                    {
                        playground.running && <div className='bg-green-400 h-1.5 w-1.5 rounded-full animate-ping'/>
                    }
                </div>
                <p className='text-sm'>
                    Created {moment(playground.createdAt).fromNow()}
                </p>
            </div>
        </div>
    )
}
