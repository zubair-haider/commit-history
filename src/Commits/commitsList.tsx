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
	const { data, loading, error } = useQuery<CommitsData, CommitsVars>(
		COMMITS_QUERY,
		{ variables }
	);

	const showMessage = (message: string) => {
		return <div>{message}</div>;
	};

	if (loading) return <Spinner animation="border" />;
	if (error) return showMessage(`Error! ${error.message}`);
	if (!data || !data.repository) return showMessage("No Data");
	const commits = data.repository.ref.target.history.edges;

	return (
		<Table striped bordered={true} hover variant="dark" responsive>
			<thead>
				<tr>
					<th>Message</th>
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
									className="App-link"
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
