import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Action from '../../Actions/Action';
import theme from './Header.scss';

export function headerClasses() {
	return classNames(theme['tc-enumeration-header'], 'tc-enumeration-header');
}

function getAction(action, index) {
	function onClick(event) {
		if (action.onClick) {
			action.onClick(event, { value: event.target.value });
		}
	}

	return (
		<Action
			key={`${index}-enum-header-action`}
			label={action.label}
			icon={action.icon}
			onClick={onClick}
			disabled={action.disabled}
			btooltipPlacement="bottom"
			inProgress={action.inProgress}
			hideLabel
			link
		/>
	);
}

export function renderActions(headerDefault) {
	return (
		<div className="actions">
			{headerDefault.map(getAction)}
		</div>
	);
}

function Header({ headerDefault, required }) {
	return (
		<header className={headerClasses()}>
			<span>Values{required && '*'}</span>
			{headerDefault.length >  0 && renderActions(headerDefault)}
		</header>
	);
}

Header.propTypes = {
	headerDefault: PropTypes.arrayOf(PropTypes.shape(Action.propTypes)).isRequired,
	required: PropTypes.bool,
};

export default Header;
