export interface IBreadcrumbs {
  title: string;
  href: string;
}

export interface IUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

export interface IGroup {
  id: string;
  name: string;
  created_at: string;
}

export interface IMessage {
  id: number;
  group_id: number;
  content: string;
  user_id: string;
  user_email: string;
  user_created_at: string;
}
