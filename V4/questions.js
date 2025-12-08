const geographyQuestions = [
    {
        "id": "R1-MC-001",
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
        "id": "R1-MC-002",
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
        "rationale": "中国四大海域为渤海，黄海，东海，男孩。洱海是云南的湖"
    },
    {
        "id": "R1-MC-003",
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
        "id": "R1-MC-004",
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
        "id": "R1-MC-005",
        "type": "multiple-choice",
        "text": "以下哪个国家不被赤道穿过？",
        "options": [
            "A.阿尔及利亚",
            "B.厄瓜多尔",
            "C.印度尼西亚",
            "D.马尔代夫"
        ],
        "answer": "A",
        "points": 1,
        "rationale": "赤道大致穿过非洲中部，阿尔及利亚位于北非。"
    },
    {
        "id": "R1-MC-006",
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
        "id": "R1-MC-007",
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
        "id": "R1-MC-008",
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
        "id": "R1-MC-009",
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
        "rationale": "哥伦比亚北接巴拿马，在太平洋沿岸有布埃纳文图拉（Buenaventura）等港口，在加勒比海沿岸拥有巴兰基亚（Barranquilla）等港口，其地理位置如图所示"
    },
    {
        "id": "R1-MC-010",
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
        "id": "R1-MC-011",
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
        "id": "R1-MC-012",
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
        "id": "R1-MC-013",
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
        "id": "R1-MC-014",
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
        "rationale": "底特律位于美加边境的密歇根州，与加拿大的温莎（Windsor）隔河相望，是密歇根州最大的市镇。其位置如图所示"
    },
    {
        "id": "R1-MC-015",
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
        "id": "R1-MC-016",
        "type": "multiple-choice",
        "text": "根据BBC报道，2025年10月22日尼日利亚的一起油罐车爆炸事故造成了至少42人死亡。下列哪个是尼日利亚的国旗？",
        "options": [
            "A.",
            "B.",
            "C.",
            "D."
        ],
        "answer": "C",
        "points": 5,
        "rationale": "图1为塞内加尔国旗，图2是贝宁国旗，图4是埃塞俄比亚国旗"
    },
    {
        "id": "R1-MC-017",
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
        "id": "R1-MC-018",
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
        "id": "R1-MC-019",
        "type": "multiple-choice",
        "text": "世界上陆地面积第二小的大洲是？",
        "options": [
            "A.欧洲",
            "B.非洲",
            "C.南美洲",
            "D.北美洲"
        ],
        "answer": "A",
        "points": 1,
        "rationale": "世界上陆地面积最小的大洲是大洋洲，倒数第二是欧洲，面积约1053万平方千米。"
    },
    {
        "id": "R1-MC-020",
        "type": "multiple-choice",
        "text": "以下哪个海域不在亚洲？",
        "options": [
            "A.波斯湾",
            "B.濑户内海",
            "C.亚德里亚海",
            "D.萨武海"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "亚德里亚海大致位于意大利和巴尔干半岛之间，萨武海大致位于印尼和帝汶岛之间。"
    },
    {
        "id": "R1-MC-021",
        "type": "multiple-choice",
        "text": "以下哪个不是印度尼西亚的岛屿？",
        "options": [
            "A.棉兰老岛",
            "B.苏门答腊岛",
            "C.爪哇岛",
            "D.婆罗洲（加里曼丹岛）"
        ],
        "answer": "A",
        "points": 1,
        "rationale": "棉兰老岛是菲律宾的第二大岛"
    },
    {
        "id": "R1-MC-022",
        "type": "multiple-choice",
        "text": "以下哪个国家不被阿尔卑斯山脉穿过？",
        "options": [
            "A.法国",
            "B.斯洛文尼亚",
            "C.意大利",
            "D.斯洛伐克"
        ],
        "answer": "D",
        "points": 1,
        "rationale": "斯洛伐克的主要山脉是喀尔巴阡山脉，前三国都可以领略壮丽的阿尔卑斯山脉景色。"
    },
    {
        "id": "R1-MC-023",
        "type": "multiple-choice",
        "text": "以下哪个不是东南亚国家？",
        "options": [
            "A.缅甸",
            "B.文莱",
            "C.孟加拉国",
            "D.东帝汶"
        ],
        "answer": "C",
        "points": 1,
        "rationale": "孟加拉国在地理区域的划分上属于南亚。"
    },
    {
        "id": "R1-MC-024",
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
        "id": "R1-MC-025",
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
        "id": "R1-MC-026",
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
        "id": "R1-MC-027",
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
        "id": "R2-SA-028",
        "type": "short-answer",
        "text": "叙利亚的首都是？",
        "answer": "大马士革",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-029",
        "type": "short-answer",
        "text": "2025年10月13日，佛得角在美加墨世界杯预选赛中以小组第一的身份获得直通世界杯的资格。这个岛国位于哪片海域上？",
        "answer": "大西洋",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-030",
        "type": "short-answer",
        "text": "2025年11月9日，一艘中国渔船在全罗南道附近海域倾覆。全罗南道属于哪个国家？",
        "answer": "韩国",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-031",
        "type": "short-answer",
        "text": "埃及的亚洲部分主要位于哪个半岛上？",
        "answer": "西奈半岛",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-032",
        "type": "short-answer",
        "text": "印度河主要流经哪个国家？",
        "answer": "巴基斯坦",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-033",
        "type": "short-answer",
        "text": "长征二号F遥二十一运载火箭于2025年10月31日在酒泉卫星发射中心成功发射了神舟二十一号载人飞船。酒泉市位于哪个省？",
        "answer": "甘肃",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-034",
        "type": "short-answer",
        "text": "2012年，匈牙利时任总统帕尔·施米特因被指控抄袭博士论文引咎辞职。匈牙利的首都被哪条河流穿过？",
        "answer": "多瑙河",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-035",
        "type": "short-answer",
        "text": "“七丘之城”说的是哪个城市？",
        "answer": "罗马",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-036",
        "type": "short-answer",
        "text": "位于欧洲中部的“音乐之都”是？",
        "answer": "维也纳",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-037",
        "type": "short-answer",
        "text": "中国唯一的北冰洋水系河流是？",
        "answer": "额尔齐斯河",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-038",
        "type": "short-answer",
        "text": "2025年1月20日，特朗普第二次在白宫就任。白宫位于华盛顿D.C.，其中D.C.表示的含义是？",
        "answer": "哥伦比亚特区",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-039",
        "type": "short-answer",
        "text": "2014年，俄罗斯城市索契举办了冬奥会。索契在哪片海域沿岸？",
        "answer": "黑海",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R2-SA-040",
        "type": "short-answer",
        "text": "中国领海最南端位于？",
        "answer": "曾母暗沙",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R2-SA-041",
        "type": "short-answer",
        "text": "世界上最著名的啤酒节每年十月在哪个城市举办？",
        "answer": "慕尼黑",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R2-SA-042",
        "type": "short-answer",
        "text": "潘帕斯草原西部主要位于哪个国家？",
        "answer": "阿根廷",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3-SA-043",
        "type": "short-answer",
        "text": "《吕氏春秋》的作者是秦国丞相吕不韦。秦国的都城是？",
        "answer": "咸阳",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-044",
        "type": "short-answer",
        "text": "红军长征途中“巧渡”的是哪条河流？",
        "answer": "这条河流位于我国西南地区，是长江的上游河段。金沙江",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-045",
        "type": "short-answer",
        "text": "Jon Krakauer的书”Into the Wild”的主人公Chris McCandless长途跋涉来到阿拉斯加。阿拉斯加的最高峰是麦金利山，它的另一个名字是？",
        "answer": "迪纳利山",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-046",
        "type": "short-answer",
        "text": "江南三大名楼分别是？",
        "answer": "（需答出3个）黄鹤楼 岳阳楼 滕王阁",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-047",
        "type": "short-answer",
        "text": "《陋室铭》中作者以“南阳诸葛庐，西蜀子云亭”自比。南阳位于那个省份？",
        "answer": "河南",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-048",
        "type": "short-answer",
        "text": "苏轼在哪里写下了《记承天寺夜游》？",
        "answer": "黄冈（接受黄州）",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-049",
        "type": "short-answer",
        "text": "韦达定理指出，对于方程𝑎𝑥²+𝑏𝑥+𝑐=0，其两根之和等于-b/a，两根之积等于c/a。韦达是哪国人？",
        "answer": "法国人",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-050",
        "type": "short-answer",
        "text": "法国化学家拉瓦锡在1774年通过拉瓦锡实验提出“提出空气由约20%氧气和80%氮气组成”。拉瓦锡最后死于哪里？",
        "answer": "被处死于巴黎",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-051",
        "type": "short-answer",
        "text": "詹姆斯·沃森和弗朗西斯·克里克在1953年共同提出了DNA的双螺旋结构模型。届时，他们的研究处在卡文迪许实验室。这座实验室位于英国哪座城市？",
        "answer": "剑桥",
        "points": 5,
        "rationale": ""
    },
    {
        "id": "R3-SA-052",
        "type": "short-answer",
        "text": "相传在1589-1592年间，伽利略在比萨斜塔进行了著名的实验以证明物体下降时间与其质量无关。比萨斜塔位于哪座城市？",
        "answer": "比萨",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3-SA-053",
        "type": "short-answer",
        "text": "1860年《中俄北京条约》使得中国失去了哪条江的最后15公里，从而失去了日本海的出海口？",
        "answer": "图们江",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "R3-SA-054",
        "type": "short-answer",
        "text": "苏珊·埃洛伊丝·欣顿热衷于创作以俄克拉荷马州为背景的青年小说。她的著名小说“The Outsiders”背景设定在哪座城市？",
        "answer": "这座城市也是该州人口第二多的城市。塔尔萨/图尔萨",
        "points": 1,
        "rationale": ""
    },
    {
        "id": "IMG-IMG-055",
        "type": "image-clue",
        "text": "这个国家根据语言被分为两个历史性区域——佛兰德斯和瓦隆尼亚。1885-1908年间，该国时任国王利奥波德二世对现在的刚过民主共和国实行了残暴的殖民统治。图中展示的是这个国家的著名地标原子塔，展示了放大1650亿倍的铁晶体晶胞构架。作为低地三国之一，这个国家的第二大城市是港口安特卫普。终极提示：请说出这个欧洲国家的名字——它的首都是布鲁塞尔，也是欧盟总部所在地。比利时",
        "answer": "比利时",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "佛兰德斯是比利时的荷兰语区，瓦隆尼亚是法语区。利奥波德二世曾下令虐杀刚果自由邦数百万到1,500万人。"
    },
    {
        "id": "IMG-IMG-056",
        "type": "image-clue",
        "text": "在这片海洋上，你可以找到爱德华王子群岛，索科特拉岛和安达曼-尼科巴群岛。图中所示的是位于这片海洋的世界最长海峡。在这片海洋的沿岸你可以找到蒙巴萨，马斯喀特和科伦坡等城市。此外，雅鲁藏布江最终注入了这片海洋。终极提示：马达加斯加岛和旅游胜地马尔代夫位于这片与一个国家同名的世界第三大洋上。它的名字是？印度洋",
        "answer": "印度洋",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "爱德华王子群岛属于南非，索科特拉岛是也门的岛屿，以龙血树闻名。安达曼-尼科巴群岛属于印度。世界上最长的海峡是莫桑比克海峡。蒙巴萨是肯尼亚的港口城市，马斯喀特和科伦坡分别是阿曼和斯里兰卡的首都。雅鲁藏布江在孟加拉国注入印度洋。"
    },
    {
        "id": "IMG-IMG-057",
        "type": "image-clue",
        "text": "在这条河的沿岸，你可以找到战神广场和特洛卡得罗花园。这条河流源自朗格勒高原，几经流转后注入科唐坦半岛北部海域。位于这条河流所在国家首都的卡鲁赛尔桥和耶拿桥飞渡这条河。它不是这个西欧国家最长的河流，却或许是最有名的一条。终极提示：这条河的河畔坐落着协和广场和奥赛博物馆，在游船上你可以观赏荣军院的穹顶和埃菲尔铁塔的壮丽景色。塞纳河",
        "answer": "塞纳河",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "特洛卡得罗花园是观赏埃菲尔铁塔景色的绝佳之处，这里曾经是夏宫（特洛卡得罗宫）所在之处，现在主要是博物馆，科唐坦半岛北部海域即英吉利海峡。"
    },
    {
        "id": "IMG-IMG-058",
        "type": "image-clue",
        "text": "这片海峡的迷雾中至今流传着1940年代荷兰商船棉兰号的诡异传说。这片海峡右岸盘踞着蒂迪旺沙山脉，南端有廖内群岛，而图中所示的是这片海峡沿岸的历史建筑荷兰红堡，位于和这个海峡同名的一座城市。作为海上丝绸之路的重要一环，这片海峡是全球最繁忙的海峡之一。终极提示：位于中南半岛的西南方，这片海峡夹于马来西亚，印度尼西亚和新加坡之间。马六甲海峡",
        "answer": "马六甲海峡",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "棉兰号Ourang Medan是一个幽灵船都市传说，蒂迪旺沙山脉是马来半岛的主要山脉。廖内群岛（Riau Islands）是印尼苏门答腊岛以东的一片群岛，荷兰红堡（Stadthuys）由荷兰人于1650年建造，位于马来西亚马六甲（Melaka）市。"
    },
    {
        "id": "IMG-IMG-059",
        "type": "image-clue",
        "text": "这座城市最早的欧洲定居者是威廉·布莱克顿，而约翰·温斯罗普则是这座城市殖民时期的第一任总督。这座城市在19世纪初开始不断填海造地以扩张面积，并在1845年时已经增加了约300英亩的土地面积。图中所示的是这座城市的雕塑“Make Way for Ducklings”。这座城市的“自由之路”从城市公园一直到查尔斯顿的邦克山纪念碑，是美国独立战争的重要标志和历史遗址。终极提示：在查尔斯河畔，你可以看到麻省理工学院的穹顶，而这座城市最为出名的莫过于1773年的“倾茶事件”。波士顿",
        "answer": "波士顿",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "波士顿最初只是一个半岛，如今的重要区域，如后湾（Back Bay），南端（South End），和洛根国际机场都是建立在填海造地的基础之上。“Make Way for Ducklings”是对罗伯特·麥克克洛茨基的同名儿童故事的现实再现。邦克山战役发生在1775年的波士顿。"
    },
    {
        "id": "IMG-IMG-060",
        "type": "image-clue",
        "text": "这个国家在1879-1883年的硝石战争中战败，丧失了海岸线，从此跻身内陆国的行列。这个国家的行政首都因为其超高的海拔导致的高原反应和缺氧而被冠以“外交官的坟墓”之名。图中所示的是该国行政首都的卫星城埃尔阿尔托，平均海拔4150米。这个国家的的的喀喀湖是世界上最高的大型可通航淡水湖。终极提示：这个国家是南美洲唯二的内陆国之一，它的行政首都是拉巴斯，而它的货币是玻利维亚诺。玻利维亚",
        "answer": "玻利维亚",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": "硝石战争，又称鸟粪战争和南美太平洋战争"
    },
    {
        "id": "IMG-IMG-061",
        "type": "image-clue",
        "text": "这片区域是东卡国家公园所在之处，该国家公园北接东萨彦岭，南抵哈马尔达班山脉。图中所示的是位于该区域的城镇米尔纳，其拥有世界上最大的挖掘洞之一——米尔矿场。1908年，一颗陨石在克拉斯诺亚尔斯克边疆区上空“空爆”，这就是著名的通古斯大爆炸。同时，位于这片区域的萨哈共和国也是世界上面积最大的一级行政单位。终极提示：鄂毕河和叶尼塞河流经这片西起乌拉尔山脉，东至太平洋的广大区域，它的名字是？西伯利亚",
        "answer": "西伯利亚",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": ""
    },
    {
        "id": "IMG-IMG-062",
        "type": "image-clue",
        "text": "这个国家首都的查尔斯桥在神圣罗马帝国皇帝查理4世的主持下始建于1357年，桥的两畔共有30坐雕塑，包括“圣殇”，施洗约翰雕像以及“圣西里尔和美多德像”。图中所示的是该国国徽，其中左下角的黑鹰代表了西里西亚。1938年，该国的切申地区被入侵并占领，而在更早的1618年，在该国首都城堡发生的第二次掷出窗外事件成为了三十年战争的导火索。终极提示：这个国家被历史性的划分为西里西亚，摩拉维亚和波西米亚三个地区，上文提到的入侵切申的是波兰，而该国首都是伏尔塔瓦河畔的布拉格。捷克共和国",
        "answer": "捷克共和国",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": ""
    },
    {
        "id": "IMG-IMG-063",
        "type": "image-clue",
        "text": "这片区域的最高峰是文森山，海拔4892米。位于该地区的沃斯托克湖也是该地区最大的地下水体。图中所示的是罗斯属地（Ross Dependency）的旗帜，是新西兰在此区域声称拥有的领地。不少其他国家也宣称在这片区域拥有领土主权，例如法国的阿黛利海岸（Adelie Land）和挪威的毛德皇后地(Queen Maud Land)。这片区域的南设得兰群岛与北面的火地岛（Tierra del Fuego）隔海相望。终极提示：1911年，罗阿尔·阿蒙森与罗伯特·法尔肯·斯科特在这片区域展开“竞争”。前者获胜，而后者在此次事件中不幸遇难。这则故事被撰写成了茨威格的文章《伟大的悲剧》。中国在这片区域设有长城站，中山站，昆仑站等科考研究中心",
        "answer": "中国在这片区域设有长城站，中山站，昆仑站等科考研究中心",
        "points": 10,
        "image": "TODO: Insert Image Path",
        "rationale": ""
    }
];
