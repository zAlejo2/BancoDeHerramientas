import { useContext, useEffect, useState } from "react";
import { MantenContext } from "../../../Context";

export const SelectChecklist = ({ label, name, value, options, onChange }) => {
  const { inputs, setInputs } = useContext(MantenContext);
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(inputs[name] || '');
  }, [inputs, name]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: newValue,
    }));
    setInternalValue(newValue);
    if (onChange) onChange(e); 
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-neutral-500 mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="px-4 py-2 bg-white placeholder:text-neutral-400/60
        border border-neutral-300/75 focus:border-[#1565c0] focus:ring-[#1565c0]
        focus:ring-1 focus:outline-none rounded-lg w-full"
        value={internalValue}
        onChange={handleChange}
        required
        >
                <option value='' disabled>Seleccione una opción</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
