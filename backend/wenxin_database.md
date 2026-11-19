<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 数据库变更记录（wenxin_database.md）

> 说明：本文件按执行顺序追加记录所有建库、建表、插入数据语句，仅凭本文件即可在新机器上完整重建数据库。
> 数据库：MySQL 8.x，库名 `wenxin_zhihu`，字符集 `utf8mb4`。

## 2026-11-19 21:00 建库与建表（wenxin_news / wenxin_gallery）

```sql
CREATE DATABASE IF NOT EXISTS `wenxin_zhihu`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `wenxin_zhihu`;

-- 科技新闻表
CREATE TABLE IF NOT EXISTS `wenxin_news` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻ID',
  `title` VARCHAR(200) NOT NULL COMMENT '新闻标题',
  `summary` VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  `content` TEXT NOT NULL COMMENT '新闻正文',
  `source` VARCHAR(100) NOT NULL COMMENT '来源媒体',
  `author` VARCHAR(50) NOT NULL COMMENT '作者',
  `category` VARCHAR(50) NOT NULL DEFAULT '科技' COMMENT '分类',
  `views` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '阅读量',
  `publish_time` DATETIME NOT NULL COMMENT '发布时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_wenxin_news_publish` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- 图文列表表
CREATE TABLE IF NOT EXISTS `wenxin_gallery` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文ID',
  `title` VARCHAR(200) NOT NULL COMMENT '图文标题',
  `description` VARCHAR(500) NOT NULL COMMENT '图文描述',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片地址',
  `category` VARCHAR(50) NOT NULL DEFAULT '科技' COMMENT '分类',
  `author` VARCHAR(50) NOT NULL COMMENT '作者',
  `likes` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文列表表';
```

## 2026-11-19 21:05 插入科技新闻测试数据（10 条）

```sql
USE `wenxin_zhihu`;

INSERT INTO `wenxin_news` (`title`, `summary`, `content`, `source`, `author`, `category`, `views`, `publish_time`) VALUES
('国产开源大模型刷新代码生成榜单纪录', '新一代国产开源大模型在主流代码生成评测集中超过同参数量级模型，推理速度提升 40%。', '国产开源大模型团队今日发布最新版本，在 HumanEval 与 MBPP 两项代码生成评测中分别取得 92.1% 与 88.7% 的成绩，刷新同参数量级开源模型纪录。官方表示，新版本通过改进数据配比与强化学习策略，在保持推理速度提升 40% 的同时显著降低了幻觉率。目前模型权重已在开源社区开放下载，支持中文、英文等 26 种编程语言。', '科技前线', '陈默', '人工智能', 15230, '2026-11-19 09:20:00'),
('新一代 AI 芯片实现能效比翻倍', '采用 3nm 工艺与存算一体架构，单卡推理性能达到上一代的两倍，功耗下降 35%。', '国内芯片企业今日发布新一代数据中心 AI 加速卡。该芯片采用 3nm 制程与存算一体架构，在典型大模型推理场景下性能较上一代提升约 2 倍，整卡功耗下降 35%。厂商透露，首批产品已交付多家云计算服务商，配套的编译器与算子库同步开源，方便开发者迁移现有模型。', '芯片观察', '李维', '硬件', 9832, '2026-11-19 08:45:00'),
('量子计算原型机完成千比特纠缠实验', '研究团队实现 1024 个超导量子比特的稳定纠缠，相干时间创国内新高。', '由多家科研院所联合组成的团队宣布，其超导量子计算原型机成功实现 1024 个量子比特的稳定纠缠，纠缠保真度达到 99.2%，量子相干时间较上一代提升近三倍。专家认为，该成果为大规模量子纠错与专用量子模拟奠定了关键基础，但在通用量子计算方向仍需长期攻关。', '科学新知', '周岚', '前沿科学', 7421, '2026-11-18 19:10:00'),
('6G 通感一体化外场试验取得突破', '单站通信速率达到 100Gbps，同时具备厘米级感知能力。', '运营商与设备商联合完成 6G 通感一体化外场试验，在毫米波与太赫兹混合组网条件下，单站峰值通信速率达到 100Gbps，并实现对低空无人机目标的厘米级定位与轨迹跟踪。试验验证了通信与感知资源共享的可行性，为低空经济场景提供了新的网络支撑方案。', '通信世界', '吴迪', '通信', 6217, '2026-11-18 16:30:00'),
('人形机器人量产线正式投产', '首条人形机器人柔性量产线年产能 5000 台，主要面向工业巡检与物流搬运场景。', '某机器人企业今日宣布其首条人形机器人柔性量产线正式投产，年产能约 5000 台。产线采用模块化装配与在线视觉检测，单台整机装配时间缩短至 4 小时。首批产品将交付工业巡检、仓储搬运等场景客户，单台售价较此前下降约三成。', '智能制造日报', '孙超', '机器人', 11045, '2026-11-17 14:05:00'),
('固态电池装车测试续航突破 1200 公里', '半固态电池包完成整车路测，低温环境下续航衰减控制在 12% 以内。', '车企公布半固态电池装车路测结果：在 CLTC 工况下整车续航达到 1216 公里，-10℃ 低温环境中续航衰减仅 12%。电池包采用高镍正极与硅碳负极，配合新型复合固态电解质，支持 4C 快充，10 分钟可补能 600 公里。官方计划于明年二季度实现小批量交付。', '新能源观察', '郑一鸣', '新能源', 18790, '2026-11-17 10:00:00'),
('开源操作系统发布长期支持版本', '新版本内核升级，提供 5 年安全维护，重点优化桌面与服务器统一体验。', '国内开源操作系统社区发布新一期长期支持版本，内核与桌面环境同步升级，提供 5 年安全维护承诺。新版本在多屏协同、应用兼容层与服务器容器运行时方面做了重点优化，已通过多家整机厂商的兼容性认证，个人用户可免费下载使用。', '开源社区', '何青', '软件', 5134, '2026-11-16 20:25:00'),
('卫星互联网完成全球组网最后一批发射', '低轨星座在轨卫星数量达到 2600 颗，全球平均时延低于 40 毫秒。', '随着最后一组卫星成功入轨，低轨卫星互联网星座完成全球组网，在轨卫星总数达到 2600 颗。实测全球平均端到端时延低于 40 毫秒，单用户下行速率可达 200Mbps。运营方表示，下一步将重点推进航空、航海与应急通信场景的终端适配。', '航天视野', '马骁', '航天', 8906, '2026-11-16 11:40:00'),
('脑机接口临床试验帮助患者实现意念打字', '受试者通过植入式脑机接口实现每分钟 62 字符的意念输入，准确率超过 95%。', '一项植入式脑机接口临床试验公布阶段性结果：一名因脊髓损伤导致四肢瘫痪的受试者，通过意念控制虚拟键盘实现每分钟 62 个字符的输入速度，字符准确率超过 95%。研究团队表示，系统采用柔性电极与自适应解码算法，长期稳定性仍需进一步观察。', '生命科学周刊', '林悦', '医疗科技', 6728, '2026-11-15 15:50:00'),
('数据中心液冷技术节省三成能耗', '冷板式液冷改造后，单机柜功率密度提升至 40kW，PUE 降至 1.15。', '某云计算数据中心完成冷板式液冷改造，单机柜功率密度由 12kW 提升至 40kW，全年平均 PUE 从 1.42 降至 1.15，整体能耗下降约 30%。改造方案通过余热回收为园区供暖，进一步提升了能源利用效率，为高密度算力集群提供了可复制的节能样本。', '算力产业网', '顾言', '数据中心', 4365, '2026-11-15 09:15:00');
```

## 2026-11-19 21:10 插入图文列表测试数据（8 条）

```sql
USE `wenxin_zhihu`;

INSERT INTO `wenxin_gallery` (`title`, `description`, `image_url`, `category`, `author`, `likes`) VALUES
('算力之城的夜晚', '成排的 AI 服务器机柜在冷蓝光下运转，液冷管道的反光像城市的街道。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20artificial%20intelligence%20server%20room%20with%20glowing%20blue%20neon%20lights%2C%20glass%20floor%20reflections%2C%20cinematic%20wide%20shot%2C%20photorealistic&image_size=landscape_4_3', '人工智能', '陈默', 328),
('第一次握手', '当机械手指与人类手掌相触，人机协作的边界又向前推进了一厘米。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=humanoid%20robot%20hand%20touching%20human%20hand%2C%20soft%20studio%20lighting%2C%20close%20up%2C%20high%20detail%2C%20photorealistic&image_size=landscape_4_3', '机器人', '孙超', 512),
('指甲盖上的世界', '一颗先进制程芯片的微观结构，导线密如城市路网。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=macro%20shot%20of%20advanced%20semiconductor%20chip%20on%20circuit%20board%2C%20golden%20pins%2C%20blue%20light%2C%20ultra%20detailed&image_size=landscape_4_3', '硬件', '李维', 276),
('补能十分钟', '黄昏的充电站里，电流与晚霞一起流动。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20vehicle%20charging%20at%20modern%20station%20at%20dusk%2C%20city%20lights%20bokeh%2C%20cinematic&image_size=landscape_4_3', '新能源', '郑一鸣', 431),
('绝对零度附近的金色吊灯', '量子计算原型机的核心结构，靠极低温维持量子态的脆弱平衡。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20computer%20core%20with%20golden%20chandelier%20structure%2C%20blue%20cryogenic%20glow%2C%20science%20photography&image_size=landscape_4_3', '前沿科学', '周岚', 389),
('离地球 550 公里', '卫星掠过晨昏线，把信号撒向还没有基站的海洋。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=satellite%20orbiting%20earth%20above%20clouds%2C%20sunrise%20over%20horizon%2C%20realistic%20space%20photography&image_size=landscape_4_3', '航天', '马骁', 604),
('客厅里的另一个世界', '戴上头显，家里的沙发成了通往虚拟空间的第一级台阶。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20wearing%20VR%20headset%20in%20bright%20modern%20living%20room%2C%20colorful%20light%2C%20lifestyle%20photography&image_size=landscape_4_3', '数字生活', '何青', 358),
('数据在城市上空流动', '夜里十一点，写字楼顶的信号灯比星星更亮。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20city%20skyline%20at%20night%20with%20glowing%20data%20network%20lines%20above%20buildings%2C%20aerial%20view%2C%20futuristic&image_size=landscape_4_3', '智慧城市', '顾言', 477);
```

## 2026-11-19 22:10 规范命名：库名与表名统一为 wenxin_ 前缀

```sql
-- 将原 cheney_zhihu 库及 Cheney_* 表迁移为 wenxin_ 命名，数据保持原样
CREATE DATABASE IF NOT EXISTS `wenxin_zhihu`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

RENAME TABLE `cheney_zhihu`.`Cheney_news` TO `wenxin_zhihu`.`wenxin_news`,
             `cheney_zhihu`.`Cheney_gallery` TO `wenxin_zhihu`.`wenxin_gallery`;

DROP DATABASE `cheney_zhihu`;
```

> 迁移结果：`wenxin_zhihu` 库下 `wenxin_news` 10 条、`wenxin_gallery` 8 条，数据完整。

