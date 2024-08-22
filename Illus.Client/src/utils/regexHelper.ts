const emailReg =
  /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-za-z]+$/;
const accountReg = /^[A-Za-z0-9]{6,16}$/;
const passwordReg =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$.\%\^\&\*\(\)]{6,32}$/;
const guidReg =
  /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i;
export { emailReg, accountReg, passwordReg, guidReg };
