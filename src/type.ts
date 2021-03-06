/* eslint-disable @typescript-eslint/no-explicit-any */
export type ID = string;

export type ApplicationConfig = {
  appId: ID;
  appKey: string;
};

export enum UserEventType {
  UserCreated = 'UserCreated',
  UserUpdated = 'UserUpdated',
  UserDeleted = 'UserDeleted',
}

export type ConnectionEdge<TNode = any> = {
  edges: { node: TNode; cursor: Buffer }[];
  endCursor?: Buffer | null;
  totalCount: number;
};

export type UserEvent = {
  id: ID;
  user: ID;
  externalId?: ID;
  application: ID;
  dateTimeCreated: Date;
  cursor: string;
} & (
  | {
      type: UserEventType.UserCreated;
      body: User & { credentials: { password: string } };
    }
  | {
      type: UserEventType.UserUpdated;
      body: Partial<Omit<User, 'id'> & { credentials: { password: string } }>;
    }
  | { type: UserEventType.UserDeleted }
);

export type User = {
  id: ID;
  externalId?: ID;
  username: string;
  groups?: ID[];
  details?: Record<string, any>;
  isEmailVerified: boolean;
  isVerified: boolean;
};

export type TokenClaims = {
  id: string;
  externalId?: string;
  iat: number;
  exp: number;
  sub: string;
};

export type BitCloutUserDetails = {
  accessLevel: number;
  accessLevelHmac: string;
  btcDepositAddress: string;
  encryptedSeedHex: string;
  hasExtraText: boolean;
  network: string;
  publicKey: string;
};
