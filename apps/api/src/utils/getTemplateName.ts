import { FrameworkType } from "types"
const mappings: Record<FrameworkType, string>
    = {
    "REACT": "bytereact",
    "VUE": "bytevue",
    "NEXT-APP": "bytenext"
}
export const getTemplateName = (framework: FrameworkType) => {
    if (mappings[framework]) {
        return mappings[framework]
    }
    else {
        return "vanilla"
    }
}