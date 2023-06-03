import { Axios } from "../config/index.js";

export async function getShortenedURL(url) {
    try {
        const res = await Axios.get("/getShortenedURL", {
            params: { url },
        });
        console.log("jello");
        console.log(res);
        return { data: res.data, error: false };
    } catch(error) {
        console.error(error);
        return { data: [], error: true };
    }
}

export async function getMappedURL(key) {
    try {
        const res = await Axios.get("/getMappedURL", {
            params: { key },
        });
        console.log("jello");
        console.log(res);
        return { data: res.data, error: false };
    } catch(error) {
        console.error(error);
        return { data: [], error: true };
    }
}