import * as React from 'react';

import { gql, useQuery } from '@apollo/client';
import { useStore } from 'store';

const SEARCH_RESULTS = gql`
  query searchResults($searchTerm: String!) {
    searchResults: search(term: $searchTerm) {
      id
      type: __typename
      content
      ... on Task {
        approachCount
      }
      ... on Approach {
        task {
          id
          content
        }
      }
    }
  }
`;

function SearchResults({ searchTerm }) {
  const { AppLink } = useStore();
  const { error, loading, data } = useQuery(SEARCH_RESULTS, {
    variables: { searchTerm },
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">{loading}</div>;
  }

  return (
    <div>
      {data.searchResults && (
        <div>
          <h2>Search Results</h2>
          <div className="y-spaced">
            {data.searchResults.length === 0 && (
              <div className="box box-primary">No results</div>
            )}
            {data.searchResults.map((item, index) => (
              <div key={index} className="box box-primary">
                <AppLink
                  to="TaskPage"
                  taskId={item.type === 'Approach' ? item.task.id : item.id}
                >
                  <span className="search-label">{item.type}</span>{' '}
                  {item.content.substr(0, 250)}
                </AppLink>
                <div className="search-sub-line">
                  {item.type === 'Task'
                    ? `Approaches: ${item.approachCount}`
                    : `Task: ${item.task.content.substr(0, 250)}`}
                </div>
              </div>
            ))}
          </div>
          <AppLink to="Home">{'<'} Home</AppLink>
        </div>
      )}
    </div>
  );
}

export default function Search({ searchTerm = null }) {
  const { setLocalAppState } = useStore();

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const term = event.target.search.value;
    setLocalAppState({
      component: { name: 'Search', props: { searchTerm: term } },
    });
  };

  return (
    <div className="search-form">
      <div className="m-5">
        <form method="post" onSubmit={handleSearchSubmit}>
          <div className="center">
            <input
              type="search"
              name="search"
              placeholder="Search all tasks and approaches"
              autoComplete="off"
              defaultValue={searchTerm}
              required
            />
          </div>
        </form>
      </div>
      {searchTerm && <SearchResults searchTerm={searchTerm} />}
    </div>
  );
}
