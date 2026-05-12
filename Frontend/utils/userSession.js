/**
 * Normalize Mongo ObjectId / string / { $oid } to a comparable 24-char hex (lowercase).
 */
export function normalizeMongoId(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string") {
    const s = value.trim();
    if (/^[a-fA-F0-9]{24}$/.test(s)) return s.toLowerCase();
    return s;
  }
  if (typeof value === "object" && value !== null) {
    if (typeof value.toHexString === "function") {
      return value.toHexString().toLowerCase();
    }
    if ("$oid" in value && value.$oid != null) {
      return String(value.$oid).trim().toLowerCase();
    }
  }
  const s = String(value).trim();
  if (/^[a-fA-F0-9]{24}$/.test(s)) return s.toLowerCase();
  return s;
}

/**
 * Stable key for remounting UI when the logged-in account changes.
 * Handles `id` / `_id` and rare BSON-shaped objects from APIs.
 */
export function stableUserSessionKey(user) {
  if (!user) return "";
  const raw = user.id ?? user._id;
  if (raw == null || raw === "") {
    return String(user.email || "").trim();
  }
  const hex = normalizeMongoId(raw);
  if (hex) return hex;
  if (typeof raw === "object" && raw !== null) {
    if (typeof raw.toHexString === "function") {
      return raw.toHexString();
    }
    if ("$oid" in raw) {
      return String(raw.$oid);
    }
  }
  return String(raw);
}
