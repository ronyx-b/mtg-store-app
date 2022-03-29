
export function checkNullEmail(email) {
  let errors = "";
  if (!email.trim()) {
    if (errors !== "") errors += ", ";
    errors += "Email is required";
  }
  return errors;
};

export function checkNullPassword(password) {
  let errors = "";
  if (!password.trim()) {
    if (errors !== "") errors += ", ";
    errors += "Password is required";
  }
  return errors;
};

export function validateFName(fname) {
  let errors = "";
  fname = fname.toLowerCase().trim();
  let regex = new RegExp(/[^(a-z| |.|\-|')]/gi);
  let len = fname.length
  if (len === 0) {
    if (errors !== "") errors += ", ";
    errors += "First Name is required";
  } else if (len < 2) {
    if (errors !== "") errors += ", ";
    errors += "First Name needs to be at least two characters long";
  }
  if (regex.test(fname)) {
    if (errors !== "") errors += ", ";
    errors += "First Name can only have valid characters (letters or the characters \".\", \"-\", \"'\")";
  }
  return errors;
};

export function validateLName(lname) {
  let errors = "";
  lname = lname.toLowerCase().trim();
  let regex = new RegExp(/[^(a-z| |.|\-|')]/gi);
  let len = lname.length
  if (len === 0) {
    if (errors !== "") errors += ", ";
    errors += "Last Name is required";
  } else if (len < 2) {
    if (errors !== "") errors += ", ";
    errors += "Last Name needs to be at least two characters long";
  }
  if (regex.test(lname)) {
    if (errors !== "") errors += ", ";
    errors += "Last Name can only have valid characters (letters or the characters \".\", \"-\", \"'\")";
  }
  return errors;
};

export function validateEmail(email) {
  let errors = "";
  email = email.toLowerCase().trim();
  let regex = new RegExp(/[^(\w|@|.|\-)]/gi);
  let len = email.length
  let amp0 = email.indexOf('@');
  let amp1 = email.lastIndexOf('@');
  let dot = email.lastIndexOf('.');
  if (regex.test(email)) { 
    if (errors !== "") errors += ", ";
    errors += "Email can only have valid characters (a-z, 0-9, \".\", \"-\", \"_\")";
  }
  if (len > 0 && (amp0 < 2 || amp0 !== amp1 || amp1 > (len - 6) || dot < (amp1 + 3))) {
    if (errors !== "") errors += ", ";
    errors += "Email needs to be properly formatted (xx@xx.xx)";
  }
  return errors;
};

export function validateAddress(address) {
  let errors = "";
  address = address.toLowerCase().trim();
  let len = address.length
  if (len === 0) {
    if (errors !== "") errors += ", ";
    errors += "Address is required";
  } else if (len < 2) {
    if (errors !== "") errors += ", ";
    errors += "Address needs to be at least two characters long";
  }
  return errors;
};

export function validateCity(city) {
  let errors = "";
  city = city.toLowerCase().trim();
  let len = city.length
  if (len === 0) {
    errors += `${(errors !== "")?", ":""}City is required`;
  } else if (len < 2) {
    errors += `${(errors !== "")?", ":""}City needs to be at least two characters long`
  }
  return errors;
};

export function validatePostal(postal) {
  let errors = "";
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

export function validatePassword(password) {
  let errors = "";
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

export function validatePasswordConfirm(passw1, passw2) {
  let errors = "";
  if (passw1.length > 0 && passw2.length === 0) {
    errors += `${(errors !== "")?", ":""}Password needs to be confirmed`;
  } else if (passw1 !== passw2) {
    errors += `${(errors !== "")?", ":""}Passwords need to match`;
  }
  return errors;
};