# hanbaikanri
# ゼロジャパン 売上自動集計システム 開発メモ

## ■ システム概要
- システム名：ゼロジャパン 売上自動集計システム
- 業種：ブランド品・貴金属・金券のリユース販売（実店舗・WEB）
- 現状：40店舗・120名 → 将来：300〜500店舗対応
- 構成：GitHub + Supabase + Vercel

---

## ■ 接続情報

| サービス | URL / 情報 |
|---|---|
| Vercel（公開URL） | https://hanbaikanri-iota.vercel.app |
| GitHub | https://github.com/ZEROJAPAN/hanbaikanri |
| Supabase URL | https://fvkssslpmjtykxoulfmf.supabase.co |
| Supabase KEY | sb_publishable_cE7_r5efkdwSM7YM_8qZmw_6Cxrwfpk |
| テスト用ログイン | ID: admin / PW: 1234 |

---

## ■ 作成済みファイル一覧

### メイン画面
| ファイル | 内容 | 状態 |
|---|---|---|
| login.html | ログイン画面（Supabase接続・店舗選択） | ✅完成 |
| index.html | トップメニュー（立体ボタン・青/緑/赤） | ✅完成 |
| master.html | マスタ管理メニュー | ✅完成 |
| daily.html | 日報入力画面（Supabase保存・ヘッダー固定・日報出力ボタン） | ✅完成 |
| nippo_export.html | 日報帳票Excel出力（1日・期間対応） | ✅完成 |

### 日報サイドメニュー
| ファイル | 内容 | 状態 |
|---|---|---|
| purchase_detail.html | 買取明細（来店動機・キャンセル率・リピーター率） | ✅完成 |
| gold_recovery.html | 地金回収（回収日連動・前日繰越自動取得） | ✅完成 |
| telecard_recovery.html | テレカ・金券回収（回収日連動） | ✅完成 |
| stamp_recovery.html | 切手・印紙回収（行追加方式・月末在庫） | ✅完成 |
| cash_register.html | 金庫〜レジ（金種表・日報連動・過不足警告） | ✅完成 |

### 組織マスタ
| ファイル | 内容 | 状態 |
|---|---|---|
| dept_master.html | 部門マスタ | ✅完成 |
| area_master.html | エリア／課マスタ（fetch方式） | ✅完成 |
| group_master.html | グループマスタ（fetch方式） | ✅完成 |
| team_master.html | チームマスタ（fetch方式） | ✅完成 |
| store_master.html | 店舗マスタ（所属チーム選択対応） | ✅完成 |

### 商品・買取関係マスタ
| ファイル | 内容 | 状態 |
|---|---|---|
| product_category_master.html | 仕入商品カテゴリーマスタ（17品目） | ✅完成 |
| precious_metal_master.html | 地金金種マスタ（22種） | ✅完成 |
| stamp_master.html | 切手・はがき・印紙マスタ（8種） | ✅完成 |
| visit_reason_master.html | 来店動機マスタ（18種） | ✅完成 |
| gift_card_master.html | テレカ・金券マスタ（13種） | ✅完成 |

### システム管理
| ファイル | 内容 | 状態 |
|---|---|---|
| recovery_calendar.html | 回収カレンダー（全店共通・店舗別対応） | ✅完成 |
| bulk_import.html | CSV一括登録（部門〜店舗の5タブ） | ✅完成 |

---

## ■ Supabaseテーブル構成

### 組織系
```
departments（部門）
　└ areas（エリア／課）
　　　└ groups（グループ）
　　　　　└ teams（チーム）
　　　　　　　└ stores（店舗）
```

### ユーザー系
```
positions（職制・13種登録済み）
clusters（クラスタ）
users（ユーザー・store_idで店舗紐付け）
```

### 商品・チャンネル系
```
product_categories（仕入商品カテゴリー・17品目）
precious_metal_types（地金金種・22種）
stamp_types（切手・はがき・印紙・8種）
visit_reasons（来店動機・18種）
gift_card_types（テレカ・金券・13種）
categories（商品カテゴリ・12品目）
channels（販売チャンネル・21種）
```

### 日次データ系
```
daily_reports（日報データ）
purchase_details（買取明細・来店動機別）
gold_recovery（地金回収）
telecard_recovery（テレカ・金券回収）
stamp_recovery（切手・印紙回収）
cash_register（金庫〜レジ・金種表）
recovery_calendar（回収カレンダー・store_id NULL=全店共通）
```

---

## ■ 組織階層
```
部門 → エリア／課 → グループ → チーム → 店舗
```

## ■ 職制（13種）
社長 / 取締役 / 部長 / 次長 / 課長 / エリアマネージャー /
グループリーダー / チームリーダー / 主任 / 店長 / 副店長 /
上級スタッフ / 一般スタッフ

---

## ■ 販売チャンネル（21列）
買取 / キャンセル / 店売り / 店売り（免税）/ 本店 / 楽天国内 /
楽天海外（免税）/ YahooShop / ヤフオク / Wowma! / メルカリ /
ebay（免税）/ LuxUness / Amazon / サブスク / ラクマ / Qoo10 /
GLOBAZONE / オークション / WEB販売 / その他販売

---

## ■ 解決済み技術課題
- RLSポリシー：UPDATE時にUSING(true)が必要 → fix_rls_policies.sqlで全テーブル修正済み
- ボタン戻り問題：type="button"未指定でsubmit扱い → 全ボタンに追加済み
- DB保存問題：Supabase SDK経由の通信がブラウザ拡張機能に邪魔される → fetch直接呼び出し方式に変更
- ヘッダー固定：2行ヘッダーのsticky問題 → 商品名を2行に分割・CSS変数で動的設定
- 店舗ログイン連動：store_idをlocalStorageに保存して直接照合
- tax未定義エラー：forEachスコープ外で参照していた → taxShop変数に修正

---

## ■ 未作成・PENDING項目
- [ ] ユーザーマスタ画面（user_master.html）
- [ ] 職制・クラスタマスタ画面（rank_master.html）
- [ ] 日報帳票出力の動作確認・調整
- [ ] 集計・レポート画面
- [ ] Supabase本番認証（現在はPW=1234の仮認証）

---

## ■ 次回作業予定
1. ユーザーマスタ・職制クラスタマスタ画面
2. 日報出力の動作確認・調整
3. 集計・レポート画面
