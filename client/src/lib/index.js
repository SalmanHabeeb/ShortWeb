import { Axios } from "../config/index.js";

export const getShortenedURL = async(url) => {
    try {
        const res = await Axios.get("/posts", {
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