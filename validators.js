const isEmail = (email) => {
  const emailRegEx = /^([\w]*[\w\.]*(?!\.)@gmail.com)/;
  if (email?.match(emailRegEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string?.trim() === "") return true;
  else return false;
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.phone)) errors.phone = "Không được để trống!";
  if (isEmpty(data.password)) errors.password = "Không được để trống!";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Không được để trống!";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be valid email address";
  }
  if (isEmpty(data.phoneNumber)) errors.phoneNumber = "Không được để trống!";

  if (isEmpty(data.password)) errors.password = "Không được để trống!";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passowrds không giống";
  if (isEmpty(data.username)) errors.username = "Không được để trống!";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
