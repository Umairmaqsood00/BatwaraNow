import Constants from "expo-constants";

const TAG = "[BatwaraNow]";

/**
 * Base API URL for production APK / web.
 * Override via EXPO_PUBLIC_API_URL or expo.extra.apiUrl (see app.json).
 */
export function getApiBaseUrl() {
  const fromEnv =
    typeof process !== "undefined" ? process.env.EXPO_PUBLIC_API_URL : undefined;
  const fromExtra = Constants.expoConfig?.extra?.apiUrl;
  const fallback = "https://batwaranow.up.railway.app/api";
  const raw = String(fromEnv || fromExtra || fallback).trim();
  return raw.replace(/\/$/, "");
}

export const API_URL = getApiBaseUrl();

console.log(`${TAG} API_URL resolved to ${API_URL}`);

const DEFAULT_TIMEOUT_MS = 25000;

export async function fetchWithTimeout(
  url,
  options = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    console.log(`${TAG} fetch → ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    console.log(
      `${TAG} fetch ← ${response.status} ${url} (${Date.now() - started}ms)`,
    );
    return response;
  } catch (error) {
    const msg =
      error?.name === "AbortError"
        ? `timeout after ${timeoutMs}ms`
        : error?.message || String(error);
    console.warn(`${TAG} fetch failed ${url}: ${msg}`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function parseJsonResponse(response, urlForLog) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    console.warn(
      `${TAG} invalid JSON from ${urlForLog}`,
      text?.slice?.(0, 300),
    );
    throw new Error(`Invalid JSON response from ${urlForLog}`);
  }
}
