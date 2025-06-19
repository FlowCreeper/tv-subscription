"use client";

import { useState, useEffect } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: any;
  immediate?: boolean; // if false, won't auto-fire on mount
}

export default function useApi(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", body = null, immediate = true } = options;

  const baseUrl = process.env.NEXT_PUBLIC_API_LINK;
  const fullUrl = `${baseUrl}${endpoint}`;

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (
    customMethod: Method = method, 
    customBody: any = body,
    resourceId?: number | string // for /endpoint/:id
  ) => {
    setLoading(true);
    try {
      const url = resourceId ? `${baseUrl}${endpoint}/${resourceId}` : `${baseUrl}${endpoint}`;

      const res = await fetch(url, {
        method: customMethod,
        headers: customBody ? { "Content-Type": "application/json" } : undefined,
        body: customBody ? JSON.stringify(customBody) : undefined,
      });

      if (!res.ok) throw new Error(`${customMethod} failed: ${res.status}`);
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const json = isJson ? await res.json() : null;

      setData(json);
      setError(null);
      return json;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [endpoint]);

  return {
    data,
    error,
    loading,
    fetch: fetchData, // fetch(method, body, id) can be reused dynamically
  };
}
