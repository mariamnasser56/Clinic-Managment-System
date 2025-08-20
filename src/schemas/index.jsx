// import * as yup from "yup";

// export const loginSchema = yup.object().shape({
//   email: yup.string().email("Invalid email address").required("Required"),
//   password: yup
//     .string()
//     .min(8)
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[a-z]/, "Must contain at least one lowercase letter")
//     .matches(/[0-9]/, "Must contain at least one digit")
//     .matches(/[!@#$%^&*_]/, "Must contain at least one special character")
//     .required("Required")
// });

// export const registerSchema = yup.object().shape({
//   fullName: yup.string().required("Required"),
//   birthDate: yup.date().required("Required"),
//   gender: yup.string().required("Required"),
//   email: yup.string().email("Invalid email address").required("Required"),
//   password: yup
//     .string()
//     .min(8)
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[a-z]/, "Must contain at least one lowercase letter")
//     .matches(/[0-9]/, "Must contain at least one digit")
//     .matches(/[!@#$%^&*_]/, "Must contain at least one special character")
//     .required("Required"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("password"), null], "Passwords must match")
//     .required("Required")
// });
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup
    .string()
    .min(8)
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[!@#$%^&*_]/, "Must contain at least one special character")
    .required("Required"),
});

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Name is required")
    .test(
      "not-empty",
      "Name must not be only spaces",
      (value) => value && value.trim().length > 0
    )
    .test(
      "min-length",
      "Name must be at least 3 characters",
      (value) => value && value.trim().length >= 3
    )
    .test(
      "no-symbols",
      "Name must contain only letters and spaces",
      (value) => {
        if (!value) return false;
        const lettersRegex = /^[\p{L}\s]+$/u;
        return lettersRegex.test(value.trim());
      }
    ),

  birthDate: yup
    .date()
    .required("Required")
    .max(new Date(), "Please enter a valid birth date"),

  gender: yup.string().required("Required"),

  email: yup.string().email("Invalid email address").required("Required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[!@#$%^&*_]/, "Must contain at least one special character")
    .required("Required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
