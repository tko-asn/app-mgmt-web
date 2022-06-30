# AppMGMT

## 概要
Webアプリを管理・紹介するためのアプリです。

※ GitHubのようなコードを共有する機能はありません。  


## 使用技術
- HTML/CSS  
- JavaScript  
- TypeScript v4.6.2  
- React v17.0.2  
- react-router-dom v6.2.2  
- @apollo/client v3.5.10  
- Auth0


## インフラ
- AWS
  - CloudFront
  - S3
- Docker Compose（開発環境）

## ゲストユーザー
以下の情報でログインできます。
- Email： `guest@test.mail`  
- パスワード： Guest-password01

## 機能一覧
- 投稿（アプリ）機能
  - 一覧取得機能
  - 詳細取得機能
  - 作成機能
  - 更新機能
  - 削除機能
- ユーザー機能
  - 認証機能（Auth0）
  - プロフィール作成機能
  - プロフィール更新機能
- チーム機能
  - 一覧取得機能
  - 詳細取得機能
  - 作成機能
  - 更新機能
- コメント機能
  - 一覧取得機能
  - 作成機能
  - 更新機能
  - 削除機能


## アプリのURL
https://d3iyd71mpt9xb0.cloudfront.net/top  


## 作成理由
ReactとTypeScriptの知識のアウトプットのために作成しました。  


## バックエンド側のリポジトリ
https://github.com/tko-asn/app-mgmt-api



