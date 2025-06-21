import z from "zod";

const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
const passwordError =
  "Password must contain at least one uppercase letter, one lowercase letter, and one number.";

export const FormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(8).regex(passwordRegex, passwordError),
});

export const FormSchemaLogin = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "La password è obbligatoria"),
})

export const ConfirmSchema = FormSchema.refine((data) => data);

export function getFieldError(schema, property, value) {
  const { error } = z
    .object({ [property]: schema.shape[property] })
    .safeParse({ [property]: value });
  return error ? error.issues[0].message : undefined;
}

export const getErrors = (error) =>
  error.issues.reduce((all, issue) => {
    const path = issue.path.join("");
    const message = all[path] ? all[path] + ", " : "";
    all[path] = message + issue.message;
    return all;
  });