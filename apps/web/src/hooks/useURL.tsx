const useURL = (slug: string) => {
    const url = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://api.bytepad.pro";
    return `${url}/${slug}`
}
export { useURL };