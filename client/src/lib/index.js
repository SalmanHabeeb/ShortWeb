import { Axios } from "../config/index.js";

export async function getShortenedURL(data) {
  try {
    const res = await Axios.get("/short/create", {
      params: data,
      crossdomain: true,
    });
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
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function makeLoginPostRequest(data) {
  try {
    const res = await Axios.post("/login", {
      params: data,
      crossdomain: true,
    });
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function getSelf(data) {
  try {
    const res = await Axios.get("/user", {
      params: data,
      crossdomain: true,
    });
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function updatePassword(data) {
  try {
    const res = await Axios.post("/password", {
      params: data,
      crossdomain: true,
    });
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function deleteSelf(data) {
  try {
    const res = await Axios.post("/user/delete", {
      params: data,
      crossdomain: true,
    });
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function sendLogOutRequest(data) {
  try {
    const res = await Axios.get("/logout", {
      params: data,
      crossdomain: true,
    });
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
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}

export async function verifyLogin(data) {
  try {
    const res = await Axios.get("/login/verify", {
      params: data,
      crossdomain: true,
    });
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
    return { data: res.data, error: false };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
}
