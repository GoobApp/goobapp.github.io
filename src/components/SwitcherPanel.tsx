import { Link } from "react-router";
import "../App.css";
const SwitcherPanel = () => {
  return (
    <div id="switcherPanelContainer" className="switcher-panel-container">
      <Link to="/">
        <button className="panel-button">Chat</button>
      </Link>

      <Link to="/games">
        <button className="panel-button">Games</button>
      </Link>
    </div>
  );
};

export default SwitcherPanel;
