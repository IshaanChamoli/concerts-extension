async function fetchConcerts() {
    const url = 'https://concerts-artists-events-tracker.p.rapidapi.com/location?name=Illinois&minDate=2024-12-14&maxDate=2024-12-31&page=1';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '27cead8a08msh56fafda9282fd21p12cd26jsnee951a082c10',
            'X-RapidAPI-Host': 'concerts-artists-events-tracker.p.rapidapi.com'
        }
    };
    
    const concertList = document.getElementById('concert-list');
    concertList.innerHTML = '<li class="loading">Loading concerts...</li>';
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Full API Response:', result);
        
        if (result && result.data && Array.isArray(result.data)) {
            displayConcerts(result.data);
        } else {
            throw new Error('Invalid data format received');
        }
    } catch (error) {
        console.error('Error fetching concerts:', error);
        concertList.innerHTML = '<li class="error">Unable to load concerts. Please try again later.</li>';
    }
}

function displayConcerts(events) {
    const concertList = document.getElementById('concert-list');
    concertList.innerHTML = '';
    
    if (events.length === 0) {
        concertList.innerHTML = '<li class="error">No concerts found for the specified dates.</li>';
        return;
    }
    
    events.forEach(event => {
        if (!event) return;
        
        const li = document.createElement('li');
        li.className = 'concert-item';
        
        const fullDescription = event.description || 'Unknown Event';
        const name = fullDescription.split(' at ')[0];
        const location = event.location?.name || 'Location TBA';
        
        // Format date and time
        const dateObj = new Date(event.startDate || event.endDate);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        li.innerHTML = `
            <div class="concert-info">
                <h2>${name}</h2>
                <p>${date} at ${time} • ${location}</p>
            </div>
        `;
        
        concertList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', fetchConcerts);