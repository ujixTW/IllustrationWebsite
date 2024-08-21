export enum signUpError {
  none = 0,
  format = 1,
  duplicate = 2,
}
export type signUpResultType = {
  accError: signUpError;
  pwdError: signUpError;
  emailError: signUpError;
};
