import React from 'react'
import { Modal } from 'react-bootstrap'

export default function AuthModal(children) {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  )
}
