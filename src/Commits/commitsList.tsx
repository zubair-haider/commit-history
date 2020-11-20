import React, { FC } from "react";
import { useQuery } from "@apollo/client";
import { Spinner } from "react-bootstrap";

import { COMMITS_QUERY } from "../Graphql/Queries";
import { CommitsData, CommitsVars } from "../Graphql/types/commitsQueryTypes";

interface propsType {
  branchName: string;
}

const CommitsComponent: FC<propsType> = ({ branchName }) => {
  const variables = {
    owner: "zubair-haider",
    name: "commit-history",
    qualifiedName: branchName,
  };
  const { data, loading: loadingData, error } = useQuery<
    CommitsData,
    CommitsVars
  >(COMMITS_QUERY, { variables });

  const timeSince = (date: string) => {
    const dateVal = new Date(date);
    const seconds = Math.floor((Date.now() - dateVal.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };

  const showMessage = (message: string, type: string) => {
    return (
      <div className={`${type} message`}>
        <span>{message}</span>
      </div>
    );
  };

  if (loadingData)
    return (
      <div className="loader">
        <Spinner animation="grow" />
      </div>
    );
  if (error) return showMessage(`Error! ${error.message}`, "error");
  if (!data || !data.repository || !data.repository.ref)
    return showMessage("No data found", "info");
  const commits = data.repository.ref.target.history.edges;

  return (
    <>
      {commits.map((commit, i) => {
        const {
          node: {
            message,
            commitUrl,
            committedDate,
            author: { avatarUrl, name },
          },
        } = commit;

        return (
          <div key={i}>
            <a href={commitUrl} target="_blank" rel="noreferrer">
              {message}
            </a>
            <img width="20" alt={name} src={avatarUrl} />
            {` ${name} committed ${timeSince(committedDate)} ago`}
          </div>
        );
      })}
    </>
  );
};

export default CommitsComponent;
