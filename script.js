document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素获取
    const semesterSelector = document.getElementById('semester-selector');
    const startDatePicker = document.getElementById('start-date-picker');
    const currentWeekDisplay = document.getElementById('current-week-display');
    const timetableGrid = document.getElementById('timetable-grid');
    const memoLeftPreview = document.getElementById('memo-left-preview');
    const memoRightPreview = document.getElementById('memo-right-preview');

    let config = {};
    let currentCourses = [];
    const aqiColors = ["#009966", "#FFDE33", "#FF9933", "#CC0033", "#660099", "#7E0023"];

    // --- 初始化和数据加载 ---
    async function initializeApp() {
        await Promise.all([
            loadConfig(),
            loadMemo('left.md', memoLeftPreview),
            loadMemo('right.md', memoRightPreview)
        ]);
        
        setupSemesterSelector();
        loadSettings(); // 加载保存的学期和日期
        await loadTimetable();
        updateCurrentWeek();

        // 添加事件监听
        semesterSelector.addEventListener('change', handleSemesterChange);
        startDatePicker.addEventListener('change', handleDateChange);
        setInterval(updateCurrentWeek, 60000); // 每分钟更新一次周数
    }
    
    async function loadConfig() {
        try {
            const response = await fetch('data/config.json');
            config = await response.json();
        } catch (error) {
            console.error('无法加载配置文件 data/config.json:', error);
        }
    }

    function setupSemesterSelector() {
        if (!config.semesters) return;
        config.semesters.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester.file;
            option.textContent = semester.name;
            semesterSelector.appendChild(option);
        });
    }

    async function loadTimetable() {
        const timetableFile = semesterSelector.value;
        if (!timetableFile) return;
        try {
            const response = await fetch(`data/${timetableFile}`);
            currentCourses = await response.json();
            renderGrid();
            renderCourses(getCurrentWeek());
        } catch (error) {
            console.error(`无法加载课表文件 data/${timetableFile}:`, error);
        }
    }

    // --- 周数计算与显示 ---
    function updateCurrentWeek() {
        const week = getCurrentWeek();
        if (week) {
            currentWeekDisplay.textContent = `当前是第 ${week} 周`;
            renderCourses(week);
        } else {
            currentWeekDisplay.textContent = "请设置起始日期";
        }
    }

    function getCurrentWeek() {
        const startDate = new Date(startDatePicker.value);
        if (isNaN(startDate.getTime())) return null;
        const today = new Date();
        const diffTime = today - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.ceil(diffDays / 7);
    }

    // --- 课表渲染 ---
    function renderGrid() {
        timetableGrid.innerHTML = '';
        const headers = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        headers.forEach(h => {
            const cell = document.createElement('div');
            cell.className = 'grid-header';
            cell.textContent = h;
            timetableGrid.appendChild(cell);
        });

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

    function renderCourses(week) {
        if (!currentCourses) return;
        document.querySelectorAll('.course-item').forEach(item => item.remove());
        const coursesToShow = currentCourses.filter(c => week >= c.startWeek && week <= c.endWeek);

        coursesToShow.forEach(course => {
            const start = course.session.start;
            const end = course.session.end;
            const duration = end - start + 1;
            const cell = document.querySelector(`.course-cell[data-day='${course.dayOfWeek}'][data-session='${start}']`);
            if (cell) {
                const item = document.createElement('div');
                item.className = 'course-item';
                const colorIndex = course.courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % aqiColors.length;
                item.style.backgroundColor = aqiColors[colorIndex];
                item.style.height = `calc(${duration * 100}% + ${duration - 1}px)`;
                item.innerHTML = `<strong>${course.courseName}</strong><span>@ ${course.location || ''}</span>`;
                cell.appendChild(item);
            }
        });
    }
    
    // --- 【新功能】备忘录加载 ---
    async function loadMemo(fileName, previewElement) {
        try {
            const response = await fetch(`data/${fileName}`);
            if (response.ok) {
                const markdownText = await response.text();
                previewElement.innerHTML = marked.parse(markdownText);
            } else {
                previewElement.innerHTML = `<p style="color: #999;">加载 ${fileName} 失败。</p>`;
            }
        } catch (error) {
            console.error(`加载 ${fileName} 失败:`, error);
            previewElement.innerHTML = `<p style="color: #999;">加载 ${fileName} 失败。</p>`;
        }
    }

    // --- 事件处理与设置保存 ---
    async function handleSemesterChange() {
        saveSettings();
        await loadTimetable();
    }
    
    function handleDateChange() {
        saveSettings();
        updateCurrentWeek();
    }

    function saveSettings() {
        localStorage.setItem('selectedSemester', semesterSelector.value);
        localStorage.setItem('startDate', startDatePicker.value);
    }

    function loadSettings() {
        const savedSemester = localStorage.getItem('selectedSemester');
        const savedDate = localStorage.getItem('startDate');
        if (savedSemester) {
            semesterSelector.value = savedSemester;
        }
        if (savedDate) {
            startDatePicker.value = savedDate;
        } else {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const distance = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
            today.setDate(today.getDate() + distance);
            startDatePicker.value = today.toISOString().split('T')[0];
            saveSettings();
        }
    }
    
    initializeApp();
});
