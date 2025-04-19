// 複製文字到剪貼簿的函數
function copyToClipboard(text, button) {
  // 創建一個臨時的 textarea 元素
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  
  try {
    // 選中文字
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    // 執行複製命令
    document.execCommand('copy');
    
    // 顯示成功提示
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.backgroundColor = '#45a049';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '#4CAF50';
    }, 1000);
  } catch (err) {
    console.error('Failed to copy response:', err);
    button.textContent = 'Copy Failed';
    button.style.backgroundColor = '#f44336';
    setTimeout(() => {
      button.textContent = 'Copy Response';
      button.style.backgroundColor = '#4CAF50';
    }, 1000);
  } finally {
    // 移除臨時元素
    document.body.removeChild(textarea);
  }
}

// 下載 JSON 文件
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(JSON.parse(data), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 初始化 UI 元素
document.addEventListener('DOMContentLoaded', function() {
  const clearAllButton = document.getElementById('clearAll');
  const confirmModal = document.getElementById('confirmModal');
  const confirmClearButton = document.getElementById('confirmClear');
  const cancelClearButton = document.getElementById('cancelClear');

  // 顯示確認對話框
  clearAllButton.addEventListener('click', function() {
    confirmModal.style.display = 'flex';
  });

  // 確認清除
  confirmClearButton.addEventListener('click', function() {
    const requestsContainer = document.getElementById('requests');
    requestsContainer.innerHTML = '';
    confirmModal.style.display = 'none';
  });

  // 取消清除
  cancelClearButton.addEventListener('click', function() {
    confirmModal.style.display = 'none';
  });

  // 點擊對話框外部關閉
  confirmModal.addEventListener('click', function(event) {
    if (event.target === confirmModal) {
      confirmModal.style.display = 'none';
    }
  });
});

// 初始化 Network 面板
chrome.devtools.network.onRequestFinished.addListener(function(request) {
  // 只處理 GET 請求，並檢查是否為目標 API 請求
  if (request.request.method === 'GET' &&
      request.request.url.includes('tw.fd-api.com/api/v5/vendors/') && 
      request.request.url.includes('include=menus,bundles,multiple_discounts')) {
    
    console.group('Foodpanda API Request');
    console.log('Request URL:', request.request.url);
    console.log('Request Method:', request.request.method);
    
    // 將請求標頭轉換為更易讀的格式
    const requestHeaders = {};
    request.request.headers.forEach(header => {
      requestHeaders[header.name] = header.value;
    });
    console.log('Request Headers:', requestHeaders);
    
    // 使用 HAR entry 的 getContent 方法獲取回應內容
    request.getContent((content, encoding) => {
      // 將回應標頭轉換為更易讀的格式
      const responseHeaders = {};
      request.response.headers.forEach(header => {
        responseHeaders[header.name] = header.value;
      });
      
      console.log('Response Status:', request.response.status, request.response.statusText);
      console.log('Response Headers:', responseHeaders);
      
      // 計算回應大小
      const size = request.response.content.size || request.response.bodySize || 0;
      console.log('Response Size:', formatBytes(size));
      console.log('Response Type:', request.response.content.mimeType);
      
      try {
        if (request.response.content.mimeType.includes('application/json')) {
          const jsonData = JSON.parse(content);
          console.log('Response Content:', jsonData);
          
          // 額外記錄一些重要的回應資訊
          if (jsonData.data) {
            console.log('Restaurant Data:', {
              name: jsonData.data.name,
              id: jsonData.data.id,
              menu_categories: jsonData.data.menus?.[0]?.menu_categories?.length || 0
            });
          }
        } else {
          console.log('Response Content:', content);
        }
      } catch (error) {
        console.log('Response Content (raw):', content);
        console.error('Error parsing response:', error);
      }
      
      console.groupEnd();

      const requestData = {
        url: request.request.url,
        timestamp: new Date().toISOString(),
        response: content,
        method: request.request.method,
        status: request.response.status,
        statusText: request.response.statusText,
        mimeType: request.response.content.mimeType,
        bodySize: size
      };
      
      addRequest(requestData);
    });
  }
});

// 在面板中顯示請求
function addRequest(requestData) {
  const requestsContainer = document.getElementById('requests');
  
  const requestElement = document.createElement('div');
  requestElement.className = 'request-item';
  
  const headerContainer = document.createElement('div');
  headerContainer.className = 'request-header';
  headerContainer.style.display = 'flex';
  headerContainer.style.justifyContent = 'space-between';
  headerContainer.style.alignItems = 'center';
  headerContainer.style.marginBottom = '10px';
  
  const leftSection = document.createElement('div');
  
  const timestampElement = document.createElement('div');
  timestampElement.className = 'timestamp';
  timestampElement.textContent = new Date(requestData.timestamp).toLocaleString();
  
  const urlElement = document.createElement('div');
  urlElement.className = 'url';
  urlElement.textContent = `${requestData.method} ${requestData.url} - ${requestData.status} ${requestData.statusText}`;
  
  const infoElement = document.createElement('div');
  infoElement.className = 'info';
  infoElement.textContent = `Type: ${requestData.mimeType}, Size: ${formatBytes(requestData.bodySize)}`;
  
  leftSection.appendChild(timestampElement);
  leftSection.appendChild(urlElement);
  leftSection.appendChild(infoElement);
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';
  
  const downloadButton = document.createElement('button');
  downloadButton.className = 'download-button';
  downloadButton.textContent = 'Download JSON';
  downloadButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.style.cssText = `
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const responseElement = document.createElement('pre');
  responseElement.className = 'response';
  
  try {
    // 如果是 JSON 回應，格式化顯示
    if (requestData.mimeType.includes('application/json')) {
      const jsonData = JSON.parse(requestData.response);
      responseElement.textContent = JSON.stringify(jsonData, null, 2);
    } else {
      responseElement.textContent = requestData.response;
    }
  } catch (error) {
    responseElement.textContent = requestData.response;
  }
  
  // 添加下載功能
  downloadButton.addEventListener('click', function() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `foodpanda-response-${timestamp}.json`;
    downloadJSON(requestData.response, filename);
  });
  
  // 添加刪除功能
  deleteButton.addEventListener('click', function() {
    requestElement.remove();
  });
  
  buttonsContainer.appendChild(downloadButton);
  buttonsContainer.appendChild(deleteButton);
  
  headerContainer.appendChild(leftSection);
  headerContainer.appendChild(buttonsContainer);
  
  requestElement.appendChild(headerContainer);
  requestElement.appendChild(responseElement);
  requestsContainer.appendChild(requestElement);
}

// 格式化位元組大小
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 