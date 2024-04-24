enum FrameworkType {
    REACT = "REACT",
    VUE = "VUE",
    NEXTAPP = "NEXTAPP",
    NEXTPAGE = "NEXTPAGE",
    NUXT = "NUXT",
    SVELTE = "SVELTE",
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
        "framework": FrameworkType.NEXTAPP,
    },
    {
        "id": 4,
        "name": "Next.js Pages Router",
        "description": "Next.js Project with Pages Router Playground",
        "framework": FrameworkType.NEXTPAGE,
    },
    {
        "id": 5,
        "name": "Nuxt.js",
        "description": "Nuxt V3 Application",
        "framework": FrameworkType.NUXT,
    },
    {
        "id": 6,
        "name": "Svelte",
        "description": "Svelte Application With Vite",
        "framework": FrameworkType.SVELTE,
    },
]