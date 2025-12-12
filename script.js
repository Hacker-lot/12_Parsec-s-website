// --- Configuration and Data ---
const LOCAL_STORAGE_KEY_TEAMS = 'quizTeams';
const LOCAL_STORAGE_KEY_QUESTION_STATUS = 'quizQuestionStatus';
const LOCAL_STORAGE_KEY_CURRENT_INDEX = 'quizCurrentIndex';
const LOCAL_STORAGE_KEY_ROUND_STATE = 'quizRoundStateV1';
const LOCAL_STORAGE_KEY_INDIVIDUALS = 'quizIndividualsV1';

// Full set of quiz questions loaded from the user's document
// -------------------------------------------------------------------
const geographyQuestions = [
    {
        "id": "R1 必答题 001",
        "type": "multiple-choice",
        "text": "以下哪个城市不是中国的四个直辖市之一？",
        "options": [
            "A.上海",
            "B.天津",
            "C.重庆",
            "D.深圳"
        ],
        "answer": "D",
        "points": 1,
        "rationale": "中国四个直辖市分别是：上海，天津，重庆，北京。深圳是经济特区"
    },
    {
        "id": "R1 必答题 002",
        "type": "multiple-choice",
        "text": "以下哪个海域不是中国的四大海域之一？",
        "options": [
            "A.东海",
            "B.洱海",
            "C.黄海",
            "D.渤海"
        ],
        "answer": "B",
        "points": 1,
        "rationale": "中国四大海域为渤海，黄海，东海，南海。洱海是云南的湖"
    },
    {
        "id": "R1 必答题 003",
        "type": "multiple-choice",
        "text": "以下哪个国家不在两河流域？",
        "options": [
            "A.叙利亚",
            "B.伊拉克",
            "C.亚美尼亚",
            "D.土耳其"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "“两河”指底格里斯河和幼发拉底河，不流经亚美尼亚"
    },
    {
        "id": "R1 必答题 004",
        "type": "multiple-choice",
        "text": "以下哪个不是英国的构成国之一？",
        "options": [
            "A.苏格兰",
            "B.北爱尔兰",
            "C.设得兰",
            "D.英格兰"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "英国的构成国是英格兰，威尔士，苏格兰和北爱尔兰。设得兰是一个群岛的名字。"
    },
    {
        "id": "R1 必答题 016",
        "type": "multiple-choice",
        "text": "根据BBC报道，2025年10月22日尼日利亚的一起油罐车爆炸事故造成了至少42人死亡。下列哪个是尼日利亚的国旗？",
        "options": [
            "A.<br><img src='images/senegal.png' class='h-24 mt-2 border border-gray-300' alt='Flag A'>",
            "B.<br><img src='images/benin.png' class='h-24 mt-2 border border-gray-300' alt='Flag B'>",
            "C.<br><img src='images/nigeria.png' class='h-24 mt-2 border border-gray-300' alt='Flag C'>",
            "D.<br><img src='images/ethiopia.png' class='h-24 mt-2 border border-gray-300' alt='Flag D'>"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "图1为塞内加尔国旗，图2是贝宁国旗，图4是埃塞俄比亚国旗"
    },

    {
        "id": "R1 必答题 006",
        "type": "multiple-choice",
        "text": "以下哪个不是古代世界四大文明之一？",
        "options": [
            "A.古巴比伦",
            "B.古罗马",
            "C.古埃及",
            "D.古印度"
        ],
        "answer": "B",
        "points": 1,
        "rationale": "古代世界四大文明是古埃及，古巴比伦，古印度和古中国。"
    },
    {
        "id": "R1 必答题 007",
        "type": "multiple-choice",
        "text": "直布罗陀是哪个国家的海外领土？",
        "options": [
            "A.爱尔兰",
            "B.法国",
            "C.西班牙",
            "D.英国"
        ],
        "answer": "D",
        "points": 3,
        "rationale": "1713年，结束了西班牙王位继承战争(War of the Spanish Succession)的乌得勒支和约(Treaty of Utrecht)将直布罗陀转让给了英国统治。"
    },
    {
        "id": "R1 必答题 008",
        "type": "multiple-choice",
        "text": "以下哪个国家没有被英国殖民过？",
        "options": [
            "A.伊朗",
            "B.埃及",
            "C.爱尔兰",
            "D.赞比亚"
        ],
        "answer": "A",
        "points": 3,
        "rationale": "伊朗从未被任何西方国家正式殖民过"
    },
    {
        "id": "R1 必答题 009",
        "type": "multiple-choice",
        "text": "南美洲唯一一个在太平洋和加勒比海沿岸都有海岸线的国家是？",
        "options": [
            "A.巴拉圭",
            "B.巴西",
            "C.哥伦比亚",
            "D.智利"
        ],
        "answer": "C",
        "points": 3,
        "rationale": "哥伦比亚北接巴拿马，在太平洋沿岸有布埃纳文图拉（Buenaventura）等港口，在加勒比海沿岸拥有巴兰基亚（Barranquilla）等港口。"
    },
    {
        "id": "R1 必答题 010",
        "type": "multiple-choice",
        "text": "下列哪座山是神话传说中众神居住之所？",
        "options": [
            "A.勃朗峰",
            "B.奥林匹斯山",
            "C.马特洪峰",
            "D.厄尔布鲁士山"
        ],
        "answer": "B",
        "points": 3,
        "rationale": "希腊神话中奥林匹斯山是众神的居所，其名字的含义是“光之处”"
    },
    {
        "id": "R1 必答题 011",
        "type": "multiple-choice",
        "text": "巴基斯坦的首都是下列哪个城市？",
        "options": [    
            "A.卡拉奇",
            "B.比什凯克",
            "C.班加罗尔",
            "D.伊斯兰堡"
        ],
        "answer": "D",
        "points": 3,
        "rationale": "卡拉奇是巴基斯坦人口最多的城市，但不是首都；比什凯克位于吉尔吉斯斯坦，班加罗尔位于印度"
    },
    {
        "id": "R1 必答题 012",
        "type": "multiple-choice",
        "text": "“石油输出国组织”的英文简称是？",
        "options": [
            "A.UNESCO",
            "B.OPEC",
            "C.ASEAN",
            "D.AU"
        ],
        "answer": "B",
        "points": 3,
        "rationale": "OPEC代表“The Organization of the Petroleum Exporting Countries”，UNESCO是联合国教科文组织，ASEAN是东南亚国家联盟，AU是非洲联盟"
    },
    {
        "id": "R1 必答题 013",
        "type": "multiple-choice",
        "text": "世界上最“年轻”的国家是？",
        "options": [
            "A.南苏丹",
            "B.东帝汶",
            "C.黑山",
            "D.马绍尔群岛"
        ],
        "answer": "A",
        "points": 5,
        "rationale": "南苏丹2011年7月9日从苏丹独立，东帝汶2002年5月20日从印度尼西亚独立，黑山于2006年6月3日从塞尔维亚独立，马绍尔群岛则早在1986年就获得独立。"
    },
    {
        "id": "R1 必答题 014",
        "type": "multiple-choice",
        "text": "底特律位于美国哪个州？",
        "options": [
            "A.密歇根州",
            "B.堪萨斯州",
            "C.威斯康星州",
            "D.伊利诺伊州"
        ],
        "answer": "A",
        "points": 5,
        "rationale": "底特律位于美加边境的密歇根州，与加拿大的温莎（Windsor）隔河相望，是密歇根州最大的市镇。"
    },
    {
        "id": "R1 必答题 015",
        "type": "multiple-choice",
        "text": "世界七大奇迹之一的罗德岛太阳神铜像曾经位于现在哪国领土？",
        "options": [
            "A.塞浦路斯",
            "B.土耳其",
            "C.希腊",
            "D.埃及"
        ],
        "answer": "C",
        "points": 5,
        "rationale": "罗德岛太阳神铜像曾经矗立在希腊罗得岛上的罗得港港口"
    },
    {
        "id": "R1 必答题 005",
        "type": "multiple-choice",
        "text": "以下哪个国家领土不被赤道穿过？",
        "options": [
            "A.赤道几内亚",
            "B.加蓬",
            "C.乌干达",
            "D.马尔代夫"
        ],
        "answer": "A",
        "points": 5,
        "rationale": "赤道大致穿过非洲中部，赤道几内亚名字虽带“赤道”二字，其主体领土却位于北纬1.6°左右的位置，赤道仅穿过其领土间的海域。"
    },
    {
        "id": "R1 必答题 017",
        "type": "multiple-choice",
        "text": "马达加斯加岛的标志性物种是？",
        "options": [
            "A.玳瑁",
            "B.狐猴",
            "C.旋角羚",
            "D.土豚"
        ],
        "answer": "B",
        "points": 5,
        "rationale": "所有狐猴均原生于马达加斯加的丛林中"
    },
    {
        "id": "R1 必答题 018",
        "type": "multiple-choice",
        "text": "以下哪个不是意大利的城市？",
        "options": [
            "A.佩斯卡拉",
            "B.帕尔马",
            "C.巴勒莫",
            "D.里耶卡"
        ],
        "answer": "D",
        "points": 5,
        "rationale": "佩斯卡拉和巴勒莫都是意大利的港口城市，帕尔马位于波河平原，里耶卡是克罗地亚的城市"
    },
    {
        "id": "R1 抢答题 019",
        "type": "multiple-choice",
        "text": "世界上陆地面积第二小的大洲是？",
        "options": [
            "A.欧洲",
            "B.非洲",
            "C.南美洲",
            "D.北美洲"
        ],
        "answer": "A",
        "points": 3,
        "rationale": "世界上陆地面积最小的大洲是大洋洲，倒数第二是欧洲，面积约1053万平方千米。"
    },
    {
        "id": "R1 抢答题 020",
        "type": "multiple-choice",
        "text": "以下哪个海域不在亚洲？",
        "options": [
            "A.波斯湾",
            "B.濑户内海",
            "C.亚德里亚海",
            "D.萨武海"
        ],
        "answer": "C",
        "points": 3,
        "rationale": "亚德里亚海大致位于意大利和巴尔干半岛之间，萨武海大致位于印尼和帝汶岛之间。"
    },
    {
        "id": "R1 抢答题 021",
        "type": "multiple-choice",
        "text": "以下哪个不是印度尼西亚的岛屿？",
        "options": [
            "A.棉兰老岛",
            "B.苏门答腊岛",
            "C.爪哇岛",
            "D.婆罗洲（加里曼丹岛）"
        ],
        "answer": "A",
        "points": 3,
        "rationale": "棉兰老岛是菲律宾的第二大岛"
    },
    {
        "id": "R1 抢答题 022",
        "type": "multiple-choice",
        "text": "以下哪个国家不被阿尔卑斯山脉穿过？",
        "options": [
            "A.法国",
            "B.斯洛文尼亚",
            "C.意大利",
            "D.斯洛伐克"
        ],
        "answer": "D",
        "points": 3,
        "rationale": "斯洛伐克的主要山脉是喀尔巴阡山脉，前三国都可以领略壮丽的阿尔卑斯山脉景色。"
    },
    {
        "id": "R1 抢答题 023",
        "type": "multiple-choice",
        "text": "以下哪个不是东南亚国家？",
        "options": [
            "A.缅甸",
            "B.文莱",
            "C.孟加拉国",
            "D.东帝汶"
        ],
        "answer": "C",
        "points": 3,
        "rationale": "孟加拉国在地理区域的划分上属于南亚。"
    },
    {
        "id": "R1 加赛抢答题 024",
        "type": "multiple-choice",
        "text": "伊斯兰教在以下哪个国家不是主要宗教体？",
        "options": [
            "A.阿尔及利亚",
            "B.以色列",
            "C.印度尼西亚",
            "D.阿曼"
        ],
        "answer": "B",
        "points": 1,
        "rationale": "阿尔及利亚，阿曼和印度尼西亚都有约90%及以上人口信奉伊斯兰教，以色列的主要宗教是犹太教。"
    },
    {
        "id": "R1 加赛抢答题 025",
        "type": "multiple-choice",
        "text": "南美洲国家大多以哪种语言作为官方语言？",
        "options": [
            "A.西班牙语",
            "B.葡萄牙语",
            "C.英语",
            "D.克里奥尔语"
        ],
        "answer": "A",
        "points": 1,
        "rationale": "南美洲的12个国家中有9个使用西班牙语作为官方语言，这与西班牙历史上对该地区的殖民有重大关系。"
    },
    {
        "id": "R1 加赛抢答题 026",
        "type": "multiple-choice",
        "text": "地球的“年龄”大约是？",
        "options": [
            "A.80亿年",
            "B.45亿年",
            "C.55亿年",
            "D.24亿年"
        ],
        "answer": "B",
        "points": 1,
        "rationale": "大约为45.4亿年，四舍五入得45亿年。"
    },
    {
        "id": "R1 加赛抢答题 027",
        "type": "multiple-choice",
        "text": "世界上最古老的国家公园是？",
        "options": [
            "A.大沼泽地国家公园",
            "B.阿卡迪亚国家公园",
            "C.黄石国家公园",
            "D.大峡谷国家公园"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "美国黄石国家公园建立于1872年3月1日，是世界上第一座国家公园。"
    },
    {
        "id": "R2 简答题 028",
        "type": "short-answer",
        "text": "叙利亚的首都是？",
        "answer": "大马士革",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 029",
        "type": "short-answer",
        "text": "2025年10月13日，佛得角在美加墨世界杯预选赛中以小组第一的身份获得直通世界杯的资格。这个岛国位于哪片海域上？",
        "answer": "大西洋",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 030",
        "type": "short-answer",
        "text": "2025年11月9日，一艘中国渔船在全罗南道附近海域倾覆。全罗南道属于哪个国家？",
        "answer": "韩国",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 031",
        "type": "short-answer",
        "text": "埃及的亚洲部分主要位于哪个半岛上？",
        "answer": "西奈半岛",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 032",
        "type": "short-answer",
        "text": "印度河主要流经哪个国家？",
        "answer": "巴基斯坦",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 033",
        "type": "short-answer",
        "text": "长征二号F遥二十一运载火箭于2025年10月31日在酒泉卫星发射中心成功发射了神舟二十一号载人飞船。酒泉市位于哪个省？",
        "answer": "甘肃",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 034",
        "type": "short-answer",
        "text": "2012年，匈牙利时任总统帕尔·施米特因被指控抄袭博士论文引咎辞职。匈牙利的首都被哪条河流穿过？",
        "answer": "多瑙河",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 035",
        "type": "short-answer",
        "text": "“七丘之城”说的是哪个城市？",
        "answer": "罗马",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 036",
        "type": "short-answer",
        "text": "位于欧洲中部的“音乐之都”是？",
        "answer": "维也纳",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 037",
        "type": "short-answer",
        "text": "中国唯一的北冰洋水系河流是？",
        "answer": "额尔齐斯河",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 038",
        "type": "short-answer",
        "text": "2025年1月20日，特朗普第二次在白宫就任。白宫位于华盛顿D.C.，其中D.C.表示的含义是？",
        "answer": "哥伦比亚特区",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 简答题 039",
        "type": "short-answer",
        "text": "2014年，俄罗斯城市索契举办了冬奥会。索契在哪片海域沿岸？",
        "answer": "黑海",
        "points": 3,
        "rationale": ""
    },
    {
        "id": "R2 加赛抢答题 040",
        "type": "short-answer",
        "text": "中国领海最南端位于？",
        "answer": "曾母暗沙",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R2 加赛抢答题 041",
        "type": "short-answer",
        "text": "世界上最著名的啤酒节每年十月在哪个城市举办？",
        "answer": "慕尼黑",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R2 加赛抢答题 042",
        "type": "short-answer",
        "text": "潘帕斯草原西部主要位于哪个国家？",
        "answer": "阿根廷",
        "points": 1,
        "rationale": ""
    },
  {
        "id": "R2 加赛抢答题 042",
        "type": "short-answer",
        "text": "中美洲国家哥斯达黎加，其领土最南端与哪个国家接壤？",
        "answer": "巴拿马",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R2 加赛抢答题 042",
        "type": "short-answer",
        "text": "2025 年男篮世界杯在卡塔尔举办，卡塔尔位于哪个海湾沿岸？",
        "answer": "波斯湾",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 043",
        "type": "short-answer",
        "text": "《吕氏春秋》的作者是秦国丞相吕不韦。秦国的都城是？",
        "answer": "咸阳",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 044",
        "type": "short-answer",
        "text": "红军长征途中“巧渡”的是哪条河流？这条河流位于我国西南地区，是长江的上游河段。",
        "answer": "金沙江",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 045",
        "type": "short-answer",
        "text": "Jon Krakauer的书”Into the Wild”的主人公Chris McCandless长途跋涉来到阿拉斯加。阿拉斯加的最高峰是麦金利山，它的另一个名字是？",
        "answer": "迪纳利山",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 046",
        "type": "short-answer",
        "text": "江南三大名楼分别是？",
        "answer": "（需答出3个）黄鹤楼 岳阳楼 滕王阁",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 047",
        "type": "short-answer",
        "text": "《陋室铭》中作者以“南阳诸葛庐，西蜀子云亭”自比。南阳位于那个省份？",
        "answer": "河南",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 048",
        "type": "short-answer",
        "text": "苏轼在哪里写下了《记承天寺夜游》？",
        "answer": "黄冈（接受黄州）",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 049",
        "type": "short-answer",
        "text": "韦达定理指出，对于方程𝑎𝑥²+𝑏𝑥+𝑐=0，其两根之和等于-b/a，两根之积等于c/a。韦达是哪国人？",
        "answer": "法国人",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 050",
        "type": "short-answer",
        "text": "法国化学家拉瓦锡在1774年通过拉瓦锡实验提出“提出空气由约20%氧气和80%氮气组成”。拉瓦锡最后死于哪里？",
        "answer": "被处死于巴黎",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 简答题 051",
        "type": "short-answer",
        "text": "詹姆斯·沃森和弗朗西斯·克里克在1953年共同提出了DNA的双螺旋结构模型。届时，他们的研究处在卡文迪许实验室。这座实验室位于英国哪座城市？",
        "answer": "剑桥",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 加赛抢答题 052",
        "type": "short-answer",
        "text": "相传在1589-1592年间，伽利略在比萨斜塔进行了著名的实验以证明物体下降时间与其质量无关。比萨斜塔位于哪座城市？",
        "answer": "比萨",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 加赛抢答题 053",
        "type": "short-answer",
        "text": "1860年《中俄北京条约》使得中国失去了哪条江的最后15公里，从而失去了日本海的出海口？",
        "answer": "图们江",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3 加赛抢答题 054",
        "type": "short-answer",
        "text": "苏珊·埃洛伊丝·欣顿热衷于创作以俄克拉荷马州为背景的青年小说。她的著名小说“The Outsiders”背景设定在哪座城市？",
        "answer": "这座城市也是该州人口第二多的城市。塔尔萨/图尔萨",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R4 图片线索题 055",
        "type": "image-clue",
        "text": "",
        "answer": "比利时",
        "points": 1,
        "image": "images/iron_balls.png",
        "rationale": "佛兰德斯是比利时的荷兰语区，瓦隆尼亚是法语区。利奥波德二世曾下令虐杀刚果自由邦数百万到1,500万人。"
    },
    {
        "id": "R4 图片线索题 056",
        "type": "image-clue",
        "text": "",
        "answer": "印度洋",
        "points": 1,
        "image": "images/indian_ocean.png",
        "rationale": "爱德华王子群岛属于南非，索科特拉岛是也门的岛屿，以龙血树闻名。安达曼-尼科巴群岛属于印度。世界上最长的海峡是莫桑比克海峡。蒙巴萨是肯尼亚的港口城市，马斯喀特和科伦坡分别是阿曼和斯里兰卡的首都。雅鲁藏布江在孟加拉国注入印度洋。"
    },
    {
        "id": "R4 图片线索题 057",
        "type": "image-clue",
        "text": "",
        "answer": "塞纳河",
        "points": 1,
        "image": "images/seine_river.png",
        "rationale": "特洛卡得罗花园是观赏埃菲尔铁塔景色的绝佳之处，这里曾经是夏宫（特洛卡得罗宫）所在之处，现在主要是博物馆，科唐坦半岛北部海域即英吉利海峡。"
    },
    {
        "id": "R4 图片线索题 058",
        "type": "image-clue",
        "text": "",
        "answer": "南极洲",
        "points": 1,
        "image": "images/ross_dependency.png",
        "rationale": "沃斯托克，即Vostok，意译为“东方湖”，靠近俄罗斯南极考察站东方站。火地群岛分属智利和阿根廷，与南设得兰群岛之间相隔着德雷克海峡。"
    },
    {
        "id": "R4 图片线索题 059",
        "type": "image-clue",
        "text": "",
        "answer": "波士顿",
        "points": 1,
        "image": "images/boston.jpg",
        "rationale": "波士顿最初只是一个半岛，如今的重要区域，如后湾（Back Bay），南端（South End），和洛根国际机场都是建立在填海造地的基础之上。“Make Way for Ducklings”是对罗伯特·麥克克洛茨基的同名儿童故事的现实再现。邦克山战役发生在1775年的波士顿。"
    },
    {
        "id": "R4 图片线索题 060",
        "type": "image-clue",
        "text": "",
        "answer": "玻利维亚",
        "points": 1,
        "image": "images/bolivia.png",
        "rationale": "硝石战争，又称鸟粪战争和南美太平洋战争，玻利维亚和秘鲁输给了智利，玻利维亚的滨海省1904年被正式割让给智利，即今天智利的安托法加斯塔大区。的的喀喀湖位于玻利维亚和秘鲁边境，海拔约3800米，面积8372平方千米。"
    },
    {
        "id": "R4 图片线索题 061",
        "type": "image-clue",
        "text": "",
        "answer": "西伯利亚",
        "points": 1,
        "image": "images/siberia.png",
        "rationale": "米尔矿场最早于1957年开始被发掘，2009年以来地下采矿活动一直处于活跃状态。东卡国家公园位于贝加尔湖西南方，而俄罗斯最常见的行政单位名称就是“边疆区”和“共和国”，其中萨哈共和国面积约308万平方千米，首府是雅库茨克。"
    },
    {
        "id": "R4 图片线索题 062",
        "type": "image-clue",
        "text": "",
        "answer": "捷克共和国",
        "points": 1,
        "image": "images/czech.png",
        "rationale": "切申（捷欣）是捷克和波兰边境的地区，历史上多次被来回划分。布拉格历史上一共发生了三次掷出窗外事件（Defenestration），1618年事件缘由的本质是新教教徒遭受迫害而发动起义。此事件后波西米亚独立，进而引发宗教战争。伏尔塔瓦河则被斯美塔那在他的交响诗组曲《我的祖国》中描绘并歌颂。"
    },
    {
        "id": "R4 图片线索题 063",
        "type": "image-clue",
        "text": "",
        "answer": "马六甲海峡",
        "points": 1,
        "image": "images/malaica_strait.png",
        "rationale": "棉兰号Ourang Medan是一个幽灵船都市传说，蒂迪旺沙山脉是马来半岛的主要山脉。廖内群岛（Riau Islands）是印尼苏门答腊岛以东的一片群岛，荷兰红堡（Stadthuys）由荷兰人于1650年建造，位于马来西亚马六甲（Melaka）市。"
    }
];

// -------------------------------------------------------------------

let teams = [];
let questions = [];
let currentQuestionIndex = -1;
let roundState = null;
let individuals = [];
let leaderboardView = 'team'; // 'team' | 'individual'
let fragmentPanels = [];
let fragmentObserver = null;
let fragmentRefreshScheduled = false;
let timerInterval = null;
let timeRemaining = 15;

// --- Initialization and Core Logic ---

document.addEventListener('DOMContentLoaded', () => {
    initializeQuestions();
    loadTeams();
    loadRoundState();
    loadIndividuals();
    renderLeaderboard();
    renderIndividualLeaderboard();
    // Removed: renderScoreAdjustmentButtons(); // Redundant function call
    loadCurrentState();
    updateRoundStatusUI();
    updateLeaderboardToggleUI();
    setPanelHeights();
    window.addEventListener('resize', setPanelHeights);
    initPanelBackgroundFragments();

    // Add Enter key support for team input
    const teamInput = document.getElementById('newTeamName');
    if (teamInput) {
        teamInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTeam();
            }
        });
    }
});

function setPanelHeights() {
    const questionCard = document.getElementById('question-card-sizer');
    if (questionCard) {
        const height = questionCard.offsetHeight;
        document.documentElement.style.setProperty('--question-card-height', `${height}px`);
    }
}

function initializeQuestions() {
    // Load questions from the embedded data and initialize status
    const status = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_QUESTION_STATUS) || '[]');

    const rawQuestions = [];
    geographyQuestions.forEach((q, idx) => {
        // Insert round separator transitions before first question of each round
        if (q.id && q.id.startsWith("R2 ") && idx > 0 && !geographyQuestions[idx - 1].id.startsWith("R2")) {
            rawQuestions.push({
                id: "ROUND-SEPARATOR-1-2",
                type: "transition",
                text: "第一轮结束\n第二轮开始",
                points: 0,
                answer: "",
                rationale: "",
                isRoundSeparator: true
            });
        }
        if (q.id && q.id.startsWith("R3 ") && idx > 0 && !geographyQuestions[idx - 1].id.startsWith("R3")) {
            rawQuestions.push({
                id: "ROUND-SEPARATOR-2-3",
                type: "transition",
                text: "第二轮结束\n第三轮开始（个人赛模式）",
                points: 0,
                answer: "",
                rationale: "",
                isRoundSeparator: true
            });
        }
        if (q.id && q.id.startsWith("R4 ") && idx > 0 && !geographyQuestions[idx - 1].id.startsWith("R4")) {
            rawQuestions.push({
                id: "ROUND-SEPARATOR-3-4",
                type: "transition",
                text: "第三轮结束\n第四轮开始（图片线索题）",
                points: 0,
                answer: "",
                rationale: "",
                isRoundSeparator: true
            });
        }

        if (q.id && (q.id.includes('抢答题') || q.id.includes('加赛抢答题'))) {
            // Check if we should insert a "Ready" slide
            rawQuestions.push({
                id: "READY-" + q.id,
                type: "transition",
                text: "抢答题，你准备好了吗",
                points: 0,
                answer: "",
                rationale: "",
                isReadySlide: true
            });
        }
        rawQuestions.push(q);
    });

    questions = rawQuestions.map((q, index) => {
        const existingStatus = status.find(s => s.id === q.id);
        const qStatus = existingStatus || {};

        // For transitions, we auto-mark as not revealed but they behave differently
        return {
            ...q,
            numeric_id: index, // Keep a numeric index for navigation
            isAnswered: qStatus.isAnswered || false,
            isRevealed: qStatus.isRevealed || false,
        };
    });
}

function loadTeams() {
    // Load teams from Local Storage. Initialize with default teams if none exist.
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS);
        teams = raw ? JSON.parse(raw) : getDefaultTeams();
    } catch (e) {
        console.error("Error loading teams from local storage:", e);
        teams = getDefaultTeams();
    }

    // Ensure teams is always an array
    if (!Array.isArray(teams)) {
        teams = getDefaultTeams();
    }
}

function getDefaultTeams() {
    return [        
        { id: 1, name: "请输入文本", score: 0 },
        { id: 2, name: "何意味", score: 0 },
        { id: 3, name: "北伦敦之王", score: 0 },
        { id: 4, name: "摇摇椅:)", score: 0 },
        { id: 5, name: "嘎拉皇室队", score: 0 },
        { id: 6, name: "大于五个汉字", score: 0 }
    ];
}

function saveTeams() {
    // Save teams to Local Storage
    teams.sort((a, b) => b.score - a.score); // Sort by score descending
    localStorage.setItem(LOCAL_STORAGE_KEY_TEAMS, JSON.stringify(teams));
    renderLeaderboard();
    // Removed: renderScoreAdjustmentButtons(); // Redundant function call
}

function saveQuestionStatus() {
    // Save only the necessary status fields
    const statusToSave = questions.map(q => ({
        id: q.id, // Use original string ID for stable storage
        isAnswered: q.isAnswered,
        isRevealed: q.isRevealed,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_QUESTION_STATUS, JSON.stringify(statusToSave));
}

// --- Round & Mode State ---
function getDefaultRoundState() {
    return {
        currentRound: 1,
        mode: 'team', // 'team' | 'individual'
        isFinishedRound1: false,
        isFinishedRound2: false,
        isFinishedRound3: false,
        isFinishedRound4: false,
        quizFinished: false,
        eliminatedTeamIds: [],
        eliminatedIndividualIds: [],
        individualRosterLocked: false,
        finalBonuses: {},
    };
}

function loadRoundState() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ROUND_STATE);
    if (raw) {
        try {
            roundState = JSON.parse(raw);
        } catch {
            roundState = getDefaultRoundState();
        }
    } else {
        roundState = getDefaultRoundState();
    }
}

function saveRoundState() {
    localStorage.setItem(LOCAL_STORAGE_KEY_ROUND_STATE, JSON.stringify(roundState));
    updateRoundStatusUI();
    updateLeaderboardToggleUI();
}

function loadCurrentState() {
    const index = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_INDEX);
    if (index !== null) {
        loadQuestion(parseInt(index), false); // false = do not reset state immediately
    }
    // When no current question stored, keep welcome screen but ensure score panel/buttons reflect mode
    if (index === null) {
        loadQuestion(-1);
    }
}

function saveCurrentIndex(index) {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_INDEX, index);
}

// --- Individuals (Round 3) ---
function loadIndividuals() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_INDIVIDUALS);
    if (raw) {
        try {
            individuals = JSON.parse(raw);
        } catch {
            individuals = getDefaultIndividuals();
        }
    } else {
        individuals = getDefaultIndividuals();
    }
}

function getDefaultIndividuals() {
    return [
        // Team 1
        { id: "I-1", name: "李子墨 Max", teamId: 1, score: 0 },
        { id: "I-2", name: "欧阳韬涵 Robin", teamId: 1, score: 0 },
        // Team 2
        { id: "I-3", name: "庞昊杨Harvey", teamId: 2, score: 0 },
        { id: "I-4", name: "陈胤同Myron", teamId: 2, score: 0 },
        // Team 3
        { id: "I-5", name: "范博君Quentin", teamId: 3, score: 0 },
        { id: "I-6", name: "卢英泽Louis", teamId: 3, score: 0 },
        // Team 4
        { id: "I-7", name: "王牧天Martin", teamId: 4, score: 0 },
        { id: "I-8", name: "倪皓轩Noel", teamId: 4, score: 0 },
        // Team 5
        { id: "I-9", name: "管奕涵 Alex", teamId: 5, score: 0 },
        { id: "I-10", name: "陈力渲 Johnny", teamId: 5, score: 0 },
        // Team 6
        { id: "I-11", name: "朱梓瑞 Kevin", teamId: 6, score: 0 },
        { id: "I-12", name: "甘雨来 Rain", teamId: 6, score: 0 }
    ];
}

function saveIndividuals() {
    localStorage.setItem(LOCAL_STORAGE_KEY_INDIVIDUALS, JSON.stringify(individuals));
    renderIndividualLeaderboard();
}

// --- Team Management Functions ---
function toggleTeamManagement() {
    const panel = document.getElementById('teamManagementPanel');
    panel.classList.toggle('hidden');
}

function addTeam() {
    const input = document.getElementById('newTeamName');
    if (!input) return;

    const name = input.value.trim();
    if (name) {
        // Ensure teams is an array before pushing
        if (!Array.isArray(teams)) teams = [];

        // Calculate new ID safely
        const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id || 0)) + 1 : 1;

        teams.push({ id: newId, name: name, score: 0 });
        input.value = '';
        saveTeams(); // This calls renderLeaderboard() which displays the new team
    }
}

function removeSelectedTeam() {
    const selector = document.getElementById('teamSelector');
    const teamIdToRemove = parseInt(selector.value);
    if (teamIdToRemove && !isNaN(teamIdToRemove)) {
        teams = teams.filter(t => t.id !== teamIdToRemove);
        selector.value = '';
        saveTeams();
    }
}

function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const teamSelector = document.getElementById('teamSelector');
    const individualPanel = document.getElementById('individualLeaderboardPanel');

    // Toggle visibility based on current view
    if (leaderboardView === 'team') {
        leaderboardList.parentElement.parentElement.classList.remove('hidden');
        if (individualPanel) individualPanel.classList.add('hidden');
    }

    // Render Team Leaderboard
    if (teams.length === 0) {
        leaderboardList.innerHTML = `
            <tr class="team-row">
                <td colspan="3" class="px-3 py-4 text-center text-gray-500">
                    No teams added yet. Use 'Manage Teams' to start!
                </td>
            </tr>
        `;
    } else {
        const eliminatedIds = (roundState && roundState.eliminatedTeamIds) || [];
        
        // Separate active and eliminated teams
        const activeTeams = teams.filter(t => !eliminatedIds.includes(t.id));
        const eliminatedTeams = teams.filter(t => eliminatedIds.includes(t.id));
        
        // Create combined list: active teams first (by rank), then eliminated teams (by elimination order)
        const rankedTeams = activeTeams.map((team, index) => ({
            ...team,
            rank: index + 1,
            isEliminated: false
        }));
        
        // Add eliminated teams with their elimination positions
        eliminatedTeams.forEach((team, eliminationIndex) => {
            rankedTeams.push({
                ...team,
                rank: activeTeams.length + eliminationIndex + 1,
                isEliminated: true
            });
        });

        const isAnswerRevealed = currentQuestionIndex > -1 && questions[currentQuestionIndex].isRevealed;
        leaderboardList.innerHTML = rankedTeams.map((teamData) => {
            const team = teamData;
            const index = teamData.rank - 1;
            const isTopTeam = index === 0 && team.score > 0 && !team.isEliminated;

            const scoreClass = isTopTeam
                ? 'text-xl font-extrabold text-green-600'
                : 'text-lg font-semibold';
            const rowColor = team.isEliminated
                ? 'bg-red-50 dark:bg-red-900/40'
                : (roundState && roundState.currentRound >= 3 ? 'bg-green-50 dark:bg-green-900/30' : '');
            
            let rankIcon = team.rank;
            if (isTopTeam) rankIcon = '🥇';
            else if (index === 1 && !team.isEliminated) rankIcon = '🥈';
            else if (index === 2 && !team.isEliminated) rankIcon = '🥉';

            const disabledAttr = team.isEliminated ? 'disabled' : '';
            const buttonClass = team.isEliminated ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:scale-125 transition-transform';

            return `
                <tr class="team-row hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ${rowColor}">
                    <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${rankIcon}</td>
                    <td class="px-3 py-4 whitespace-nowrap text-lg font-medium text-indigo-600 dark:text-indigo-400">${team.name}</td>
                    <td id="score-${team.id}" class="px-3 py-4 whitespace-nowrap ${scoreClass}">${team.score}</td>
                    <td class="px-3 py-4 whitespace-nowrap text-center">
                        <button onclick="addScore(${team.id})" class="font-bold text-xl text-green-500 hover:text-green-700 ${buttonClass}" ${disabledAttr}>+</button>
                        <button onclick="subtractScore(${team.id})" class="font-bold text-xl text-red-500 hover:text-red-700 ml-2 ${buttonClass}" ${disabledAttr}>-</button>
                    </td>
                </tr>
            `;
        }).join('');
    }


    // Render Remove Team Selector
    teamSelector.innerHTML = '<option value="" disabled selected>Select team to remove</option>' + teams.map(team => `
        <option value="${team.id}">${team.name}</option>
    `).join('');
}

function loadQuestion(index, resetState = true) {
    if (index < 0 || index >= questions.length) {
        currentQuestionIndex = -1;
        saveCurrentIndex(-1);
        document.getElementById('questionTitle').textContent = "Welcome to the Quiz Master!";
        document.getElementById('questionContent').textContent = "Use the button below to load the next question once teams are ready.";
        document.getElementById('optionsContainer').classList.add('hidden');
        document.getElementById('questionImage').classList.add('hidden');
        document.getElementById('correctAnswer').textContent = "(Answer is hidden)";
        document.getElementById('revealBtn').style.display = 'none';
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'inline-block';
        nextBtn.textContent = "LOAD NEXT QUESTION »";
        document.getElementById('scorePanel').style.display = 'none';
        return;
    }

    currentQuestionIndex = index;
    saveCurrentIndex(index);
    const q = questions[index];

    document.getElementById('questionCard').classList.remove('flash-effect-reveal');
    document.getElementById('scorePanel').style.display = 'none';

    // Reset reveal state if moving to a new question (unless explicitly prevented)
    if (resetState) {
        q.isRevealed = false;
        saveQuestionStatus();
    }

    // Update Question Card
    document.getElementById('questionTitle').textContent = `Question ${q.id} (${q.points} Points)`;
    document.getElementById('questionContent').textContent = q.text; // Use 'text' instead of 'question'
    document.getElementById('currentPoints').textContent = q.points;

    // Update Question Image
    const imgEl = document.getElementById('questionImage');
    if (q.image) {
        imgEl.src = q.image;
        imgEl.classList.remove('hidden');
    } else {
        imgEl.classList.add('hidden');
    }

    document.getElementById('correctAnswer').textContent = q.isRevealed ? `${q.answer}. ${q.rationale}` : "(Answer is hidden)";


    // Display logic for different types
    if (q.type === 'transition') {
        document.getElementById('questionTitle').textContent = "即将开始"; // or "Ready?"
        document.getElementById('questionContent').textContent = q.text;
        document.getElementById('questionContent').className = "text-center text-4xl font-extrabold text-white my-12 animate-pulse"; // Make it big and pulsing
        document.getElementById('currentPoints').textContent = "-";
        document.getElementById('correctAnswer').textContent = "";

        // Hide standard elements
        document.getElementById('optionsContainer').classList.add('hidden');
        document.getElementById('questionImage').classList.add('hidden');
        document.getElementById('scorePanel').style.display = 'none';

        // In transition, we show "Next" immediately and hide "Redveal"
        // Also we don't need to reveal it to proceed.
        document.getElementById('revealBtn').style.display = 'none';

        const nextBtn = document.getElementById('nextBtn');
        nextBtn.textContent = "I'm Ready! »";
        nextBtn.style.display = 'inline-block';

        // Auto-mark as revealed/answered effectively so we can move pass it without clicking reveal
        // But we won't save it to DB necessarily, handled in goToNext
        q.isRevealed = true;
    } else {
        // Reset styles for normal questions
        document.getElementById('questionContent').className = "text-3xl text-gray-300 mb-4 border-b pb-4 border-gray-700";

        // Update Options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        if (q.type === 'multiple-choice' && q.options) { // Check for 'multiple-choice'
            optionsContainer.classList.remove('hidden');
            optionsContainer.innerHTML = q.options.map(option => {
                // Answer is a letter like "D", option is "D.深圳". Check if option starts with the answer letter.
                const isAnswer = q.isRevealed && option.startsWith(q.answer + ".");
                const optionClass = isAnswer
                    ? 'bg-green-100 dark:bg-green-700 border-green-500 font-bold text-green-800 dark:text-green-100 shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 font-medium text-gray-700 dark:text-gray-200 shadow-md';
                return `
                    <div class="p-4 border-l-4 rounded-lg ${optionClass} transition duration-300 flex items-center text-xl">
                        ${option}
                    </div>
                `;
            }).join('');
        } else {
            optionsContainer.classList.add('hidden');
        }

        // Update Buttons and Score Panel Visibility
        document.getElementById('revealBtn').style.display = q.isRevealed ? 'none' : 'inline-block';
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.textContent = "NEXT QUESTION »";
        nextBtn.style.display = q.isRevealed ? 'inline-block' : 'none';
        if (q.isRevealed) {
            document.getElementById('scorePanel').style.display = 'block';
        }
    }
    renderLeaderboard(); // Update buttons in leaderboard
}

function findNextUnanswered(startIndex = -1) {
    for (let i = startIndex + 1; i < questions.length; i++) {
        if (!questions[i].isAnswered) {
            return i;
        }
    }
    return -1;
}

function showCompletionState() {
    currentQuestionIndex = -1;
    saveCurrentIndex(-1);
    document.getElementById('questionTitle').textContent = "Quiz Complete!";
    document.getElementById('questionContent').textContent = "All questions have been answered. You can still adjust scores if needed or reset to start over.";
    document.getElementById('optionsContainer').classList.add('hidden');
    document.getElementById('questionImage').classList.add('hidden');
    document.getElementById('correctAnswer').textContent = "(Quiz Finished)";
    document.getElementById('revealBtn').style.display = 'none';
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';
    document.getElementById('scorePanel').style.display = 'none';
}

function revealAnswer() {
    if (currentQuestionIndex === -1) return;

    const q = questions[currentQuestionIndex];
    if (q.isRevealed) return;

    // 1. Set revealed state
    q.isRevealed = true;
    saveQuestionStatus();

    // 2. Animate and display answer
    const questionCard = document.getElementById('questionCard');
    questionCard.classList.add('flash-effect-reveal'); // Trigger the flash animation
    questionCard.addEventListener('animationend', function handler() {
        // Remove the class after animation to allow the card to return to default color
        questionCard.classList.remove('flash-effect-reveal');
        questionCard.removeEventListener('animationend', handler);
    });

    // Display the answer and update UI
    document.getElementById('correctAnswer').textContent = `${q.answer}. ${q.rationale}`;
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('scorePanel').style.display = 'block';

    // Re-render question to show correct options/styling
    loadQuestion(currentQuestionIndex, false);
}

function goToNextQuestion() {
    if (currentQuestionIndex === -1) {
        const nextIndex = findNextUnanswered(-1);
        if (nextIndex === -1) {
            showCompletionState();
        } else {
            loadQuestion(nextIndex);

            // Only auto-start timer if it's NOT a transition slide
            if (questions[nextIndex].type !== 'transition') {
                resetTimer();
                startTimer();
            } else {
                resetTimer(); // Ensure timer is off for transition
            }
        }
        return;
    }

    const q = questions[currentQuestionIndex];
    if (!q.isRevealed) {
        return;
    }

    q.isAnswered = true;
    q.isRevealed = true;
    saveQuestionStatus();

    const nextIndex = findNextUnanswered(currentQuestionIndex);
    if (nextIndex === -1) {
        showCompletionState();
    } else {
        loadQuestion(nextIndex);

        // Only auto-start timer if it's NOT a transition slide
        if (questions[nextIndex].type !== 'transition') {
            resetTimer();
            startTimer();
        } else {
            resetTimer(); // Ensure timer is off for transition
        }
    }
}

function subtractScore(teamId) {
    if (!roundState || roundState.quizFinished) return;
    if (roundState.mode === 'individual') return; // Only team scoring here

    const eliminated = new Set(roundState.eliminatedTeamIds || []);
    if (eliminated.has(teamId)) return;

    // Default to 1 point if on welcome screen so you can test buttons
    const points = currentQuestionIndex === -1 ? 1 : questions[currentQuestionIndex].points;
    const team = teams.find(t => t.id === teamId);

    if (team) {
        const oldScore = team.score;
        team.score = team.score - points; // Allow negative scores
        saveTeams();
        animateScoreUpdate(`score-${team.id}`, oldScore, team.score);
        showAvatarFeedback(false); // Wrong answer feedback
    }
}

function addScore(teamId) {
    if (!roundState || roundState.quizFinished) return;
    if (roundState.mode === 'individual' && roundState.currentRound === 3) return;

    const eliminated = new Set(roundState.eliminatedTeamIds || []);
    if (eliminated.has(teamId)) return;

    // Default to 1 point if on welcome screen so you can test buttons
    const points = currentQuestionIndex === -1 ? 1 : questions[currentQuestionIndex].points;
    const team = teams.find(t => t.id === teamId);

    if (team) {
        const oldScore = team.score;
        team.score += points;
        saveTeams();
        animateScoreUpdate(`score-${team.id}`, oldScore, team.score);
        showAvatarFeedback(true); // Correct answer feedback
    }
}

function animateScoreUpdate(elementId, startScore, endScore, isBonus = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = isBonus ? 700 : 500; // Longer duration for bonus
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const countUp = () => {
        frame++;
        const progress = frame / totalFrames;
        const currentScore = Math.round(startScore + (endScore - startScore) * progress);
        element.textContent = currentScore;

        if (frame < totalFrames) {
            requestAnimationFrame(countUp);
        } else {
            element.textContent = endScore; // Ensure it ends on the exact score
        }
    };

    const animationClass = isBonus ? 'bonus-burst-effect' : 'score-update-effect';
    element.classList.add(animationClass);
    element.addEventListener('animationend', function handler() {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handler);
    });

    requestAnimationFrame(countUp);
}

// --- Avatar Feedback ---
function showAvatarFeedback(isCorrect) {
    const image = document.getElementById('avatarImage');
    if (!image) return;

    // Set the correct image (thumb_up.gif or shocked.gif)
    image.src = isCorrect ? 'thumb_up.gif' : 'shocked.gif';

    // After 3 seconds, revert to idle.gif
    setTimeout(() => {
        image.src = 'idle.gif';
    }, 2400); // 3-second duration
}

// --- Round & leaderboard UI helpers ---
function updateRoundStatusUI() {
    const label = document.getElementById('roundStatus');
    const r1Btn = document.getElementById('finishRound1Btn');
    const r2Btn = document.getElementById('finishRound2Btn');
    const r3Btn = document.getElementById('finishRound3Btn');
    const r4Btn = document.getElementById('finishRound4Btn');

    if (!roundState) return;

    if (label) {
        let text = `Round ${roundState.currentRound} · ${roundState.mode === 'individual' ? 'Individual Mode' : 'Team Mode'}`;
        if (roundState.quizFinished) text = 'Quiz Finished';
        label.textContent = text;
    }

    if (r1Btn) r1Btn.disabled = roundState.currentRound !== 1 || roundState.isFinishedRound1;
    if (r2Btn) r2Btn.disabled = roundState.currentRound !== 2 || !roundState.isFinishedRound1 || roundState.isFinishedRound2;
    if (r3Btn) r3Btn.disabled = roundState.currentRound !== 3 || !roundState.isFinishedRound2 || roundState.isFinishedRound3;
    if (r4Btn) r4Btn.disabled = roundState.currentRound !== 4 || !roundState.isFinishedRound3 || roundState.isFinishedRound4;
}

function updateLeaderboardToggleUI() {
    const teamBtn = document.getElementById('teamViewBtn');
    const indBtn = document.getElementById('individualViewBtn');
    const teamTableWrapper = document.getElementById('leaderboardList')?.parentElement?.parentElement;
    const individualPanel = document.getElementById('individualLeaderboardPanel');

    if (!roundState) return;

    // Force team view while still in team mode
    if (roundState.mode === 'team') {
        leaderboardView = 'team';
    }

    if (teamBtn && indBtn) {
        if (leaderboardView === 'team') {
            teamBtn.classList.add('bg-indigo-500', 'text-white');
            teamBtn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');
            indBtn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');
            indBtn.classList.remove('bg-indigo-500', 'text-white');
        } else {
            indBtn.classList.add('bg-indigo-500', 'text-white');
            indBtn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');
            teamBtn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-200');
            teamBtn.classList.remove('bg-indigo-500', 'text-white');
        }
    }

    if (teamTableWrapper && individualPanel) {
        if (leaderboardView === 'team') {
            teamTableWrapper.classList.remove('hidden');
            individualPanel.classList.add('hidden');
        } else {
            teamTableWrapper.classList.add('hidden');
            individualPanel.classList.remove('hidden');
        }
    }
}

function setLeaderboardView(view) {
    if (!roundState) return;
    if (roundState.mode === 'team' && view === 'individual') {
        // Can't view individuals before individual mode
        return;
    }
    leaderboardView = view === 'individual' ? 'individual' : 'team';
    updateLeaderboardToggleUI();
    renderLeaderboard();
    renderIndividualLeaderboard();
}

// --- Individuals: leaderboard + editor ---
function renderIndividualLeaderboard() {
    const tbody = document.getElementById('individualLeaderboardList');
    const panel = document.getElementById('individualLeaderboardPanel');
    if (!tbody || !panel) return;

    if (!individuals.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-2 py-3 text-center text-gray-500 text-xs">No individuals yet. Finish Round 2 to generate roster.</td></tr>';
        renderIndividualEditor();
        return;
    }

    const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));
    const indexMap = {};
    individuals.forEach((ind, idx) => { indexMap[ind.id] = idx; });

    const quizFinished = roundState && roundState.quizFinished;
    const eliminatedIndividualIds = (roundState && roundState.eliminatedIndividualIds) || [];
    
    // Separate active and eliminated individuals
    const activeIndividuals = individuals.filter(ind => !eliminatedIndividualIds.includes(ind.id));
    const eliminatedIndividualsArr = individuals.filter(ind => eliminatedIndividualIds.includes(ind.id));
    
    // Sort active individuals by score, then by original order
    const sortedActive = [...activeIndividuals].sort((a, b) =>
        b.score - a.score || indexMap[a.id] - indexMap[b.id]
    );
    
    // Create ranked list: active individuals first, then eliminated in elimination order
    const rankedIndividuals = sortedActive.map((ind, index) => ({
        ...ind,
        rank: index + 1,
        isEliminated: false
    }));
    
    // Add eliminated individuals with their elimination positions
    eliminatedIndividualsArr.forEach((ind, eliminationIndex) => {
        rankedIndividuals.push({
            ...ind,
            rank: sortedActive.length + eliminationIndex + 1,
            isEliminated: true
        });
    });

    const eliminatedIndividuals = new Set(eliminatedIndividualIds);

    tbody.innerHTML = rankedIndividuals.map((indData) => {
        const ind = indData;
        const isEliminated = indData.isEliminated;
        let rankIcon = ind.rank;
        if (ind.rank === 1 && !isEliminated) rankIcon = '🥇';
        else if (ind.rank === 2 && !isEliminated) rankIcon = '🥈';
        else if (ind.rank === 3 && !isEliminated) rankIcon = '🥉';

        const disabledAttr = (quizFinished || isEliminated) ? 'disabled' : '';
        const buttonClass = (quizFinished || isEliminated) ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:scale-125 transition-transform';
        const rowColor = isEliminated ? 'bg-red-50 dark:bg-red-900/40' : '';

        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ${rowColor}">
                <td class="px-2 py-2 text-xs font-medium">${rankIcon}</td>
                <td class="px-2 py-2 text-xs">${ind.name}</td>
                <td class="px-2 py-2 text-xs text-indigo-600 dark:text-indigo-300">${teamMap[ind.teamId] || ''}</td>
                <td id="individual-score-${ind.id}" class="px-2 py-2 text-xs font-semibold">${ind.score}</td>
                <td class="px-2 py-2 whitespace-nowrap text-center">
                    <button onclick="addScoreIndividual('${ind.id}')" class="font-bold text-xl text-green-500 hover:text-green-700 ${buttonClass}" ${disabledAttr}>+</button>
                    <button onclick="subtractScoreIndividual('${ind.id}')" class="font-bold text-xl text-red-500 hover:text-red-700 ml-2 ${buttonClass}" ${disabledAttr}>-</button>
                </td>
            </tr>
        `;
    }).join('');

    renderIndividualEditor();
}

function renderIndividualEditor() {
    const editor = document.getElementById('individualEditor');
    const list = document.getElementById('individualEditorList');
    if (!editor || !list || !roundState) return;

    const shouldShow = roundState.currentRound === 3 && roundState.mode === 'individual' && !roundState.individualRosterLocked;
    if (!shouldShow) {
        editor.classList.add('hidden');
        return;
    }

    editor.classList.remove('hidden');
    list.innerHTML = individuals.map(ind => `
        <div class="flex items-center gap-1">
            <span class="w-8 text-[10px] text-gray-400">${ind.teamId}</span>
            <input type="text" data-id="${ind.id}" value="${ind.name}"
                   class="flex-1 px-1 py-0.5 border rounded text-xs bg-white dark:bg-gray-900" />
        </div>
    `).join('');
}

function lockIndividualRoster() {
    if (!roundState || roundState.individualRosterLocked) return;

    const inputs = document.querySelectorAll('#individualEditorList input[data-id]');
    inputs.forEach(input => {
        const id = input.dataset.id;
        const name = input.value.trim();
        const individual = individuals.find(ind => ind.id === id);
        if (individual && name) {
            individual.name = name;
        }
    });

    roundState.individualRosterLocked = true;
    saveRoundState();
    saveIndividuals();
    renderIndividualEditor();
    alertUser('Individual roster locked! You can now proceed with Round 3 questions.');
}

function generateIndividualRoster() {
    if (teams.length === 0) {
        alertUser("Please add teams first.");
        return;
    }

    // Use the hardcoded default individuals
    const defaultIndividuals = getDefaultIndividuals();

    // Filter by active teams (not eliminated)
    const activeTeamIds = new Set(teams.filter(t => !roundState.eliminatedTeamIds.includes(t.id)).map(t => t.id));
    individuals = defaultIndividuals.filter(ind => activeTeamIds.has(ind.teamId));

    roundState.individualRosterLocked = false;
    saveIndividuals();
    renderIndividualLeaderboard();
    alertUser("Individual roster generated. Please review and rename players in the editor, then click 'Lock Roster'.");
}

function addScoreIndividual(individualId) {
    if (!roundState || roundState.quizFinished) return;
    if (roundState.mode === 'team') return;

    const points = currentQuestionIndex === -1 ? 1 : questions[currentQuestionIndex].points;
    const individual = individuals.find(i => i.id === individualId);

    if (individual) {
        const oldScore = individual.score;
        individual.score += points;
        saveIndividuals();
        animateScoreUpdate(`individual-score-${individual.id}`, oldScore, individual.score);
        showAvatarFeedback(true); // Correct answer feedback
    }
}

function subtractScoreIndividual(individualId) {
    if (!roundState || roundState.quizFinished) return;
    if (roundState.mode === 'team') return;

    const points = currentQuestionIndex === -1 ? 1 : questions[currentQuestionIndex].points;
    const individual = individuals.find(i => i.id === individualId);

    if (individual) {
        const oldScore = individual.score;
        individual.score = individual.score - points; // Allow negative scores
        saveIndividuals();
        animateScoreUpdate(`individual-score-${individual.id}`, oldScore, individual.score);
        showAvatarFeedback(false); // Wrong answer feedback
    }
}

// --- Round Finishing Logic ---
function finishRound(roundNum) {
    if (roundState.quizFinished) {
        alertUser("The quiz is already finished!");
        return;
    }

    if (roundNum === 1) {
        finishRound1();
    } else if (roundNum === 2) {
        finishRound2();
    } else if (roundNum === 3) {
        finishRound3();
    } else if (roundNum === 4) {
        finishRound4();
    }
}

function finishRound1() {
    if (roundState.isFinishedRound1) {
        alertUser("Round 1 already finished.");
        return;
    }

    // Sort to identify lowest teams
    teams.sort((a, b) => a.score - b.score);

    // Identify the bottom two teams
    const teamsToEliminate = teams.slice(0, 2);

    if (teams.length < 3) {
        alertUser("Need at least 3 teams to eliminate two. Please add more teams or check scores.");
        return;
    }

    const eliminatedNames = teamsToEliminate.map(t => t.name).join(', ');
    const userConfirms = confirm(`Are you sure you want to finish Round 1 and eliminate the two lowest scoring teams: ${eliminatedNames}?`);

    if (userConfirms) {
        roundState.isFinishedRound1 = true;
        roundState.currentRound = 2;
        roundState.eliminatedTeamIds.push(...teamsToEliminate.map(t => t.id));

        // Re-sort teams by score descending for the leaderboard view
        teams.sort((a, b) => b.score - a.score);

        saveRoundState();
        saveTeams();

        // Find the round separator transition (1→2)
        const separatorIndex = questions.findIndex(q => q.id === "ROUND-SEPARATOR-1-2");
        if (separatorIndex !== -1) {
            loadQuestion(separatorIndex);
        } else {
            console.warn("Could not find round separator 1→2");
            // Fallback: find first question of Round 2
            const r2Index = questions.findIndex(q => q.id.startsWith("R2"));
            if (r2Index !== -1) {
                loadQuestion(r2Index);
            }
        }
    }
}

function finishRound2() {
    if (roundState.isFinishedRound2) {
        alertUser("Round 2 already finished.");
        return;
    }

    const activeTeams = teams.filter(t => !roundState.eliminatedTeamIds.includes(t.id));

    // Sort active teams to identify lowest team
    activeTeams.sort((a, b) => a.score - b.score);

    const teamToEliminate = activeTeams[0];

    if (activeTeams.length < 2) {
        alertUser("Need at least 2 active teams to eliminate one. Please check scores.");
        return;
    }

    const userConfirms = confirm(`Are you sure you want to finish Round 2 and eliminate the lowest scoring team: ${teamToEliminate.name}?`);

    if (userConfirms) {
        roundState.isFinishedRound2 = true;
        roundState.currentRound = 3;
        roundState.mode = 'individual'; // Switch to individual mode
        roundState.eliminatedTeamIds.push(teamToEliminate.id);

        // Prepare for individual round
        generateIndividualRoster();

        // Re-sort teams by score descending for the leaderboard view
        teams.sort((a, b) => b.score - a.score);

        saveRoundState();
        saveTeams();

        // Find the round separator transition (2→3)
        const separatorIndex = questions.findIndex(q => q.id === "ROUND-SEPARATOR-2-3");
        if (separatorIndex !== -1) {
            loadQuestion(separatorIndex);
        } else {
            console.warn("Could not find round separator 2→3");
            // Fallback: find first question of Round 3
            const r3Index = questions.findIndex(q => q.id.startsWith("R3"));
            if (r3Index !== -1) {
                loadQuestion(r3Index);
            }
        }
    }
}

function finishRound3() {
    if (roundState.isFinishedRound3) {
        alertUser("Round 3 (Individual) already finished.");
        return;
    }

    if (!roundState.individualRosterLocked) {
        alertUser("Please lock the individual roster before finishing Round 3.");
        return;
    }

    const userConfirms = confirm("Are you sure you want to finish Round 3 and eliminate the three lowest scoring individuals?");
    if (!userConfirms) return;

    // 1. Find bottom 3 individuals to eliminate
    const sortedIndividuals = [...individuals].sort((a, b) => a.score - b.score);
    const individualsToEliminate = sortedIndividuals.slice(0, 3);

    if (individuals.length < 4) {
        alertUser("Need at least 4 individuals to eliminate three. Please check the roster.");
        return;
    }

    const eliminatedNames = individualsToEliminate.map(i => i.name).join(', ');
    const confirmMessage = `Eliminating individuals: ${eliminatedNames}`;

    // 2. Mark individuals as eliminated
    roundState.isFinishedRound3 = true;
    roundState.currentRound = 4;
    roundState.eliminatedIndividualIds.push(...individualsToEliminate.map(i => i.id));

    // 3. Update individuals array
    individuals.forEach(ind => {
        if (roundState.eliminatedIndividualIds.includes(ind.id)) {
            ind.eliminated = true;
        }
    });

    saveRoundState();
    saveIndividuals();

    alertUser(`Round 3 Finished! ${confirmMessage}\n\nProceeding to Round 4.`);

    // Find the round separator transition (3→4)
    const separatorIndex = questions.findIndex(q => q.id === "ROUND-SEPARATOR-3-4");
    if (separatorIndex !== -1) {
        loadQuestion(separatorIndex);
    } else {
        console.warn("Could not find round separator 3→4");
        // Fallback: find first question of Round 4
        const r4Index = questions.findIndex(q => q.id.startsWith("R4"));
        if (r4Index !== -1) {
            loadQuestion(r4Index);
        }
    }
}


function finishRound4() {
    if (roundState.isFinishedRound4) {
        alertUser("Round 4 (Finals) already finished.");
        return;
    }

    const userConfirms = confirm("Are you sure you want to finish Round 4 and calculate final bonuses?");
    if (!userConfirms) return;

    // 1. Find top 3 remaining individuals
    const activeIndividuals = individuals.filter(i => !roundState.eliminatedIndividualIds.includes(i.id));
    const sortedIndividuals = [...activeIndividuals].sort((a, b) => b.score - a.score);
    const topIndividuals = sortedIndividuals.slice(0, 3);

    // 2. Assign bonuses to their teams (if still active)
    roundState.finalBonuses = {};
    const bonusPoints = [15, 10, 5]; // 1st, 2nd, 3rd place bonus
    const activeTeamIds = new Set(teams.filter(t => !roundState.eliminatedTeamIds.includes(t.id)).map(t => t.id));

    let bonusSummary = 'Final Bonuses:\n';
    let teamUpdates = [];

    topIndividuals.forEach((individual, index) => {
        const team = teams.find(t => t.id === individual.teamId);
        const bonus = bonusPoints[index];

        if (team && activeTeamIds.has(team.id)) {
            const oldScore = team.score;
            team.score += bonus;
            roundState.finalBonuses[team.id] = (roundState.finalBonuses[team.id] || 0) + bonus;
            teamUpdates.push({ teamId: team.id, oldScore: oldScore, newScore: team.score, isBonus: true });
            bonusSummary += `${index + 1}st Individual (${individual.name}) earns ${bonus} points for Team ${team.name}.\n`;
        }
    });

    // 3. Finalize state
    roundState.isFinishedRound4 = true;
    roundState.quizFinished = true;
    teams.sort((a, b) => b.score - a.score); // Final sort

    saveRoundState();
    saveTeams();

    // 4. Animate bonuses and show final message
    const animationPromises = teamUpdates.map(update =>
        new Promise(resolve => {
            animateScoreUpdate(`score-${update.teamId}`, update.oldScore, update.newScore, update.isBonus);
            setTimeout(resolve, 800); // Wait for animation before next one/final message
        })
    );

    Promise.all(animationPromises).then(() => {
        const winner = teams.filter(t => !roundState.eliminatedTeamIds.includes(t.id))[0];
        alertUser(`Quiz Finished! Winner: ${winner ? winner.name : 'No active teams'}. \n${bonusSummary}`);
    });

    loadQuestion(-1); // Go to final completion screen
}

// --- Utility Functions ---

function alertUser(message) {
    // Custom modal/message box instead of alert()
    const modal = document.getElementById('alertModal');
    const msgContainer = document.getElementById('alertMessage');
    const closeBtn = document.getElementById('alertCloseBtn');

    if (!modal || !msgContainer || !closeBtn) {
        console.warn("Modal elements not found. Using console log for message:", message);
        console.log(message);
        return;
    }

    msgContainer.textContent = message;
    modal.classList.remove('hidden');

    // Automatically hide after 5 seconds
    const timeout = setTimeout(() => {
        modal.classList.add('hidden');
    }, 5000);

    // Manual close function
    const closeHandler = () => {
        modal.classList.add('hidden');
        clearTimeout(timeout);
        closeBtn.removeEventListener('click', closeHandler);
    };

    closeBtn.addEventListener('click', closeHandler);
}

function resetApp() {
    const userConfirms = confirm("Are you sure you want to completely reset the application? All teams, scores, and question statuses will be deleted.");
    if (userConfirms) {
        // Clear all local storage keys
        localStorage.removeItem(LOCAL_STORAGE_KEY_TEAMS);
        localStorage.removeItem(LOCAL_STORAGE_KEY_QUESTION_STATUS);
        localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_INDEX);
        localStorage.removeItem(LOCAL_STORAGE_KEY_ROUND_STATE);
        localStorage.removeItem(LOCAL_STORAGE_KEY_INDIVIDUALS);

        // Reinitialize everything
        currentQuestionIndex = -1;
        initializeQuestions();
        loadTeams();
        loadRoundState();
        loadIndividuals();
        loadQuestion(-1); // Display welcome state
        renderLeaderboard();
        renderIndividualLeaderboard();
        // Removed: renderScoreAdjustmentButtons(); // Redundant function call
        updateRoundStatusUI();
        updateLeaderboardToggleUI();
    }
}

// --- Timer Functions ---
function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timeRemaining = 15;
    const timerValue = document.getElementById('timerValue');
    const bigBenContainer = document.getElementById('bigBenContainer');

    if (timerValue) {
        timerValue.textContent = timeRemaining;
        timerValue.classList.remove('text-red-500', 'scale-125');
    }

    if (bigBenContainer) {
        bigBenContainer.classList.remove('timer-active');
    }
}

function startTimer() {
    if (timerInterval) return; // Timer is already running

    const timerValue = document.getElementById('timerValue');
    const bigBenContainer = document.getElementById('bigBenContainer');
    const bellSound = document.getElementById('bellSound');

    timeRemaining = 15;
    timerValue.textContent = timeRemaining;
    bigBenContainer.classList.add('timer-active');

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerValue.textContent = timeRemaining;

        if (timeRemaining <= 3) {
            timerValue.classList.add('text-red-500', 'scale-125');
        } else {
            timerValue.classList.remove('text-red-500', 'scale-125');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timeRemaining = 15;
            timerValue.textContent = timeRemaining;
            timerValue.classList.remove('text-red-500', 'scale-125');
            bigBenContainer.classList.remove('timer-active');

            // Play a sound to signal time is up
            if (bellSound) bellSound.play().catch(e => console.error("Audio playback failed:", e));

            alertUser("TIME IS UP! Please lock in your answers.");
        }
    }, 1000);
}

// --- Background Fragments (Visual Effect) ---
function initPanelBackgroundFragments() {
    const fragments = [
        document.getElementById('fragmentPanel1'),
        document.getElementById('fragmentPanel2'),
        document.getElementById('fragmentPanel3')
    ].filter(el => el);

    fragmentPanels = fragments;

    if (fragmentPanels.length === 0) return;

    fragmentObserver = new ResizeObserver(entries => {
        if (!fragmentRefreshScheduled) {
            fragmentRefreshScheduled = true;
            window.requestAnimationFrame(() => {
                fragmentPanels.forEach(panel => createFragments(panel));
                fragmentRefreshScheduled = false;
            });
        }
    });

    fragmentPanels.forEach(panel => {
        fragmentObserver.observe(panel);
    });

    // Initial run
    fragmentPanels.forEach(panel => createFragments(panel));
}

function createFragments(panel) {
    // Clear existing fragments
    panel.innerHTML = '';
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;

    // Define fragment size (e.g., 1/10th of the smaller dimension)
    const size = Math.min(width, height) / 8;
    const countX = Math.ceil(width / size);
    const countY = Math.ceil(height / size);

    // Total number of fragments, capped for performance
    const maxFragments = 150;
    const totalFragments = Math.min(countX * countY, maxFragments);

    // Only render fragments if we have space and it makes sense
    if (size < 10) return;

    for (let i = 0; i < totalFragments; i++) {
        const fragment = document.createElement('div');
        fragment.classList.add('absolute', 'bg-indigo-300', 'opacity-50', 'fragment');

        // Random size and position within bounds
        const s = size * (0.5 + Math.random() * 0.5); // Size variation
        const x = Math.random() * (width - s);
        const y = Math.random() * (height - s);

        fragment.style.width = `${s}px`;
        fragment.style.height = `${s}px`;
        fragment.style.left = `${x}px`;
        fragment.style.top = `${y}px`;
        fragment.style.borderRadius = '50%';
        fragment.style.filter = 'blur(10px)';
        fragment.style.animationDuration = `${5 + Math.random() * 5}s`; // 5 to 10 seconds
        fragment.style.animationDelay = `${-Math.random() * 10}s`; // Start at random phase

        panel.appendChild(fragment);
    }
}