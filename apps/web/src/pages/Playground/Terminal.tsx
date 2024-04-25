import { Terminal as XTerm } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import { AttachAddon } from "@xterm/addon-attach";


export default function Terminal({ tag, container, previewStatus }: { tag: string | undefined, container: boolean, previewStatus: boolean }) {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('terminal', tag, container, previewStatus);

        if (!terminalRef.current || !tag || !container || !previewStatus) return;

        const term = new XTerm({
            convertEol: true
        });

        const socket = new WebSocket(`wss://terminal.bytepad.pro/containers/${tag}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`);
        const attachAddon = new AttachAddon(socket);

        term.loadAddon(attachAddon);

        term.open(terminalRef.current);

        return () => {
            term.dispose();
            attachAddon.dispose();
        };
    }, [tag, container, previewStatus]);


    return (
        <div className='terminal-container font-mono max-h-min overflow-y-scroll bg-black' ref={terminalRef}>
        </div>
    );
}
