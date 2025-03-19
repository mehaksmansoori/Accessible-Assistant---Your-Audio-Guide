// featureHandlers.js - Defines handlers for different voice commands

const featureHandlers = {
    // Handle search commands
    search: function(query) {
        if (!query) {
            respondToUser("What would you like to search for?");
            return;
        }
        
        // Simulate search functionality
        respondToUser(`Searching for "${query}"...`);
        
        // You could implement actual search here, either on your site or by redirecting to Google
        // For example:
        // window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        // For demo purposes, we'll just simulate it
        setTimeout(() => {
            document.getElementById('content-area').innerHTML = `
                <h2>Search Results for "${query}"</h2>
                <div class="search-results">
                    <p>Found 5 results matching your query.</p>
                    <ul>
                        <li>Result 1 for ${query}</li>
                        <li>Result 2 for ${query}</li>
                        <li>Result 3 for ${query}</li>
                        <li>Result 4 for ${query}</li>
                        <li>Result 5 for ${query}</li>
                    </ul>
                </div>
            `;
            respondToUser(`Here are the search results for "${query}"`);
        }, 1000);
    },
    
    // Handle navigation commands
    navigate: function(destination) {
        if (!destination) {
            respondToUser("Where would you like to go?");
            return;
        }
        
        // Map of known destinations
        const destinations = {
            'home': '/',
            'about': '/about.html',
            'contact': '/contact.html',
            'products': '/products.html',
            'services': '/services.html',
            'blog': '/blog.html'
        };
        
        // Clean up destination text
        destination = destination.toLowerCase().trim();
        
        // Check if destination is known
        if (destinations[destination]) {
            respondToUser(`Navigating to ${destination} page...`);
            
            // Simulate navigation by updating content
            setTimeout(() => {
                document.getElementById('content-area').innerHTML = `
                    <h2>${destination.charAt(0).toUpperCase() + destination.slice(1)} Page</h2>
                    <p>This is the ${destination} page content. It was loaded via voice command.</p>
                `;
                respondToUser(`You are now on the ${destination} page.`);
            }, 1000);
            
            // For actual navigation:
            // window.location.href = destinations[destination];
        } else {
            respondToUser(`I'm sorry, I don't know how to navigate to "${destination}". Available destinations are: home, about, contact, products, services, and blog.`);
        }
    },
    
    // Handle media control commands
    mediaControl: function(command) {
        // Check for video element
        const video = document.querySelector('video');
        if (!video) {
            // If no video exists, create one for demo purposes
            document.getElementById('content-area').innerHTML = `
                <h2>Media Player</h2>
                <video id="demo-video" width="640" height="360" controls>
                    <source src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            setTimeout(() => this.mediaControl(command), 500);
            return;
        }
        
        // Handle different media commands
        if (command.includes('play')) {
            video.play();
            respondToUser("Playing video");
        } else if (command.includes('pause')) {
            video.pause();
            respondToUser("Video paused");
        } else if (command.includes('volume up')) {
            video.volume = Math.min(1, video.volume + 0.2);
            respondToUser(`Volume increased to ${Math.round(video.volume * 100)}%`);
        } else if (command.includes('volume down')) {
            video.volume = Math.max(0, video.volume - 0.2);
            respondToUser(`Volume decreased to ${Math.round(video.volume * 100)}%`);
        } else if (command.includes('mute')) {
            video.muted = !video.muted;
            respondToUser(video.muted ? "Video muted" : "Video unmuted");
        } else {
            respondToUser("Available media commands: play, pause, volume up, volume down, mute");
        }
    },
    
    // Handle information requests
    getInformation: function(topic) {
        // If just "help" or "information" with no specific topic
        if (!topic || topic === "") {
            respondToUser("Here are some things you can ask me: search for something, navigate to a page, control media playback, or get information about our products and services.");
            return;
        }
        
        // Information database (would be more extensive in production)
        const information = {
            'products': "We offer a wide range of products including electronics, home goods, and apparel. You can browse our catalog by saying 'go to products'.",
            'services': "Our services include consultation, maintenance, and support. For more details, say 'go to services'.",
            'contact': "You can contact us by phone at 555-123-4567 or by email at info@example.com.",
            'hours': "Our business hours are Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 3 PM.",
            'location': "We are located at 123 Main Street, Anytown, USA.",
            'pricing': "Our pricing varies by product and service. For specific pricing information, please navigate to the product or service page.",
            'shipping': "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days."
        };
        
        // Clean up topic
        topic = topic.toLowerCase().trim();
        
        // Check if we have information on the topic
        for (const key in information) {
            if (topic.includes(key)) {
                respondToUser(information[key]);
                return;
            }
        }
        
        // If topic not found
        respondToUser(`I'm sorry, I don't have information about "${topic}". You can ask about products, services, contact, hours, location, pricing, or shipping.`);
    }
};

// Make featureHandlers available globally
window.featureHandlers = featureHandlers;