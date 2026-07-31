import type { MongoAbility, MongoQuery, ForcedSubject } from "@casl/ability";

export const Action = {
  READ: "read",
  LIST: "list",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
} as const;

export type ActionType = (typeof Action)[keyof typeof Action] | string;

export const Resource = {
  ALL: "all",
  DASHBOARD: "dashboard",
  OVERVIEW: "overview",
  SHOP: "shop",
  PRODUCT: "product",
  INVENTORY: "inventory",
  ORDER: "order",
  TRACK_ORDER: "track_order",
  PROCUREMENT: "procurement",
  QUOTE: "quote",
  SETTINGS: "settings",
  USER: "user",
} as const;

export type ResourceType = (typeof Resource)[keyof typeof Resource] | string;

export type UserType = "buyer" | "procurement" | "admin" | "vendor";

export type AppRole = {
  id: string;
  name: string;
};

export type AppPermission = {
  action: ActionType;
  resource: ResourceType;
};

export type SerializedRule = {
  action: ActionType | ActionType[];
  subject: ResourceType | ResourceType[];
  conditions?: Record<string, unknown>;
  inverted?: boolean;
};

export type AppAbility = MongoAbility<
  [ActionType, ResourceType | ForcedSubject<ResourceType>],
  MongoQuery
>;

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: UserType;
  roles: AppRole[];
  permissions: AppPermission[];
  rules: SerializedRule[];
};

export type PermissionRequirement = {
  action?: ActionType;
  resource?: ResourceType;
  role?: string;
  roles?: string[];
  userType?: UserType;
};
