const mongoose = require('mongoose');

function jwtUserIdString(reqUser) {
  return String(reqUser.userId);
}

/**
 * Trip belongs to this JWT user, or is a legacy doc (no userId) and this user is the configured legacy owner.
 * Set MIGRATE_LEGACY_TRIPS_USER_ID in Railway to your MongoDB user _id (hex string) so that account still sees old trips until you run a DB migration.
 */
function tripOwnedByUser(trip, reqUser) {
  if (!trip) return false;
  const uid = jwtUserIdString(reqUser);
  if (trip.userId != null && trip.userId !== undefined && String(trip.userId) !== '') {
    return String(trip.userId) === uid;
  }
  const legacy = process.env.MIGRATE_LEGACY_TRIPS_USER_ID;
  return !!(legacy && uid === String(legacy).trim());
}

/** Mongo query: trips visible to this user (handles ObjectId vs string userId in DB). */
function buildTripOwnerQuery(reqUser) {
  const uidStr = jwtUserIdString(reqUser);
  const clauses = [{ userId: reqUser.userId }, { userId: uidStr }];
  const oid = mongoose.Types.ObjectId.isValid(uidStr)
    ? new mongoose.Types.ObjectId(uidStr)
    : null;
  if (oid) {
    clauses.push({ userId: oid });
    clauses.push({ userId: String(oid) });
  }
  const legacy = process.env.MIGRATE_LEGACY_TRIPS_USER_ID;
  if (legacy && uidStr === String(legacy).trim()) {
    clauses.push({ userId: null });
    clauses.push({ userId: { $exists: false } });
  }
  return { $or: clauses };
}

function ownerObjectIdForCreate(reqUser) {
  const uidStr = jwtUserIdString(reqUser);
  if (mongoose.Types.ObjectId.isValid(uidStr)) {
    return new mongoose.Types.ObjectId(uidStr);
  }
  return reqUser.userId;
}

module.exports = {
  tripOwnedByUser,
  buildTripOwnerQuery,
  ownerObjectIdForCreate,
};
