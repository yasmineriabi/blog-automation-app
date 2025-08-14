export interface Blog {
  _id: string;
  title: string;
  content: string;
  topicid: string;
  approvedby: string;
  publushedat: string;
  createdat: string;
  status: string;
  createdby: string;
  viewcount: number;
}

export interface ApprovedBlogWithDomain {
  _id: string;
  title: string;
  content: string;
  status: string;
  topicid: string;
  created_by: string;
  viewcount: number;
  domain: string;
  topic: string;
  createdat: string;
}
