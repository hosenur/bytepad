enum FrameworkType {
    REACT = "REACT",
    VUE = "VUE",
    NEXT_APP = "NEXT-APP"
}
export const playgroundTypes = [
    {
        "id": 1,
        "name": "React",
        "description": "React + TypeScript + Vite Playground",
        "framework": FrameworkType.REACT,
    },
    {
        "id": 2,
        "name": "Vue",
        "description": "Vue JS + TypeScript + Vite Playground",
        "framework": FrameworkType.VUE,
    },
    {
        "id": 3,
        "name": "Next.js App Router",
        "description": "Next.js Project with App Router Playground",
        "framework": FrameworkType.NEXT_APP,
    },

]