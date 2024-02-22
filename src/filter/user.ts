import {matcher, type Condition} from '.';

const users = (process.env.GHP_BLOCKED_USERS ?? '').split(',');
const rules = users.map(pattern => matcher(pattern));

const disallow: Condition<string> = user => rules.some(m => m(user));

export default disallow;
