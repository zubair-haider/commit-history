import React, { FC } from "react";
import { useQuery } from "@apollo/client";
import {
  Spinner,
  Row,
  Col,
  Button,
  Container,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import { COMMITS_QUERY } from "../Graphql/Queries";
import {
  CommitsData,
  CommitsVars,
  node,
} from "../Graphql/types/commitsQueryTypes";

const owner = "zubair-haider";
const repoName = "commit-history";
const repoUrl = `https://github.com/${owner}/${repoName}/`;
const authorUrl = `${repoUrl}commits?author=${owner}`;

interface propsType {
  branchName: string;
}

const CommitsComponent: FC<propsType> = ({ branchName }) => {
  const { data, loading: loadingData, error } = useQuery<
    CommitsData,
    CommitsVars
  >(COMMITS_QUERY, {
    variables: {
      owner,
      name: repoName,
      qualifiedName: branchName,
    },
  });

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
      return Math.floor(interval + 1) + " days";
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

  const groups = commits.reduce((group, commit) => {
    const node = commit.node;
    let dateVal = new Date(node.committedDate);
    const date = dateVal.toLocaleDateString();
    group[date] = group[date] || [];
    group[date].push(node);
    return group;
  }, Object.create(null));

  return (
    <>
      {Object.keys(groups).map((key) => {
        const commits: node[] = groups[key];

        return (
          <>
            <Container className="date-container">
              <ul>
                <li>Commits on {key}</li>
              </ul>
            </Container>

            <Container>
              {commits.map((commit) => {
                const {
                  message,
                  commitUrl,
                  committedDate,
                  oid,
                  author: { avatarUrl, name },
                } = commit;
                const browseRepoUrl = `${repoUrl}tree/${oid}`;

                return (
                  <Row key={oid} className="single-row">
                    <Col md={9}>
                      <a
                        className="app-link"
                        href={commitUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {message}
                      </a>
                      <img width="20" alt={name} src={avatarUrl} />

                      <a
                        className="profile-link"
                        href={authorUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {owner}
                      </a>
                      <span className="commit-since profile-link">
                        {" "}
                        {` committed ${timeSince(committedDate)} ago`}
                      </span>
                    </Col>
                    <Col md={3} className="last-col">
                      <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => (
                          <Tooltip id="button-tooltip" {...props}>
                            Browse the repository at this point in the history
                          </Tooltip>
                        )}
                      >
                        <Button
                          className="code-btn"
                          variant="light"
                          href={browseRepoUrl}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            version="1.1"
                            width="16"
                            height="16"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"
                            ></path>
                          </svg>{" "}
                        </Button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                );
              })}
            </Container>
          </>
        );
      })}
    </>
  );
};

export default CommitsComponent;
