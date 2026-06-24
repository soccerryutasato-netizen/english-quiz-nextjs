export interface IntermediateTemplate {
  id: string;
  num: number;
  question: string;
  questionJa: string;
  sampleAnswers: string[];
  docsUrl: string;
}

export const intermediateTemplates: IntermediateTemplate[] = [
  {
    id: "inter-1",
    num: 1,
    question: "Have you ever been to the US?",
    questionJa: "アメリカに行ったことはありますか？",
    sampleAnswers: [
      "Yes, I have. I went to New York last year.",
      "No, I haven't, but I'd love to visit someday.",
    ],
    docsUrl: "https://docs.google.com/document/d/16-jwwm05rmVZZnDUBJtLVeTsYM4IvwcYdIGX_IUy8ys/edit?usp=sharing",
  },
  {
    id: "inter-2",
    num: 2,
    question: "Do you have any siblings?",
    questionJa: "兄弟姉妹はいますか？",
    sampleAnswers: [
      "Yes, I have an older brother and a younger sister.",
      "No, I'm an only child.",
    ],
    docsUrl: "https://docs.google.com/document/d/1d3evN66wR7Etao7KvMn6Uf9MDOCxt8Q0MUicm3BaIEI/edit?usp=sharing",
  },
  {
    id: "inter-3",
    num: 3,
    question: "When is your birthday?",
    questionJa: "誕生日はいつですか？",
    sampleAnswers: [
      "My birthday is on March 15th.",
      "It's in July. July 20th.",
    ],
    docsUrl: "https://docs.google.com/document/d/1ATbCHGWFixz7Y0lJtnrMKB6-MaQ2lLmjt91T7RwOdK4/edit?usp=sharing",
  },
  {
    id: "inter-4",
    num: 4,
    question: "How many countries have you ever been to?",
    questionJa: "今まで何カ国行ったことがありますか？",
    sampleAnswers: [
      "I've been to about five countries, including Thailand and Korea.",
      "I've only been to two countries so far.",
    ],
    docsUrl: "https://docs.google.com/document/d/1PIvfEZy47BTcODxiRhNMFQa6Dhx5Pq3VxW2C-Otnukc/edit?usp=sharing",
  },
  {
    id: "inter-5",
    num: 5,
    question: "What are you gonna do for today?",
    questionJa: "今日は何をする予定ですか？",
    sampleAnswers: [
      "I'm gonna study English and then go to the gym.",
      "I'm just gonna relax at home today.",
    ],
    docsUrl: "https://docs.google.com/document/d/1lIej62bjgRlNvZgQU7z-bHkFwDf4IwHPWnQP8yOJw6g/edit?usp=sharing",
  },
  {
    id: "inter-6",
    num: 6,
    question: "What did you do yesterday?",
    questionJa: "昨日は何をしましたか？",
    sampleAnswers: [
      "I went shopping with my friends.",
      "I stayed home and watched Netflix all day.",
    ],
    docsUrl: "https://docs.google.com/document/d/13heuHL-myiRc2KVg0-hPk6hgAqnegSOaTfO5rNme-NM/edit?usp=sharing",
  },
  {
    id: "inter-7",
    num: 7,
    question: "What club were you in when you were a student?",
    questionJa: "学生のとき、何部でしたか？",
    sampleAnswers: [
      "I was in the soccer club.",
      "I was in the art club in high school.",
    ],
    docsUrl: "https://docs.google.com/document/d/1zs2sHSx7VqhJWD3uzFs0ZXK5lcfE5nueQj75yJe1ukE/edit?usp=sharing",
  },
  {
    id: "inter-8",
    num: 8,
    question: "Do you have any pets?",
    questionJa: "ペットは飼っていますか？",
    sampleAnswers: [
      "Yes, I have a cat. Her name is Mochi.",
      "No, I don't, but I want to get a dog someday.",
    ],
    docsUrl: "https://docs.google.com/document/d/12E9qFQ_E89WuoK-cnwzFD8MSCnmvdRLpFsevwKBQpT8/edit?usp=sharing",
  },
  {
    id: "inter-9",
    num: 9,
    question: "What season do you like?",
    questionJa: "どの季節が好きですか？",
    sampleAnswers: [
      "I like spring because the weather is nice and the cherry blossoms are beautiful.",
      "I like winter. I love snowboarding.",
    ],
    docsUrl: "https://docs.google.com/document/d/1ccysxPsvF-acOrZrFr-Hut-qjBhHe3Uof6hNUk-_FmU/edit?usp=sharing",
  },
  {
    id: "inter-10",
    num: 10,
    question: "Where do you live?",
    questionJa: "どこに住んでいますか？",
    sampleAnswers: [
      "I live in Tokyo.",
      "I live in Osaka. It's a really fun city.",
    ],
    docsUrl: "https://docs.google.com/document/d/1juBOw-JZLWJqQMo9ceL9oPLCtYNX2qnJkG5bD9u0TKQ/edit?usp=sharing",
  },
  {
    id: "inter-11",
    num: 11,
    question: "What do you do?",
    questionJa: "お仕事は何をされていますか？",
    sampleAnswers: [
      "I'm an engineer. I work at a tech company.",
      "I'm a student. I'm studying business.",
    ],
    docsUrl: "https://docs.google.com/document/d/1jSyn0Vbc69xQSWeOPd-J_3_pY0U9VmySJkd6UPopEmI/edit?usp=sharing",
  },
  {
    id: "inter-12",
    num: 12,
    question: "Do you like anime?",
    questionJa: "アニメは好きですか？",
    sampleAnswers: [
      "Yes, I love anime! My favorite is One Piece.",
      "Not really, but I've seen a few popular ones.",
    ],
    docsUrl: "https://docs.google.com/document/d/1YjRgZokPhSb8CPHpbGIc9kcfx1outTloTDUaaVHNkdw/edit?usp=sharing",
  },
  {
    id: "inter-13",
    num: 13,
    question: "Are there any good restaurants you recommend?",
    questionJa: "おすすめのレストランはありますか？",
    sampleAnswers: [
      "Yes! There's a great ramen shop near my house.",
      "I'd recommend this Italian place in Shibuya.",
    ],
    docsUrl: "https://docs.google.com/document/d/11vOXWL6Lt7DOhcZuUHdub7hMGFRlcserwDzv4ecGA5k/edit?usp=sharing",
  },
  {
    id: "inter-14",
    num: 14,
    question: "What did you eat for dinner?",
    questionJa: "夕飯は何を食べましたか？",
    sampleAnswers: [
      "I had curry and rice. It was delicious.",
      "I ate sushi at a restaurant with my family.",
    ],
    docsUrl: "https://docs.google.com/document/d/1KohHw6VEUDjOQTmXjPiwusyOxkB3EWKNcp3M4bFyYpE/edit?usp=sharing",
  },
  {
    id: "inter-15",
    num: 15,
    question: "Do you play any sports?",
    questionJa: "何かスポーツはしますか？",
    sampleAnswers: [
      "Yes, I play soccer every weekend.",
      "Not anymore, but I used to play basketball.",
    ],
    docsUrl: "https://docs.google.com/document/d/1SnfBIXAwzPwXvTO0l-vNl_OAuX5I6H4S1IcUV4y3EqA/edit?usp=sharing",
  },
  {
    id: "inter-16",
    num: 16,
    question: "Do you eat breakfast?",
    questionJa: "朝ごはんは食べますか？",
    sampleAnswers: [
      "Yes, I always eat toast and eggs.",
      "Sometimes. On weekdays, I usually skip it.",
    ],
    docsUrl: "https://docs.google.com/document/d/191SCQRV05myCkFbjozov-p2t4rYh71gp0BbJOYQP144/edit?usp=sharing",
  },
  {
    id: "inter-17",
    num: 17,
    question: "What's your favorite snack?",
    questionJa: "好きなお菓子は何ですか？",
    sampleAnswers: [
      "I love chocolate. Especially dark chocolate.",
      "My favorite snack is potato chips.",
    ],
    docsUrl: "https://docs.google.com/document/d/1_X-6spmGAdyQfgLpYqKtMSlWZozV6dr4EM1kRlyDtT0/edit?usp=sharing",
  },
  {
    id: "inter-18",
    num: 18,
    question: "What's your favorite sport?",
    questionJa: "好きなスポーツは何ですか？",
    sampleAnswers: [
      "My favorite sport is soccer. I watch it every week.",
      "I really like tennis. I play it with my friends.",
    ],
    docsUrl: "https://docs.google.com/document/d/1gKs5cZF8K1h3TXYvnNtx_qXHSLou8-pL7Ixt7QRxMbM/edit?usp=sharing",
  },
  {
    id: "inter-19",
    num: 19,
    question: "What's your favorite fruit?",
    questionJa: "好きな果物は何ですか？",
    sampleAnswers: [
      "I love strawberries. They're so sweet.",
      "My favorite fruit is mango.",
    ],
    docsUrl: "https://docs.google.com/document/d/14tRWB8tQlAFNoOGAkY3JTeA8CgwI1mYifnCBDP1QR8Y/edit?usp=sharing",
  },
  {
    id: "inter-20",
    num: 20,
    question: "What time do you usually get up?",
    questionJa: "普段何時に起きますか？",
    sampleAnswers: [
      "I usually get up at 7 a.m.",
      "Around 6:30 on weekdays, but on weekends I sleep in until 10.",
    ],
    docsUrl: "https://docs.google.com/document/d/10KhVez-4rIIoqoZmxpFdqUh3AIk_-wGrNH6ZyVNvAyU/edit?usp=sharing",
  },
  {
    id: "inter-21",
    num: 21,
    question: "What do you like to do in your free time?",
    questionJa: "暇なとき何をするのが好きですか？",
    sampleAnswers: [
      "I like watching movies and playing video games.",
      "I enjoy reading books and going for walks.",
    ],
    docsUrl: "https://docs.google.com/document/d/1-FEmody9xYx4Zt282nqUwcN-iiGBUVI4OntMmMSEqpc/edit?usp=sharing",
  },
  {
    id: "inter-22",
    num: 22,
    question: "What's your favorite song?",
    questionJa: "好きな曲は何ですか？",
    sampleAnswers: [
      "My favorite song is 'Shape of You' by Ed Sheeran.",
      "I really like 'Lemon' by Kenshi Yonezu.",
    ],
    docsUrl: "https://docs.google.com/document/d/1wJoIc3QpcCakFKRXOKFMeETv9hacILaiI2-tE77HOf4/edit?usp=sharing",
  },
];
