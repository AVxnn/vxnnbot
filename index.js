const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const axios = require("axios");
const BrawlStars = require("brawlstars.js")
const tokens = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjUzYTQyOTcyLWEwOTgtNGNmNS04YThlLTA2YTU5ZWVhYmJjOCIsImlhdCI6MTY2MjE1MTE4MSwic3ViIjoiZGV2ZWxvcGVyL2Q5NDg0ZDJhLWJlNGMtNDQwNC0xOGJhLWI2ODM4OWMwYWNiYiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOC4yMS4xMTAuMjAiXSwidHlwZSI6ImNsaWVudCJ9XX0.mAuB-Ux5PRFceES2aSMknlZ19R8ajomm014U4t4hgFnEeynlg14eKlp6-p3HJJsrV2JYmC-SFoMgtRo6w8HnUg"
const client = new BrawlStars.Client(tokens)
const token = process.env.TELEGRAM_API_TOKEN || '';
const translit = require('./func/translit')

const bot = new TelegramBot(token, {polling: true});

const keyboard = [
  [
    {
      text: 'Сгенерировать котика',
      callback_data: 'generate'
    }
  ]
];

const gif = [
  [
    {
      text: 'Сгенерировать gifky',
      callback_data: 'gif'
    }
  ]
];

const generatee = async (e, url) => {
  await bot.sendPhoto(e, url, {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.from.id;
  let value = match[0].split(' ').filter((v, i) => i >= 2).join(' ')
  console.log(value)
  await bot.sendSticker(chatId, 'CAACAgQAAxkBAAEEnIdib_FFuDgXsXRfSksM4SefWQJY7gACjgsAAvsm6FJ-_p0kiwRi2iQE');
  await bot.sendMessage(chatId, `Приветики, тебя зовут ${msg.from.first_name} правильно?
Я думаю что мы с тобой отлично проведем время!`);

  setTimeout(() => {
    bot.sendMessage(chatId, `Команды есть в менюшке ниже или напиши в строке "/" `);
  }, 2000)
});

// ${msg.from.first_name} решил испытать свою удачу.
bot.onText(/\/q@MetaVxnn_bot (.+)/, async(msg, match) => {
  const value = match[1];
  console.log(msg, match)
  await bot.sendMessage(msg.chat.id, `
Действие: ${value}
Результат: ${Math.round(Math.random() * 1) == 1 ? 'Да' : 'Нет'}`)
});

// ${msg.from.first_name} решил испытать свою удачу.
bot.onText(/\/trans@MetaVxnn_bot (.+)/, async(msg, match) => {
  try {
    const value = match[1];
    console.log(value)
    console.log(msg, match)
    await bot.sendMessage(msg.chat.id, `${translit(value)}`)
  } catch (e) {
    console.log(e)
  }
});



bot.onText(/\/editable/, function onEditableText(msg) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Edit Text',
            // we shall check for this value when we listen
            // for "callback_query"
            callback_data: 'edit'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.from.id, 'Original Text', opts);
});


bot.onText(/\/love/, async function onLoveText(msg) {
  await bot.sendPoll(msg.chat.id, 'Is Telegram great?', ['Sure', 'Of course'], {is_anonymous: false})
});




// ${msg.from.first_name} решил испытать свою удачу.
bot.onText(/\/brawl@MetaVxnn_bot (.+)/, async(msg, match) => {
  const value = match[1];
  console.log(msg, match)
  const player = await client.getPlayer(value)
  const bestBrawler = player.brawlers.filter(i => i.trophies === Math.max(...player.brawlers.map(i => {return +i.trophies})))
  await bot.sendMessage(msg.chat.id, `Имя: ${player.name}, 
Тэг: ${player.tag}, 
Кубки: ${player.trophies}, 
всего побед: ${player.totalVictories}, 
всего бравлеров: ${player.brawlerCount},
  💚 любимый бравлер: ${bestBrawler[0].name},
  💚 сила: ${bestBrawler[0].power},
  💚 ранг: ${bestBrawler[0].rank},
  💚 кубков: ${bestBrawler[0].trophies}`)
});

bot.onText(/\/brawler@MetaVxnn_bot (.+)/, async(msg, match) => {
  const value = match[1];
  console.log(msg, match)
  const res = await client.getBrawlers()
  const brawler = res.data.filter(i => i.name === value.toUpperCase())
  console.log(brawler[0].gadgets)
  await bot.sendMessage(msg.chat.id, `Имя бравлера: ${brawler[0].name},
id: ${brawler[0].id},
Гаджеты: ${brawler[0].gadgets.length > 1 ? brawler[0].gadgets.map(i => (` ${i.name} `)) : `${brawler[0].gadgets[0].name}`},
Пассивки: ${brawler[0].starPowers.length > 1 ? brawler[0].starPowers.map(i => (` ${i.name} `)) : `${brawler[0].starPowers[0].name}`}`
  )});

bot.onText(/\/send@MetaVxnn_bot (.+) (.+)/, async (msg, match) => {
  if (msg.from.id === 679898263) {
    const chatI = match[1];
    let value = match[0].split(' ').filter((v, i) => i >= 2).join(' ')
    console.log(value)
    await bot.sendMessage(chatI, match[0].split(' ').filter((v, i) => i >= 2).join(' '));
  }
});

bot.onText(/\/cube/,async (msg) => {
  console.log(msg)
  await bot.sendMessage(msg.chat.id, `Я бросил(а) кубик и выпало число: ${Math.round(Math.random() * 6)}`)
});

// bot.onText(/\/idinaxyibot@MetaVxnn_bot (.+)/, async(msg, match) => {
//         const value = match[1];
//         console.log(msg, match)
//         await bot.sendMessage(msg.chat.id, `
// Действие: ${value}
// Результат: ${Math.round(Math.random() * 1) == 1 ? 'Да' : 'Нет'}`)
// });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id === 679898263) {
    bot.setMyCommands([
      {command: '/random', description: 'Генерация рандомного котика'},
      {command: '/gif', description: 'Генерация рандомной gif'},
      {command: '/q', description: 'Да или нет'},
      {command: '/idinaxyibot', description: 'Пошли нахуй бота'},
      {command: '/send', description: 'Отправить сообщение определенному человеку'},
      {command: '/sendall', description: 'Отправка сообщений всем юзерам'},
      {command: '/sticker', description: 'Отправить стикер определенному человеку'},
      {command: '/stickerall', description: 'Отправка стикера всем юзерам'},
      {command: '/photoall', description: 'Отправка фотографии всем юзерам'},
    ])
  } else {
    bot.setMyCommands([
      {command: '/random', description: 'Генерация рандомного котика'},
      {command: '/gif', description: 'Генерация рандомной gif'},
      {command: '/q', description: 'Да или нет'}
    ])
    bot.sendMessage(1676384990, `Имя: ${msg.from.first_name}; id: ${msg.from.id}; msg: ${msg.text}; chatId: ${msg.chat.id}`)
  }

  if (msg.text === '/random' || msg.text === '/random@MetaVxnn_bot') {
    axios.get('https://api.thecatapi.com/v1/images/search')
      .then(res => {
        url = res.data[0].url
        generatee(chatId, url)
      })
  }

  if (msg.text === '/gif' || msg.text === '/gif@MetaVxnn_bot') {
    axios.get('https://api.giphy.com/v1/gifs/random?api_key=E7urEC8EODS2Ua5cQehdGDIoIVtlbNmA&tag=&rating=g')
      .then(res => {
        url = res.data.data.images.preview.mp4;
        bot.sendVideo(chatId, url, {
          reply_markup: {
            inline_keyboard: gif
          }
        });
      })
  }

  if (msg.text === 'ты собака') {
    const opts = {
      reply_to_message_id: msg.message_id,
      'reply_markup': {
        'inline_keyboard' : [
          [{text: "Ответить", callback_data: "reply"}, {text: "Заготовка", callback_data: "defaul"}]
        ]
      }
    };
    await bot.sendMessage(msg.chat.id, `Сам ты собака`, opts)
    await bot.sendPoll(msg.chat.id, 'Is Telegram great?', ['Sure', 'Of course'], {is_anonymous: false})
    await bot.sendDice(msg.chat.id)
    console.log(msg);
    await bot.forwardMessage(msg.chat.id, 679898263, 1313)
  }

  if (msg.from.id === 679898263) {
    await bot.setMyCommands([
      {command: '/cube', description: 'Генерирует число от 1 до 6'},
      {command: '/trans', description: 'Перевод с Дариненого'},
    ])
    await bot.sendMessage(679898263, `Имя: ${msg.from.first_name};\nСообщение: ${msg.text};\nchatId: ${msg.chat.id}`, {
      'reply_markup': {
        'inline_keyboard' : [
          [{text: "Убрать клаву", callback_data: "clear"}, {text: "Заготовка", callback_data: "demo"}]
        ]
      }
    })
  } else {
    await bot.sendMessage(679898263, `Имя: ${msg.from.first_name};\nid: ${msg.from.id};\nСообщение: ${msg.text};\nchatId: ${msg.chat.id}`, {
      'reply_markup': {
        'inline_keyboard': [
          [{text: "Убрать клаву", callback_data: "clear"}, {text: "Заготовка", callback_data: "demo"}]
        ]
      }
    })
  }
})


// -1001178790101
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  let url = '';

  if (query.data === 'gif') {
    axios.get('https://api.giphy.com/v1/gifs/random?api_key=E7urEC8EODS2Ua5cQehdGDIoIVtlbNmA&tag=&rating=g')
      .then(res => {
        url = res.data.data.images.preview.mp4;
        bot.sendVideo(chatId, url, {
          reply_markup: {
            inline_keyboard: gif
          }
        });
      })
  }
  if (query.data == 'clear') {
    const action = query.data;
    const msg = query.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: {
        remove_keyboard: true
      }
    };
    let text;

    if (action === 'clear') {
      text = 'Клавиатура убрана';
    }

    bot.sendMessage(chatId, text, opts);
  }
  if(query.data == 'demo') {
    const opts = {
      reply_markup: JSON.stringify({
        'keyboard': [[`/send@MetaVxnn_bot ${query.message?.text?.match('chatId:[ ][ -[][0-9]*')[0].split(' ')[1]} Вам ответят в течении 30 минут`]],
        'inline_keyboard' : [
          [{text: "убрать клаву", callback_data: "clear"}]
        ]
      })
    };
    await bot.sendMessage(chatId, `Заготовка:`, opts)
}
  }
);