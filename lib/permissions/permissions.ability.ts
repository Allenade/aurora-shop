import { createMongoAbility } from "@casl/ability";
import type {
  AppAbility,
  SerializedRule,
  SessionUser,
} from "./permissions.types";

/** Build a CASL ability from the session /auth/me-shaped payload. */
export function buildAbility(me: SessionUser | null | undefined): AppAbility {
  if (!me) {
    return createMongoAbility<AppAbility>([]);
  }

  if (me.rules?.length) {
    return createMongoAbility<AppAbility>(
      me.rules as unknown as Array<SerializedRule>,
    );
  }

  const rules: SerializedRule[] = me.permissions.map((p) => ({
    action: p.action,
    subject: p.resource,
  }));

  return createMongoAbility<AppAbility>(rules);
}
