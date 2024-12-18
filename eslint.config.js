import {configBuilder} from '@mochaa/eslintrc';

export default configBuilder({}, {
	rules: {
		'node/prefer-global/process': 'off',
	},
});
