# @tokiumjp/vscode-dict
ワークスペース直下のdict.ymlに記述された辞書情報をvscode上で閲覧できるようにする拡張機能です。
`dict.yml`の書式は以下の通りです。

```yaml
- name: ユーザー
  aliases:
    - 利用者
  description: システムの利用者です。
```

## Features
コードコメントのホバー時、コメントに含まれる辞書登録された単語を表示します。
現在、サポートされている言語は以下の通りです。
- Ruby
