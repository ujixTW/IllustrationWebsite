export enum signUpError {
  none = 0,
  format = 1,
  duplicate = 2,
  oldWrong = 3,
  notSame = 4,
}
export type signUpResultType = {
  accError: signUpError;
  pwdError: signUpError;
  emailError: signUpError;
};
