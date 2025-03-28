
export namespace AuthSignin {

  export interface Request {
    username: string;
    password: string;
  }

  export interface Response {
    isAuthenticated: boolean;
    id: string;
    username: string;
  }
}

export namespace AuthRegister {
  export interface Request {
    username: string;
    password: string;
  }

  export interface Response {
    isAuthenticated: boolean;
    id: string;
    username: string;
  }
}


export namespace GetMe {
  export interface Request {
  }

  export interface Response {
    isAuthenticated: boolean;
    user: {
      id: string;
      username: string;
    }
  }
}
