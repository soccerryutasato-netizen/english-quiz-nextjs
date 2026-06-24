export interface SampleAnswer {
  en: string;
  ja: string;
  pronunciation: string;
}

export interface IntermediateTemplate {
  id: string;
  num: number;
  question: string;
  questionJa: string;
  sampleAnswers: SampleAnswer[];
  docsUrl: string;
}

export const intermediateTemplates: IntermediateTemplate[] = [
  {
    id: "inter-1",
    num: 1,
    question: "Have you ever been to the US?",
    questionJa: "アメリカに行ったことはありますか？",
    sampleAnswers: [
      { en: "Yes, I have. I went to New York last year.", ja: "はい、あります。去年ニューヨークに行きました。", pronunciation: "イエス、アイ ハヴ。アイ ウェント トゥ ニューヨーク ラスト イヤー。" },
      { en: "No, I haven't, but I'd love to visit someday.", ja: "いいえ、ありません。でもいつか行ってみたいです。", pronunciation: "ノー、アイ ハヴント、バット アイド ラヴ トゥ ヴィジット サムデイ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/16-jwwm05rmVZZnDUBJtLVeTsYM4IvwcYdIGX_IUy8ys/edit?usp=sharing",
  },
  {
    id: "inter-2",
    num: 2,
    question: "Do you have any siblings?",
    questionJa: "兄弟姉妹はいますか？",
    sampleAnswers: [
      { en: "Yes, I have an older brother and a younger sister.", ja: "はい、兄と妹がいます。", pronunciation: "イエス、アイ ハヴ アン オールダー ブラザー アンド ア ヤンガー シスター。" },
      { en: "No, I'm an only child.", ja: "いいえ、一人っ子です。", pronunciation: "ノー、アイム アン オンリー チャイルド。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1d3evN66wR7Etao7KvMn6Uf9MDOCxt8Q0MUicm3BaIEI/edit?usp=sharing",
  },
  {
    id: "inter-3",
    num: 3,
    question: "When is your birthday?",
    questionJa: "誕生日はいつですか？",
    sampleAnswers: [
      { en: "My birthday is on March 15th.", ja: "私の誕生日は3月15日です。", pronunciation: "マイ バースデイ イズ オン マーチ フィフティーンス。" },
      { en: "It's in July. July 20th.", ja: "7月です。7月20日です。", pronunciation: "イッツ イン ジュライ。ジュライ トゥエンティース。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1ATbCHGWFixz7Y0lJtnrMKB6-MaQ2lLmjt91T7RwOdK4/edit?usp=sharing",
  },
  {
    id: "inter-4",
    num: 4,
    question: "How many countries have you ever been to?",
    questionJa: "今まで何カ国行ったことがありますか？",
    sampleAnswers: [
      { en: "I've been to about five countries, including Thailand and Korea.", ja: "タイや韓国を含めて5カ国くらい行ったことがあります。", pronunciation: "アイヴ ビーン トゥ アバウト ファイヴ カントリーズ、インクルーディング タイランド アンド コリア。" },
      { en: "I've only been to two countries so far.", ja: "今のところ2カ国だけです。", pronunciation: "アイヴ オンリー ビーン トゥ トゥー カントリーズ ソー ファー。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1PIvfEZy47BTcODxiRhNMFQa6Dhx5Pq3VxW2C-Otnukc/edit?usp=sharing",
  },
  {
    id: "inter-5",
    num: 5,
    question: "What are you gonna do for today?",
    questionJa: "今日は何をする予定ですか？",
    sampleAnswers: [
      { en: "I'm gonna study English and then go to the gym.", ja: "英語を勉強して、そのあとジムに行く予定です。", pronunciation: "アイム ゴナ スタディ イングリッシュ アンド ゼン ゴー トゥ ザ ジム。" },
      { en: "I'm just gonna relax at home today.", ja: "今日は家でゆっくりするつもりです。", pronunciation: "アイム ジャスト ゴナ リラックス アット ホーム トゥデイ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1lIej62bjgRlNvZgQU7z-bHkFwDf4IwHPWnQP8yOJw6g/edit?usp=sharing",
  },
  {
    id: "inter-6",
    num: 6,
    question: "What did you do yesterday?",
    questionJa: "昨日は何をしましたか？",
    sampleAnswers: [
      { en: "I went shopping with my friends.", ja: "友達と買い物に行きました。", pronunciation: "アイ ウェント ショッピング ウィズ マイ フレンズ。" },
      { en: "I stayed home and watched Netflix all day.", ja: "家にいて一日中ネットフリックスを見ていました。", pronunciation: "アイ ステイド ホーム アンド ウォッチト ネットフリックス オール デイ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/13heuHL-myiRc2KVg0-hPk6hgAqnegSOaTfO5rNme-NM/edit?usp=sharing",
  },
  {
    id: "inter-7",
    num: 7,
    question: "What club were you in when you were a student?",
    questionJa: "学生のとき、何部でしたか？",
    sampleAnswers: [
      { en: "I was in the soccer club.", ja: "サッカー部でした。", pronunciation: "アイ ワズ イン ザ サッカー クラブ。" },
      { en: "I was in the art club in high school.", ja: "高校では美術部でした。", pronunciation: "アイ ワズ イン ジ アート クラブ イン ハイスクール。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1zs2sHSx7VqhJWD3uzFs0ZXK5lcfE5nueQj75yJe1ukE/edit?usp=sharing",
  },
  {
    id: "inter-8",
    num: 8,
    question: "Do you have any pets?",
    questionJa: "ペットは飼っていますか？",
    sampleAnswers: [
      { en: "Yes, I have a cat. Her name is Mochi.", ja: "はい、猫を飼っています。名前はモチです。", pronunciation: "イエス、アイ ハヴ ア キャット。ハー ネイム イズ モチ。" },
      { en: "No, I don't, but I want to get a dog someday.", ja: "いいえ、でもいつか犬を飼いたいです。", pronunciation: "ノー、アイ ドント、バット アイ ウォント トゥ ゲット ア ドッグ サムデイ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/12E9qFQ_E89WuoK-cnwzFD8MSCnmvdRLpFsevwKBQpT8/edit?usp=sharing",
  },
  {
    id: "inter-9",
    num: 9,
    question: "What season do you like?",
    questionJa: "どの季節が好きですか？",
    sampleAnswers: [
      { en: "I like spring because the weather is nice and the cherry blossoms are beautiful.", ja: "春が好きです。天気がいいし、桜がきれいだからです。", pronunciation: "アイ ライク スプリング ビコーズ ザ ウェザー イズ ナイス アンド ザ チェリー ブロッサムズ アー ビューティフル。" },
      { en: "I like winter. I love snowboarding.", ja: "冬が好きです。スノーボードが大好きです。", pronunciation: "アイ ライク ウィンター。アイ ラヴ スノーボーディング。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1ccysxPsvF-acOrZrFr-Hut-qjBhHe3Uof6hNUk-_FmU/edit?usp=sharing",
  },
  {
    id: "inter-10",
    num: 10,
    question: "Where do you live?",
    questionJa: "どこに住んでいますか？",
    sampleAnswers: [
      { en: "I live in Tokyo.", ja: "東京に住んでいます。", pronunciation: "アイ リヴ イン トーキョー。" },
      { en: "I live in Osaka. It's a really fun city.", ja: "大阪に住んでいます。とても楽しい街です。", pronunciation: "アイ リヴ イン オーサカ。イッツ ア リアリー ファン シティ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1juBOw-JZLWJqQMo9ceL9oPLCtYNX2qnJkG5bD9u0TKQ/edit?usp=sharing",
  },
  {
    id: "inter-11",
    num: 11,
    question: "What do you do?",
    questionJa: "お仕事は何をされていますか？",
    sampleAnswers: [
      { en: "I'm an engineer. I work at a tech company.", ja: "エンジニアです。IT企業で働いています。", pronunciation: "アイム アン エンジニア。アイ ワーク アット ア テック カンパニー。" },
      { en: "I'm a student. I'm studying business.", ja: "学生です。ビジネスを勉強しています。", pronunciation: "アイム ア ステューデント。アイム スタディイング ビジネス。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1jSyn0Vbc69xQSWeOPd-J_3_pY0U9VmySJkd6UPopEmI/edit?usp=sharing",
  },
  {
    id: "inter-12",
    num: 12,
    question: "Do you like anime?",
    questionJa: "アニメは好きですか？",
    sampleAnswers: [
      { en: "Yes, I love anime! My favorite is One Piece.", ja: "はい、アニメ大好きです！一番好きなのはワンピースです。", pronunciation: "イエス、アイ ラヴ アニメ！マイ フェイバリット イズ ワンピース。" },
      { en: "Not really, but I've seen a few popular ones.", ja: "あまり見ませんが、人気のは何個か見ました。", pronunciation: "ノット リアリー、バット アイヴ シーン ア フュー ポピュラー ワンズ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1YjRgZokPhSb8CPHpbGIc9kcfx1outTloTDUaaVHNkdw/edit?usp=sharing",
  },
  {
    id: "inter-13",
    num: 13,
    question: "Are there any good restaurants you recommend?",
    questionJa: "おすすめのレストランはありますか？",
    sampleAnswers: [
      { en: "Yes! There's a great ramen shop near my house.", ja: "はい！家の近くにおいしいラーメン屋があります。", pronunciation: "イエス！ゼアーズ ア グレイト ラーメン ショップ ニア マイ ハウス。" },
      { en: "I'd recommend this Italian place in Shibuya.", ja: "渋谷のイタリアンのお店がおすすめです。", pronunciation: "アイド レコメンド ディス イタリアン プレイス イン シブヤ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/11vOXWL6Lt7DOhcZuUHdub7hMGFRlcserwDzv4ecGA5k/edit?usp=sharing",
  },
  {
    id: "inter-14",
    num: 14,
    question: "What did you eat for dinner?",
    questionJa: "夕飯は何を食べましたか？",
    sampleAnswers: [
      { en: "I had curry and rice. It was delicious.", ja: "カレーライスを食べました。おいしかったです。", pronunciation: "アイ ハド カリー アンド ライス。イット ワズ デリシャス。" },
      { en: "I ate sushi at a restaurant with my family.", ja: "家族とレストランでお寿司を食べました。", pronunciation: "アイ エイト スシ アット ア レストラン ウィズ マイ ファミリー。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1KohHw6VEUDjOQTmXjPiwusyOxkB3EWKNcp3M4bFyYpE/edit?usp=sharing",
  },
  {
    id: "inter-15",
    num: 15,
    question: "Do you play any sports?",
    questionJa: "何かスポーツはしますか？",
    sampleAnswers: [
      { en: "Yes, I play soccer every weekend.", ja: "はい、毎週末サッカーをしています。", pronunciation: "イエス、アイ プレイ サッカー エブリ ウィーケンド。" },
      { en: "Not anymore, but I used to play basketball.", ja: "もうしてませんが、昔はバスケをしていました。", pronunciation: "ノット エニモア、バット アイ ユースト トゥ プレイ バスケットボール。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1SnfBIXAwzPwXvTO0l-vNl_OAuX5I6H4S1IcUV4y3EqA/edit?usp=sharing",
  },
  {
    id: "inter-16",
    num: 16,
    question: "Do you eat breakfast?",
    questionJa: "朝ごはんは食べますか？",
    sampleAnswers: [
      { en: "Yes, I always eat toast and eggs.", ja: "はい、いつもトーストと卵を食べます。", pronunciation: "イエス、アイ オールウェイズ イート トースト アンド エッグズ。" },
      { en: "Sometimes. On weekdays, I usually skip it.", ja: "たまにです。平日はだいたい食べません。", pronunciation: "サムタイムズ。オン ウィークデイズ、アイ ユージュアリー スキップ イット。" },
    ],
    docsUrl: "https://docs.google.com/document/d/191SCQRV05myCkFbjozov-p2t4rYh71gp0BbJOYQP144/edit?usp=sharing",
  },
  {
    id: "inter-17",
    num: 17,
    question: "What's your favorite snack?",
    questionJa: "好きなお菓子は何ですか？",
    sampleAnswers: [
      { en: "I love chocolate. Especially dark chocolate.", ja: "チョコレートが大好きです。特にダークチョコレート。", pronunciation: "アイ ラヴ チョコレート。エスペシャリー ダーク チョコレート。" },
      { en: "My favorite snack is potato chips.", ja: "好きなお菓子はポテトチップスです。", pronunciation: "マイ フェイバリット スナック イズ ポテト チップス。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1_X-6spmGAdyQfgLpYqKtMSlWZozV6dr4EM1kRlyDtT0/edit?usp=sharing",
  },
  {
    id: "inter-18",
    num: 18,
    question: "What's your favorite sport?",
    questionJa: "好きなスポーツは何ですか？",
    sampleAnswers: [
      { en: "My favorite sport is soccer. I watch it every week.", ja: "好きなスポーツはサッカーです。毎週見ています。", pronunciation: "マイ フェイバリット スポート イズ サッカー。アイ ウォッチ イット エブリ ウィーク。" },
      { en: "I really like tennis. I play it with my friends.", ja: "テニスがすごく好きです。友達と一緒にやっています。", pronunciation: "アイ リアリー ライク テニス。アイ プレイ イット ウィズ マイ フレンズ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1gKs5cZF8K1h3TXYvnNtx_qXHSLou8-pL7Ixt7QRxMbM/edit?usp=sharing",
  },
  {
    id: "inter-19",
    num: 19,
    question: "What's your favorite fruit?",
    questionJa: "好きな果物は何ですか？",
    sampleAnswers: [
      { en: "I love strawberries. They're so sweet.", ja: "いちごが大好きです。すごく甘いです。", pronunciation: "アイ ラヴ ストロベリーズ。ゼイアー ソー スウィート。" },
      { en: "My favorite fruit is mango.", ja: "好きな果物はマンゴーです。", pronunciation: "マイ フェイバリット フルート イズ マンゴー。" },
    ],
    docsUrl: "https://docs.google.com/document/d/14tRWB8tQlAFNoOGAkY3JTeA8CgwI1mYifnCBDP1QR8Y/edit?usp=sharing",
  },
  {
    id: "inter-20",
    num: 20,
    question: "What time do you usually get up?",
    questionJa: "普段何時に起きますか？",
    sampleAnswers: [
      { en: "I usually get up at 7 a.m.", ja: "だいたい朝7時に起きます。", pronunciation: "アイ ユージュアリー ゲット アップ アット セブン エイエム。" },
      { en: "Around 6:30 on weekdays, but on weekends I sleep in until 10.", ja: "平日は6時半くらい、週末は10時まで寝てます。", pronunciation: "アラウンド シックスサーティ オン ウィークデイズ、バット オン ウィーケンズ アイ スリープ イン アンティル テン。" },
    ],
    docsUrl: "https://docs.google.com/document/d/10KhVez-4rIIoqoZmxpFdqUh3AIk_-wGrNH6ZyVNvAyU/edit?usp=sharing",
  },
  {
    id: "inter-21",
    num: 21,
    question: "What do you like to do in your free time?",
    questionJa: "暇なとき何をするのが好きですか？",
    sampleAnswers: [
      { en: "I like watching movies and playing video games.", ja: "映画を見たりゲームをするのが好きです。", pronunciation: "アイ ライク ウォッチング ムービーズ アンド プレイング ビデオ ゲームズ。" },
      { en: "I enjoy reading books and going for walks.", ja: "読書と散歩を楽しんでいます。", pronunciation: "アイ エンジョイ リーディング ブックス アンド ゴーイング フォー ウォークス。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1-FEmody9xYx4Zt282nqUwcN-iiGBUVI4OntMmMSEqpc/edit?usp=sharing",
  },
  {
    id: "inter-22",
    num: 22,
    question: "What's your favorite song?",
    questionJa: "好きな曲は何ですか？",
    sampleAnswers: [
      { en: "My favorite song is 'Shape of You' by Ed Sheeran.", ja: "好きな曲はエド・シーランの「Shape of You」です。", pronunciation: "マイ フェイバリット ソング イズ 'シェイプ オブ ユー' バイ エド シーラン。" },
      { en: "I really like 'Lemon' by Kenshi Yonezu.", ja: "米津玄師の「Lemon」がすごく好きです。", pronunciation: "アイ リアリー ライク 'レモン' バイ ケンシ ヨネヅ。" },
    ],
    docsUrl: "https://docs.google.com/document/d/1wJoIc3QpcCakFKRXOKFMeETv9hacILaiI2-tE77HOf4/edit?usp=sharing",
  },
];
