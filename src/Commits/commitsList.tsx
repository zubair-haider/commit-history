import React, { FC } from "react";
import { useQuery } from "@apollo/client";
import { Table, Spinner } from "react-bootstrap";

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
		<Table striped hover variant="dark" responsive>
			<thead>
				<tr>
					<th>Commit Message</th>
					<th>Link</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody>
				{commits.map((commit, i) => {
					const {
						node: { message, commitUrl, committedDate },
					} = commit;

					const date = new Date(committedDate);

					return (
						<tr key={i}>
							<td>{message}</td>
							<td>
								<a
									className="app-link"
									href={commitUrl}
									target="_blank"
									rel="noreferrer"
								>
									Commit link
								</a>
							</td>
							<td>{date.toLocaleString()}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default CommitsComponent;
