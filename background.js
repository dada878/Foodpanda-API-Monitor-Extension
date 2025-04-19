// 用於儲存請求 ID 和 URL 的映射
const requestMap = new Map();

// 儲存所有連接的 devtools 面板
const devtoolsConnections = new Set();

// 監聽請求開始
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('tw.fd-api.com/api/v5/vendors/') && 
        details.url.includes('include=menus,bundles,multiple_discounts')) {
      // 儲存請求 ID 和 URL 的映射
      requestMap.set(details.requestId, details.url);
    }
  },
  { urls: ["https://tw.fd-api.com/*"] }
);

// 監聽請求完成
chrome.webRequest.onCompleted.addListener(
  function(details) {
    const url = requestMap.get(details.requestId);
    if (url) {
      // 獲取回應資料
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // 儲存請求資訊和回應資料
          chrome.storage.local.get(['apiRequests'], function(result) {
            const requests = result.apiRequests || [];
            requests.push({
              url: url,
              timestamp: new Date().toISOString(),
              response: data
            });
            
            chrome.storage.local.set({ apiRequests: requests }, function() {
              console.log('API request and response saved:', url);
            });
          });
        })
        .catch(error => console.error('Error fetching response:', error));
      
      // 清理映射
      requestMap.delete(details.requestId);
    }
  },
  { urls: ["https://tw.fd-api.com/*"] }
);

// 監聽來自 devtools 面板的連接
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "devtools-panel") {
    devtoolsConnections.add(port);
    
    // 當連接斷開時移除
    port.onDisconnect.addListener(function() {
      devtoolsConnections.delete(port);
    });
  }
});

// 監聽來自 devtools 面板的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'request') {
    // 將請求轉發給所有連接的 devtools 面板
    devtoolsConnections.forEach(port => {
      port.postMessage(message);
    });
  }
}); 