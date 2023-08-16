// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Modal } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from "prop-types";

/**
 * A modal component designed to wrap and display authentication-related content.
 *
 * The AuthModal displays its children within a modal dialog. It provides a consistent
 * modal structure for rendering authentication-related forms or content.
 *
 * @component
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - The content to render within the modal.
 * @returns {ReactNode} - Rendered modal component.
 *
 */
export default function AuthModal({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Modal show={true} onHide={() => location.pathname === '/log-in' ? navigate('/home') : navigate(-1)}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton className='border border-primary border-0'></Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  )
}

AuthModal.propTypes = {
  children: PropTypes.node.isRequired,
};
