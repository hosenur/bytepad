import { atom } from "recoil"
export const openwindows = atom({
    key: 'openwindows',
    default: {
        one: <div></div>,
        two: <div></div>,
        three: <div></div>,
        e1: <div></div>,
        e2: <div></div>,
        e3: <div></div>
    }
})

export const gridlayout = atom({
    key: 'gridlayout',
    default: {
        direction: 'column',
        first: {
            direction: 'row',
            first: 'one',
            second: 'two'
        },
        second: 'three'
    }
})