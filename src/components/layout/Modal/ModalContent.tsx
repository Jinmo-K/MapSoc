import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { resetUserErrors, updateUser } from '../../../store/actions';
import { Profile, Security, Settings } from '../../../components';

interface IModalContentProps extends PropsFromRedux {
  page: string;
}

export const ModalContentHOC: React.FC<IModalContentProps> = ({ page, ...props }) => {
  
  if (page === 'Profile') {
    return <Profile {...props} />
  }
  else if (page === 'Security') {
    return <Security {...props} />
  }
  else {
    return <Settings />
  }
};

const mapDispatchToProps = {
  resetUserErrors,
  updateUser,
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  errors: state.auth.errors,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ModalContent = connector(ModalContentHOC);
