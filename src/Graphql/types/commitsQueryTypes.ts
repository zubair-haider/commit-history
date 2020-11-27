interface author {
  avatarUrl: string;
  name: string;
}

export interface node {
  message: string;
  commitUrl: string;
  committedDate: string;
  abbreviatedOid: string;
  oid: string;
  author: author;
}

interface edge {
  node: node;
}

interface history {
  id: string;
  edges: edge[];
}

interface target {
  id: string;
  history: history;
}

interface ref {
  name: string;
  target: target;
}

interface repository {
  id: string;
  model: string;
  ref: ref;
}

export interface CommitsData {
  repository: repository;
}

export interface CommitsVars {
  owner: string;
  name: string;
  qualifiedName: string;
}
