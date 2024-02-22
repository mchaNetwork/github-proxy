import {matcher, type Condition} from '.';

type Repo = {
	user: string;
	repo: string;
};

const repos = (process.env.GHP_BLOCKED_REPOS ?? '').split(',');
const rules = repos.map(pattern => matcher(pattern));

const forbid: Condition<Repo> = ({user, repo}) => rules.some(m => m(`${user}/${repo}`));

export default forbid;
