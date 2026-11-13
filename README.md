# GRID/64 — 1:64 赛车模型档案

网页默认英文，点 **中文 / EN** 切换。进入 **Add collection item / 新增藏品**，选择照片并填写车型、模型品牌、赛事、比例、收藏原因和入藏时间。可保存为本机草稿，也可以先预览单件详情。选填的中文车型和收藏原因会随语言切换；只填一种语言时保留原文。

## 发布与维护

部署仓库：`suyihong20060219-cell/grid64`。`main` 是正式版本；GitHub Pages 选择 **GitHub Actions**，工作流只发布 `dist/`。公开网站地址为 `https://suyihong20060219-cell.github.io/grid64/`，须等首次构建成功才可访问。已有作品集不需要更改。部署时只提交本站目录；后续保留仓库里最新的 `dist/collection/`，不能用空的本地索引覆盖线上藏品。

要在网页内正式发布，先在 GitHub 创建 **Fine-grained personal access token**，只选 `grid64` 仓库，开启 **Contents: Read and write**。在新增藏品表单点 **发布到 GitHub** 后输入令牌，再确认公开发布。不要把令牌发到聊天里。令牌只用于当次 GitHub API 请求，网站不会存储。照片在浏览器中转成最长边 1600px 的 JPEG 再上传，照片和档案随同一个提交进入仓库。待 Pages 构建成功，其他设备也能看到。已有藏品可在编辑器下拉菜单选中后更新。浏览器草稿留在同一设备和同一网站地址，不能跨设备同步。

仓库没有真实藏品前使用明确标注的参考样例。发布第一件真实藏品后，索引只显示真实藏品。公开发布前请检查照片是否适合公开。本站没有支付、账户注册或付费服务。

- [GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub 细粒度令牌说明](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
