import { useEffect, useState } from "react";
import { apiRequest } from "./api.js";

export function useReferenceData() {
  const [data, setData] = useState({ districts: [], listing_districts: [], purposes: [] });
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest("/api/reference-data").then((result) => {
      if (active) {
        setData({ districts: result.districts ?? [], listing_districts: result.listing_districts ?? [], purposes: result.purposes ?? [] });
        setStatus({ type: "ready", message: "" });
      }
    }).catch((error) => {
      if (active) setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, []);

  return { data, status };
}
