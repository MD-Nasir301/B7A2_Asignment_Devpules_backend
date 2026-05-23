export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export interface ILogingInput {
  email: string;
  password: string;
}
