const useURL = (slug: string) => {
    const url = `http://localhost:8080/${slug}`;
    return url;
}
export { useURL };