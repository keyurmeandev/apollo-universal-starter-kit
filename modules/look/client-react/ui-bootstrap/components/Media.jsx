import React from 'react';
import PropTypes from 'prop-types';
import { Media as RSMedia } from 'reactstrap';

const Media = ({ children, ...props }) => {
  return <RSMedia {...props}>{children}</RSMedia>;
};

export default Media;

Media.propTypes = {
  children: PropTypes.node
};
