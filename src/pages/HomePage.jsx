import { useState } from 'react';

function HomePage() {
  // 状态管理
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [recentRecords, setRecentRecords] = useState([
    { date: 'Oct 25', mood: '😊 Happy', note: 'Had a great lunch!' }
  ]);

  // submitState 控制提交按钮的动画与显示内容
  // 'idle'   - 空闲状态，显示 "Submit"
  // 'loading'- 加载中，显示 spinner（按钮宽度不变）
  // 'success'- 成功，短暂显示对勾后恢复
  const [submitState, setSubmitState] = useState('idle');

  // 心情选项
    const moods = [
      { emoji: '😊', label: 'Happy' },
      { emoji: '😃', label: 'Excited' },
      { emoji: '😎', label: 'Confident' },
      { emoji: '😌', label: 'Calm' },
      { emoji: '😢', label: 'Sad' },
      { emoji: '😠', label: 'Angry' },
      { emoji: '😫', label: 'Stressed' },
      { emoji: '😰', label: 'Anxious' }, 
      // { emoji: '😐', label: 'Neutral' } 
    ];

  // 提交表单（带 loading->success 的视觉流程）
  const handleSubmit = () => {
    if (!selectedMood || !note) {
      alert('Please select a mood and add a note!');
      return;
    }

    // 进入加载状态（显示spinner）
    setSubmitState('loading');

  
    setTimeout(() => {
      // 显示成功状态（对勾）
      setSubmitState('success');

      // 短暂延迟后保存记录并重置界面
      setTimeout(() => {
        const newRecord = {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: selectedMood,
          note: note
        };

        setRecentRecords([newRecord, ...recentRecords].slice(0, 3));
        setSelectedMood('');
        setNote('');

        // 恢复到空闲状态，允许再次提交
        setSubmitState('idle');
      }, 900);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      {/* <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Home
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Trends
          </button>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </nav> */}

      {/* 主要内容区域 */}
      <div className="max-w-2xl mx-auto mt-8 p-6">
        {/* 心情选择 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            How are you feeling today?
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(`${mood.emoji} ${mood.label}`)}
                /* 使用 group 以便子元素（emoji）在悬停时响应 */
                className={`group px-4 py-2 rounded-lg border-2 transition ${
                  selectedMood === `${mood.emoji} ${mood.label}`
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                {/* emoji：使用 Tailwind 的 group-hover 实现微上移 */}
                <span className="text-2xl mr-2 transform transition-transform duration-200 group-hover:-translate-y-1 inline-block">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* 笔记输入 */}
          <div className="mb-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              rows="3"
            />
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            disabled={submitState === 'loading'}
            aria-live="polite"
            className={`flex items-center justify-center relative w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 ${
              submitState === 'loading' ? 'cursor-wait' : ''
            }`}
          >
            {/* 主要文字：加载时绝对定位并隐藏，使 spinner 居中且不引起布局跳动 */}
            <span
              className={`transition-opacity duration-150 ${
                submitState === 'loading'
                  ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0'
                  : ''
              }`}
            >
              Submit
            </span>

            {/* 加载指示：使用 Tailwind 的 animate-spin + border utilities */}
            {submitState === 'loading' && (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
            )}

            {/* 对勾：使用 scale 和 opacity 过渡实现弹出效果 */}
            {submitState === 'success' && (
              <svg className="w-5 h-5 text-white opacity-100 transform scale-100 transition duration-200" viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* 最近记录 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent records
          </h2>
          
          {recentRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No records yet</p>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600">📅 {record.date}</span> |
                  <span className="text-sm font-medium">{record.mood}</span> |
                  <span className="text-sm text-gray-600">"{record.note}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;