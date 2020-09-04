import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '../../../store/reducers';
import { signup } from '../../../store/actions';
import { useInput } from '../../../helpers/useInput';
import { GraphBg } from '../Home/GraphBg';


interface ISignupProps extends PropsFromRedux { 
}

const SignupPage: React.FC<ISignupProps> = ({ authErrors, signup }) => {
  const {value: name, bindProps: bindName} = useInput('');
  const {value: email, bindProps: bindEmail} = useInput('');
  const {value: password, bindProps: bindPassword} = useInput('');
  const {value: password2, bindProps: bindPassword2} = useInput('');
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasBeenSubmitted(true);
    if (Object.keys(errors).length === 0) {
      let newUser = {
        name,
        email,
        password
      };
      signup(newUser);
    }
  }

  useEffect(() => {
    if (hasBeenSubmitted) {
      setErrors(errors => {
        let nextErrors = {...errors, ...authErrors};
        // Check that name is not empty
        (!name) ? nextErrors.name = 'Please enter a name' : delete nextErrors.name;
        (!email) ? nextErrors.email = 'Please enter an email' : delete nextErrors.email;
        (!password) ? nextErrors.password = 'Please enter a password' : delete nextErrors.password;
        (password !== password2) ? nextErrors.password2 = 'Passwords do not match' : delete nextErrors.password2;
        return nextErrors;
      });
    }
  }, [hasBeenSubmitted, name, email, password, password2, authErrors]);

  return (
    <main id='signup' className='auth-page main-container'>
      <GraphBg width={window.innerWidth} height={window.innerHeight} />
      <div className='auth-form-container'>
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className='form-group'>
            <label className='sr-only' htmlFor='signup-email'>Name</label>
            <input 
              className={errors.name ? 'form-input-error' : 'form-input'}
              type='text' 
              id='signup-name' 
              name='name' 
              placeholder='Name' 
              autoCapitalize='off'
              autoComplete='off'
              autoCorrect='off'
              autoFocus
              required
              {...bindName}
            />
            <div className='form-input-error-text'>
              {errors.name}
            </div>
          </div>
          {/* Email */}
          <div className='form-group'>
            <label className='sr-only' htmlFor='signup-email'>Email</label>
            <input 
              className={errors.email ? 'form-input-error' : 'form-input'}
              type='text' 
              id='signup-email' 
              name='email' 
              placeholder='Email' 
              autoCapitalize='off'
              autoComplete='off'
              autoCorrect='off'
              required
              {...bindEmail}
            />
            <div className='form-input-error-text'>
              {errors.email}
            </div>
          </div>
          {/* Password */}
          <div className='form-group'>
            <label className='sr-only' htmlFor='signup-password'>Password</label>
            <input 
              className={errors.password ? 'form-input-error' : 'form-input'}
              type='password' 
              id='signup-password' 
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
          {/* Confirm password */}
          <div className='form-group'>
            <label className='sr-only' htmlFor='signup-password2'>Confirm password</label>
            <input 
              className={errors.password2 ? 'form-input-error' : 'form-input'}
              type='password' 
              id='signup-password2' 
              name='password2' 
              placeholder='Confirm password' 
              autoComplete='off'
              required
              {...bindPassword2}
            />
            <div className='form-input-error-text'>
              {errors.password2}
            </div>
          </div>
          {/* Submit button */}
          <div className='form-group'>
            <button 
              className='form-submit' 
              type='submit' 
              disabled
              title='Not available in client demo'
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
      <div className='auth-form-container'>
        Already have an account? <Link to='/login' className='form-link'>Login</Link>
      </div>
    </main>
  )
}

const mapStateToProps = (state: RootState) => ({
  authErrors: state.auth.errors
});

const mapDispatchToProps = {
  signup
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Signup = connector(SignupPage);
