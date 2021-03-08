import * as React from 'react';

import { useStore } from 'store';
import * as mainComponents from './index';
import Navbar from './Navbar';

export default function Root() {
  const { useLocalAppState } = useStore();

  const [component, user] = useLocalAppState('component', 'user');
  const Component = mainComponents[component.name];

  return (
    <div id="root-container">
      <Navbar user={user} />
      <div className="main-container">
        <Component {...component.props} />
      </div>
    </div>
  );
}
