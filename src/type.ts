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

export type UserEvent = {
  id: ID;
  application: ID;
  dateTimeCreated: Date;
} & (
  | {
    type: UserEventType.UserCreated;
    body: User & { credentials: { password: string } };
  }
  | { type: UserEventType.UserUpdated; body: Partial<Omit<User, 'id'>> }
  | { type: UserEventType.UserDeleted }
);

export type User = {
  id: ID;
  username: string;
  groups?: ID[];
  details?: Record<string, any>;
  isEmailVerified: boolean;
  isVerified: boolean;
};
