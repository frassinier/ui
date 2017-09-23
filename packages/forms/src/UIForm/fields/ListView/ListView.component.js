import PropTypes from 'prop-types';
import React from 'react';
import ListView from '@talend/react-components/lib/ListView';

import FieldTemplate from '../FieldTemplate';

const DISPLAY_MODE_DEFAULT = 'DISPLAY_MODE_DEFAULT';
const DISPLAY_MODE_SEARCH = 'DISPLAY_MODE_SEARCH';
const DEFAULT_ITEM_HEIGHT = 33;

class ListViewWidget extends React.Component {
	constructor(props) {
		super(props);

		this.onItemChange = this.onItemChange.bind(this);

		this.state = {
			...this.initItems(props),
			getItemHeight: () => DEFAULT_ITEM_HEIGHT,
			onToggleAll: this.onToggleAll.bind(this),
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.schema !== this.props.schema) {
			this.setState(oldState => this.initItems(newProps, oldState));
		} else if (newProps.value !== this.props.value) {
			this.setState(oldState => this.updateItems(newProps, oldState));
		}
	}

	initItems({ schema, value }, { searchCriteria } = {}) {
		const items = schema.titleMap.map((option, index) => ({
			checked: value.indexOf(option.value) !== -1,
			index,
			label: option.name,
			onChange: this.onItemChange,
			value: option.value,
		}));
		const displayedItems = searchCriteria ?
			items.filter(item => item.label.toLowerCase().includes(searchCriteria.toLowerCase())) :
			items;
		const toggleAllChecked = displayedItems.every(item => item.checked);

		return {
			displayedItems,
			items,
			required: schema.required,
			toggleAllChecked,
		};
	}

	updateItems({ value }, { displayedItems, items }) {
		function updateChecked(item) {
			const checked = value.indexOf(item.value) !== -1;
			if (item.checked !== checked) {
				return {
					...item,
					checked,
				};
			}
			return item;
		}

		const newItems = items.map(updateChecked);
		const newDisplayedItems = displayedItems.map(updateChecked);
		const toggleAllChecked = newDisplayedItems.every(item => item.checked);

		return {
			displayedItems: newDisplayedItems,
			items: newItems,
			toggleAllChecked,
		};
	}

	onItemChange(changedItem, event) {
		const value = this.state.items
			.filter((item) => {
				if (changedItem === item) {
					return !item.checked;
				}
				return item.checked;
			})
			.map(item => item.value);
		this.onChange(event, value);
	}

	onToggleAll(event) {
		const value = this.state.toggleAllChecked ?
			[] :
			this.state.items.map(item => item.value);
		this.onChange(event, value);
	}

	onChange(event, newValue) {
		const value = newValue.length ? newValue : undefined;
		const payload = { schema: this.props.schema, value };
		this.props.onChange(event, payload);
		this.props.onFinish(event, payload);
	}

	render() {
		return (
			<FieldTemplate
				description={this.props.schema.description}
				errorMessage={this.props.errorMessage}
				id={this.props.id}
				isValid={this.props.isValid}
				label={this.props.schema.title}
			>
				<ListView {...this.state} />
			</FieldTemplate>
		);
	}
}

ListViewWidget.defaultProps = {
	value: [],
};

if (process.env.NODE_ENV !== 'production') {
	ListViewWidget.propTypes = {
		id: PropTypes.string,
		isValid: PropTypes.bool,
		errorMessage: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		onFinish: PropTypes.func.isRequired,
		schema: PropTypes.shape({
			autoFocus: PropTypes.bool,
			description: PropTypes.string,
			disabled: PropTypes.bool,
			placeholder: PropTypes.string,
			readOnly: PropTypes.bool,
			required: PropTypes.bool,
			title: PropTypes.string,
			titleMap: PropTypes.arrayOf(PropTypes.shape({
				name: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired,
			})),
		}),
		value: PropTypes.string,
	};
}

export default ListViewWidget;
