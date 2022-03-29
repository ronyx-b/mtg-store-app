
export function validateName(name, errors) {
  console.log(errors);
  name = name.toLowerCase().trim();
  let regex = new RegExp(/[^(a-z| |.|\-|')]/gi);
  if (regex.test(name)) {
    errors += (errors !== "")?", ":"";
    errors += `Name can only have valid characters (letters or the characters ".", "-", " ' ")`;
  }
  return errors;
};

export function validateEmail(email, errors) {
  email = email.toLowerCase().trim();
  let regex = new RegExp(/[^(\w|@|.|\-)]/gi);
  let len = email.length
  let amp0 = email.indexOf('@');
  let amp1 = email.lastIndexOf('@');
  let dot = email.lastIndexOf('.');
  if (regex.test(email)) { 
    errors += (errors !== "")?", ":"";
    errors += "Email can only have valid characters (a-z, 0-9, \".\", \"-\", \"_\")";
  }
  if (len > 0 && (amp0 < 2 || amp0 !== amp1 || amp1 > (len - 6) || dot < (amp1 + 3))) {
    errors += (errors !== "")?", ":"";
    errors += "Email needs to be properly formatted (xx@xx.xx)";
  }
  return errors;
};

export function validatePostal(postal, errors) {
  postal = postal.toLowerCase().trim();
  let len = postal.length;
  let regex = new RegExp(/^[a-z]\d[a-z][ -]?\d[a-z]\d$/);
  if (len === 0) {
    errors += `${(errors !== "")?", ":""}Postal Code is required`;
  } else if (!regex.test(postal)) { 
    errors += `${(errors !== "")?", ":""}Postal Code needs to follow the format X0X 0X0`;
  }
  return errors;
};

export function validatePassword(password, errors) {
  let regex = new RegExp(/[^(\w|.|-|+|@|#|$|%|&|*|!|?)]/gi);
  let len = password.length
  if (len > 0 && len < 6) {
    errors += `${(errors !== "")?", ":""}Password needs to be at least six characters long`;
  }
  if (regex.test(password)) {
    errors += `${(errors !== "")?", ":""}Password can only have valid characters (letters, numbers, or special characters [._-+@#$%&*!?])`;
  }
  return errors;
};

export function validatePasswordConfirm(passw1, passw2, errors) {
  if (passw1.length > 0 && passw2.length === 0) {
    errors += `${(errors !== "")?", ":""}Password needs to be confirmed`;
  } else if (passw1 !== passw2) {
    errors += `${(errors !== "")?", ":""}Passwords need to match`;
  }
  return errors;
};

export function validateMinMaxLength(value, name, errors, min, max) {
  if (value.length === 0) {
    errors += `${(errors !== "")?", ":""}${name} must not be empty`;
  } else  if (value.length < min) {
    errors += `${(errors !== "")?", ":""}${name} must be at least ${min} characters long`;
  } else if (max !== undefined && value.length > max) {
    errors += `${(errors !== "")?", ":""}${name} must be less than ${max} characters long`;
  }
  return errors;
}