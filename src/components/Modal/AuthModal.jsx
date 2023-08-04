import React from 'react'
import { Modal } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from "prop-types";


export default function AuthModal({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Modal show={true} onHide={() => location.pathname === '/log-in' ? navigate('/home') : navigate(-1)}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  )
}

AuthModal.propTypes = {
  children: PropTypes.node.isRequired,
};
