const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const axios = require("axios");
const token = process.env.TELEGRAM_API_TOKEN || '';
const translit = require('./func/translit')
const logger = require('./middleware/logger')

const bot = new TelegramBot(token, {polling: true});

let data = {
  admin: '',
  user: '',
  isActive: false,
  stars: false
}

let trans = {
  active: false,
  user: '',
  admin: ''
}

let frontwars = [
  {
    name: 'Что выведет консоль?',
    quest: ['1', '2', '3', '4']
  }
]

const keyboard = [
  [
    {
      text: 'Сгенерировать котика',
      callback_data: 'cat'
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

const generatee = async (msg, url) => {
  console.log(msg);
  await bot.editMessageMedia({
    type: 'photo',
    media: url,
  },
  {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: keyboard
    }
  })
}

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

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.from.id;
  let value = match[0].split(' ').filter((v, i) => i >= 2).join(' ')
  console.log(value)
  await bot.sendSticker(chatId, 'CAACAgQAAxkBAAEEnIdib_FFuDgXsXRfSksM4SefWQJY7gACjgsAAvsm6FJ-_p0kiwRi2iQE');
  await bot.sendMessage(chatId, `Привет я бот одного популярного человека, если хочешь узнать по больше команд то напиши /help `);

  setTimeout(() => {
    bot.sendMessage(chatId, `А так же ты можешь написать /report "text" и в скором времени я отвечу тебе лично`);
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

bot.onText(/\/send@MetaVxnn_bot (.+) (.+)/, async (msg, match) => {
  if (msg.from.id === 679898263) {
    const chatI = match[1];
    let value = match[0].split(' ').filter((v, i) => i >= 2).join(' ')
    console.log(value)
    await bot.sendMessage(chatI, match[0].split(' ').filter((v, i) => i >= 2).join(' '));
  }
});
bot.onText(/\/report@MetaVxnn_Bot (.+)/, async (msg, match) => {
  console.log(12,msg);
  await bot.sendMessage(679898263, `${msg.from.first_name}
Сообщение: ${match[1]} 
id ${msg.from.id};
messageId ${msg.message_id}`, {
    'reply_markup': {
      'inline_keyboard': [
        [{text: "Подключиться", callback_data: "connect"}, {text: "Удалить", callback_data: "delete"}],
        [{text: "Ответить позже", callback_data: "also"}]
      ]
    }
  });
  await bot.sendMessage(msg.chat.id, "Вы отправили репорт админу, если он сочтет это интересным он ответит вам -_-");
});

bot.onText(/\/cube/,async (msg) => {
  console.log(msg)
  await bot.sendMessage(msg.chat.id, `Я бросил(а) кубик и выпало число: ${Math.round(Math.random() * 6)}`)
});


bot.setMyCommands(JSON.stringify([
  {command: '/random', description: 'Генерация рандомного котика'},
  {command: '/cube', description: 'Кинуть куб'},
  {command: '/gif', description: 'Генерация рандомной gif'},
  {command: '/q', description: 'Да или нет'},
  {command: '/report', description: 'Связь с админом'},
  {command: '/trans', description: 'Перевод с английского на русский раскладка'},
  {command: '/help', description: 'Все команды'},
]))

bot.on('message', async (msg) => {
  logger(msg)

  const chatId = msg.chat.id;
  console.log(data);

  if (msg.text === '/random' || msg.text === '/random@MetaVxnn_bot') {
    axios.get('https://api.thecatapi.com/v1/images/search')
      .then(res => {
        url = res.data[0].url
        bot.sendPhoto(msg.chat.id, url, {
          reply_markup: {
            inline_keyboard: keyboard
          }
        })
      })
  }

  if (msg.text === '/frontwars' || msg.text === '/frontwars@MetaVxnn_bot') {
    await bot.sendMessage(msg.chat.id, ``)
  }

  if (msg.text === '/help' || msg.text === '/help@MetaVxnn_bot') {
    await bot.sendMessage(msg.chat.id, `Список команд:
/q@MetaVxnn_Bot "текст" - спроси бота да или нет
/trans@MetaVxnn_Bot "текст" - поможет поменять английские буквы на русские
/trans "текст" - тоже самое что и выше только в лс бота
/gif - сгенерирует рандомную гифку
/random - сгенерирует рандомного котика
/report@MetaVxnn_Bot "текст" - написать сообщение админу
    `)
  }

  if (trans.active) {
    console.log(trans)
    if (trans.user == msg.from.id) {
      await bot.sendMessage(trans.chatId, `${translit(msg.text)}`)
      trans = {
        active: false,
        user: '',
        chatId: '',
        admin: ''
      }
    }
  }

  if (msg.text === '/trans' || msg.text === '/trans@MetaVxnn_bot') {
    console.log(msg)
    try {
      await bot.sendMessage(msg.chat.id, `Отправь текст который нужно перевести 
(работает только в лс бота)`)
      trans = {
        active: true,
        user: msg.from.id,
        chatId: msg.chat.id,
        admin: ''
      }
      console.log(trans)
    } catch (e) {
      console.log(e)
    }
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

  if(data.isActive && msg.from.id == data.user || msg.from.id == data.admin) {
    if(msg.text === 'Disconnect') {
      await bot.sendMessage(data.admin, 'Разговор окончен', {reply_markup: {
        remove_keyboard: true
      }})
      await bot.sendMessage(data.user, 'Разговор окончен', {reply_markup: {
        remove_keyboard: true
      }})
      data = {
        admin: '',
        user: '',
        isActive: false,
        stars: false
      }
    }
    if(msg.from.id == data.admin) {
      console.log(msg);
      if (msg.photo) {
        await bot.sendPhoto(data.user, msg.photo[3].file_id);
      }
      if (msg.text) {
        await bot.sendMessage(data.user, msg.text);
      }
    }
    if(msg.from.id == data.user) {
      if (msg.photo) {
        await bot.sendPhoto(data.admin, msg.photo[3].file_id);
      }
      if (msg.text) {
        await bot.sendMessage(data.admin, msg.text);
      }
    }
    if(data.stars) {
      await bot.sendMessage(data.admin, `Вас оценили на ${msg.text}` );
      await bot.sendMessage(data.user, 'Разговор окончен', {reply_markup: {
        remove_keyboard: true
      }})
      data = {
        admin: '',
        user: '',
        isActive: false,
        stars: false
      }
    }
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
})


// -1001178790101
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  let url = '';

  if (query.data == 'cat') {
    axios.get('https://api.thecatapi.com/v1/images/search')
      .then(res => {
        url = res.data[0].url
        generatee(query.message, url)
      })
  }

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
          'keyboard': [[`disconnect`]],
          'inline_keyboard' : [
            [{text: "убрать клаву", callback_data: "clear"}]
          ]
        })
      };
      await bot.sendMessage(chatId, `Заготовка:`, opts)
    }
    if(query.data == 'also') {
      const msg = query.message;
      const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: JSON.stringify({
          'inline_keyboard': [
            [{text: "Подключиться", callback_data: "connect"}, {text: "Удалить", callback_data: "delete"}]
          ]
        })
      };
      await bot.editMessageText(`Вы отправили сообщение что заняты и напишите позже
id ${query.message?.text?.match('id[ ][ -[][0-9]*')[0].split(' ')[1]};
messageId ${query.message?.text?.match('messageId[ ][ -[][0-9]*')[0].split(' ')[1]}`, opts)
      await bot.sendMessage(query.message?.text?.match('id[ ][ -[][0-9]*')[0].split(' ')[1], 'Админ на курорте и ответит вам чуть позже')
    }
    if(query.data == 'connect') {
      console.log(query);
      const msg = query.message;
      const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: JSON.stringify({
          'inline_keyboard' : [
            [{text: "Приветствие", callback_data: "welcome"}, {text: "Уточнение", callback_data: "faq"}],
            [{text: "Отзыв", callback_data: "stars"}, {text: "Отзыв", callback_data: "stars"}],
            [{text: "Отключиться", callback_data: "disconnect"}],
          ]
        })
      };
      data = {
        admin: 679898263,
        user: +query.message?.text?.match('id[ ][ -[][0-9]*')[0].split(' ')[1],
        isActive: true,
        stars: false
      }
      console.log(data);
      await bot.editMessageText(`Вы подключились к ${msg.from.first_name}
id ${msg.from.id};
messageId ${msg.message_id}`, opts)
      await bot.sendMessage(msg.chat.id, '...',
      {
        reply_markup: JSON.stringify({
          'keyboard': [['Disconnect']],
        })
      })
      await bot.sendMessage(query.message?.text?.match('id[ ][ -[][0-9]*')[0].split(' ')[1], 'К вам подключился админ Георгий, ожидайте', 
      {
        reply_markup: JSON.stringify({
          'keyboard': [['Disconnect']],
        })
      })
    }

    if(query.data == 'disconnect') {
      console.log(query);
      const msg = query.message;
      const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      };
      console.log(data);
      await bot.sendMessage(msg.chat.id, 'Разговор окончен')
      await bot.sendMessage(data.user, 'Разговор окончен')
      data = {
        admin: '',
        user: '',
        isActive: false,
        stars: false
      }
    }

    if(query.data == 'welcome') {
      await bot.sendMessage(data.user, 'Здравствуйте, могли бы вы уточнить ваш вопрос')
    }
    if(query.data == 'stars') {
      await bot.sendMessage(data.user, 'Спасибо за обращение, будем благодарны если оставите вашу оценку от 1 до 5', 
      {
        reply_markup: JSON.stringify({
          'keyboard': [['1', '2', '3', '4', '5']],
        })
      })
      data = {
        ...data,
        stars: true
      }
    }
  }
);