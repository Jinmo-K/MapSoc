import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '../../../store/reducers';
import { login } from '../../../store/actions';
import { useInput } from '../../../helpers/useInput';

import './Login.css';
import { GraphBg } from '../Home/GraphBg';

interface ILoginProps extends PropsFromRedux {
}

const LoginPage: React.FC<ILoginProps> = ({ login }) => {
  const {value: email, bindProps: bindEmail} = useInput('');
  const {value: password, bindProps: bindPassword} = useInput('');
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasBeenSubmitted(true);
    if (Object.keys(errors).length === 0) {
      login(email, password);
    }
  };

  useEffect(() => {
    if (hasBeenSubmitted) {
      setErrors(errors => {
        let nextErrors = {...errors};
        (!email) ? nextErrors.email = 'Please enter an email' : delete nextErrors.email;
        (!password) ? nextErrors.password = 'Please enter a password' : delete nextErrors.password;
        return nextErrors;
      })
    }
  }, [hasBeenSubmitted, email, password]);

  return (
    <main id='login' className='auth-page main-container'>
      <GraphBg width={window.innerWidth} height={window.innerHeight} />
      <div className='auth-form-container'>
        <h1>Login to continue</h1>
        <form onSubmit={handleFormSubmit} noValidate>
          <div className='form-group'>
            <label className='sr-only' htmlFor='login-email'>Email</label>
            <input 
              className={errors.email ? 'form-input-error' : 'form-input'}
              type='text' 
              id='login-email' 
              name='email' 
              placeholder='Email' 
              autoCapitalize='off'
              autoComplete='off'
              autoCorrect='off'
              autoFocus
              {...bindEmail}
            />
            <div className='form-input-error-text'>
              {errors.email}
            </div>
          </div>
          <div className='form-group'>
            <label className='sr-only' htmlFor='login-password'>Password</label>
            <input 
              className={errors.password ? 'form-input-error' : 'form-input'}
              type='password' 
              id='login-password' 
              name='password' 
              placeholder='Password' 
              autoComplete='off'
              required
              {...bindPassword}
            />
            <div className='form-input-error-text'>
              {errors.password}
            </div>
          </div>
          <div className='form-group'>
            <button 
              className='form-submit' 
              type='submit'
              disabled={!(email && password) || Object.keys(errors).length > 0}
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
      <div className='auth-form-container'>
        Don't have an account? <Link to='/signup' className='form-link'>Sign up</Link>
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Login = connector(LoginPage);
