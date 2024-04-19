import { usePlaygrounds } from '@/hooks/usePlaygrounds'
import { PlaygroundType } from 'types'
import Playground from './Playground'

export default function MyPlaygrounds() {
    const { getMyPlaygrounds } = usePlaygrounds()
    const { data, isLoading } = getMyPlaygrounds()
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div className="flex gap-2.5 flex-col">
            <h1 className="text-lg font-semibold md:text-2xl">My Playgrounds</h1>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-5 ">
                {
                    data?.map((playground: PlaygroundType) => (
                        <Playground key={playground.id} playground={playground} />
                    ))
                }
            </div>
        </div>
    )
}
