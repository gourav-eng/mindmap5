import React, { useState } from 'react';
import { 
  X, CheckSquare, ChevronUp, ChevronDown, 
  Maximize2, Minimize2, Circle, MessageSquare
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', color: 'bg-gray-400' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-amber-500' },
];

export default function TaskPanel({
  tasks,
  taskGroups,
  cardTaskLinks,
  nodes,
  showTaskPanel,
  taskPanelMode,
  setTaskPanelMode,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
  onMoveTaskToGroup,
  onReorderGroups,
}) {
  const [expandedNotes, setExpandedNotes] = useState({});

  if (!showTaskPanel) return null;

  const sortedGroups = [...taskGroups].sort((a, b) => a.order - b.order);

  const getTasksForGroup = (groupId) => {
    return tasks.filter(t => t.groupId === groupId);
  };

  const getLinkedCard = (taskId) => {
    const link = cardTaskLinks.find(l => l.taskId === taskId);
    if (!link) return null;
    return nodes.find(n => n.id === link.cardId) || null;
  };

  const toggleNote = (taskId) => {
    setExpandedNotes(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className={`${taskPanelMode === 'fullscreen' ? 'flex-1' : 'w-1/2'} bg-white border-l border-slate-200 flex flex-col overflow-hidden shrink-0`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Tasks</h3>
          <span className="text-xs text-slate-400 font-medium">({tasks.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTaskPanelMode(taskPanelMode === 'split' ? 'fullscreen' : 'split')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
            title={taskPanelMode === 'split' ? 'Fullscreen' : 'Split View'}
          >
            {taskPanelMode === 'split' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {sortedGroups.map((group, groupIndex) => {
          const groupTasks = getTasksForGroup(group.id);
          return (
            <div key={group.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              {/* Group Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{group.name}</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] text-slate-400 mr-1">{groupTasks.length}</span>
                  <button
                    onClick={() => onReorderGroups(groupIndex, groupIndex - 1)}
                    disabled={groupIndex === 0}
                    className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onReorderGroups(groupIndex, groupIndex + 1)}
                    disabled={groupIndex === sortedGroups.length - 1}
                    className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Items */}
              <div className="p-2 space-y-1.5">
                {groupTasks.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">No tasks</p>
                ) : (
                  groupTasks.map(task => {
                    const linkedCard = getLinkedCard(task.id);
                    const statusOption = STATUS_OPTIONS.find(s => s.value === task.status) || STATUS_OPTIONS[0];
                    const isCompleted = task.status === 'completed';

                    return (
                      <div key={task.id} className="bg-white rounded-lg border border-slate-100 p-2.5 shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-start gap-2">
                          {/* Checkbox */}
                          <button
                            onClick={() => onToggleTaskStatus(task.id)}
                            className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {isCompleted && <CheckSquare className="w-3 h-3 text-white" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                              className={`w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none focus:bg-slate-50 rounded px-1 ${
                                isCompleted ? 'line-through text-slate-400' : ''
                              }`}
                              placeholder="Task title..."
                            />

                            {/* Linked Card Chip */}
                            {linkedCard && (
                              <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[10px] font-medium text-indigo-700">
                                <Circle className="w-2 h-2" />
                                <span className="truncate max-w-[120px]">{linkedCard.title || `Card #${linkedCard.id}`}</span>
                              </div>
                            )}

                            {/* Status & Group Selectors */}
                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                              <select
                                value={task.status}
                                onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                                className="text-[10px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>

                              <select
                                value={task.groupId}
                                onChange={(e) => onMoveTaskToGroup(task.id, e.target.value)}
                                className="text-[10px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              >
                                {sortedGroups.map(g => (
                                  <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                              </select>

                              <button
                                onClick={() => toggleNote(task.id)}
                                className={`p-0.5 rounded hover:bg-slate-100 transition-colors ${expandedNotes[task.id] ? 'text-indigo-600' : 'text-slate-400'}`}
                                title="Toggle note"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-0.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                                title="Delete task"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Note Field */}
                            {expandedNotes[task.id] && (
                              <textarea
                                value={task.note || ''}
                                onChange={(e) => onUpdateTask(task.id, { note: e.target.value })}
                                placeholder="Add a note..."
                                className="mt-1.5 w-full text-[11px] bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-600 placeholder-slate-400 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-300 min-h-[40px]"
                                rows={2}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
