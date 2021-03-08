import * as React from 'react';
import { gql, useMutation } from '@apollo/client';

import { useStore } from 'store';
import Errors from './Errors';

const USER_LOGIN = gql`
  mutation userLogin($input: AuthInput!) {
    userLogin(input: $input) {
      errors {
        message
      }
      user {
        id
        username
      }
      authToken
    }
  }
`;

export default function Login() {
  const { setLocalAppState } = useStore();
  const [uiErrors, setUIErrors] = React.useState<any>([]);

  const [userLogin, { error, loading }] = useMutation(USER_LOGIN);

  const handleLogin = async (event) => {
    event.preventDefault();
    setUIErrors([]);
    const input = event.target.elements;
    const { data, errors: rootErrors } = await userLogin({
      variables: {
        input: {
          username: input.username.value,
          password: input.password.value,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors, user, authToken } = data.userLogin;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    user.authToken = authToken;
    window.localStorage.setItem('azdev:user', JSON.stringify(user));
    setLocalAppState({ user, component: { name: 'Home' } });
  };
  return (
    <div className="sm-container">
      <form method="POST" onSubmit={handleLogin}>
        <div className="form-entry">
          <label>
            USERNAME
            <input type="text" name="username" required />
          </label>
        </div>
        <div className="form-entry">
          <label>
            PASSWORD
            <input type="password" name="password" required />
          </label>
        </div>
        <Errors errors={uiErrors} />
        {error && <div className="error">{error.message}</div>}
        <div className="spaced">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
