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

## 2026-11-23 14:10 新建知识库表（wenxin_kb_files / wenxin_kb_chunks）

```sql
USE `wenxin_zhihu`;

-- 知识库文件表
CREATE TABLE IF NOT EXISTS `wenxin_kb_files` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
  `file_name` VARCHAR(255) NOT NULL COMMENT '服务器存储文件名',
  `ext` VARCHAR(20) NOT NULL COMMENT '扩展名',
  `mime_type` VARCHAR(120) NOT NULL DEFAULT '' COMMENT 'MIME 类型',
  `file_size` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件字节数',
  `char_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '解析字符数',
  `chunk_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '分块数量',
  `status` VARCHAR(20) NOT NULL DEFAULT 'ready' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表';

-- 知识库文本分块表
CREATE TABLE IF NOT EXISTS `wenxin_kb_chunks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分块ID',
  `file_id` INT UNSIGNED NOT NULL COMMENT '所属文件ID',
  `chunk_index` INT UNSIGNED NOT NULL COMMENT '分块序号（从 0 开始）',
  `content` TEXT NOT NULL COMMENT '分块文本',
  `char_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '分块字符数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_wenxin_chunk_file` (`file_id`),
  CONSTRAINT `fk_wenxin_chunk_file` FOREIGN KEY (`file_id`) REFERENCES `wenxin_kb_files` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文本分块表';
```



## 2026-11-23 14:30 知识库示例文件与分块数据（2 个文件、10 个分块）

```sql
USE `wenxin_zhihu`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40000 ALTER TABLE wenxin_kb_files DISABLE KEYS */;
INSERT INTO wenxin_kb_files (id, original_name, file_name, ext, mime_type, file_size, char_count, chunk_count, status, created_at) VALUES (1,'wenxin_客服FAQ.txt','wenxin_kb_1795413550807_734770.txt','.txt','application/octet-stream',3194,1258,5,'ready','2026-11-23 13:59:10'),(2,'wenxin_产品与服务说明.docx','wenxin_kb_1795413550903_544118.docx','.docx','application/octet-stream',5901,1340,5,'ready','2026-11-23 13:59:11');
/*!40000 ALTER TABLE wenxin_kb_files ENABLE KEYS */;

/*!40000 ALTER TABLE wenxin_kb_chunks DISABLE KEYS */;
INSERT INTO wenxin_kb_chunks (id, file_id, chunk_index, content, char_count, created_at) VALUES (1,1,0,'温馨智联 · 客服常见问题（FAQ）\n更新日期：2026-11-23\n一、发货与物流\n1. 下单后多久发货？\n现货商品在付款后 24 小时内安排出库，预售商品以商品页标注的发货时间为准。遇大促期间订单量较大，发货可能顺延 1 至 2 天。\n2. 支持哪些配送方式？\n默认使用顺丰速运或京东物流，偏远地区（新疆、西藏、内蒙古部分区域）改用邮政 EMS。下单时可在结算页选择\"普通配送\"或\"次日达\"，次日达需在当日 16:00 前下单。\n3. 运费怎么计算？\n单笔订单满 99 元包邮，未满 99 元收取 8 元运费；偏远地区统一收取 15 元运费。会员等级达到 V3 及以上享受全场包邮。',293,'2026-11-23 13:59:10'),(2,1,1,'二、退换货与售后\n4. 七天无理由退货的条件是什么？\n商品签收之日起 7 天内，商品未使用、配件齐全、包装完好且不影响二次销售，可申请无理由退货。定制类、贴身类商品及已激活的软件授权不支持无理由退货。\n5. 退货后多久退款？\n仓库验收通过后 1 至 3 个工作日内原路退回。银行卡支付一般 3 至 7 个工作日到账，第三方支付（微信、支付宝）通常 24 小时内到账。\n6. 商品出现质量问题怎么办？\n签收后 15 天内出现非人为损坏的性能故障，可申请换新；超过 15 天进入保修流程。请在\"我的订单-申请售后\"中上传故障照片或视频，客服会在 24 小时内响应。',280,'2026-11-23 13:59:10'),(3,1,2,'7. 保修期是多久？\n主机类商品保修 12 个月，电池及易损件保修 6 个月，配件保修 3 个月。保修期内非人为损坏免费维修，人为损坏只收取零件成本费。\n三、发票与支付\n8. 可以开具发票吗？\n支持开具电子普通发票和增值税专用发票。电子发票在订单完成后 24 小时内发送至预留邮箱；专用发票需提供公司名称、税号、开户行及账号，审核通过后 3 个工作日内开出。\n9. 支持哪些支付方式？\n支持微信支付、支付宝、银联卡、云闪付及花呗分期（3 期、6 期、12 期）。企业客户可申请对公转账，到账后 1 个工作日内发货。',257,'2026-11-23 13:59:10'),(4,1,3,'四、会员与优惠\n10. 会员积分怎么获得和使用？\n每消费 1 元累计 1 积分，评价晒单额外奖励 20 积分。100 积分可抵扣 1 元，单笔订单最多抵扣订单金额的 10%。\n11. 优惠券可以叠加使用吗？\n同一订单最多使用 1 张平台券和 1 张店铺券，二者可叠加；同类优惠券不可叠加。优惠券过期后不予补发。\n五、服务与联系\n12. 如何联系人工客服？\n服务时间每天 9:00 至 21:00。可拨打客服热线 400-800-1234，或在 App 内点击\"我的-在线客服\"转人工。非服务时间可留言，次日 10:00 前回复。',264,'2026-11-23 13:59:10'),(5,1,4,'13. 可以修改收货地址吗？\n订单未发货前可在订单详情页自行修改地址；已发货订单需联系客服拦截，拦截成功后退回运费由用户承担。\n14. 是否提供上门安装服务？\n大家电及智能家居套装支持付费上门安装，安装费 99 元起，具体以商品页说明为准。安装服务由合作服务商提供，预约后 48 小时内上门。',146,'2026-11-23 13:59:10'),(6,2,0,'温馨智联智能客服系统 · 产品与服务说明\n一、产品定位\n温馨智联智能客服系统是一套面向中小企业的知识库问答解决方案，帮助企业把产品手册、售后政策、常见问题等文档沉淀为可检索的知识库，并通过大模型实现 7×24 小时的自动客服应答。\n二、主要功能\n1. 知识库文件上传：支持 txt、md、pdf、doc、docx、ppt、pptx、csv、rtf 等格式，上传后自动解析并切分为文本分块。\n2. 知识库管理：查看文件字符数、分块数量，支持删除文件并级联清理分块，支持查看每个分块的原文内容。\n3. 智能问答：用户提问后先检索知识库中最相关的分块，再把资料与问题一起交给大模型生成回答，并标注引用来源。\n4. 会话记录：问答请求与模型响应数据',320,'2026-11-23 13:59:11'),(7,2,1,'检索知识库中最相关的分块，再把资料与问题一起交给大模型生成回答，并标注引用来源。\n4. 会话记录：问答请求与模型响应数据均输出到浏览器控制台，便于调试与验收。\n三、版本与价格\n- 基础版：包含 1 个知识库、50 个文件、每月 3000 次问答，价格 399 元/月。\n- 专业版：包含 5 个知识库、500 个文件、每月 20000 次问答，价格 1299 元/月。\n- 企业版：知识库数量不限，支持私有化部署与专属模型，价格需联系商务报价。\n所有版本均提供 14 天免费试用，试用期结束后数据保留 30 天。\n四、技术规格\n- 后端：Node.js + Express，接口统一以 /api 为前缀，默认端口 8328。\n- 数据库：M',320,'2026-11-23 13:59:11'),(8,2,2,'术规格\n- 后端：Node.js + Express，接口统一以 /api 为前缀，默认端口 8328。\n- 数据库：MySQL 8.0 及以上，字符集 utf8mb4。\n- 前端：原生 HTML、CSS、JavaScript，不依赖第三方框架。\n- 模型：默认使用 deepseek-ai/DeepSeek-V4-Flash，可通过环境变量 AI_MODEL 更换。\n- 单文件大小上限 20MB，单次上传解析耗时通常在 3 秒以内。\n五、数据与安全\n1. 用户上传的原始文件保存在服务器 uploads 目录，数据库仅保存文件名与分块文本。\n2. 接口密钥保存在服务端 .env 文件，前端不接触密钥。\n3. 删除知识库文件时，其对应分',320,'2026-11-23 13:59:11'),(9,2,3,'仅保存文件名与分块文本。\n2. 接口密钥保存在服务端 .env 文件，前端不接触密钥。\n3. 删除知识库文件时，其对应分块通过外键级联删除，避免残留数据。\n4. 企业版支持数据本地化部署，所有数据不出企业内网。\n六、部署要求\n- 操作系统：Windows 10 及以上或主流 Linux 发行版。\n- 运行环境：Node.js 18 及以上（推荐 20 或更高）。\n- 数据库：MySQL 8.0，需提前创建数据库并按文档导入表结构。\n- 网络：服务器需能访问大模型接口域名 api.siliconflow.cn。\n七、服务与支持\n- 工作日 9:00-18:00 提供在线技术支持，紧急问题可拨打 400-800-1234。\n- 基础版提',320,'2026-11-23 13:59:11'),(10,2,4,'服务与支持\n- 工作日 9:00-18:00 提供在线技术支持，紧急问题可拨打 400-800-1234。\n- 基础版提供邮件支持，响应时间 1 个工作日内；专业版及以上提供专属技术顾问，响应时间 2 小时内。\n- 版本升级：每季度发布一次功能更新，安全补丁随发现随修复。\n八、常见限制\n1. 扫描版 PDF 若没有文字层，需要先做 OCR 再上传。\n2. 老版 .doc 与 .ppt 文件的解析效果弱于 .docx 与 .pptx，建议转换后再上传。\n3. 图片、图表中的文字不会被自动识别，除非文件本身带有文字层。\n4. 知识库检索基于关键词匹配，问题表述与文档用词差异过大时可能召回不到内容。',300,'2026-11-23 13:59:11');
/*!40000 ALTER TABLE wenxin_kb_chunks ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

```
