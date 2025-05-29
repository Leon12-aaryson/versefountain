export const APP_NAME = "VerseFountain";
export const API_BASE_URL =
    typeof window !== "undefined" &&
    (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
        ? "http://127.0.0.1:8001"
        : "https://api.versefountain.com";
export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de"];
export const ITEMS_PER_PAGE = 20;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;