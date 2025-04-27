export interface IBreadcrumbs {
  title: string;
  href: string;
}

export interface IUser {
  id: string;
  email: string;
}

export interface IGroup {
  id: string;
  name: string;
  created_at: string;
}

export interface IMessage {
  id: string;
  user_id: string;
  group_id: string;
  content: string;
  user: IUser;
  group: IGroup;
  created_at: string;
}
