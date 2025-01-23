import React from "react";
import { useQuery, gql } from "@apollo/client";

export const GET_LOCATION_QUERY = gql`
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

  const {
    location: { name, description, photo } = {
      name: undefined,
      description: undefined,
      photo: undefined,
    },
  } = data ?? {};

  return (
    <div>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  );
}
