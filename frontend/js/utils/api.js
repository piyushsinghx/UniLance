const API_BASE = "http://localhost:5000/api";

function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    search.set(key, value);
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

export const api = {
  base: API_BASE,

  async request(method, path, data, options = {}) {
    const token = localStorage.getItem("ul-token");
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const requestOptions = {
      method,
      headers,
      ...(data !== undefined && data !== null
        ? {
            body: isFormData ? data : JSON.stringify(data),
          }
        : {}),
    };

    let response;

    try {
      response = await fetch(`${API_BASE}${path}`, requestOptions);
    } catch (error) {
      throw {
        message: "Could not connect to the UniLance API. Make sure the backend is running on port 5000.",
        cause: error,
      };
    }

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw payload;
    }

    return payload;
  },

  get(path, params) {
    const finalPath = typeof params === "object" ? `${path}${buildQuery(params)}` : path;
    return this.request("GET", finalPath);
  },

  post(path, data) {
    return this.request("POST", path, data);
  },

  put(path, data) {
    return this.request("PUT", path, data);
  },

  delete(path) {
    return this.request("DELETE", path);
  },

  buildQuery,
};

export { API_BASE };
