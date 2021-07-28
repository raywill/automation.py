# automation.py
auto explain OceanBase log

## script location
~/Library/Services/lookup.workflow

## install
refer to Mac Automation usage

---

## 安装
确认本机已经安装 node（node -v），如果未安装，则先安装（brew install node）
执行下面的脚本安装本助手
```
cd ~/Library/Services/
git clone https://github.com/raywill/automation.py lookup.workflow
open lookup.workflow
```
设置快捷键。例如：

  > 系统偏好设置 - 键盘 - 快捷键 - 服务 - lookup

注意：快捷键不能和别的重复，否则会无效。
 
## 使用

设置好快捷键后，就可以开始使用。使用方法：选中要查询的 ID，按上面设置好的快捷键（如 ） 就能在屏幕的右上角看到解析结果。

目前支持：表 ID、时间戳、错误码、RPC CODE、OB_INVALID_ID 的解析。
支持的软件：iTerm、Terminal、Chrome、Safari、记事本、VSCode、等等所有能选中文本的软件

完整帮助文档地址：https://yuque.antfin-inc.com/xiaochu.yh/doc/vzwuxs （阿里内网可访问）
