# 如何將 LGT Games Portal 部署至 Cloudflare Pages

既然你已經把專案推送到 GitHub（`https://github.com/eren-olympic/games`），並且網域 `lgt.wtf` 也已經託管在 Cloudflare 上了，接下來的部署過程非常簡單，五分鐘內就能搞定！

## 步驟一：連結 GitHub 專案

1. 登入你的 **[Cloudflare 儀表板](https://dash.cloudflare.com/)**。
2. 左側選單點擊 **Workers & Pages (工作階段與網頁)**。
3. 點擊藍色按鈕 **Create (建立)**，然後選擇 **Pages** 標籤頁。
4. 點擊 **Connect to Git (連接至 Git)**。
5. 授權 Cloudflare 存取你的 GitHub 帳號，並在列表中選擇你剛剛推送的 `games` Repository。
6. 點擊 **Begin setup (開始設定)**。

## 步驟二：設定 Build Settings (建置設定)

由於我們的專案是完美的純靜態（Vanilla JS/HTML/CSS），完全不需要經過任何編譯打包，所以設定非常簡單：

1. **Project name (專案名稱)**: 隨意取，例如 `lgt-games`。
2. **Production branch (生產分支)**: 保持預設的 `main`。
3. **Framework preset (框架預設值)**: 選擇 **None**。
4. **Build command (建置指令)**: **留白 (不用填)**。
5. **Build output directory (建置輸出目錄)**: **留白 (不用填)**，或者填 `/` 也行。
6. 點擊 **Save and Deploy (儲存並部署)**。

*稍等大約 30 秒，Cloudflare 就會跑完流程，並發布一個 `*.pages.dev` 的臨時專屬網址給你。*

## 步驟三：綁定你的專屬網址 (Custom Domain)

最後一步，把你的 `lgt.wtf` 綁上去！

1. 在剛才部署成功的畫面上，點擊 **Continue to project (繼續前往專案)**。
2. 點選上方的 **Custom domains (自訂網域)** 標籤頁。
3. 點擊 **Set up a custom domain (設定自訂網域)**。
4. 輸入你想用的網址：
   - 如果你要把大廳放在根目錄，就直接輸入 `lgt.wtf`。
   - 如果你想放在子網域，也可以輸入例如 `play.lgt.wtf`。
5. 點擊 **Continue (繼續)**。
6. Cloudflare 會自動偵測到你的網域已經在它那裡託管了，所以它會問你要不要自動新增 DNS 紀錄。點擊 **Activate domain (啟動網域)** 即可！

## 完成！🎉

現在 Cloudflare 會自動幫你搞定 SSL 憑證（大約需要 1~2 分鐘）。
之後，只要你打開 **https://lgt.wtf**，就能看到我們辛苦打造的心血結晶了！

而且，未來只要你在本機寫好新遊戲，並執行 `git push origin main`，Cloudflare 就會**自動**抓取最新的程式碼並立即更新網站，你再也不需要登入 Cloudflare 點任何按鈕了。
