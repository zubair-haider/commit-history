import { gql } from "@apollo/client";

export const COMMITS_QUERY = gql`
	query Commits_query(
		$owner: String!
		$name: String!
		$qualifiedName: String!
	) {
		repository(owner: $owner, name: $name) {
			ref(qualifiedName: $qualifiedName) {
				name
				target {
					... on Commit {
						id
						history {
							pageInfo {
								hasNextPage
							}
							edges {
								node {
									message
									commitUrl
									committedDate
								}
							}
						}
					}
				}
			}
		}
	}
`;
