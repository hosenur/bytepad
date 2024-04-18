const mappings: Record<string, string>
    = {
    "react": "bytereact",
    "vue": "bytevue",
}
export const getTemplateName = (type: string) => {
    if (mappings[type]) {
        return mappings[type]
    }
    else {
        return "vanilla"
    }
}