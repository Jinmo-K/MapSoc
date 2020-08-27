import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { resetUserErrors, updateUser, updateGraphSettings } from '../../../store/actions';
import { Profile, Security, Settings } from '../../../components';

interface IModalContentProps extends PropsFromRedux {
  page: string;
}

export const ModalContentHOC: React.FC<IModalContentProps> = ({ errors, graph, page, resetUserErrors, user, updateGraphSettings, updateUser }) => {
  
  if (page === 'Profile') {
    return <Profile errors={errors} resetUserErrors={resetUserErrors} user={user} updateUser={updateUser} />
  }
  else if (page === 'Security') {
    return <Security errors={errors} resetUserErrors={resetUserErrors} user={user} updateUser={updateUser} />
  }
  else {
    return <Settings graph={graph} updateGraphSettings={updateGraphSettings} />
  }
};

const mapDispatchToProps = {
  resetUserErrors,
  updateUser,
  updateGraphSettings,
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  errors: state.auth.errors,
  graph: state.graph.data,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ModalContent = connector(ModalContentHOC);
