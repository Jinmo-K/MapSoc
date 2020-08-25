import React, { useEffect, useState } from 'react';
import { IUser } from '../../types';
import { useInput } from '../../helpers/useInput';

import './Profile.css';

export interface IProfileProps {
  errors: Record<string, string>;
  resetUserErrors: () => void;
  user: IUser;
  updateUser: (userId: number, values: Record<string, string>) => void;
}

export const Profile: React.FC<IProfileProps> = ({ errors, resetUserErrors, updateUser, user }) => {
  const {value: name, bindProps: bindName} = useInput(user.name);
  const {value: email, bindProps: bindEmail} = useInput(user.email);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      updateUser(user.id!, { name, email });
    }
  };

  useEffect(() => {
    setShowSubmit(!!name && !!email && (name !== user.name || email !== user.email));
  }, [name, email]);

  useEffect(() => {
    return () => resetUserErrors();
  }, [])

  return (
    <section className='profile'>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} noValidate>

        {/* Name */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='name'>Name</label>
          <input 
            type='text'
            id='name'
            className='form-input'
            {...bindName}
          />
        </div>

        {/* Email */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='email'>Email</label>
          <div>
            <input 
              type='email'
              id='email'
              className='form-input'
              {...bindEmail}
            />
            <div className='form-input-error-text'>
              {errors.email}
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
