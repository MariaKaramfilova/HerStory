import React from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import PropTypes from "prop-types";


export default function AuthModal({ children }) {
  const navigate = useNavigate();
  return (
    <Modal show={true} onHide={() => navigate(-1)}
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
