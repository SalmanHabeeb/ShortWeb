import { Axios } from "../config/index.js";

export async function getShortenedURL(url) {
  try {
    const res = await Axios.get("/short/create", {
      params: { url },
      crossdomain: true,
    });
    console.log("jello");
    console.log(res.data);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function getMappedURL(data) {
  try {
    const res = await Axios.get("/short", {
      params: data,
      crossdomain: true,
    });
    console.log("jello");
    console.log(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function makeSignUpPostRequest(data) {
  try {
    const res = await Axios.post("/signup", {
      params: data,
      crossdomain: true,
    });
    console.log("Made signup post request");
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    return { data: [], error: true };
  }
}

export async function makeLoginPostRequest(data) {
  try {
    const res = await Axios.post("/login", {
      params: data,
      crossdomain: true,
    });
    console.log("Made login post request");
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    return { data: [], error: true };
  }
}

export async function getSelf(data) {
  try {
    const res = await Axios.get("/user", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    return { data: [], error: true };
  }
}

export async function updatePassword(data) {
  try {
    const res = await Axios.post("/password", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    return { data: [], error: true };
  }
}

export async function deleteSelf(data) {
  try {
    const res = await Axios.post("/user/delete", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    return { data: [], error: true };
  }
}

export async function sendLogOutRequest() {
  try {
    const res = await Axios.get("/logout", {
      params: {},
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function getUrlData(data) {
  try {
    const res = await Axios.get("/data/short", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function verifyLogin() {
  try {
    const res = await Axios.get("/login/verify", {
      params: {},
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function postNotes(data) {
  try {
    const res = await Axios.get("/notes/edit", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function getSuggestions(data) {
  try {
    const res = await Axios.get("/search/suggestions", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function getSearchResult(data) {
  try {
    const res = await Axios.get("/search/results", {
      params: data,
      crossdomain: true,
    });
    console.debug(res);
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}
