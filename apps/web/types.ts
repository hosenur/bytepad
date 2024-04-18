export type PlaygroundTemplateType = {
    id: number;
    name: string;
    description: string;
    image: string;
    value: string
};
export type PlaygroundType = {
    id: number;
    name: string;
    type: string;
    owner: string;
    PlaygroundMember: {
        role: string;
        userId: string;
    }
}