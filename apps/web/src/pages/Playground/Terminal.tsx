import { Terminal as XTerm } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import "./Terminal.module.css"
import { AttachAddon } from "@xterm/addon-attach";
const fitAddon = new FitAddon();

export default function Terminal({ tag, container }: { tag: string | undefined , container: boolean}) {
    const terminalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!terminalRef.current || !tag || !container ) return;
        const term = new XTerm({
            convertEol: true,
            cols: 100,
            cursorStyle: 'underline',
            cursorBlink: true,
            fontFamily: 'Courier New',
            fontSize: 14,
            fontWeight: 'bold',
            theme: {
                background: '#000000',
                foreground: '#FFFFFF',
                cursor: '#00FF00',
            },
        });
        const socket = new WebSocket(`wss://terminal.bytepad.pro/containers/${tag}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`);
        const attachAddon = new AttachAddon(socket);
        term.loadAddon(attachAddon);
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        return () => {
            term.dispose();
        }

    }, [terminalRef, container, tag])
    return (
        <div ref={terminalRef}>
        </div>
    )
}
