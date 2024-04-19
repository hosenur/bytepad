import { FrameworkType } from "types"

const mapping = {
    "REACT": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "VUE": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    "NEXTAPP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-plain.svg",
    "NEXTPAGE": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-plain.svg",

}
export const getImage = (value: FrameworkType) => {
    console.log(value)
    return mapping[value]
}