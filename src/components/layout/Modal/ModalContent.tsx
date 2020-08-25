import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { updateUser } from '../../../store/actions';
import { Profile, Security, Settings } from '../../../components';

interface IModalContentProps extends PropsFromRedux {
  page: string;
}

export const ModalContentHOC: React.FC<IModalContentProps> = ({ page, user }) => {
  const components: Record<string, React.FC<any>> = {
    Profile,
    Security,
    Settings
  };
  const Component = components[page];

  return (
      <div className='modal-content'>
        <Component user={user} />
      </div>
  );
};

const mapDispatchToProps = {
  updateUser,
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ModalContent = connector(ModalContentHOC);
