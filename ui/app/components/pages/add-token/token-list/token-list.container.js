import { connect } from 'react-redux';
import TokenList from './token-list.component';

const mapStateToProps = ({ irmeta }) => {
  const { tokens } = irmeta;
  return {
    tokens,
  };
};

export default connect(mapStateToProps)(TokenList);
