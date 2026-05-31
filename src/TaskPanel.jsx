import React, { useState } from 'react';
import { 
  X, CheckSquare, ChevronUp, ChevronDown, 
  Maximize2, Minimize2, Circle, MessageSquare,
  Plus, Trash2, Palette
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', color: 'bg-gray-400' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-amber-500' },
];

const GROUP_COLORS = [
  { value: 'slate', label: 'Default', bg: 'bg-slate-100', border: 'border-slate-200', header: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  { value: 'green', label: 'Green', bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  { value: 'amber', label: 'Amber', bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  { value: 'rose', label: 'Rose', bg: 'bg-rose-50', border: 'border-rose-200', header: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500' },
  { value: 'teal', label: 'Teal', bg: 'bg-teal-50', border: 'border-teal-200', header: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
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
  onAddGroup,
  onDeleteGroup,
  onUpdateGroup,
  onLocateCard,
}) {
  const [expandedNotes, setExpandedNotes] = useState({});
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [colorPickerGroupId, setColorPickerGroupId] = useState(null);

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

  const handleAddGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    onAddGroup(name);
    setNewGroupName('');
    setShowAddGroup(false);
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
            onClick={() => setShowAddGroup(!showAddGroup)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
            title="Add Group"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
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

      {/* Add Group Input */}
      {showAddGroup && (
        <div className="px-3 pt-3 pb-0 shrink-0">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddGroup(); if (e.key === 'Escape') { setShowAddGroup(false); setNewGroupName(''); } }}
              placeholder="New group name..."
              className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
              autoFocus
            />
            <button
              onClick={handleAddGroup}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddGroup(false); setNewGroupName(''); }}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Task Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {sortedGroups.map((group, groupIndex) => {
          const groupTasks = getTasksForGroup(group.id);
          const groupColor = GROUP_COLORS.find(c => c.value === group.color) || GROUP_COLORS[0];
          return (
            <div key={group.id} className={`${groupColor.bg} rounded-lg border ${groupColor.border} overflow-hidden`}>
              {/* Group Header */}
              <div className={`flex items-center justify-between px-3 py-2 ${groupColor.header} border-b ${groupColor.border} relative`}>
                <span className={`text-xs font-bold ${groupColor.text} uppercase tracking-wide`}>{group.name}</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] text-slate-400 mr-1">{groupTasks.length}</span>
                  <button
                    onClick={() => setColorPickerGroupId(colorPickerGroupId === group.id ? null : group.id)}
                    className={`p-0.5 rounded hover:bg-white/50 ${groupColor.text} transition-colors`}
                    title="Change color"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>
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
                  <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="p-0.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Color Picker Dropdown */}
                {colorPickerGroupId === group.id && (
                  <div className="absolute top-full right-2 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 flex gap-1.5 flex-wrap max-w-[180px]">
                    {GROUP_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => { onUpdateGroup(group.id, { color: color.value }); setColorPickerGroupId(null); }}
                        className={`w-6 h-6 rounded-full ${color.dot} border-2 border-white shadow-sm hover:scale-110 transition-transform flex items-center justify-center`}
                        title={color.label}
                      >
                        {group.color === color.value && <span className="text-white text-[8px] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
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
                              <button
                                onClick={() => onLocateCard(linkedCard.id)}
                                className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[10px] font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                                title="Locate card on canvas"
                              >
                                <Circle className="w-2 h-2" />
                                <span className="truncate max-w-[120px]">{linkedCard.title || `Card #${linkedCard.id}`}</span>
                              </button>
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
