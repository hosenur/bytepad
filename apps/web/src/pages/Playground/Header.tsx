import { Button } from '@/components/ui/button'
import { Trash, UserSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <header className="flex h-16 w-full shrink-0 bg-zinc-950 text-white items-center px-4 md:px-6">
            <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base" to="/">
                <span className="sr-only">Bytepad</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
                <Button size="sm" variant="outline">
                    <UserSquare className="w-5 h-5" />
                    Invite
                </Button>
                <Button size="sm" variant="ghost">
                    <Trash className="w-5 h-5" />
                    Delete
                </Button>
            </div>
        </header>
    )
}
