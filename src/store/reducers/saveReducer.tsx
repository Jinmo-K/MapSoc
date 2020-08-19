import { AxiosResponse } from "axios";
import { SaveAction } from '../actions';
import { saveConstants } from '../../constants';

interface ISaveState {
  /** List of functions that return calls that need to be made to the server */
  queue: (() => Promise<AxiosResponse<any>>)[];
}

const initialState: ISaveState = {
  queue: []
};

export default (state = initialState, action: SaveAction): ISaveState => {
  switch(action.type) {
    case saveConstants.ADD_USER_ACTIVITY:
      return {
        ...state,
        queue: [...state.queue, action.activity]
      };

    case saveConstants.FLUSH_ACTIVITY_QUEUE:
      return {
        ...state,
        queue: []
      };

    default:
      return state;
  }
}
