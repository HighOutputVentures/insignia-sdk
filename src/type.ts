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
  type: UserEventType;
  body?: Record<string, any>;
  dateTimeCreated: Date;
};

export type User = {
  id: ID;
  username: string;
  groups?: ID[];
  details?: Record<string, any>;
  isEmailVerified: boolean;
  isVerified: boolean;
};
