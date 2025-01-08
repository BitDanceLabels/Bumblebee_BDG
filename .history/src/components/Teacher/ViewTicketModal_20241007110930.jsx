import React from 'react'

const ViewTicketModal = ({ show, tickets, onDelete, onClose }) => {
  if (!show) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>View Tickets</h2>
        {tickets.length > 0 ? (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                {ticket.name}{' '}
                <button onClick={() => onDelete(ticket.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tickets available</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ViewTicketModal
