import { useState } from "react";
import supabase from "../../supabase/supabase-client"
import {
  ConfirmSchema,
  getErrors,
  getFieldError,
} from '../../lib/validationForm';
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const { error, data } = ConfirmSchema.safeParse(formState);    
    console.log(data);
    
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      console.log(errors);
    } else {
      let { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data : {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username 
          }
        }
      });
      if (error) {
        alert("Signing up error!");
      } else {
        alert("Signed up!")
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/")
      }
    }
  };

  const onBlur = (property) => () => {
    const value = formState[property];
    if (!value) {
      setFormErrors((prev) => ({ ...prev, [property]: undefined }));
      setTouchedFields((prev) => ({ ...prev, [property]: false }));
      return;
    }
  const message = getFieldError(FormSchema, property, value);
    setFormErrors((prev) => ({ ...prev, [property]: message }));
    setTouchedFields((prev) => ({ ...prev, [property]: true }));
  };

  const isInvalid = (property) => {
    if (formSubmitted || touchedFields[property]) {
      return !!formErrors[property];
    }
    return undefined;
  };

  const setField = (property, valueSelector) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: valueSelector ? valueSelector(e) : e.target.value,
    }));
  };

  const floatingLabel = (id, label, type = "text") => (
    <label className="form-control w-full floating-label relative">
      <span className="label-text">{label}</span>
      <input
        placeholder={label}
        className={`input input-md input-bordered w-full ${isInvalid(id) && "input-error"} pr-12`}
        type={type}
        id={id}
        name={id}
        value={formState[id]}
        onChange={setField(id)}
        onBlur={onBlur(id)}
        aria-invalid={isInvalid(id)}
        autoComplete={id === "password" ? "new-password" : "on"}
        required
      />
      {(touchedFields[id] || formSubmitted) && formErrors[id] && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 tooltip tooltip-left z-20" data-tip={formErrors[id]}>
          <div className="badge badge-error text-xs cursor-help">!</div>
        </div>
      )}
    </label>
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-full max-w-md shadow-xl bg-base-200">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            {floatingLabel("email", "Email", "email")}
            {floatingLabel("firstName", "First Name")}
            {floatingLabel("lastName", "Last Name")}
            {floatingLabel("username", "Username")}
            {floatingLabel("password", "Password", "password")}

            <button type="submit" className="btn w-full btnSpecial">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
