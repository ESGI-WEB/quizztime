const useApi = () => {
    const baseUrl = "http://localhost:8080";

    return async (url: string, options: RequestInit = {}) => {

        const type = 'application/json';
        const headers = new Headers(options.headers);
        headers.set('Content-Type', type);
        headers.set('Accept', type);

        const response = await fetch(`${baseUrl}/${url}`, {...options, headers});
        if (response.ok) {
            // check if it's a 204 response
            if (response.status === 204) {
                return;
            }

            return response.json();
        }
        const error = await response.json();
        throw new Error(error.detail ?? response.statusText ?? "An error occurred");
    }
};

export default useApi;