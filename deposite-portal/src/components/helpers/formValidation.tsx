import { useState } from 'react';

export const formValidate = (values: any, errorMessage: any) => {
  const errors: any = {};
  errorMessage.forEach((element: { required: any; key: string; value: any }) => {
    if (element.required && !values[element.key]) {
      errors[element.key] = element.value;
    }
  });
  return errors;
};
interface Validation {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: string;
    message: string;
  };
  custom?: {
    isValid: (value: string) => boolean;
    message: string;
  };
}
export const useForm = (options: { validations?: any; onSubmit: any; initialValues: any }) => {
  const [data, setData] = useState(options?.initialValues || {});
  const [errors, setErrors] = useState<any>({});
  const handleChange = async (key: string, value: any) => {
    if (!value || !(value === '')) {
      let selectedTypes = errors;
      for (let selectedType in selectedTypes) {
        if (selectedType.indexOf(key) !== -1) {
          delete selectedTypes[selectedType];
        }
      }
      setErrors({ ...selectedTypes });
    }

    setData({
      ...data,
      [key]: value
    });
  };

  const handleSubmit = async () => {
    const validations = options?.validations;
    if (validations) {
      let valid = true;
      const newErrors: any = {};
      for (const key in validations) {
        const value = data[key];
        const validation = validations[key];
        if (validation?.required?.value && (!value || value === '' || value === 'null')) {
          valid = false;
          newErrors[key] = validation?.required?.message;
        }
        const pattern = validation?.pattern;
        if (pattern?.value && !RegExp(pattern.value).test(value) && value !== '') {
          valid = false;
          newErrors[key] = pattern.message;
        }

        const custom = validation?.custom;
        if (!newErrors[key] && custom?.isValid && !custom.isValid(value) && value !== '') {
          valid = false;
          newErrors[key] = custom.message;
        }
      }

      if (!valid) {
        setErrors(newErrors);
        setTimeout(() => window.scrollTo(0, document.getElementsByClassName('error')[0]?.offsetTop - 200));
        return;
      }
    }

    setErrors({});

    if (options?.onSubmit) {
      options.onSubmit();
    }
  };

  return {
    data,
    handleChange,
    handleSubmit,
    errors
  };
};
