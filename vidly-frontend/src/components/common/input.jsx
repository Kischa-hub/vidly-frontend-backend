import React from "react";
const Input = ({ name, label, value, error, onChange, autoFocus, type }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        autoFocus={autoFocus}
        // ref={this.username}
        value={value}
        id={name}
        name={name}
        type={type}
        className="form-control"
        onChange={onChange}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
