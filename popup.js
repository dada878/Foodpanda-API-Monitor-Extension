document.addEventListener('DOMContentLoaded', function() {
  const requestsContainer = document.getElementById('requests');
  
  chrome.storage.local.get(['apiRequests'], function(result) {
    const requests = result.apiRequests || [];
    
    if (requests.length === 0) {
      requestsContainer.innerHTML = '<p>No API requests saved yet.</p>';
      return;
    }
    
    requests.forEach(request => {
      const requestElement = document.createElement('div');
      requestElement.className = 'request-item';
      
      const timestampElement = document.createElement('div');
      timestampElement.className = 'timestamp';
      timestampElement.textContent = new Date(request.timestamp).toLocaleString();
      
      const urlElement = document.createElement('div');
      urlElement.className = 'url';
      urlElement.textContent = request.url;
      
      const toggleButton = document.createElement('button');
      toggleButton.className = 'toggle-response';
      toggleButton.textContent = 'Show Response';
      
      const responseElement = document.createElement('pre');
      responseElement.className = 'response';
      responseElement.style.display = 'none';
      responseElement.textContent = JSON.stringify(request.response, null, 2);
      
      toggleButton.addEventListener('click', function() {
        if (responseElement.style.display === 'none') {
          responseElement.style.display = 'block';
          toggleButton.textContent = 'Hide Response';
        } else {
          responseElement.style.display = 'none';
          toggleButton.textContent = 'Show Response';
        }
      });
      
      requestElement.appendChild(timestampElement);
      requestElement.appendChild(urlElement);
      requestElement.appendChild(toggleButton);
      requestElement.appendChild(responseElement);
      requestsContainer.appendChild(requestElement);
    });
  });
}); 