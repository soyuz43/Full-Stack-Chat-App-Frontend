// src/components/SessionList.jsx
import PropTypes from "prop-types";
function SessionList({ sessions, selectedSessionId, handleSessionSelect }) {
  return (
    <div className="session-list">
      <h2>Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li
            key={session.id} // Use id as the key
            className={selectedSessionId === session.id ? "active" : ""}
            onClick={() => handleSessionSelect(session.id)} // Use id when handling click
          >
            Session {session.id}
          </li>
        ))}
      </ul>
    </div>
  );
}

SessionList.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedSessionId: PropTypes.number,
  handleSessionSelect: PropTypes.func.isRequired,
};

SessionList.defaultProps = {
  selectedSessionId: null,
};

export default SessionList;
