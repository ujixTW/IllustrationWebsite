# IllustrationWebsite

## 一、介紹

繪圖創作網站，使用者能在上面分享自己的繪圖創作，並透過標籤來讓更多人看到自己的作品，除作品作者外，其他的使用者也能添加新的標籤到作品上。
觀看作品時，使用者能對作品按讚並留言表達自己的想法。

為前後端分離的做法。

- 前端資料於－Illus.Client 使用 React 和 TypeScript 編寫
- 後端資料於－Illus.Server 使用.NET 編寫

## 二、運行環境

### 前端

- Node.js 21.7.1

### 後端

- .NET 8.0
- MSSQL 18

## 三、環境檔

### 後端

- appsettings.json
  - WebsiteEmail (為帳號註冊、密碼重設功能所需)
    - UserName : Gmail 電子信箱
    - Password : 信箱密碼金鑰 [申請方法](https://blog.hungwin.com.tw/cs-gmail/)

## 四、安裝步驟

### VS Code

1. 複製網址 https://github.com/ujixTW/IllustrationWebsite.git
2. 於 VS code 功能列 Source control > Clone repository
3. 貼上所複製的網址
4. 選擇要放置專案的資料夾
5. 新增 Terminal
6. 輸入 `cd Illus.Client` 至前端的檔案路徑
7. 輸入 `npm install`

### Visual Studio 2022

1. 複製網址 https://github.com/ujixTW/IllustrationWebsite.git
2. Visual Studio 2022 > 不使用程式碼繼續
3. Git 變更 > 複製存放庫
4. 貼上所複製的網址
5. 選擇要放置專案的資料夾
6. 檢視 > 終端機 或 ctrl ` 開啟 PowerShell
7. 輸入 `cd Illus.Client` 至前端的檔案路徑
8. 輸入 `npm install`

### 資料庫與資料

#### 資料

1. [下載附屬資料](https://drive.google.com/file/d/11ProxtBvGl-LmAu5t7QgTGkhjvb6htxl/view?usp=sharing)
2. 將解壓縮後的資料中，UserData、Work 資料夾放至 IllustrationWebsite\Illus.Client\public

#### 資料庫

1. 於 MSSQL 開啟於 [附屬資料](https://drive.google.com/file/d/11ProxtBvGl-LmAu5t7QgTGkhjvb6htxl/view?usp=sharing) 中的 IllusWebMsSql.sql 檔案
2. 執行

## 五、運行步驟

### VS Code

#### 前端

1. 新增 Terminal
2. 輸入 `cd Illus.Client` 至前端的檔案路徑
3. 輸入 `npm run dev` > 複製結果顯示的網址貼至瀏覽器

#### 後端

1. 於 VS code 功能列 Run and Debug > C# > https
2. Start Debug(F5)

### Visual Studio 2022

#### 前端

1. 檢視 > 終端機 或 ctrl ` 開啟 PowerShell
2. 輸入 `cd Illus.Client` 至前端的檔案路徑
3. 輸入 `npm run dev` > 複製結果顯示的網址貼至瀏覽器

#### 後端

1. Debug 選項 > Debug > https
2. Start Debug(F5)

- 帳號與密碼：
  - 帳號：illusWeb2024
  - 密碼：Illus@Web&202\*4

## 六、注意事項

1. 本專案的圖片會儲存在電腦硬碟中，資料夾路徑為 Illus.Client/public 下的 Work、UserData 資料夾，會於儲存第一張圖片時自動產生。
2. 後端程式 Log 會記錄於 "C:\Logs\IllusWebLog.log" ，若要修改 Log 紀錄位置，請修改於 "Illus.Server\Helper\Logger.cs" 中的 \_savePath 變數值。
