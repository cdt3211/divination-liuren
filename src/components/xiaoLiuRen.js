import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, InputNumber, message, Input } from 'antd';
import { sendMsg } from '../utils/aiService';

const { Title, Paragraph, Text } = Typography;

// 六神数组
const liuShen = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];

const calculateDivination = (num1, num2, num3) => {
  const index1 = num1 % 6;
  const index2 = (num1 + num2 - 1) % 6;
  const index3 = (num1 + num2 + num3 - 2) % 6;
  const divination1 = liuShen.at(index1 - 1);
  const divination2 = liuShen.at(index2 - 1);
  const divination3 = liuShen.at(index3 - 1);
  return {
    divination1,
    divination2,
    divination3
  };
};

const generateDivinationText = (divination1, divination2, divination3) => {
  const texts = {
    '大安': '万事大吉，身心安泰，所求皆如意。',
    '留连': '事多阻滞，凡事宜缓不宜急。',
    '速喜': '喜事临门，吉祥如意，吉庆可期。',
    '赤口': '口舌是非，谨慎言行，避免争执。',
    '小吉': '平安顺遂，虽无大利，亦无大害。',
    '空亡': '事难成就，凡事宜守不宜进。'
  };
  const explain1 = texts[divination1];
  const explain2 = texts[divination2];
  const explain3 = texts[divination3];

  return {
    explain1,
    explain2,
    explain3
  }
};


const LiurenDivination = () => {
  const [result, setResult] = useState(null);
  const [nums, setNums] = useState({ num1: 0, num2: 0, num3: 0 });
  const [manualNums, setManualNums] = useState({ num1: null, num2: null, num3: null });
  const [isManual, setIsManual] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const setNumsByTime = () => {
    const now = new Date();
    // 获取北京时间
    const beijingTime = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
    const hour = beijingTime.getHours();
    const minute = beijingTime.getMinutes();
    const minuteTens = Math.floor(minute / 10);
    const minuteOnes = minute % 10;
    setNums({
      num1: hour,
      num2: minuteTens,
      num3: minuteOnes
    });
    setIsManual(false);
  }

  const setNumsManually = () => {
    if (manualNums.num1 === null || manualNums.num2 === null || manualNums.num3 === null) {
      message.error('请先输入三个数');
      return;
    }
    setNums(manualNums);
    setIsManual(true);
  }


  useEffect(() => {
    if (nums.num1 !== 0 || nums.num2 !== 0 || nums.num3 !== 0) {
      const divination = calculateDivination(nums.num1, nums.num2, nums.num3);
      const divinationText = generateDivinationText(divination.divination1, divination.divination2, divination.divination3);

      setResult({
        ...divination,
        ...divinationText
      });
    }
  }, [nums, isManual]);


  return (
    <div className='xiaoliuren'>
      <Card title={<Title level={4}>小六壬</Title>} style={{ width: 350 }}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Text>小六壬是一种古老的占卜方法，用八卦六个爻对应事物形态预测信息、找寻失物、推算吉凶。<br />
            起卦前，心中默想所问之事。</Text>
          {!result && (
            <>
              <Text>点击下方按钮起卦(按当下时辰起卦)：</Text>
              <Button type="primary" onClick={setNumsByTime}>
                起卦
              </Button>
              <Text>或者手动输入三个数进行起卦：</Text>
              <Space>
                <InputNumber controls changeOnWheel min={1} max={99} placeholder="1~99" onChange={(value) => setManualNums({ ...manualNums, num1: value })} />
                <InputNumber controls changeOnWheel min={1} max={99} placeholder="1~99" onChange={(value) => setManualNums({ ...manualNums, num2: value })} />
                <InputNumber controls changeOnWheel min={1} max={99} placeholder="1~99" onChange={(value) => setManualNums({ ...manualNums, num3: value })} />
              </Space>
              <Button type="primary" onClick={setNumsManually}>
                手动起卦
              </Button>
            </>
          )}
          {result && (
            <>
              <Title level={5}>卦象：</Title>
              <Text strong>{result.divination1} {result.divination2} {result.divination3}</Text>
              <Text strong>卦象解释</Text>
              <Paragraph>
                <Text strong>{result.divination1}</Text>: {result.explain1}<br />
                <Text strong>{result.divination2}</Text>: {result.explain2}<br />
                <Text strong>{result.divination3}</Text>: {result.explain3}<br />
              </Paragraph>
              <Text strong>AI分析卦象</Text>
              <Input
                placeholder="输入你刚才想的的问题"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
              {!aiResponse && (
                <>
                  <Button type="primary" onClick={() => sendMsg(result, userQuestion, setAiResponse)}>
                    分析卦象
                  </Button>
                </>
              )

              }
              {aiResponse && (
                <Paragraph><Text strong>AI分析(非专业性，仅供参考)：</Text>{aiResponse}</Paragraph>
              )}
            </>
          )}
        </Space>
      </Card>
      <Card title={<Title level={4}>六神释义</Title>} style={{ width: 350 }} >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Paragraph><Text strong>大安：</Text>身不动时，五行属木，颜色青色，方位东方。临青龙，谋事主一、五、七。有静止、心安。吉祥之含义。<br />
            诀曰：大安事事昌，求谋在东方，失物去不远，宅舍保安康。行人身未动，病者主无妨。将军回田野，仔细好推详。</Paragraph>
          <Paragraph><Text strong>留连：</Text>人未归时，五行属水，颜色黑色，方位北方，临玄武，凡谋事主二、八、十。有喑味不明，延迟。纠缠．拖延、漫长之含义。<br />
            诀曰：留连事难成，求谋日未明。官事只宜缓，去者来回程，失物南方去，急寻方心明。更需防口舌，人事且平平。</Paragraph>
          <Paragraph><Text strong>速喜：</Text>人即至时，五行属火，颜色红色方位南方，临朱雀，谋事主三，六，九。有快速、喜庆，吉利之含义。指时机已到。<br />
            诀曰：速喜喜来临，求财向南行。失物申未午，逢人要打听。官事有福德，病者无须恐。田宅六畜吉，行人音信明。</Paragraph>
          <Paragraph><Text strong>赤口：</Text>官事凶时，五行属金，颜色白色，方位西方，临白虎，谋事主四、七，十。有不吉、惊恐，凶险、口舌是非之含义。<br />
            诀曰：赤口主口舌，官非切要防。失物急去寻，行人有惊慌。鸡犬多作怪，病者出西方。更须防咀咒，恐怕染瘟殃</Paragraph>
          <Paragraph><Text strong>小吉：</Text>人来喜时，五行属木，临六合，凡谋事主一、五、七有和合、吉利之含义。<br />
            诀曰：小吉最吉昌，路上好商量。阴人来报喜，失物在坤方。行人立便至，交易甚是强，凡事皆和合，病者祈上苍。</Paragraph>
          <Paragraph><Text strong>空亡：</Text>音信稀时，五行属土，颜色黄色，方位中央；临勾陈。谋事主三、六、九。有不吉、无结果、忧虑之含义。<br />
            诀曰：空亡事不祥，阴人多乖张。求财无利益，行人有灾殃。失物寻不见，官事有刑伤。病人逢暗鬼，析解可安康。</Paragraph>
        </Space>
      </Card >
    </div>
  );
};

export default LiurenDivination;