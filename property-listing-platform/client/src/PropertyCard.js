import React from 'react';

function PropertyCard({property}) {
    const { id, name, location, room, img, price, amenities} = property;

    return (
        <div className="property-card">
            <div className='property-image'>
                <img src={`${img}`} alt={name} />
            </div>
            <div className="property-details">
                <h2>{name}</h2>
                <p>Location: {location}</p>
                <p>Rooms: {room}</p>
                <p>Price: {price}</p>
                <p>Amenities: {amenities.join(', ')}</p>

            </div>
        </div>

    );
}

export default PropertyCard;