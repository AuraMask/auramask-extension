import { connect } from 'react-redux';
import TokenList from './token-list.component';

const mapStateToProps = ({ auramask }) => {
  const { tokens } = auramask;
  return {
    tokens,
  };
};

export default connect(mapStateToProps)(TokenList);
