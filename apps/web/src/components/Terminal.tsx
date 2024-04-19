import { FitAddon } from '@xterm/addon-fit';
import { Terminal as XTerm, } from "@xterm/xterm";
import { useEffect, useRef } from 'react';

const TerminalSettings = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 200,
    theme: {
        background: "black"
    }
};
export default function Terminal() {
    const terminalRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const terminal = new XTerm(TerminalSettings)
        const fitAddon = new FitAddon()
        if (!terminalRef.current) {
            return
        }
        terminal.loadAddon(fitAddon)
        terminal.open(terminalRef.current)
        fitAddon.fit()
    }, [terminalRef])
    return (
        <div className="w-full bg-zinc-900 h-[20vh]" ref={terminalRef}>

        </div>
    )
}
