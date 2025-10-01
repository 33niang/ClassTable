# 简易网页课表 (Simple Web Timetable)

这是一个轻量级的、纯前端的网页课表项目。专为学生设计，方便在浏览器中快速查看个人课表。

无需后端或数据库，所有课程数据都存储在一个 `JSON` 文件中，让修改和部署都变得非常简单。

## ✨ 功能特性

  * **周视图网格**：以清晰的网格形式展示一周七天的课程。
  * **周数切换**：支持学期周数切换，仅显示当前周需要上的课程。
  * **跨周课程**：轻松处理持续多周（例如 1-12 周）的课程。
  * **自动染色**：根据课程名称自动为课程块分配不同的颜色，方便区分。
  * **纯静态**：无任何后端依赖，可以免费部署在 Cloudflare Pages, GitHub Pages, Vercel 等任何静态网站托管平台。
  * **易于定制**：课程数据完全由你掌控，只需修改 `timetable.json` 文件即可更新课表。

## 🚀 如何使用

### 本地运行

1.  下载项目中的所有文件 (`index.html`, `style.css`, `script.js`, `timetable.json`) 并将它们放在同一个文件夹中。
2.  使用你喜欢的文本编辑器（如 VS Code）打开 `timetable.json` 文件，根据你的实际情况修改课程信息。
3.  在浏览器中直接打开 `index.html` 文件即可查看效果。

### 修改课表数据

所有课程数据都保存在 `timetable.json` 文件中。该文件是一个数组，其中每个元素都是一个代表课程的对象。

**字段说明：**

| 字段名 | 类型 | 描述 | 示例 |
| :--- | :--- | :--- | :--- |
| `courseName` | `String` | **必需**，课程的完整名称。 | `"高等数学"` |
| `teacher` | `String` | 可选，教师姓名。 | `"张老师"` |
| `location` | `String` | 可选，上课地点。 | `"教学楼A-101"` |
| `dayOfWeek` | `Number` | **必需**，星期几。`1` 代表周一，`7` 代表周日。 | `1` (周一) |
| `session` | `Object` | **必需**，包含课程的开始和结束节次。 | `{"start": 1, "end": 2}` (第1-2节) |
| `startWeek` | `Number` | **必需**，课程开始的周数。 | `1` |
| `endWeek` | `Number` | **必需**，课程结束的周数。 | `12` |

**`timetable.json` 示例：**

```json
[
  {
    "courseName": "高等数学",
    "teacher": "张老师",
    "location": "教学楼A-101",
    "dayOfWeek": 1,
    "session": { "start": 1, "end": 2 },
    "startWeek": 1,
    "endWeek": 12
  },
  {
    "courseName": "大学物理",
    "teacher": "李老师",
    "location": "实验楼B-203",
    "dayOfWeek": 3,
    "session": { "start": 3, "end": 4 },
    "startWeek": 6,
    "endWeek": 16
  }
]
```

## 部署到线上

由于这是一个纯静态项目，你可以非常轻松地将其免费部署到线上，方便你和同学随时访问。这里以 **Cloudflare Pages** 为例：

1.  **创建 GitHub 仓库**：在 GitHub 上创建一个新的代码仓库，并将你的四个文件（`index.html`, `style.css`, `script.js`, `timetable.json`）上传上去。

2.  **登录 Cloudflare**：

      * 登录 Cloudflare 仪表板，进入 `Workers & Pages` 菜单。
      * 点击 `Create application` \> `Pages` \> `Connect to Git`。

3.  **连接仓库**：

      * 授权并选择你刚刚创建的 GitHub 仓库。
      * 点击 `Begin setup`。

4.  **配置部署**：

      * **项目名称 (Project name)**：可以随意填写。
      * **构建命令 (Build command)**：**留空** (因为我们没有使用框架，不需要构建)。
      * **构建输出目录 (Build output directory)**：**留空** 或填写 `/` (因为我们的文件都在根目录)。
      * 点击 `Save and Deploy`。

5.  **完成**：等待几分钟，Cloudflare 就会为你生成一个唯一的网址 (`.pages.dev` 后缀)。现在，任何人都可以通过这个网址访问你的课表了！

> **自动更新**：之后，每当你修改了 `timetable.json` 并将改动推送到 GitHub 仓库，Cloudflare Pages 就会自动为你重新部署，网站上的课表会同步更新！

## 🛠️ 技术栈

  * HTML5
  * CSS3
  * JavaScript (ES6+)
