import React, { Component } from "react";
import Input from "./input";
import Select from "./select";
import Joi from "joi-browser";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    //because Joi terminate any other error when it found an Error
    const options = {
      abortEarly: false,
    };
    const result = Joi.validate(this.state.data, this.schema, options);
    // console.log(result);
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    console.log(errors);
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handelSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();

    console.log(errors);

    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handelChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    //e.currentTarget.name
    data[input.name] = input.value;
    this.setState({ data: data, errors });
  };
  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, autoFocus = false, type = "text") {
    const { data } = this.state;
    return (
      <Input
        type={type}
        autoFocus={autoFocus}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handelChange}
        error={this.state.errors[name]}
      />
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        label={label}
        value={data[name]}
        options={options}
        onChange={this.handelChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
