import React from 'react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

interface GetLocationQuery {
  location: {
    id: number;
    name: string;
    description: string;
    photo: string;
  } | null;
}

export const GET_LOCATION_QUERY: TypedDocumentNode<GetLocationQuery, { locationId: number }> = gql`
  query GetLocation($locationId: Int!) {
    location(id: $locationId) {
      id
      name
      description
      photo
    }
  }
`;

export function DisplayLocation({ locationId }: { locationId: number }) {
  const { loading, error, data } = useQuery(GET_LOCATION_QUERY, {
    variables: { locationId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const location = data?.location;

  return (
    <div>
      <h3>{location?.name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${location?.photo}`} />
      <br />
      <b>About this location:</b>
      <p>{location?.description}</p>
      <br />
    </div>
  );
}
