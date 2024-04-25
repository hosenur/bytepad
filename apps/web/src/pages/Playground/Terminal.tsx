import { Terminal as XTerm } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { AttachAddon } from "@xterm/addon-attach";

const fitAddon = new FitAddon();

export default function Terminal({ tag, container, previewStatus, refreshDirectory }: { tag: string | undefined, container: boolean, previewStatus: boolean, refreshDirectory: () => void }) {
    const terminalRef = useRef<HTMLDivElement>(null);
    let currentLine = "";

    useEffect(() => {
        console.log('terminal', tag, container, previewStatus);

        if (!terminalRef.current || !tag || !container || !previewStatus) return;

        const term = new XTerm({
            convertEol: true,
            cursorStyle: 'underline',
            cursorBlink: true,
            fontFamily: 'monospace',
            fontSize: 14,
            fontWeight: '600',
            theme: {
                background: '#2b2b2b',
                foreground: '#FFFFFF',
                cursor: '#00FF00',
            },
        });

        const socket = new WebSocket(`wss://terminal.bytepad.pro/containers/${tag}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`);
        const attachAddon = new AttachAddon(socket);

        term.loadAddon(attachAddon);
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        term.clear();
        fitAddon.fit();
        term.focus();

        // const handleData = (data: string) => {
        //     console.log(data)
        //     // Check if the command is a file manipulation command
        //     const fileManipulationCommands = ['mv', 'cp', 'rm', 'mkdir', 'touch']; // Add more if needed
        //     const command = data.trim().split(' ')[0]; // Get the first word as the command
        //     if (fileManipulationCommands.includes(command)) {
        //         refreshDirectory(); // Call the refreshDirectory function
        //     }
        // };

        // term.onData((data) => {
        //     currentLine += data;
        //     if (data === '\r') {
        //         handleData(currentLine);
        //         currentLine = "";
        //     }

        // })

        return () => {
            term.dispose();
            attachAddon.dispose();
        };
    }, [tag, container, previewStatus]);

    useEffect(() => {
        const terminalElement = terminalRef.current;
        if (terminalElement) {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = terminalElement;
                if (scrollHeight - scrollTop === clientHeight) {
                    fitAddon.fit();
                }
            };
            terminalElement.addEventListener('scroll', handleScroll);
            return () => {
                terminalElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, [terminalRef]);

    return (
        <div className='font-mono terminal-container w-full h-full' ref={terminalRef}>
        </div>
    );
}
