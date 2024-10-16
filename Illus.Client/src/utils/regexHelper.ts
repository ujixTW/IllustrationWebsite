const emailReg =
  /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-za-z]+$/;
const accountReg = /^[A-Za-z0-9]{6,16}$/;
const passwordReg =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$.\%\^\&\*\(\)]{6,32}$/;
const guidReg =
  /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i;

const htmlReg = /<\/?.+?>/gi;

const dateReg = /^[0-9]{4}[\s\.\/\:]+[0-9]{1,2}[\s\.\/\:]+[0-9]{1,2}$/g;
const timeReg = /^[0-9]{1,2}[\s\.\/\:]+[0-9]{1,2}$/g;
export {
  emailReg,
  accountReg,
  passwordReg,
  guidReg,
  htmlReg,
  dateReg,
  timeReg,
};
