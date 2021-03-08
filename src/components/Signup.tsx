import * as React from 'react';
import { useMutation, gql } from '@apollo/client';

import { useStore } from 'store';
import Errors from './Errors';

const USER_CREATE = gql`
  mutation userCreate($input: UserInput!) {
    userCreate(input: $input) {
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

export default function Signup() {
  const { setLocalAppState } = useStore();
  const [createUser, { error, loading }] = useMutation(USER_CREATE);
  const [uiErrors, setUIErrors] = React.useState<any>([]);

  const handleSignup = async (event) => {
    event.preventDefault();
    setUIErrors([]);
    const input = event.target.elements;
    if (input.password.value !== input.confirmPassword.value) {
      return setUIErrors([{ message: 'Password mismatch' }]);
    }
    const { data, errors: rootErrors } = await createUser({
      variables: {
        input: {
          firstName: input.firstName.value,
          lastName: input.lastName.value,
          email: input.email.value,
          username: input.username.value,
          password: input.password.value,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors, user, authToken } = data.userCreate;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    user.authToken = authToken;
    window.localStorage.setItem('azdev:user', JSON.stringify(user));
    setLocalAppState({ user, component: { name: 'Home' } });
  };

  return (
    <div className="sm-container">
      <form method="POST" onSubmit={handleSignup}>
        <div>
          <div className="form-entry">
            <label>
              FIRST NAME
              <input type="text" name="firstName" required />
            </label>
          </div>
          <div className="form-entry">
            <label>
              LAST NAME
              <input type="text" name="lastName" required />
            </label>
          </div>
          <div className="form-entry">
            <label>
              EMAIL
              <input type="email" name="email" required />
            </label>
          </div>
          <div className="form-entry">
            <label>
              USERNAME
              <input type="text" name="username" required />
            </label>
          </div>
        </div>
        <div>
          <div className="form-entry">
            <label>
              PASSWORD
              <input type="password" name="password" required />
            </label>
          </div>
          <div>
            <div className="form-entry">
              <label>
                CONFIRM PASSWORD
                <input type="password" name="confirmPassword" required />
              </label>
            </div>
          </div>
        </div>
        <Errors errors={uiErrors} />
        {error && <div className="error">{error.message}</div>}
        <div className="spaced">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}
