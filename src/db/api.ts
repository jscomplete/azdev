import DataLoader from 'dataloader';
import pgClient from './client';

import userFromAuthToken from './operations/user-from-auth-token';

import usersInfo from './operations/users-info';
import tasksInfo from './operations/tasks-info';
import approachesInfo from './operations/approaches-info';
import tasksForUsers from './operations/tasks-for-users';
import approachLists from './operations/approach-lists';
import approachDetailLists from './operations/approach-detail-lists';
import searchResults from './operations/search-results';

import userCreate from './operations/user-create';
import userLogin from './operations/user-login';
import taskCreate from './operations/task-create';
import approachCreate from './operations/approach-create';
import approachVote from './operations/approach-vote';

const pgApiWrapper = async () => {
  const { pgPool } = await pgClient();

  const pgQuery = (text, params = {}) =>
    pgPool.query(text, Object.values(params));

  const api = (currentUser) => ({
    loaders: {
      users: new DataLoader((userIds) => usersInfo({ pgQuery })(userIds)),
      tasks: new DataLoader((taskIds) =>
        tasksInfo({ pgQuery, currentUser })(taskIds),
      ),
      approaches: new DataLoader((approachIds) =>
        approachesInfo({ pgQuery, currentUser })(approachIds),
      ),
      tasksForUsers: new DataLoader((userIds) =>
        tasksForUsers({ pgQuery })(userIds),
      ),
      approachLists: new DataLoader((taskIds) =>
        approachLists({ pgQuery })(taskIds),
      ),
      detailLists: new DataLoader((approachIds) =>
        approachDetailLists({ pgQuery })(approachIds),
      ),
      search: new DataLoader((searchTerms) =>
        searchResults({ pgQuery, currentUser })(searchTerms),
      ),
    },

    mutators: {
      userCreate: userCreate({ pgQuery }),
      userLogin: userLogin({ pgQuery }),
      taskCreate: taskCreate({ pgQuery, currentUser }),
      approachCreate: approachCreate({ pgQuery, currentUser }),
      approachVote: approachVote({ pgQuery, currentUser }),
    },
  });

  api.userFromAuthToken = userFromAuthToken({ pgQuery });

  return api;
};

export default pgApiWrapper;
