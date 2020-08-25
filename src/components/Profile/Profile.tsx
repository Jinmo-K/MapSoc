import React, { useEffect, useState } from 'react';
import { IUser } from '../../types';
import { useInput } from '../../helpers/useInput';

import './Profile.css';

export interface IProfileProps {
  user: IUser;
}

export const Profile: React.FC<IProfileProps> = ({ user }) => {
  const {value: name, bindProps: bindName} = useInput(user.name);
  const {value: email, bindProps: bindEmail} = useInput(user.email);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    setShowSubmit(!!name && !!email && (name !== user.name || email !== user.email));
  }, [name, email])

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
            placeholder='Name'
            {...bindName}
          />
        </div>

        {/* Email */}
        <div className='form-group form-col-wrapper'>
          <label className='form-label' htmlFor='email'>Email</label>
          <input 
            type='email'
            id='email'
            className='form-input'
            placeholder='Email'
            {...bindEmail}
          />
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
