const emailReg =
  /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-za-z]+$/;
const accountReg = /^[A-Za-z0-9]{6,16}$/;
const passwordReg =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$.\%\^\&\*\(\)]{6,32}$/;

export { emailReg, accountReg, passwordReg };
