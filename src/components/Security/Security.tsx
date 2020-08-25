import React, { useEffect, useState } from 'react';
import { useInput } from '../../helpers/useInput';
import { IUser } from '../../types';


export interface ISecurityProps {
  errors: Record<string, string>;
  user: IUser;
  resetUserErrors: () => void;
  updateUser: (userId: number, values: Record<string, string>) => void;
}

export const Security: React.FC<ISecurityProps> = ({ errors, resetUserErrors, user, updateUser }) => {
  const {value: currPassword, bindProps: bindCurrPassword} = useInput('');
  const {value: newPassword, bindProps: bindNewPassword} = useInput('');
  const {value: newPassword2, bindProps: bindNewPassword2} = useInput('');
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      updateUser(user.id!, {currPassword, newPassword});
    }
  };

  useEffect(() => {
    setShowSubmit(!!currPassword && !!newPassword && !!newPassword2 && newPassword === newPassword2);
  }, [currPassword, newPassword, newPassword2]);

  useEffect(() => {
    return () => resetUserErrors();
  }, []);

  return (
    <section className='security'>
      <h1>Security</h1>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Change Password</h2>
        {/* Old password */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='currPassword'>Current</label>
          <div>
            <input 
              type='password'
              id='currPassword'
              className='form-input'
              {...bindCurrPassword}
            />
            <div className='form-input-error-text'>
              {errors.currPassword}
            </div>
          </div>
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
              {(newPassword !== newPassword2) ? 'Passwords do not match' : ''}
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
