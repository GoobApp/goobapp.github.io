import "../App.css"
import UIElement from "../types/UIElementObject";

const UIPopup = ({elements}: {elements: UIElement[]}) => {
    return (
        <div className="ui-popup-container">
            {
                elements.map((element, index) => {
                    return (
                        <div className="ui-popup-element">
                            {element.emoji && <img src={element.emoji} className="ui-popup-emoji"></img>}
                            <p>{element.name}</p>
                        </div> 
                        // TODO: Replace with button
                    )
                })
            }
        </div>
    );
}

export default UIPopup;