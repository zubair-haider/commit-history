import React, { FC } from "react";

import CommitsList from "./commitsList";

const branchName = "main";
const repoLink = "https://github.com/zubair-haider/commit-history";
const mainHeading = "Git commit history of branch ";

const CommitsPage: FC = () => {
  return (
    <>
      <header className="app-header">
        <h1>
          {mainHeading}
          <a href={repoLink} target="_blank" rel="noreferrer">
            {branchName}
          </a>
        </h1>
      </header>
      <CommitsList branchName={branchName} />
    </>
  );
};

export default CommitsPage;
