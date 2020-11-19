import React, { FC } from "react";
import { Container, Row } from "react-bootstrap";

import CommitsList from "./commitsList";

const branchName = "main";

const App: FC = () => {
	return (
		<div className="App">
			<header className="App-header">
				<h1>
					Git commit history of branch <b>{branchName}</b>
				</h1>
			</header>
			<Container>
				<Row>
					<CommitsList branchName={branchName} />
				</Row>
			</Container>
		</div>
	);
};

export default App;
