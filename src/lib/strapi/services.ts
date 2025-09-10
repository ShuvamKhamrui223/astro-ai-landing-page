export interface StrapiResponse<T> {
  data: T | null;
  error: string | null | unknown;
}

export async function getDataFromStrapi<T>(
  endpoint: string
): Promise<StrapiResponse<T>> {
  const { abort, signal } = new AbortController();
  const base_url = import.meta.env.STRAPI_BASE_URL;
  if (!base_url) {
    throw new Error("environment variable not found");
  }
  const url = new URL(`${base_url}/api/${endpoint}`);
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      let message = `Strapi request failed: ${res.status}`;

      if (res.status >= 400 && res.status < 500) {
        if (res.status === 401)
          message = "Unauthorized: Invalid or missing API token.";
        else if (res.status === 403)
          message =
            "Forbidden: You don’t have permission to access this resource.";
        else if (res.status === 404)
          message = "Not Found: The requested resource doesn’t exist.";
        else message = `Client error (${res.status}): ${res.statusText}`;
      } else if (res.status >= 500) {
        message = `Server error (${res.status}): Strapi server encountered an issue.`;
      }

      return { data: null, error: message };
    }

    const json = await res.json();
    return { data: json as T, error: null };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { data: null, error: "Request was aborted." };
    }
    if (err instanceof TypeError && err.message.includes("fetch")) {
      return {
        data: null,
        error: "Network error: Could not reach Strapi server.",
      };
    }
    return {
      data: null,
      error: `Unexpected error: ${err.message || "Unknown error"}`,
    };
  }
}
