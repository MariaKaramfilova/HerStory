import React from 'react'
import './Error.css'
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export default function Error({ error }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="error-template">
            <h1>
              Oops!</h1>
            <h4>
              {error}</h4>
            <div className="error-details">
              Sorry, an error has occurred, we cannot process your request!
            </div>
            <div className="error-actions">
              <Link to={'/home'} className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>
                Take Me Home </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Error.propTypes = {
  error: PropTypes.string,
};
