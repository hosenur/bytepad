import { Terminal as XTerm } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { AttachAddon } from "@xterm/addon-attach";
const fitAddon = new FitAddon();

export default function Terminal({ tag, container, previewStatus }: { tag: string | undefined, container: boolean, previewStatus: boolean }) {
    const terminalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!terminalRef || !tag || !container || !previewStatus) return;
        const term = new XTerm({
            convertEol: true,
            cols: 100,
            cursorStyle: 'underline',
            cursorBlink: true,
            fontFamily: 'monospace',
            fontSize: 14,
            fontWeight: '600',
            theme: {
                background: '#000000',
                foreground: '#FFFFFF',
                cursor: '#00FF00',
            },
        });

        const socket = new WebSocket(`wss://terminal.bytepad.pro/containers/${tag}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`);
        term.clear();
        term.writeln("Connecting to terminal...");

        socket.addEventListener('open', () => {
            const attachAddon = new AttachAddon(socket);
            term.loadAddon(attachAddon);
            term.loadAddon(fitAddon);
            term.open(terminalRef.current!);
            term
        });

        return () => {
            term.dispose();
        }

    }, [terminalRef, tag, container])
    return (
        <div className='font-mono terminal-container  w-full h-full' ref={terminalRef}>
        </div>
    )
}
