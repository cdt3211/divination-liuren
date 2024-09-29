import * as base64 from 'base-64';
import CryptoJs from 'crypto-js';
import { message } from 'antd';

const requestObj = {
  APPID: process.env.REACT_APP_APPID,
  APISecret: process.env.REACT_APP_APISecret,
  APIKey: process.env.REACT_APP_APIKey,
  Uid: process.env.REACT_APP_Uid,
  sparkResult: ''
};

const explain = {
  "大安": "身不动时，五行属木，颜色青色，方位东方。临青龙，凡谋事主一、五、七。有静止、心安。吉祥之含义。\n\
身不动时，属木，青龙，凡事主逢一、五、七（寅巳申）。\n\
大安事事昌，求财在坤方，失物去不远，宅舍保安康，行人身未动，病者主无妨。将军回田野，仔细与推详，丢失在附近，可能西南向，安居得吉日，不可动身祥。办事别出屋，求借邀自房，得病凶化吉，久疾得安康，寻人知音信，可能归村庄。口舌能消散，远行要提防，交易别出村，离屯细推详，求财有八分，得全不出房。",
  "留连": "人未归时，五行属水，颜色黑色，方位北方，临玄武，凡谋事主二、八、十。有喑味不明，延迟。纠缠．拖延、漫长之含义。\n\
人未归时，属水，玄武，凡事主逢在二、八、十（卯午子）。\n\
留连事未当，求事日莫光，凡事只宜缓，去者未回向，失物南方去，急急行便访。紧记防口舌，人口且平祥，丢失难寻找，窃者又转场，出行定不归，久去拖延长。办事不果断，牵连又返往，求借不易成，被求而彷徨，此日患疾病，几天不复康。找人迷雾中，迷迷又恍惚，口舌继续有，拖拉又伸长，女方嫁吉日，求财六分量。",
  "速喜": "人即至时，五行属火，颜色红色方位南方，临朱雀，谋事主三，六，九。有快速、喜庆，吉利之含义。指时机已到。\n\
人便至时，属火，朱雀，凡事主在三，六，九 （辰戌未）。\n\
速喜喜临乡，求财往南方，失物申午未，逢人路寻详，官事有福德，病者无大伤。六畜田稼庆，行人有音向，丢失得音信，微乐在面上，出行遇吉利，小喜而顺当。办事如逢春，吉利又荣光，小量可求借，大事难全强，久病见小愈，得病速回康，寻人得知见，口舌见消亡，交易可得成，但不太久长，求财有十分，吉时得顺当。",
  "赤口": "官事凶时，五行属金，颜色白色，方位西方，临白虎，谋事主四、七，十。有不吉、惊恐，凶险、 口舌是非之含义。\n\
官事凶时，属金，白虎，凡事主在四、七，十。\n\
赤口主口伤，官事且紧防，失物急去找，行人有惊慌，鸡犬多作怪，病者上西方。更须防咒咀，恐怕染瘟殃，找物犯谎口，寻问无音向，出门千口怨，言谈万骂伤。办事犯口舌，难成有阻挡，求借不全顺，闭口无事张，得病千口猜，求医还无妨。寻人得凶音，人心不安详，口舌犯最重，交易口舌防，求财只四分，逢吉才成当。",
  "小吉": "人来喜时，五行属木，临六合，凡谋事主一、五、七有和合、吉利之含义。\n\
人来喜时，属水，六合，凡事主逢在一、五、七。\n\
小吉最吉昌，路上好商量，阴人来报喜，失物在坤方，行人立刻至，交易甚是强。凡事皆合好，病者保安康，大吉又大顺，万事如意详，出行可得喜，千里吉安详。诸事可心顺，有忧皆消光，求借自来助，众友愿相帮，重病莫要愁，久病得安康。不见得相见，不打自归庄，千人称赞君，无限上荣光，交易成兴隆，十二分财量.",
  "空亡": "音信稀时，五行属土，颜色黄色，方位中央；临勾陈。谋事主三、六、九。 有不吉、无结果、忧虑之含义。\n\
音信稀时，属土，勾陈，凡事主在三、六、九（辰未丑）。\n\
空亡事不长，阴人无主张，求财心白费，行人有灾殃，失物永不见，官事有刑伤。病人遇邪鬼，久病添祸殃，失物难找见，找寻空荡荡，出行不吉利，凶多不吉祥。办事凶为多，处处有阻挡，求借不能成，成事化败伤，得病凶多噩，久患雪加霜。寻人无音信，知音变空想，万口都诽骂，小舟遭狂浪，求财有二分，不吉不利亡"
};

const getWebsocketUrl = async () => {
  try {
    let url = "wss://spark-api.xf-yun.com/v1.1/chat";
    let host = "spark-api.xf-yun.com";
    let apiKeyName = "api_key";
    let date = new Date().toGMTString();
    let algorithm = "hmac-sha256";
    let headers = "host date request-line";
    let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
    let signatureSha = CryptoJs.HmacSHA256(signatureOrigin, requestObj.APISecret);
    let signature = CryptoJs.enc.Base64.stringify(signatureSha);

    let authorizationOrigin = `${apiKeyName}="${requestObj.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;

    let authorization = base64.encode(authorizationOrigin);

    // 将空格编码
    url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;

    return url;
  } catch (error) {
    throw new Error('Failed to generate websocket URL');
  }
};

const sendMsg = async (result, userQuestion, setAiResponse) => {
  let myUrl = await getWebsocketUrl();
  let socket = new WebSocket(myUrl);

  if (userQuestion === '') {
    message.error('请输入问题');
    return;
  }

  socket.addEventListener('open', () => {
    let params = {
      "header": {
        "app_id": requestObj.APPID,
        "uid": requestObj.Uid
      },
      "parameter": {
        "chat": {
          "domain": "general",
          "temperature": 0.5,
          "max_tokens": 4096,
        }
      },
      "payload": {
        "message": {
          "text": [
            {
              "role": "user", "content": `你是一个精通小六壬的专家，现在需要你根据小六壬的口诀和原理，对用户提供的小六壬卦象进行详细、专业且有用的结果分析。
              小六壬的基本信息如下：
              大安：${explain.大安}，
              留连：${explain.留连}，
              速喜：${explain.速喜}，
              赤口：${explain.赤口}，
              小吉：${explain.小吉}，
              空亡：${explain.空亡}。
              目的：生成基于用户提问的小六壬卦象结果分析。
              功能需求：
              1.理解用户提问： 能够准确理解用户的问题。

2.结果分析： 结合卦象的基本信息，生成具体、详细的分析结果。分析结果应包括但不限于以下方面：

- 吉祥含义或不吉警示
- 求财方向
- 失物寻找建议
- 行人身未动或即将到来的指示
- 病者状况
- 口舌是非
- 交易、求借、办事的吉凶
- 出行建议
- 寻人信息
- 求医指导
- 求财可能性
3. 个性化回答： 根据用户的具体问题，生成个性化的卦象分析，避免千篇一律的回答。

4. 专业术语使用： 在分析中适当使用小六壬的专业术语，如五行、方位、临神等，以增强分析的专业性和可信度。

5. 简洁明了： 确保生成的分析结果简洁明了，避免冗长和复杂，易于用户理解。

6. 文化尊重： 在分析中尊重小六壬卦象的文化背景和传统，不进行任何形式的歪曲或贬低。
              示例输出：用户提问：“我今天丢失了钱包，能找到吗？”

你的回答：“根据您提供的情况，您的问题是与‘失物’相关。根据小六壬卦象分析，(生成对应卦象的分析内容)，您的钱包可能在南方，建议您沿着申、午、未三个时辰的方向寻找。速喜卦象还暗示着您可能会在路上遇到帮助您的人，所以不妨询问周围的人。”
              ` },
            {
              "role": "user", "content": `
              用户占卜的卦象为: ${result.divination1} ${result.divination2} ${result.divination3}。
              ` },
            {
              "role": "user", "content": `用户的问题为：${userQuestion}
              回答问题的口吻为“我”和“你”。
              生成的结果要求专业、有用、有价值且简洁，不要出现无意义的内容。
              ` },
          ]
        }
      }
    };
    socket.send(JSON.stringify(params));
  });

  socket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    if (data.header.code === 0 && data.payload.choices.text) {
      requestObj.sparkResult += data.payload.choices.text[0].content;
      setAiResponse(requestObj.sparkResult);
    }
  });
};

export { sendMsg };