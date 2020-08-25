import React, { useEffect, useState } from 'react';
import { useInput } from '../../helpers/useInput';


export interface ISecurityProps {

}

export const Security: React.FC<ISecurityProps> = ({}) => {
  const {value: currPassword, bindProps: bindCurrPassword} = useInput('');
  const {value: newPassword, bindProps: bindNewPassword} = useInput('');
  const {value: newPassword2, bindProps: bindNewPassword2} = useInput('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string>);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  useEffect(() => {
    setShowSubmit(!!currPassword && !!newPassword && !!newPassword2 && newPassword === newPassword2);
    setErrors(errors => {
      let nextErrors = {...errors};
      (newPassword !== newPassword2) ? nextErrors.newPassword2 = 'Passwords do not match' : delete nextErrors.newPassword2;
      return nextErrors;
    });
  }, [currPassword, newPassword, newPassword2]);

  return (
    <section className='security'>
      <h1>Security</h1>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Change Password</h2>
        {/* Old password */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='currPassword'>Current</label>
          <input 
            type='password'
            id='currPassword'
            className='form-input'
            {...bindCurrPassword}
          />
        </div>

        {/* New password */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='newPassword'>New</label>
          <input 
            type='password'
            id='newPassword'
            className='form-input'
            {...bindNewPassword}
          />
        </div>

        {/* Confirm password */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='newPassword2'>Re-type new</label>
          <div>
            <input 
              type='password'
              id='newPassword2'
              className='form-input'
              {...bindNewPassword2}
            />
            <div className='form-input-error-text'>
              {errors.newPassword2}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className='form-group form-group-submit'>
          <button type='submit' className='form-submit' disabled={!showSubmit}>
            Update
          </button>
        </div>
      </form>
    </section>
  );
};
