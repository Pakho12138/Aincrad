---
date: 2023-12-11
tags:
  - Github Actions
categories:
  - 前端
image: https://ghcdn.pages.dev/pic/20250705160421824.webp
---

# 使用 Github Action 实现 Github 自动同步代码到 Gitee，并自动部署 Gitee Pages

## 1. 创建 workflow

在你的 GitHub 项目 `.github/workflows/` 文件夹下创建一个 `.yml` 文件，如 `sync.yml`，内容如下：

```yaml
name: Sync To Gitee #名字  可自定义
on: page_build #触发条件   page_build表示Github Page部署完成后触发
# on:
#   push:
#     branches: [master, gh-pages]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master #开源actions包
        env:
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_PRIVATE_KEY }}
        with:
          source-repo: 'git@github.com:Pakho12138/Aincrad.git' # github仓库地址
          destination-repo: 'git@gitee.com:pakhoc/Aincrad.git' # gitee仓库地址

      - name: Build Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: 326061636@qq.com
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
          gitee-repo: pakhoc/Aincrad
          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
          branch: gh-pages
```

注：

1. 这里先使用 [wearerequired/git-mirror-action](https://github.com/wearerequired/git-mirror-action) 将 GitHub 仓库同步到 Gitee 仓库，再使用 [yanglbme/gitee-pages-action](https://github.com/yanglbme/gitee-pages-action) 实现 Gitee Pages 的自动部署。如果已经通过其它的方式，将代码 push 至 Gitee 了，那么可以不使用 [wearerequired/git-mirror-action](https://github.com/wearerequired/git-mirror-action)，也不需要配置 `GITEE_PRIVATE_KEY`。

2. `branch` 参数默认是 `master`，如果你是部署在 `gh-pages`(或者 `main`) 分支等等，务必指定 `branch: gh-pages`(或者 `branch: main`)。

3. `branch` 对应的分支，必须在仓库中实际存在，请不要随意（不）指定分支，否则可能导致 Gitee Pages 站点出现 404 无法访问的情况。

4. 对于 `gitee-repo` 参数，如果你的项目在 Gitee 的地址为 https://gitee.com/用户名/xxx ，那么 `gitee-repo` 就填写为 `用户名/xxx`。

5. 对于 workflow 的触发事件，你可以根据项目实际情况，指定为其它的触发事件。比如：

   ```yaml
   on:
     push:
       branches: [master, gh-pages]
   ```

更多触发事件，请参考 [Events that trigger workflows](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

## 2. 配置密钥

密钥的配置步骤如下：

a. 在命令行终端或 Git Bash 使用命令 `ssh-keygen -t rsa -C "youremail@example.com"` 生成 SSH Key，注意替换为自己的邮箱。生成的 `id_rsa` 是私钥，`id_rsa.pub` 是公钥。(⚠️ 注意此处不要设置密码，生成的公私钥用于下面 GitHub / Gitee 的配置，以保证公私钥成对，否则从 GitHub -> Gitee 的同步将会失败。)

b. 在 GitHub 项目的「Settings -> Secrets and variables -> Actions」**Repository secrets**下配置好命名为 `GITEE_PRIVATE_KEY` 和 `GITEE_PASSWORD` 的两个密钥。其中：`GITEE_PRIVATE_KEY` 存放 `id_rsa` 私钥；`GITEE_PASSWORD` 存放 Gitee 帐号的密码。

c. 在 GitHub 的个人设置页面「[Settings -> SSH and GPG keys](https://github.com/settings/keys)」配置 SSH 公钥（即：`id_rsa.pub`），命名随意。

d. 在 Gitee 的个人设置页面「[安全设置 -> SSH 公钥](https://gitee.com/profile/sshkeys)」配置 SSH 公钥（即：`id_rsa.pub`），命名随意。

## 3. 关注 Gitee 公众号

关注 Gitee 官方公众号，并绑定个人 Gitee 帐号，用于接收帐号登录通知、以及绕过短信验证码校验，见[错误及解决方案](https://github.com/marketplace/actions/gitee-pages-action#错误及解决方案) 第 3 点。

## 4. 运行结果

如果一切配置正常，并成功触发 [Gitee Pages Action](https://github.com/marketplace/actions/gitee-pages-action) ，Gitee Pages Action 会打印出成功的结果。并且，我们会在 Gitee 公众号收到一条登录通知。这是 Gitee Pages Action 程序帮我们登录到 Gitee 官网，并为我们点击了项目的部署按钮。

<br/>

**参考文章： [Gitee Pages Action](https://github.com/marketplace/actions/gitee-pages-action)**
