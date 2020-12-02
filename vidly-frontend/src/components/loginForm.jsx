import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  //username = React.createRef();

  // componentDidMount() {
  //   this.username.current.focus();
  // }
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    //cal server & Save Changes & Redirect user to other page
    // const username = this.username.current.value;
    try {
      const { data } = this.state;
      //Jason Web Token
      await auth.login(data.username, data.password);

      const { state } = this.props.location;
      // this.props.history.push("/");
      // to full reload the Application
      window.location = state ? state.from.pathname : "/";

      console.log("Submitted");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        //console.log("errors");
        //console.log(errors);
        errors.username = ex.response.data;
        errors.password = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    //object distraction

    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handelSubmit}>
          {this.renderInput("username", "Username", true)}
          {this.renderInput("password", "Password", false, "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
