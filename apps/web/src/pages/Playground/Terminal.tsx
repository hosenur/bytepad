import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

const fitAddon = new FitAddon();

function ab2str(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

const OPTIONS_TERM = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 200,
    theme: {
        background: "black"
    }
};
interface Props {
    socket: Socket | undefined;
    tag: string | undefined;
}

export const TerminalComponent = ({ socket, tag }: Props) => {
    if (!socket || !tag) {
        return null;
    }
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!terminalRef.current || !socket) {
            return;
        }

        socket.on("terminalOutput", terminalHandler);
        const term = new Terminal(OPTIONS_TERM);
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        function terminalHandler({ data }: { data: ArrayBuffer }) {
            console.log(ab2str(data));
            term.write(ab2str(data));
        }

        term.onData((data) => {
            socket.emit('command', {
                data,
                tag
            });
        });

        socket.emit('command', {
            data: '\n'
        });

        return () => {
            socket.off("terminal");
        };
    }, [socket]);

    return <div style={{ width: "40vw", height: "400px", textAlign: "left" }} ref={terminalRef}></div>;
};
