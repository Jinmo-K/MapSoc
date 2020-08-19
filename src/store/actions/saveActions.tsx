import { AxiosResponse } from 'axios';
import { saveConstants } from '../../constants';


export {
  addUserActivity,
  flushActivityQueue,
}

/* ------------------------------ Action Types ------------------------------ */

interface IAddUserActivityAction {
  type: typeof saveConstants.ADD_USER_ACTIVITY;
  activity: () => Promise<AxiosResponse<any>>;
}

interface IFlushActivityQueueAction {
  type: typeof saveConstants.FLUSH_ACTIVITY_QUEUE;
}

export type SaveAction = IAddUserActivityAction | IFlushActivityQueueAction;


/* --------------------------------- Actions -------------------------------- */

/**
 * Add a user activity to the queue of pending DB calls
 */
const addUserActivity = (activity: () => Promise<AxiosResponse<any>>): SaveAction => ({
  type: saveConstants.ADD_USER_ACTIVITY,
  activity
});

/**
 * Empty the queue of pending user activity calls
 */
const flushActivityQueue = (): SaveAction => ({
  type: saveConstants.FLUSH_ACTIVITY_QUEUE
});
