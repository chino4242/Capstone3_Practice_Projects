import React, {useState, useEffect} from 'react';
import PropertyCard from './PropertyCard';
import './index.css';

function Home(){
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minRooms: '',
        maxRooms: ''
    });

    useEffect(() => {
        fetch('http://localhost:5000/properties')
        .then(response => response.json())
        .then(data => {
            setProperties(data);
            setFilteredProperties(data);
        })
        .catch(error => console.error('Error fetching properties:', error));
    }, []);

    const applyFilters = () => {
        console.log('🔍 Starting filter process...');
        console.log('Current filters:', filters);
        console.log('Total properties:', properties.length);
        console.log('Sample property:', properties[0]);
        
        let filtered = properties;
        
        // Convert strings to numbers for price filtering
        if (filters.minPrice !== '' && filters.maxPrice !== '') {
            const minPrice = Number(filters.minPrice);
            const maxPrice = Number(filters.maxPrice);
            console.log(`💰 Filtering by price: ${minPrice} to ${maxPrice}`);
            
            filtered = filtered.filter(property => {
                const passes = property.price >= minPrice && property.price <= maxPrice;
                console.log(`Property ${property.id}: price ${property.price} - ${passes ? 'PASS' : 'FAIL'}`);
                return passes;
            });
            
            console.log(`After price filter: ${filtered.length} properties`);
        }
        
        // Convert strings to numbers for room filtering
        if (filters.minRooms !== '' && filters.maxRooms !== '') {
            const minRooms = Number(filters.minRooms);
            const maxRooms = Number(filters.maxRooms);
            console.log(`🏠 Filtering by rooms: ${minRooms} to ${maxRooms}`);
            
            filtered = filtered.filter(property => {
                const passes = property.room >= minRooms && property.room <= maxRooms;
                console.log(`Property ${property.id}: rooms ${property.room} - ${passes ? 'PASS' : 'FAIL'}`);
                return passes;
            });
            
            console.log(`After room filter: ${filtered.length} properties`);
        }
        
        console.log('🎯 Final filtered properties:', filtered.length);
        setFilteredProperties(filtered);
    }
    
    

    const handleFilterChange = event => {
        const { name, value} = event.target;
        setFilters({...filters, [name]: value});
    }

    return (
        <div className='home-container'>
            <div className='filter'>
                <label>Minimum Price:</label>
                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
                <label>Maximum Price:</label>
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
                <label>Minimum Rooms:</label>
                <input type="number" name="minRooms" value={filters.minRooms} onChange={handleFilterChange} />
                <label>Maximum Rooms:</label>
                <input type="number" name="maxRooms" value={filters.maxRooms} onChange={handleFilterChange} />
                <button onClick={applyFilters}>Apply</button>
            </div>
            <div className='parent-property'>
                <div className='property-list'>
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map(property => (
                              <PropertyCard key={property.id} property={property} />
                        ))
                    ) : (
                        <p>No Properties found</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;