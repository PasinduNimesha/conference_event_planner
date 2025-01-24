import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";

const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const venueItems = useSelector((state) => state.venue);
    const avItems = useSelector((state) => state.av);
    const dispatch = useDispatch();

    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;

    const handleToggleItems = () => {
        setShowItems(!showItems);
    };

    const handleAddToCart = (index) => {
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
            return; 
        }
        dispatch(incrementQuantity(index));
    };

    const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
            dispatch(decrementQuantity(index));
        }
    };

    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
        if (avItems[index].quantity > 0) {
            dispatch(decrementAvQuantity(index));
        }
    };

    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
            venueItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        } else if (section === "addons") {
            avItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        }
        return totalCost;
    };

    const venueTotalCost = calculateTotalCost("venue");
    const addonsTotalCost = calculateTotalCost("addons");

    const navigateToProducts = (idType) => {
        if (idType === '#venue' || idType === '#addons' || idType === '#meals') {
            if (showItems) {
                setShowItems(!showItems);
            }
        }
    };

    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")}>Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>

            <div className="main_container">
                {!showItems ? (
                    <div className="items-information">
                        {/* Venue Selection */}
                        <div id="venue" className="venue_container container_main">
                            <div className="text">
                                <h1>Venue Room Selection</h1>
                            </div>
                            <div className="venue_selection">
                                {venueItems.map((item, index) => (
                                    <div className="venue_main" key={index}>
                                        <div className="img">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="text">{item.name}</div>
                                        <div>${item.cost}</div>
                                        <div className="button_container">
                                            {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (
                                                <>
                                                    <button
                                                        className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>
                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                                                    </span>
                                                    <button
                                                        className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="button_container">
                                                    <button
                                                        className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>
                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                                                    </span>
                                                    <button
                                                        className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="total_cost">Total Cost: ${venueTotalCost}</div>
                        </div>

                        {/* Add-ons Selection */}
                        <div id="addons" className="venue_container container_main">
                            <div className="text">
                                <h1>Add-ons Selection</h1>
                            </div>
                            <div className="addons_selection">
                                {avItems.map((item, index) => (
                                    <div className="av_data venue_main" key={index}>
                                        <div className="img">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="text"> {item.name} </div>
                                        <div> ${item.cost} </div>
                                        <div className="addons_btn">
                                            <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="total_cost">Total Cost: ${addonsTotalCost}</div>
                        </div>
                    </div>
                ) : (
                    <div className="total_amount_detail">
                        <TotalCost totalCosts={venueTotalCost + addonsTotalCost} handleClick={handleToggleItems} />
                    </div>
                )}
            </div>
        </>
    );
};

export default ConferenceEvent;
