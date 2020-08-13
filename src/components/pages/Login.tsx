import React from 'react';
import { connect } from 'react-redux';

interface ILoginProps {
}

interface ILoginState {
  emailField: string,
  passwordField: string
}

class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      emailField: '',
      passwordField: ''
    };
  }

  private onFieldChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ 
      [e.currentTarget.name]: e.currentTarget.value 
    } as Pick<ILoginState, keyof ILoginState>);
  }

  private onSubmitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Attemping login: ' + this.state);
  }

  render() {
    return (
      <form className='login-form' onSubmit={this.onSubmitLogin} noValidate>
        <fieldset>
          <legend>Login</legend>

          {/* Email address */}
          <div className='form-field'>
            <label htmlFor='emailField'>Email</label>
            <input 
              type='email'
              name='emailField'
              id='emailField'
              value={this.state.emailField}
              onChange={this.onFieldChange}
            />
          </div>

          {/* Password */}
          <div className='form-field'>
            <label htmlFor='passwordField'>Password</label>
            <input 
              type='password'
              name='passwordField'
              id='passwordField'
              value={this.state.passwordField}
              onChange={this.onFieldChange}
            />
          </div>
          
          {/* Submit button */}
          <button 
            className='submit-button' 
            type='submit'
          >
            SUBMIT
          </button>

        </fieldset>
      </form>
    );
  }
}

export default Login;
