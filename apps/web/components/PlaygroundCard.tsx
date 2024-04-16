import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function PlaygroundCard() {
    return (
        <div className='flex rounded gap-2.5 p-2.5 bg-zinc-50 border border-zinc-100 shadow-sm'>
            <div className="flex items-center justify-center w-20">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className='w-10' />
            </div>
            <div>
                <h2>React</h2>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
            </div>

        </div>
    )
}
