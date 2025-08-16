import React from "react";

const FormInput = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  rows,
}) => {
  const isTextarea = type === "textarea";
  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-2">
        {Icon && <Icon className="h-4 w-4 inline mr-2" />}
        {label}
      </label>
      <InputComponent
        type={isTextarea ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={isTextarea ? rows : undefined}
        className={`w-full px-4 py-3 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          isTextarea ? "resize-none" : ""
        }`}
        required={required}
        maxLength={maxLength}
      />
      {maxLength && (
        <div className="text-right text-sm text-gray-400 dark:text-gray-500 mt-1">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

export default FormInput;
