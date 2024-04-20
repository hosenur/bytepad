const useURL = (slug: string) => {
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:8080/${slug}` : `${import.meta.env.VITE_ENDPOINT_URL}/${slug}`;
    return url;
}
export { useURL };