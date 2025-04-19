# Foodpanda API Monitor Extension

## 簡介

這是一個方便的 Chrome Extension，專門用於監控和擷取 Foodpanda 商家的 API 資料。它可以幫助你：

- 自動捕獲商家的完整 API 回應，包含商家基本資料、菜單資料等
- 一鍵下載資料為格式化的 JSON 檔案
- 方便地管理和清理歷史記錄

![使用示範](/image/README/CleanShot%202025-04-19%20at%2012.15.23.gif)

## 功能特點

- 🔍 自動監控特定的 Foodpanda API 請求
- 📊 即時顯示請求和回應詳細資訊
- 💾 支援 JSON 格式下載
- 🗑️ 提供單筆和批量刪除功能
- 📱 美觀且易用的介面

## 安裝步驟

1. 下載或 Clone 此專案到本地
2. 打開 Chrome 瀏覽器，進入擴充功能管理頁面：
   - 在網址列輸入 `chrome://extensions/`
   - 或從選單中選擇「更多工具」>「擴充功能」
3. 開啟右上角的「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇此專案的資料夾

## 使用方法

1. 安裝完成後，打開 Chrome DevTools（按 F12 或右鍵選擇「檢查」）
2. 在 DevTools 的頁籤中選擇「Foodpanda API Monitor」
3. 訪問任何 Foodpanda 商家頁面，例如：
   - [春陽茶室](https://www.foodpanda.com.tw/restaurant/q2dn/chun-yang-cha-shi-tai-zhong-zhong-dian)
   - 或其他任何 Foodpanda 商家頁面
4. 重新整理頁面，等待頁面載入完成
5. 在 Foodpanda API Monitor 面板中查看擷取到的資料

## 資料管理

- 下載資料：點擊每筆記錄右側的「Download JSON」按鈕
- 刪除單筆記錄：點擊記錄右側的「Delete」按鈕
- 清除所有記錄：點擊面板頂部的「Clear All Requests」按鈕

## 注意事項

- 本擴充功能僅供學習和研究使用
- 請勿用於商業用途或違反 Foodpanda 服務條款的行為
- 建議在使用時遵守網站的使用規範

## 技術支援

如果你遇到任何問題或有改進建議，歡迎：
- 提交 Issue
- 發送 Pull Request
- 聯繫開發者

## License

MIT License - 詳見 [LICENSE](LICENSE) 檔案