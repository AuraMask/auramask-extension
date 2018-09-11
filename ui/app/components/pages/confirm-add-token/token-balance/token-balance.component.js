import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class TokenBalance extends Component {
  static get propTypes() {
    return {
      string: PropTypes.string,
      symbol: PropTypes.string,
      error: PropTypes.string,
    };
  };

  render() {
    return (
      <div className="hide-text-overflow">{this.props.string}</div>
    );
  }
}
