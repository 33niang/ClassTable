document.addEventListener('DOMContentLoaded', () => {
    const weekPicker = document.getElementById('week-picker');
    const timetableGrid = document.getElementById('timetable-grid');
    let allCourses = [];
    const TOTAL_WEEKS = 20; // 总周数，你可以根据学期长度修改
    const aqiColors = ["#009966", "#FFDE33", "#FF9933", "#CC0033", "#660099", "#7E0023"]; // 随机颜色

    // 初始化周数选择器
    for (let i = 1; i <= TOTAL_WEEKS; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `第 ${i} 周`;
        weekPicker.appendChild(option);
    }
    weekPicker.value = 1; // 默认选中第一周

    // 渲染课表框架
    function renderGrid() {
        timetableGrid.innerHTML = ''; // 清空
        // 添加表头
        const headers = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        headers.forEach(header => {
            const headerCell = document.createElement('div');
            headerCell.className = 'grid-header';
            headerCell.textContent = header;
            timetableGrid.appendChild(headerCell);
        });

        // 添加时间槽和课程格子 (假设一天12节课)
        for (let i = 1; i <= 12; i++) {
            const timeCell = document.createElement('div');
            timeCell.className = 'time-slot';
            timeCell.textContent = `第 ${i} 节`;
            timetableGrid.appendChild(timeCell);
            for (let j = 1; j <= 7; j++) {
                const courseCell = document.createElement('div');
                courseCell.className = 'course-cell';
                courseCell.dataset.day = j;
                courseCell.dataset.session = i;
                timetableGrid.appendChild(courseCell);
            }
        }
    }

    // 渲染课程
    function renderCourses(week) {
        // 先清除旧课程
        document.querySelectorAll('.course-item').forEach(item => item.remove());

        const coursesToShow = allCourses.filter(course => week >= course.startWeek && week <= course.endWeek);

        coursesToShow.forEach(course => {
            const startSession = course.session.start;
            const endSession = course.session.end;
            const duration = endSession - startSession + 1;

            const cell = document.querySelector(`.course-cell[data-day='${course.dayOfWeek}'][data-session='${startSession}']`);
            if (cell) {
                const courseItem = document.createElement('div');
                courseItem.className = 'course-item';
                // 简单的 hash 函数给课程分配一个固定的颜色
                const colorIndex = course.courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % aqiColors.length;
                courseItem.style.backgroundColor = aqiColors[colorIndex];
                
                // 设置课程块的高度
                courseItem.style.height = `calc(${duration * 100}% + ${duration - 1}px)`;
                
                courseItem.innerHTML = `
                    <strong>${course.courseName}</strong>
                    <span>${course.teacher || ''}</span><br>
                    <span>@ ${course.location || ''}</span>
                `;
                cell.appendChild(courseItem);
            }
        });
    }

    // 从 JSON 文件加载数据
    async function loadData() {
        try {
            const response = await fetch('timetable.json');
            if (!response.ok) {
                throw new Error('无法加载 timetable.json 文件！');
            }
            allCourses = await response.json();
            renderGrid();
            renderCourses(weekPicker.value);
        } catch (error) {
            console.error(error);
            timetableGrid.innerHTML = `<p style="color: red; grid-column: 1 / -1; text-align: center;">${error.message}</p>`;
        }
    }

    // 监听周数变化
    weekPicker.addEventListener('change', (e) => {
        renderCourses(e.target.value);
    });

    loadData();
});
