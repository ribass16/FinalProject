//facilita a criacao e validacao de formularios
import { useState } from 'react';


export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Valida e submete o formulario
  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await callback();
    }
  };

  return { values, errors, handleChange, handleSubmit, setValues };
};
