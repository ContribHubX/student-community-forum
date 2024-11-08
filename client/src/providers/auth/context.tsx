import { createContext } from "react";
import { User } from "@/types";

export interface IAuthContextState {
  user: User | undefined;
  accessToken: string | undefined;
}

export const defaultAuthContextState = {
  user: undefined,
  accessToken: undefined,
};

export enum OPERATION {
  LOGIN_USER,
  LOGOUT_USER,
}

type Actions =
  | { type: OPERATION.LOGIN_USER; payload: { user: User; accessToken: string } }
  | { type: OPERATION.LOGOUT_USER; payload: null };

export const authReducer = (
  state: IAuthContextState,
  action: Actions,
): IAuthContextState => {
  switch (action.type) {
    case OPERATION.LOGIN_USER:
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case OPERATION.LOGOUT_USER:
      return { user: undefined, accessToken: undefined };
    default:
      return state;
  }
};

export interface IAuthContextProps {
  authState: IAuthContextState;
  authDispatch: React.Dispatch<Actions>;
}

export const AuthContext = createContext<IAuthContextProps>({
  authState: defaultAuthContextState,
  authDispatch: () => {},
});

export const AuthContextProvider = AuthContext.Provider;