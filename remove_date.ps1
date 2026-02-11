# 移除Markdown文件顶部的日期行脚本
$files = @(
    "e:\git\vercel-ci\mdfiles\职场晋升攻略：能力与人际关系的双翼齐飞.md",
    "e:\git\vercel-ci\mdfiles\时间管理的艺术：提升效率的新策略.md",
    "e:\git\vercel-ci\mdfiles\探索存在的意义：我们在这个宇宙中的角色与价值.md",
    "e:\git\vercel-ci\mdfiles\鸟欲高飞先振翅，人求上进先读书.md",
    "e:\git\vercel-ci\mdfiles\魔兽世界副本团长团队管理：如何管理500人线上社群.md",
    "e:\git\vercel-ci\mdfiles\高考满分750，冲击985的秘籍大揭秘.md",
    "e:\git\vercel-ci\mdfiles\马镫未发明时，骑兵如何作战？.md",
    "e:\git\vercel-ci\mdfiles\香菇掉厕所了还能叫香菇吗？.md",
    "e:\git\vercel-ci\mdfiles\饮食与运动：预防慢性疾病的两大法宝.md",
    "e:\git\vercel-ci\mdfiles\风速多大能让雨滴击穿汽车挡风玻璃.md",
    "e:\git\vercel-ci\mdfiles\顺手牵羊新解：多视角下的行为探秘.md",
    "e:\git\vercel-ci\mdfiles\风浪越大鱼越贵：于挑战处寻机遇与价值.md",
    "e:\git\vercel-ci\mdfiles\项目管理式人生：在规划与随性之间找到平衡.md",
    "e:\git\vercel-ci\mdfiles\顶级魔术师的表演设计：范围管理与时间管理的艺术.md",
    "e:\git\vercel-ci\mdfiles\靠人不如靠自己：现代视角下的自我赋能之道.md",
    "e:\git\vercel-ci\mdfiles\雷公电母放的是直流电还是交流电？.md",
    "e:\git\vercel-ci\mdfiles\随着人工智能的发展，如何确保其符合人类的伦理和价值观？.md",
    "e:\git\vercel-ci\mdfiles\阴谋论传播网络：去中心化项目管理模式与反脆弱组织启示.md",
    "e:\git\vercel-ci\mdfiles\长期主义：开启成功之门的稳健钥匙.md",
    "e:\git\vercel-ci\mdfiles\长期主义的终极意义：当坚持在宇宙尺度下毫无意义.md",
    "e:\git\vercel-ci\mdfiles\长期主义的心理陷阱：如何辨别真伪长期主义.md",
    "e:\git\vercel-ci\mdfiles\长期主义与概率彩票：坚持是否是另一种形式的赌徒谬误.md",
    "e:\git\vercel-ci\mdfiles\长期主义与敏捷迭代的个人成长实验.md",
    "e:\git\vercel-ci\mdfiles\钱真的能买到快乐吗？.md",
    "e:\git\vercel-ci\mdfiles\鉴黄师下班看黄色视频：加班还是违法？.md",
    "e:\git\vercel-ci\mdfiles\金融科技对传统银行业的影响及应对策略.md",
    "e:\git\vercel-ci\mdfiles\金斧头银斧头：一场关于人性试炼的千年寓言.md",
    "e:\git\vercel-ci\mdfiles\量子计算的跨领域应用：超越密码学的科技革命.md",
    "e:\git\vercel-ci\mdfiles\量子计算的实际应用前景：开启科技新时代.md",
    "e:\git\vercel-ci\mdfiles\量子计算与信息安全：密码学的未来挑战.md",
    "e:\git\vercel-ci\mdfiles\野外求生专家的决策逻辑：经济下行期的生存与发展策略.md",
    "e:\git\vercel-ci\mdfiles\重新审视\"枪打出头鸟\".md",
    "e:\git\vercel-ci\mdfiles\重新审视\"有钱能使鬼推磨\".md",
    "e:\git\vercel-ci\mdfiles\重新审视\"一个好汉三个帮\"：合作互助的新内涵与新意义.md",
    "e:\git\vercel-ci\mdfiles\遭遇\"好评\"陷阱：开自助台球店遇到的那些奇葩事.md",
    "e:\git\vercel-ci\mdfiles\道德标准是绝对的吗？.md",
    "e:\git\vercel-ci\mdfiles\逆向思维与商业成功：站在人性的反方向赚钱.md",
    "e:\git\vercel-ci\mdfiles\退休规划：精心布局畅享无忧老年生活.md",
    "e:\git\vercel-ci\mdfiles\远程工作的高效管理：从工具到文化的构建.md",
    "e:\git\vercel-ci\mdfiles\远程工作中的数字边界管理.md",
    "e:\git\vercel-ci\mdfiles\这个男人来自地球观后感.md",
    "e:\git\vercel-ci\mdfiles\运营自媒体和搭建个人网站的优劣势分析.md",
    "e:\git\vercel-ci\mdfiles\运用新兴技术解决技术问题的注意要点.md",
    "e:\git\vercel-ci\mdfiles\过期毒药是否还有毒性？.md",
    "e:\git\vercel-ci\mdfiles\过度依赖项目管理规划人生：如何为随机性预留空间.md",
    "e:\git\vercel-ci\mdfiles\边缘计算的应用与挑战：分布式智能的崛起.md",
    "e:\git\vercel-ci\mdfiles\身高高的人看到的日落更久吗？.md",
    "e:\git\vercel-ci\mdfiles\踢猫效应：情绪传递背后的心理真相.md",
    "e:\git\vercel-ci\mdfiles\跨时空对话：与已注销百度账号的违规内容对话.md",
    "e:\git\vercel-ci\mdfiles\跨文化家庭的代际沟通：融合与冲突的平衡之道.md",
    "e:\git\vercel-ci\mdfiles\跨境内容营销利器：DeepSeek多语言SEO优化与本地化实践.md",
    "e:\git\vercel-ci\mdfiles\跨国恋情中的文化碰撞与交融：谱写爱的新乐章.md",
    "e:\git\vercel-ci\mdfiles\赚钱新视角：为何要先努力停止打工.md",
    "e:\git\vercel-ci\mdfiles\跨代际沟通中的数字素养差异与桥梁构建.md",
    "e:\git\vercel-ci\mdfiles\贾宝玉出生时嘴里含着玉，为何不叫\"宝国\"？.md",
    "e:\git\vercel-ci\mdfiles\资源有限竞争者众时如何挖掘收入增长点.md",
    "e:\git\vercel-ci\mdfiles\负荆请罪：一场跨越千年的非暴力沟通范本.md",
    "e:\git\vercel-ci\mdfiles\财富创造原理：探寻财富自由的通途.md",
    "e:\git\vercel-ci\mdfiles\谋士为何难成一把手？.md",
    "e:\git\vercel-ci\mdfiles\让人心平气和的小商品推荐.md",
    "e:\git\vercel-ci\mdfiles\认知差异下的成长启示：重读《小马过河》的现代隐喻.md",
    "e:\git\vercel-ci\mdfiles\认知过载时代深度学习的解锁之道.md",
    "e:\git\vercel-ci\mdfiles\解构与重构：《三只小猪》叙事迷宫中的生存哲学.md",
    "e:\git\vercel-ci\mdfiles\解锁式文章：核心论点隐藏与项目管理任务解锁.md",
    "e:\git\vercel-ci\mdfiles\见一面是\"少一面\"还是\"多一面\".md",
    "e:\git\vercel-ci\mdfiles\解决Markdown文件中标题解析异常的问题.md",
    "e:\git\vercel-ci\mdfiles\被门夹过的核桃还能补脑吗？.md",
    "e:\git\vercel-ci\mdfiles\被袋鼠暴打时躺成球状真能保命吗？.md",
    "e:\git\vercel-ci\mdfiles\虚拟现实技术的未来趋势：开启无限可能的数字新纪元.md",
    "e:\git\vercel-ci\mdfiles\虚假信息和舆论引导对社会和个人会产生哪些深远影响？.md",
    "e:\git\vercel-ci\mdfiles\莫让舒适成为成长的羁绊：在舒适与挑战间寻求平衡.md",
    "e:\git\vercel-ci\mdfiles\蓝牙耳机坏了，去医院挂牙科还是耳科？.md",
    "e:\git\vercel-ci\mdfiles\草船借箭：一场跨越千年的资源博弈与人性实验.md",
    "e:\git\vercel-ci\mdfiles\苹果洗洗能吃，自来水和没洗苹果为啥不行？.md",
    "e:\git\vercel-ci\mdfiles\若地球自转周期变为1秒赤道线速度达光速十分之一地球会被撕裂吗.md",
    "e:\git\vercel-ci\mdfiles\自由意志的程度：从量子到社会的梯度视角.md",
    "e:\git\vercel-ci\mdfiles\自由是否是有边界的？.md",
    "e:\git\vercel-ci\mdfiles\自杀：世界多了一个自杀的人还是少了一个自杀的人？.md",
    "e:\git\vercel-ci\mdfiles\自我激励与目标设定：奏响成功乐章的双弦.md",
    "e:\git\vercel-ci\mdfiles\自我剥削识别：个人成长项目是否成为自我剥削合同.md",
    "e:\git\vercel-ci\mdfiles\自慰会导致早泄吗.md",
    "e:\git\vercel-ci\mdfiles\自助台球门店客流量差异分析.md",
    "e:\git\vercel-ci\mdfiles\自信心的培养与提升：开启成功人生的密钥.md",
    "e:\git\vercel-ci\mdfiles\脑机接口时代的注意力管理：挑战与防御.md",
    "e:\git\vercel-ci\mdfiles\脑机接口时代的隐私保护：神经数据的伦理边界.md",
    "e:\git\vercel-ci\mdfiles\脑机接口在医疗领域的应用：从康复到增强.md",
    "e:\git\vercel-ci\mdfiles\能力一般者在职场中\"逆袭\"的实用指南.md",
    "e:\git\vercel-ci\mdfiles\脑机接口与隐私保护：当技术直接连接大脑时.md",
    "e:\git\vercel-ci\mdfiles\职场生存法则：比学历和经验更重要的4项核心能力.md",
    "e:\git\vercel-ci\mdfiles\职场沟通秘籍：点燃团队协作的高效引擎.md",
    "e:\git\vercel-ci\mdfiles\职场压力下的心理调适：于忙碌中守护心灵的宁静.md",
    "e:\git\vercel-ci\mdfiles\职场效率革命：DeepSeek如何重塑数据分析、会议纪要与简历优化.md",
    "e:\git\vercel-ci\mdfiles\职场人的微习惯链：从单点突破到系统升级.md",
    "e:\git\vercel-ci\mdfiles\职场中能力与人情世故的权衡之道.md",
    "e:\git\vercel-ci\mdfiles\聊一下乒乓混双得主王楚钦和邓颖莎.md",
    "e:\git\vercel-ci\mdfiles\职场中的隐性能力：被忽视的职业发展加速器.md",
    "e:\git\vercel-ci\mdfiles\老公对我不错但性生活缺失是否该离婚.md",
    "e:\git\vercel-ci\mdfiles\老年人常见的心理问题及应对策略.md",
    "e:\git\vercel-ci\mdfiles\网红减肥训练营运营模式分析：项目管理三角的应用与用户依赖形成.md",
    "e:\git\vercel-ci\mdfiles\老公向着婆婆，婚姻该何去何从？.md"
)

$count = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            # 读取文件内容
            $content = Get-Content -Path $file -Encoding UTF8
            
            # 检查是否包含日期行
            if ($content.Count -gt 0 -and $content[0] -match '^date: \d{4}-\d{2}-\d{2}$') {
                # 移除日期行和可能的空行
                $newContent = $content | Select-Object -Skip 1
                # 移除开头的空行
                while ($newContent.Count -gt 0 -and $newContent[0].Trim() -eq '') {
                    $newContent = $newContent | Select-Object -Skip 1
                }
                
                # 保存修改后的内容
                $newContent | Set-Content -Path $file -Encoding UTF8
                $count++
                Write-Host "已处理文件: $file"
            }
        } catch {
            Write-Host "处理文件时出错: $file"
            Write-Host "错误信息: $($_.Exception.Message)"
        }
    } else {
        Write-Host "文件不存在: $file"
    }
}

Write-Host "\n处理完成，共修改了 $count 个文件。"